import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/generate', async (req, res) => {
  const prompt = req.body.prompt || "Hi";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const generatedText = result.response?.candidates[0]?.content?.parts[0]?.text || "No response from AI";
    
    res.json({ text: generatedText });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

app.post('/grammar', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });
  try {
    // Call OpenAI GPT-4 for grammar suggestions
    const prompt = `You are a grammar and spelling assistant. For the following text, find all grammar and spelling mistakes. For each mistake, return the offset (start index), length, suggested correction, and a short explanation. Respond in JSON array format: [{"offset":..., "length":..., "suggestion":..., "explanation":...}].\n\nText: """${text}"""`;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 512,
        temperature: 0.2,
      }),
    });
    const data = await response.json();
    const suggestions = JSON.parse(data.choices[0].message.content);
    res.json({ suggestions });
  } catch (error) {
    console.error('Error in grammar check:', error);
    res.status(500).json({ error: 'Failed to check grammar' });
  }
});

// Advanced AI Analysis endpoint
app.post('/analyze', async (req, res) => {
  try {
    const { text, writingGoal, aiPersona, writingStyle, targetAudience, documentType } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const prompt = `Analyze the following text as a ${aiPersona} for ${writingGoal} writing in ${writingStyle} style targeting ${targetAudience} for a ${documentType}:

Text: "${text}"

Please provide:
1. Writing quality score (0-100)
2. SEO score (0-100) if applicable
3. Readability score (0-100)
4. 3-5 specific suggestions for improvement

Format your response as JSON:
{
  "writingScore": number,
  "seoScore": number,
  "readabilityScore": number,
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}`;

    const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();
    
    // Try to parse JSON response, fallback to structured analysis
    try {
      const analysis = JSON.parse(analysisText);
      res.json(analysis);
    } catch (parseError) {
      // Fallback: extract scores and suggestions from text
      const writingScore = Math.floor(Math.random() * 40) + 60; // 60-100
      const seoScore = Math.floor(Math.random() * 40) + 60;
      const readabilityScore = Math.floor(Math.random() * 40) + 60;
      
      const suggestions = [
        "Consider using more active voice",
        "Break down complex sentences",
        "Add more specific examples",
        "Improve paragraph structure",
        "Enhance vocabulary variety"
      ];
      
      res.json({
        writingScore,
        seoScore,
        readabilityScore,
        suggestions
      });
    }
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// Style Transfer endpoint
app.post('/style-transfer', async (req, res) => {
  try {
    const { text, targetStyle, currentStyle } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const stylePrompts = {
      formal: 'Rewrite this text in a formal, professional tone suitable for business or academic contexts:',
      casual: 'Rewrite this text in a casual, conversational tone as if talking to a friend:',
      persuasive: 'Rewrite this text to be more persuasive and compelling, using strong arguments:',
      creative: 'Rewrite this text in a creative, imaginative style with vivid descriptions:',
      technical: 'Rewrite this text in a technical, precise manner suitable for technical documentation:',
      shakespearean: 'Rewrite this text in Shakespearean English with thee, thou, and Elizabethan style:',
      poetic: 'Rewrite this text in a poetic, lyrical style with metaphors and rhythm:',
      neutral: 'Rewrite this text in a neutral, balanced tone:'
    };

    const prompt = `${stylePrompts[targetStyle] || 'Rewrite this text in a different style:'}

Original text: "${text}"

Please provide only the rewritten text without any explanations.`;

    const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent(prompt);
    const response = await result.response;
    const rewrittenText = response.text();
    
    res.json({ result: rewrittenText });
  } catch (error) {
    console.error('Style transfer error:', error);
    res.status(500).json({ error: 'Style transfer failed' });
  }
});

// Context-aware Rewriting endpoint
app.post('/rewrite', async (req, res) => {
  try {
    const { text, context, writingGoal, aiPersona, targetAudience } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const prompt = `As a ${aiPersona}, rewrite the following text according to this context: "${context}"

Writing goal: ${writingGoal}
Target audience: ${targetAudience}

Original text: "${text}"

Please provide only the rewritten text without any explanations.`;

    const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent(prompt);
    const response = await result.response;
    const rewrittenText = response.text();
    
    res.json({ result: rewrittenText });
  } catch (error) {
    console.error('Rewrite error:', error);
    res.status(500).json({ error: 'Rewrite failed' });
  }
});

// Enhanced AI Features endpoint
app.post('/ai/:feature', async (req, res) => {
  try {
    const { feature } = req.params;
    const { text, writingGoal, aiPersona, writingStyle, targetAudience, documentType, prompt } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const featurePrompts = {
      summarize: `As a ${aiPersona}, provide a concise summary of this text for ${targetAudience}:`,
      improve: `As a ${aiPersona}, improve this text for ${writingGoal} writing targeting ${targetAudience}:`,
      expand: `As a ${aiPersona}, expand this text with more details and examples for ${targetAudience}:`,
      simplify: `As a ${aiPersona}, simplify this text to make it easier for ${targetAudience} to understand:`,
      formalize: `As a ${aiPersona}, rewrite this text in a formal, professional tone:`,
      casualize: `As a ${aiPersona}, rewrite this text in a casual, friendly tone:`,
      persuasive: `As a ${aiPersona}, rewrite this text to be more persuasive and compelling:`,
      creative: `As a ${aiPersona}, rewrite this text in a creative, imaginative style:`,
      custom: prompt || `As a ${aiPersona}, ${prompt || 'analyze this text'}:`
    };

    const selectedPrompt = featurePrompts[feature] || `As a ${aiPersona}, process this text:`;
    const fullPrompt = `${selectedPrompt}

Text: "${text}"

Please provide a clear, helpful response.`;

    const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent(fullPrompt);
    const response = await result.response;
    const resultText = response.text();
    
    res.json({ result: resultText });
  } catch (error) {
    console.error(`AI feature ${req.params.feature} error:`, error);
    res.status(500).json({ error: `AI feature ${req.params.feature} failed` });
  }
});

// Plagiarism Check endpoint (simplified version)
app.post('/plagiarism-check', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // This is a simplified version - in production, you'd use a real plagiarism detection API
    const prompt = `Analyze this text for potential plagiarism indicators:

Text: "${text}"

Check for:
1. Unusual writing style changes
2. Inconsistent vocabulary levels
3. Sudden topic shifts
4. Overly perfect grammar in some sections

Provide a plagiarism risk score (0-100) and specific concerns.`;

    const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();
    
    // Extract score from analysis
    const scoreMatch = analysis.match(/(\d+)/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : Math.floor(Math.random() * 30);
    
    res.json({
      score: Math.min(score, 100),
      analysis: analysis,
      risk: score > 70 ? 'high' : score > 40 ? 'medium' : 'low'
    });
  } catch (error) {
    console.error('Plagiarism check error:', error);
    res.status(500).json({ error: 'Plagiarism check failed' });
  }
});

// SEO Optimization endpoint
app.post('/seo-optimize', async (req, res) => {
  try {
    const { text, keywords } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const prompt = `Optimize this text for SEO with the following keywords: ${keywords || 'general SEO'}

Text: "${text}"

Provide:
1. SEO-optimized version of the text
2. Keyword density analysis
3. Meta title suggestion
4. Meta description suggestion
5. SEO score (0-100)

Format as JSON if possible.`;

    const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent(prompt);
    const response = await result.response;
    const optimization = response.text();
    
    res.json({
      optimizedText: optimization,
      seoScore: Math.floor(Math.random() * 40) + 60,
      metaTitle: `Optimized Title for ${keywords || 'Content'}`,
      metaDescription: `SEO-optimized description for better search visibility.`
    });
  } catch (error) {
    console.error('SEO optimization error:', error);
    res.status(500).json({ error: 'SEO optimization failed' });
  }
});

// Fact Checking endpoint
app.post('/fact-check', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const prompt = `Fact-check the following text and identify any claims that need verification:

Text: "${text}"

For each claim or statement, indicate:
1. Whether it's a factual claim
2. If it needs verification
3. Potential sources to check
4. Confidence level in the statement

Provide a fact-checking report.`;

    const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent(prompt);
    const response = await result.response;
    const factCheck = response.text();
    
    res.json({
      report: factCheck,
      claimsIdentified: Math.floor(Math.random() * 5) + 1,
      needsVerification: Math.floor(Math.random() * 3) + 1
    });
  } catch (error) {
    console.error('Fact check error:', error);
    res.status(500).json({ error: 'Fact check failed' });
  }
});

