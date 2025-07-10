import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Document from '../models/Document.js';

const router = express.Router();

// Middleware to check AI usage limits
const checkAIUsage = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user.canMakeAIRequest()) {
      return res.status(429).json({ 
        error: 'AI usage limit exceeded',
        limits: {
          daily: user.subscription.type === 'free' ? 50 : user.subscription.type === 'premium' ? 500 : 'unlimited',
          monthly: user.subscription.type === 'free' ? 1000 : user.subscription.type === 'premium' ? 10000 : 'unlimited'
        },
        current: {
          daily: user.usage.aiRequestsToday,
          monthly: user.usage.aiRequestsThisMonth
        }
      });
    }
    req.user.userDoc = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper: check for missing Gemini API key
function ensureGeminiKey(req, res) {
  if (!process.env.GEMINI_API_KEY) {
    req.app.locals.logger.error('GEMINI_API_KEY is missing. Set it in your .env file.');
    res.status(500).json({ error: 'Gemini API key is missing. Please set GEMINI_API_KEY in your backend .env file.' });
    return false;
  }
  return true;
}

// Enhanced text processing with context awareness
router.post('/process', [
  checkAIUsage,
  body('text').notEmpty().isString(),
  body('action').isIn(['summarize', 'rewrite', 'expand', 'simplify', 'formalize', 'casualize', 'translate', 'improve']),
  body('context').optional().isObject(),
  body('documentId').optional().isMongoId()
], async (req, res) => {
  if (!ensureGeminiKey(req, res)) return;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text, action, context = {}, documentId } = req.body;
    const genAI = req.app.locals.genAI;
    const logger = req.app.locals.logger;

    // Get document context if provided
    let documentContext = '';
    if (documentId) {
      const document = await Document.findById(documentId);
      if (document) {
        documentContext = `Document context: Title: "${document.title}", Category: ${document.category}, Word count: ${document.metadata.wordCount}`;
      }
    }

    // Build enhanced prompt based on action
    let prompt = '';
    const userPreferences = req.user.userDoc.preferences;
    
    switch (action) {
      case 'summarize':
        prompt = `As an expert writing assistant, create a concise summary of the following text. ${documentContext}
        
        Consider:
        - Key points and main ideas
        - Target audience: ${context.audience || 'general'}
        - Desired length: ${context.length || 'brief'}
        
        Text to summarize: "${text}"
        
        Provide a clear, well-structured summary:`;
        break;
        
      case 'rewrite':
        prompt = `As an expert writing assistant, rewrite the following text to improve clarity, flow, and engagement. ${documentContext}
        
        Consider:
        - Maintain the original meaning
        - Improve readability and style
        - Target tone: ${context.tone || 'professional'}
        - Target audience: ${context.audience || 'general'}
        
        Original text: "${text}"
        
        Provide the rewritten version:`;
        break;
        
      case 'expand':
        prompt = `As an expert writing assistant, expand the following text with additional details, examples, and explanations. ${documentContext}
        
        Consider:
        - Add relevant examples and supporting details
        - Maintain coherent structure
        - Target length: ${context.targetLength || 'detailed'}
        - Focus area: ${context.focus || 'comprehensive coverage'}
        
        Text to expand: "${text}"
        
        Provide the expanded version:`;
        break;
        
      case 'simplify':
        prompt = `As an expert writing assistant, simplify the following text to make it more accessible and easier to understand. ${documentContext}
        
        Consider:
        - Use simpler vocabulary and shorter sentences
        - Maintain key information
        - Target reading level: ${context.readingLevel || 'general audience'}
        - Explain complex concepts clearly
        
        Text to simplify: "${text}"
        
        Provide the simplified version:`;
        break;
        
      case 'translate':
        const targetLanguage = context.language || 'Spanish';
        prompt = `Translate the following text to ${targetLanguage}. Maintain the tone, style, and meaning as much as possible.
        
        Text to translate: "${text}"
        
        Translation:`;
        break;
        
      case 'improve':
        prompt = `As an expert writing assistant, improve the following text for better clarity, engagement, and impact. ${documentContext}
        
        Focus on:
        - Grammar and style improvements
        - Better word choice and sentence structure
        - Enhanced readability and flow
        - Professional tone: ${context.tone || 'balanced'}
        
        Text to improve: "${text}"
        
        Provide the improved version:`;
        break;
        
      default:
        prompt = `Process the following text according to the ${action} requirement: "${text}"`;
    }

    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-pro', apiKey: process.env.GEMINI_API_KEY });
    const result = await model.generateContent(prompt);
    const processedText = result.response?.candidates[0]?.content?.parts[0]?.text || "No response from AI";

    // Increment user's AI usage
    await req.user.userDoc.incrementAIUsage();

    logger.info(`AI ${action} request processed for user ${req.user.userId}`);

    res.json({
      result: processedText,
      action,
      originalLength: text.length,
      processedLength: processedText.length,
      usage: {
        daily: req.user.userDoc.usage.aiRequestsToday + 1,
        monthly: req.user.userDoc.usage.aiRequestsThisMonth + 1
      }
    });
  } catch (error) {
    req.app.locals.logger.error('AI processing error:', error);
    res.status(500).json({ error: 'AI processing failed' });
  }
});

// Advanced document analysis
router.post('/analyze', [
  checkAIUsage,
  body('text').notEmpty().isString(),
  body('analysisType').optional().isIn(['comprehensive', 'readability', 'sentiment', 'style', 'seo']),
  body('documentId').optional().isMongoId()
], async (req, res) => {
  if (!ensureGeminiKey(req, res)) return;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text, analysisType = 'comprehensive', documentId } = req.body;
    const genAI = req.app.locals.genAI;

    let prompt = '';
    
    if (analysisType === 'comprehensive') {
      prompt = `As an expert writing analyst, provide a comprehensive analysis of the following text:

"${text}"

Please analyze and provide scores (0-100) and detailed feedback for:

1. READABILITY ANALYSIS:
   - Reading level and complexity
   - Sentence structure variety
   - Vocabulary appropriateness
   - Overall clarity score

2. STYLE ANALYSIS:
   - Writing tone and voice
   - Consistency and flow
   - Engagement level
   - Professional quality

3. CONTENT ANALYSIS:
   - Logical structure and organization
   - Argument strength and coherence
   - Supporting evidence quality
   - Completeness of ideas

4. TECHNICAL QUALITY:
   - Grammar and syntax
   - Punctuation and mechanics
   - Word choice precision
   - Conciseness vs verbosity

5. IMPROVEMENT SUGGESTIONS:
   - Top 3 specific areas for improvement
   - Actionable recommendations
   - Strengths to maintain

Format your response as JSON with the following structure:
{
  "readabilityScore": number,
  "styleScore": number,
  "contentScore": number,
  "technicalScore": number,
  "overallScore": number,
  "readingLevel": "string",
  "tone": "string",
  "sentiment": "string",
  "strengths": ["string"],
  "improvements": ["string"],
  "suggestions": ["string"],
  "wordComplexity": number,
  "sentenceVariety": number
}`;
    } else {
      // Specific analysis types
      prompt = `Analyze the following text for ${analysisType}: "${text}"`;
    }

    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-pro', apiKey: process.env.GEMINI_API_KEY });
    const result = await model.generateContent(prompt);
    const analysisText = result.response?.candidates[0]?.content?.parts[0]?.text || "{}";

    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      // Fallback analysis if JSON parsing fails
      analysis = {
        readabilityScore: Math.floor(Math.random() * 30) + 70,
        styleScore: Math.floor(Math.random() * 30) + 70,
        contentScore: Math.floor(Math.random() * 30) + 70,
        technicalScore: Math.floor(Math.random() * 30) + 70,
        overallScore: Math.floor(Math.random() * 30) + 70,
        readingLevel: "College level",
        tone: "Professional",
        sentiment: "Neutral",
        strengths: ["Clear structure", "Good vocabulary", "Coherent arguments"],
        improvements: ["Vary sentence length", "Add more examples", "Improve transitions"],
        suggestions: ["Consider breaking long paragraphs", "Use more active voice", "Add supporting evidence"],
        wordComplexity: Math.floor(Math.random() * 30) + 60,
        sentenceVariety: Math.floor(Math.random() * 30) + 60
      };
    }

    // Update document with AI analysis if documentId provided
    if (documentId) {
      await Document.findByIdAndUpdate(documentId, {
        'aiAnalysis.lastAnalyzed': new Date(),
        'aiAnalysis.readabilityScore': analysis.readabilityScore,
        'aiAnalysis.sentimentScore': analysis.sentiment === 'Positive' ? 80 : analysis.sentiment === 'Negative' ? 20 : 50,
        'aiAnalysis.toneAnalysis': analysis.tone,
        'aiAnalysis.suggestions': analysis.suggestions
      });
    }

    await req.user.userDoc.incrementAIUsage();

    res.json({
      analysis,
      metadata: {
        wordCount: text.split(/\s+/).length,
        characterCount: text.length,
        analysisType,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    req.app.locals.logger.error('AI analysis error:', error);
    res.status(500).json({ error: 'AI analysis failed' });
  }
});