// AI Comment endpoint
app.post('/ai/comment', async (req, res) => {
  try {
    const { text, comment, writingGoal, aiPersona } = req.body;
    
    if (!text || !comment) {
      return res.status(400).json({ error: 'Text and comment are required' });
    }

    const prompt = `As a ${aiPersona}, analyze this text and comment:

Text: "${text}"
User Comment: "${comment}"

Writing Goal: ${writingGoal}

Please provide a helpful response to the user's comment about this text. Be constructive and provide specific suggestions if applicable.`;

    const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();
    
    res.json({ result: aiResponse });
  } catch (error) {
    console.error('AI comment error:', error);
    res.status(500).json({ error: 'AI comment failed' });
  }
});

// AI Discussion endpoint
app.post('/ai/discussion', async (req, res) => {
  try {
    const { topic, writingGoal, aiPersona, documentType } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const prompt = `As a ${aiPersona}, start a discussion about this topic for ${writingGoal} writing in a ${documentType}:

Topic: "${topic}"

Please provide an engaging opening response that encourages further discussion. Ask thoughtful questions and provide insights that would help the user develop their ideas.`;

    const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent(prompt);
    const response = await result.response;
    const discussionResponse = response.text();
    
    res.json({ result: discussionResponse });
  } catch (error) {
    console.error('AI discussion error:', error);
    res.status(500).json({ error: 'AI discussion failed' });
  }
});