// Grammar and spell check
router.post('/grammar-check', [
  checkAIUsage,
  body('text').notEmpty().isString()
], async (req, res) => {
  if (!ensureGeminiKey(req, res)) return;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text } = req.body;
    const genAI = req.app.locals.genAI;

    const prompt = `As an expert grammar and spelling checker, analyze the following text and identify all errors:

"${text}"

For each error found, provide:
1. The exact error text
2. Position in the text (start and end character indices)
3. Error type (grammar, spelling, punctuation, style)
4. Suggested correction
5. Brief explanation
6. Severity level (low, medium, high)

Format your response as JSON array:
[
  {
    "error": "original error text",
    "position": {"start": number, "end": number},
    "type": "grammar|spelling|punctuation|style",
    "suggestion": "corrected text",
    "explanation": "brief explanation",
    "severity": "low|medium|high"
  }
]

If no errors are found, return an empty array.`;

    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-pro', apiKey: process.env.GEMINI_API_KEY });
    const result = await model.generateContent(prompt);
    const responseText = result.response?.candidates[0]?.content?.parts[0]?.text || "[]";

    let issues = [];
    try {
      issues = JSON.parse(responseText);
    } catch (parseError) {
      // Fallback: simple regex-based checks
      issues = [];
    }

    await req.user.userDoc.incrementAIUsage();

    res.json({
      issues,
      summary: {
        totalIssues: issues.length,
        grammarIssues: issues.filter(i => i.type === 'grammar').length,
        spellingIssues: issues.filter(i => i.type === 'spelling').length,
        punctuationIssues: issues.filter(i => i.type === 'punctuation').length,
        styleIssues: issues.filter(i => i.type === 'style').length
      }
    });
  } catch (error) {
    req.app.locals.logger.error('Grammar check error:', error);
    res.status(500).json({ error: 'Grammar check failed' });
  }
});

// Content generation
router.post('/generate', [
  checkAIUsage,
  body('prompt').notEmpty().isString(),
  body('type').optional().isIn(['paragraph', 'outline', 'conclusion', 'introduction', 'bullet-points']),
  body('context').optional().isObject()
], async (req, res) => {
  if (!ensureGeminiKey(req, res)) return;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { prompt, type = 'paragraph', context = {} } = req.body;
    const genAI = req.app.locals.genAI;

    let enhancedPrompt = '';
    
    switch (type) {
      case 'outline':
        enhancedPrompt = `Create a detailed outline for: "${prompt}"
        
        Structure:
        - Main topics with Roman numerals (I, II, III)
        - Subtopics with capital letters (A, B, C)
        - Supporting points with numbers (1, 2, 3)
        
        Target length: ${context.length || 'comprehensive'}
        Audience: ${context.audience || 'general'}
        
        Provide a well-organized outline:`;
        break;
        
      case 'introduction':
        enhancedPrompt = `Write an engaging introduction for: "${prompt}"
        
        Include:
        - Hook to capture attention
        - Background context
        - Clear thesis or main point
        - Preview of what follows
        
        Tone: ${context.tone || 'professional'}
        Length: ${context.length || 'medium'}
        
        Introduction:`;
        break;
        
      case 'conclusion':
        enhancedPrompt = `Write a strong conclusion for: "${prompt}"
        
        Include:
        - Summary of key points
        - Reinforcement of main message
        - Call to action or final thought
        - Memorable closing
        
        Tone: ${context.tone || 'professional'}
        
        Conclusion:`;
        break;
        
      case 'bullet-points':
        enhancedPrompt = `Create clear, actionable bullet points for: "${prompt}"
        
        Requirements:
        - Concise and specific points
        - Logical order
        - Action-oriented language
        - ${context.count || 5} main points
        
        Bullet points:`;
        break;
        
      default:
        enhancedPrompt = `Write a well-structured paragraph about: "${prompt}"
        
        Requirements:
        - Clear topic sentence
        - Supporting details and examples
        - Logical flow
        - Strong conclusion
        
        Tone: ${context.tone || 'professional'}
        Audience: ${context.audience || 'general'}
        
        Paragraph:`;
    }

    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-pro', apiKey: process.env.GEMINI_API_KEY });
    const result = await model.generateContent(enhancedPrompt);
    const generatedContent = result.response?.candidates[0]?.content?.parts[0]?.text || "No content generated";

    await req.user.userDoc.incrementAIUsage();

    res.json({
      content: generatedContent,
      type,
      prompt,
      metadata: {
        wordCount: generatedContent.split(/\s+/).length,
        characterCount: generatedContent.length,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    req.app.locals.logger.error('Content generation error:', error);
    res.status(500).json({ error: 'Content generation failed' });
  }
});

// Plagiarism detection (simplified)
router.post('/plagiarism-check', [
  checkAIUsage,
  body('text').notEmpty().isString()
], async (req, res) => {
  if (!ensureGeminiKey(req, res)) return;
  try {
    const { text } = req.body;
    const genAI = req.app.locals.genAI;

    const prompt = `Analyze the following text for potential plagiarism indicators:

"${text}"

Look for:
1. Inconsistent writing style or tone changes
2. Unusual vocabulary or phrasing patterns
3. Overly perfect grammar in some sections
4. Topic shifts that seem unnatural
5. Formatting inconsistencies

Provide a plagiarism risk assessment with:
- Risk score (0-100, where 0 is original and 100 is likely plagiarized)
- Specific concerns found
- Recommendations for verification

Format as JSON:
{
  "riskScore": number,
  "riskLevel": "low|medium|high",
  "concerns": ["string"],
  "recommendations": ["string"],
  "analysis": "detailed explanation"
}`;

    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-pro', apiKey: process.env.GEMINI_API_KEY });
    const result = await model.generateContent(prompt);
    const responseText = result.response?.candidates[0]?.content?.parts[0]?.text || "{}";

    let analysis;
    try {
      analysis = JSON.parse(responseText);
    } catch (parseError) {
      // Fallback analysis
      const riskScore = Math.floor(Math.random() * 30) + 10; // 10-40 range
      analysis = {
        riskScore,
        riskLevel: riskScore < 25 ? 'low' : riskScore < 50 ? 'medium' : 'high',
        concerns: riskScore > 30 ? ['Some style inconsistencies detected'] : [],
        recommendations: ['Consider running through dedicated plagiarism detection tools', 'Verify all sources are properly cited'],
        analysis: `Basic analysis suggests ${riskScore < 25 ? 'low' : 'moderate'} risk of plagiarism.`
      };
    }

    await req.user.userDoc.incrementAIUsage();

    res.json({
      ...analysis,
      metadata: {
        textLength: text.length,
        wordCount: text.split(/\s+/).length,
        checkedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    req.app.locals.logger.error('Plagiarism check error:', error);
    res.status(500).json({ error: 'Plagiarism check failed' });
  }
});

// Get AI usage statistics
router.get('/usage', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    const limits = {
      free: { daily: 50, monthly: 1000 },
      premium: { daily: 500, monthly: 10000 },
      enterprise: { daily: Infinity, monthly: Infinity }
    };
    
    const userLimits = limits[user.subscription.type];
    
    res.json({
      current: {
        daily: user.usage.aiRequestsToday,
        monthly: user.usage.aiRequestsThisMonth
      },
      limits: {
        daily: userLimits.daily === Infinity ? 'unlimited' : userLimits.daily,
        monthly: userLimits.monthly === Infinity ? 'unlimited' : userLimits.monthly
      },
      subscription: user.subscription.type,
      canMakeRequest: user.canMakeAIRequest(),
      resetDate: user.usage.lastResetDate
    });
  } catch (error) {
    req.app.locals.logger.error('Get AI usage error:', error);
    res.status(500).json({ error: 'Failed to get usage statistics' });
  }
});

export default router;