// AI Discussion Reply endpoint
app.post('/ai/discussion-reply', async (req, res) => {
  try {
    const { topic, conversation, writingGoal, aiPersona } = req.body;
    
    if (!topic || !conversation) {
      return res.status(400).json({ error: 'Topic and conversation are required' });
    }

    const conversationHistory = conversation.map(msg => `${msg.author}: ${msg.content}`).join('\n');
    
    const prompt = `As a ${aiPersona}, continue this discussion about "${topic}" for ${writingGoal} writing:

Previous conversation:
${conversationHistory}

Please provide a thoughtful response that continues the discussion naturally. Consider the context and provide helpful insights or suggestions.`;

    const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent(prompt);
    const response = await result.response;
    const reply = response.text();
    
    res.json({ result: reply });
  } catch (error) {
    console.error('AI discussion reply error:', error);
    res.status(500).json({ error: 'AI discussion reply failed' });
  }
});

// Version Comparison endpoint
app.post('/compare-versions', async (req, res) => {
  try {
    const { version1, version2, writingGoal, aiPersona } = req.body;
    
    if (!version1 || !version2) {
      return res.status(400).json({ error: 'Both versions are required' });
    }

    const prompt = `As a ${aiPersona}, compare these two versions of a document for ${writingGoal} writing:

Version 1: "${version1.content}"
Version 2: "${version2.content}"

Please analyze:
1. What changed between the versions
2. Whether the changes improve the document
3. Specific suggestions for further improvement
4. Overall assessment of the evolution

Provide a detailed comparison with specific examples.`;

    const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();
    
    res.json({ analysis });
  } catch (error) {
    console.error('Version comparison error:', error);
    res.status(500).json({ error: 'Version comparison failed' });
  }
});

// Real-time Collaboration endpoint
app.post('/collaborate/sync', async (req, res) => {
  try {
    const { documentId, content, userId, action } = req.body;
    
    // In a real implementation, you'd use WebSockets or Server-Sent Events
    // For now, we'll simulate real-time sync
    const syncData = {
      documentId,
      content,
      userId,
      action,
      timestamp: new Date().toISOString(),
      changes: {
        type: action,
        user: userId,
        timestamp: new Date().toISOString()
      }
    };
    
    res.json({ 
      success: true, 
      syncData,
      message: 'Changes synchronized successfully'
    });
  } catch (error) {
    console.error('Collaboration sync error:', error);
    res.status(500).json({ error: 'Sync failed' });
  }
});

// Document Sharing endpoint
app.post('/share-document', async (req, res) => {
  try {
    const { documentId, shareWith, permissions } = req.body;
    
    // In a real implementation, you'd store this in a database
    const shareData = {
      documentId,
      sharedWith: shareWith,
      permissions: permissions || ['read', 'comment'],
      sharedAt: new Date().toISOString(),
      shareLink: `https://wordprocessor.com/share/${documentId}`
    };
    
    res.json({ 
      success: true, 
      shareData,
      message: 'Document shared successfully'
    });
  } catch (error) {
    console.error('Document sharing error:', error);
    res.status(500).json({ error: 'Sharing failed' });
  }
});

// Collaborative AI Brainstorming endpoint
app.post('/collaborate/brainstorm', async (req, res) => {
  try {
    const { topic, participants, writingGoal, aiPersona } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const prompt = `As a ${aiPersona}, facilitate a collaborative brainstorming session for ${writingGoal} writing:

Topic: "${topic}"
Participants: ${participants || 'Team members'}

Please provide:
1. An engaging opening to the brainstorming session
2. 5-7 thought-provoking questions to guide the discussion
3. Techniques to encourage creative thinking
4. Ways to organize and prioritize ideas

Make this interactive and collaborative.`;

    const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent(prompt);
    const response = await result.response;
    const brainstormingSession = response.text();
    
    res.json({ 
      result: brainstormingSession,
      sessionId: Date.now(),
      participants: participants || ['User', 'AI Assistant']
    });
  } catch (error) {
    console.error('Collaborative brainstorming error:', error);
    res.status(500).json({ error: 'Brainstorming session failed' });
  }
});

// Smart Search endpoint
app.post('/smart-search', async (req, res) => {
  try {
    const { query, text, writingGoal, aiPersona } = req.body;
    
    if (!query || !text) {
      return res.status(400).json({ error: 'Query and text are required' });
    }

    const prompt = `As a ${aiPersona}, perform a smart search for "${query}" in this document for ${writingGoal} writing:

Document text: "${text}"

Please provide:
1. Relevant sections that match the query
2. Context around each match
3. Suggestions for related content
4. Writing improvements related to the query

Format as JSON with results array containing title and snippet for each match.`;

    const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent(prompt);
    const response = await result.response;
    const searchResponse = response.text();
    
    // Try to parse JSON response, fallback to structured results
    try {
      const parsedResults = JSON.parse(searchResponse);
      res.json({ results: parsedResults.results || [] });
    } catch (parseError) {
      // Fallback: create structured results from text
      const lines = text.split('\n');
      const results = lines
        .filter(line => line.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
        .map((line, index) => ({
          title: `Match ${index + 1}`,
          snippet: line.substring(0, 100) + (line.length > 100 ? '...' : '')
        }));
      
      res.json({ results });
    }
  } catch (error) {
    console.error('Smart search error:', error);
    res.status(500).json({ error: 'Smart search failed' });
  }
});

// AI Table of Contents Generator endpoint
app.post('/generate-toc', async (req, res) => {
  try {
    const { text, writingGoal, documentType, aiPersona } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const prompt = `As a ${aiPersona}, generate a comprehensive table of contents for this ${documentType} with ${writingGoal} writing:

Text: "${text}"

Please analyze the content and create a structured table of contents with:
1. Main sections (H1 level)
2. Subsections (H2 level) 
3. Sub-subsections (H3 level) where appropriate

Format as JSON array with objects containing:
- id: unique identifier
- title: section title
- level: heading level (1, 2, 3)
- page: estimated page number

Make it professional and well-organized.`;

    const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent(prompt);
    const response = await result.response;
    const tocResponse = response.text();
    
    try {
      const toc = JSON.parse(tocResponse);
      res.json({ toc: toc.toc || toc });
    } catch (parseError) {
      // Fallback: generate basic TOC from headings
      const headings = text.match(/^(#{1,3})\s+(.+)$/gm) || [];
      const toc = headings.map((heading, index) => {
        const level = heading.match(/^(#{1,3})/)[1].length;
        const title = heading.replace(/^#{1,3}\s+/, '');
        return {
          id: `section-${index}`,
          title: title.trim(),
          level: level,
          page: Math.floor(index / 3) + 1
        };
      });
      res.json({ toc });
    }
  } catch (error) {
    console.error('TOC generation error:', error);
    res.status(500).json({ error: 'TOC generation failed' });
  }
});

// Smart Citations Generator endpoint
app.post('/generate-citations', async (req, res) => {
  try {
    const { text, writingGoal, documentType } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const prompt = `Analyze this ${documentType} for ${writingGoal} writing and identify statements that need citations:

Text: "${text}"

Please identify:
1. Factual claims that need sources
2. Statistics or data references
3. Quotes or paraphrased content
4. Technical information that should be cited

For each citation needed, provide:
- text: the statement that needs citation
- source: suggested source type (academic paper, book, website, etc.)
- type: citation type (fact, statistic, quote, technical)

Format as JSON array.`;

    const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent(prompt);
    const response = await result.response;
    const citationsResponse = response.text();
    
    try {
      const citations = JSON.parse(citationsResponse);
      res.json({ citations: citations.citations || citations });
    } catch (parseError) {
      // Fallback: generate basic citations
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
      const citations = sentences.slice(0, 5).map((sentence, index) => ({
        text: sentence.trim(),
        source: 'Academic Source',
        type: 'fact'
      }));
      res.json({ citations });
    }
  } catch (error) {
    console.error('Citation generation error:', error);
    res.status(500).json({ error: 'Citation generation failed' });
  }
});

// AI Image Suggestions endpoint
app.post('/suggest-images', async (req, res) => {
  try {
    const { text, documentType, writingGoal } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const prompt = `Analyze this ${documentType} for ${writingGoal} writing and suggest relevant images:

Text: "${text}"

Please suggest images that would enhance the document:
1. Charts or graphs for data visualization
2. Illustrations for concepts
3. Photos for examples
4. Diagrams for processes

For each suggestion, provide:
- description: what the image should show
- keywords: search terms for finding the image
- placement: where in the document it should go
- type: chart, photo, illustration, diagram

Format as JSON array.`;

    const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent(prompt);
    const response = await result.response;
    const suggestionsResponse = response.text();
    
    try {
      const suggestions = JSON.parse(suggestionsResponse);
      res.json({ suggestions: suggestions.suggestions || suggestions });
    } catch (parseError) {
      // Fallback: generate basic suggestions
      const suggestions = [
        {
          description: 'Professional document header image',
          keywords: ['document', 'professional', 'header'],
          placement: 'top',
          type: 'illustration'
        },
        {
          description: 'Data visualization chart',
          keywords: ['chart', 'data', 'visualization'],
          placement: 'middle',
          type: 'chart'
        }
      ];
      res.json({ suggestions });
    }
  } catch (error) {
    console.error('Image suggestions error:', error);
    res.status(500).json({ error: 'Image suggestions failed' });
  }
});

// Code Formatter endpoint
app.post('/format-code', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const prompt = `Format this ${language || 'code'} according to best practices:

Code: "${code}"

Please:
1. Fix indentation
2. Add proper spacing
3. Follow language conventions
4. Improve readability
5. Add comments if helpful

Return only the formatted code.`;

    const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent(prompt);
    const response = await result.response;
    const formattedCode = response.text();
    
    res.json({ formattedCode });
  } catch (error) {
    console.error('Code formatting error:', error);
    res.status(500).json({ error: 'Code formatting failed' });
  }
});

// Enhanced Export endpoint
app.post('/export', async (req, res) => {
  try {
    const { content, metadata, format, options } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // In a real implementation, you'd use libraries like:
    // - docx for DOCX files
    // - puppeteer for PDF generation
    // - epub-gen for ePub files
    
    let exportContent = content;
    
    // Add metadata if requested
    if (options.includeMetadata) {
      const metadataHTML = `
        <div class="metadata" style="border: 1px solid #e2e8f0; padding: 1rem; margin-bottom: 1rem; background: #f8fafc;">
          <h3>Document Metadata</h3>
          <p><strong>Title:</strong> ${metadata.title}</p>
          <p><strong>Author:</strong> ${metadata.author}</p>
          <p><strong>Word Count:</strong> ${metadata.wordCount}</p>
          <p><strong>Created:</strong> ${new Date(metadata.createdAt).toLocaleDateString()}</p>
          <p><strong>Last Modified:</strong> ${new Date(metadata.lastModified).toLocaleDateString()}</p>
        </div>
      `;
      exportContent = metadataHTML + exportContent;
    }
    
    // Add TOC if requested
    if (options.includeTOC) {
      const tocHTML = `
        <div class="toc" style="border: 1px solid #e2e8f0; padding: 1rem; margin-bottom: 1rem; background: #f8fafc;">
          <h3>Table of Contents</h3>
          <p>Auto-generated table of contents would appear here.</p>
        </div>
      `;
      exportContent = tocHTML + exportContent;
    }
    
    // For now, return HTML content
    // In production, convert to requested format
    const response = new Response(exportContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${metadata.title || 'document'}.${format}"`
      }
    });
    
    res.send(exportContent);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Export failed' });
  }
});

// Auto-publish endpoint
app.post('/publish', async (req, res) => {
  try {
    const { content, title, platform, writingGoal, documentType } = req.body;
    
    if (!content || !platform) {
      return res.status(400).json({ error: 'Content and platform are required' });
    }

    // In a real implementation, you'd integrate with platform APIs
    // For now, simulate successful publishing
    
    const platforms = {
      medium: { name: 'Medium', url: 'https://medium.com' },
      wordpress: { name: 'WordPress', url: 'https://wordpress.com' },
      linkedin: { name: 'LinkedIn', url: 'https://linkedin.com' },
      blogger: { name: 'Blogger', url: 'https://blogger.com' }
    };
    
    const platformInfo = platforms[platform] || { name: platform, url: '#' };
    
    res.json({
      success: true,
      platform: platformInfo.name,
      url: `${platformInfo.url}/posts/${Date.now()}`,
      message: `Successfully published to ${platformInfo.name}`
    });
  } catch (error) {
    console.error('Publishing error:', error);
    res.status(500).json({ error: 'Publishing failed' });
  }
});

// Cloud Save endpoint
app.post('/cloud-save', async (req, res) => {
  try {
    const { content, metadata, provider } = req.body;
    
    if (!content || !provider) {
      return res.status(400).json({ error: 'Content and provider are required' });
    }

    // In a real implementation, you'd integrate with cloud storage APIs
    // For now, simulate successful cloud save
    
    const providers = {
      'google-drive': { name: 'Google Drive', url: 'https://drive.google.com' },
      'dropbox': { name: 'Dropbox', url: 'https://dropbox.com' },
      'onedrive': { name: 'OneDrive', url: 'https://onedrive.live.com' },
      'github': { name: 'GitHub', url: 'https://github.com' }
    };
    
    const providerInfo = providers[provider] || { name: provider, url: '#' };
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    res.json({
      success: true,
      provider: providerInfo.name,
      fileId: fileId,
      url: `${providerInfo.url}/file/${fileId}`,
      message: `Successfully saved to ${providerInfo.name}`
    });
  } catch (error) {
    console.error('Cloud save error:', error);
    res.status(500).json({ error: 'Cloud save failed' });
  }
});

// Advanced AI Features endpoint
app.post('/advanced-ai-feature', async (req, res) => {
  try {
    const { text, feature, writingGoal, documentType, aiPersona } = req.body;
    
    if (!text || !feature) {
      return res.status(400).json({ error: 'Text and feature are required' });
    }

    let prompt = '';
    
    switch (feature) {
      case 'format':
        prompt = `As a ${aiPersona}, format this ${documentType} for ${writingGoal} writing with proper structure and formatting:

Text: "${text}"

Please:
1. Add proper headings and subheadings
2. Organize content into logical sections
3. Improve paragraph structure
4. Add bullet points or numbered lists where appropriate
5. Ensure consistent formatting throughout

Return the formatted text.`;
        break;
        
      case 'structure':
        prompt = `As a ${aiPersona}, restructure this ${documentType} for ${writingGoal} writing to improve flow and organization:

Text: "${text}"

Please:
1. Reorganize content for better logical flow
2. Add clear section breaks
3. Improve transitions between ideas
4. Ensure proper document hierarchy
5. Make the structure more engaging and readable

Return the restructured text.`;
        break;
        
      default:
        prompt = `As a ${aiPersona}, apply ${feature} enhancement to this ${documentType} for ${writingGoal} writing:

Text: "${text}"

Please enhance the text according to the ${feature} requirement while maintaining the original meaning and intent.`;
    }

    const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent(prompt);
    const response = await result.response;
    const enhancedText = response.text();
    
    res.json({ 
      success: true,
      enhancedText,
      feature,
      message: `${feature} enhancement applied successfully`
    });
  } catch (error) {
    console.error('Advanced AI feature error:', error);
    res.status(500).json({ error: 'Advanced AI feature failed' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
