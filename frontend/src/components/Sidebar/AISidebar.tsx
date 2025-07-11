import React, { useState, useRef, useEffect } from 'react';
import { 
  X, MessageSquare, Send, Bot, Wand2, FileText, 
  TrendingUp, Target, Lightbulb, RefreshCw, CheckCircle,
  Languages, BookOpen, PenTool, Zap, Search, Award
} from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { useDocument } from '../../context/DocumentContext';
import { useCollaboration } from '../../context/CollaborationContext';

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AISidebarProps {
  isOpen: boolean;
  onClose: () => void;
  injectedMessages?: Message[];
}

const AISidebar: React.FC<AISidebarProps> = ({ isOpen, onClose, injectedMessages }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [grammarCheck, setGrammarCheck] = useState<any>(null);

  const { 
    processText,
    generateContent,
    analyzeWriting,
    checkGrammar,
    checkPlagiarism,
    translateText,
    generateOutline,
    improveWriting,
    generateCitations
  } = useAI();
  const { document, updateContent } = useDocument();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('aiChatHistory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
        setMessages(parsed.map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) })));
      } catch {}
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('aiChatHistory', JSON.stringify(messages));
  }, [messages]);

  // Start a new chat (clear messages, but keep history in localStorage)
  const handleNewChat = () => {
    setMessages([]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Get selected text when sidebar opens
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    }
  }, [isOpen]);

  useEffect(() => {
    if (injectedMessages && injectedMessages.length > 0) {
      setMessages((prev) => [...prev, ...injectedMessages]);
    }
    // eslint-disable-next-line
  }, [JSON.stringify(injectedMessages)]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      const response = await generateContent(inputValue);
      updateContent(document.content + "<br>" + response);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('Error generating AI response:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        type: 'ai',
        content: error.message || 'AI error occurred',
        timestamp: new Date(),
      }]);
    }
  };

  const handleTextAction = async (action: string) => {
    if (!selectedText.trim()) return;
    try {
      let response = '';
      if ([
        'summarize', 'rewrite', 'expand', 'simplify', 'formal', 'casual'
      ].includes(action)) {
        response = await processText(selectedText, action);
      } else if (action === 'grammar') {
        const result = await checkGrammar(selectedText);
        response = result.correctedText || selectedText;
      } else if (action === 'analyze') {
        const result = await analyzeWriting(selectedText);
        response = JSON.stringify(result);
      } else if (action === 'plagiarism') {
        const result = await checkPlagiarism(selectedText);
        response = JSON.stringify(result);
      }
      updateContent(document.content + "<br>" + response);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('Error processing text:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        type: 'ai',
        content: error.message || 'AI error occurred',
        timestamp: new Date(),
      }]);
    }
  };

  const handleAdvancedAction = async (action: string, params?: any) => {
    try {
      let result = '';
      switch (action) {
        case 'translate':
          result = await translateText(selectedText || document.content, params.language || 'Spanish');
          break;
        case 'outline':
          result = await generateOutline(params.topic || 'Document Topic');
          break;
        case 'improve':
          result = await improveWriting(selectedText || document.content, params.style || 'general');
          break;
        case 'citations':
          result = await generateCitations(document.content, params.style || 'APA');
          break;
        case 'plagiarism':
          const plagResult = await checkPlagiarism(document.content);
          result = `**Plagiarism Check Results:**\n\nOriginality Score: ${plagResult.originalityScore}%\nStatus: ${plagResult.status}\n\nMatches found: ${plagResult.matches.length}`;
          break;
      }
      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: result,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('Error with advanced action:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        type: 'ai',
        content: error.message || 'AI error occurred',
        timestamp: new Date(),
      }]);
    }
  };

  const handleAnalyzeDocument = async () => {
    if (!document.content) return;
    
    try {
      const result = await analyzeWriting(document.content);
      setAnalysis(result);
      setActiveTab('insights');
    } catch (error: any) {
      console.error('Error analyzing document:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        type: 'ai',
        content: error.message || 'AI error occurred',
        timestamp: new Date(),
      }]);
    }
  };

  const handleGrammarCheck = async () => {
    if (!document.content) return;
    
    try {
      const result = await checkGrammar(document.content);
      setGrammarCheck(result);
      setActiveTab('grammar');
    } catch (error: any) {
      console.error('Error checking grammar:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        type: 'ai',
        content: error.message || 'AI error occurred',
        timestamp: new Date(),
      }]);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed right-0 top-0 h-full w-96 max-w-full z-40 transition-transform duration-300 bg-white shadow-lg border-l border-gray-200 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      style={{ maxHeight: '100vh', overflowY: 'auto' }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900">AI Assistant</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-md text-xs font-medium"
              title="Start new chat"
            >
              <RefreshCw className="w-4 h-4" /> New Chat
            </button>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex mt-3 space-x-1 bg-white/60 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 px-2 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'chat'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="w-3 h-3 inline mr-1" />
            Chat
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`flex-1 py-2 px-2 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'tools'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Wand2 className="w-3 h-3 inline mr-1" />
            Tools
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex-1 py-2 px-2 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'insights'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-3 h-3 inline mr-1" />
            Insights
          </button>
          <button
            onClick={() => setActiveTab('grammar')}
            className={`flex-1 py-2 px-2 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'grammar'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CheckCircle className="w-3 h-3 inline mr-1" />
            Grammar
          </button>
        </div>
      </div>

      {/* Chat/Content Area (scrollable only for messages) */}
      <div className="flex-1 flex flex-col">
        {activeTab === 'chat' ? (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2" style={{ minHeight: 0 }}>
              {messages.map((msg) => (
                <div key={msg.id} className={`mb-2 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`rounded-lg px-3 py-2 text-sm max-w-[80%] break-words
                      ${msg.type === 'user'
                        ? 'bg-blue-100 text-gray-900 dark:bg-blue-900 dark:text-gray-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}
                      ${msg.type === 'ai' && msg.content && (msg.content.toLowerCase().includes('error') || msg.content.toLowerCase().includes('network')) ? 'border border-red-400 text-red-700 dark:text-red-300' : ''}
                    `}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="bg-white border-t border-gray-200 p-3 flex items-center z-10">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
                placeholder="Ask AI anything..."
                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="ml-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'tools' && (
              <div className="p-4 space-y-4 overflow-auto">
                {selectedText && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs font-medium text-blue-800 mb-2">Selected Text:</p>
                    <p className="text-sm text-blue-700 italic">"{selectedText.slice(0, 100)}..."</p>
                  </div>
                )}
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Text Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleTextAction('summarize')}
                      disabled={!selectedText}
                      className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      <FileText className="w-4 h-4 text-blue-600 mb-1" />
                      <p className="text-xs font-medium">Summarize</p>
                    </button>
                    <button
                      onClick={() => handleTextAction('rewrite')}
                      disabled={!selectedText}
                      className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      <RefreshCw className="w-4 h-4 text-green-600 mb-1" />
                      <p className="text-xs font-medium">Rewrite</p>
                    </button>
                    <button
                      onClick={() => handleTextAction('expand')}
                      disabled={!selectedText}
                      className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      <TrendingUp className="w-4 h-4 text-purple-600 mb-1" />
                      <p className="text-xs font-medium">Expand</p>
                    </button>
                    <button
                      onClick={() => handleTextAction('simplify')}
                      disabled={!selectedText}
                      className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Target className="w-4 h-4 text-orange-600 mb-1" />
                      <p className="text-xs font-medium">Simplify</p>
                    </button>
                    <button
                      onClick={() => handleTextAction('formal')}
                      disabled={!selectedText}
                      className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      <PenTool className="w-4 h-4 text-indigo-600 mb-1" />
                      <p className="text-xs font-medium">Make Formal</p>
                    </button>
                    <button
                      onClick={() => handleTextAction('casual')}
                      disabled={!selectedText}
                      className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Zap className="w-4 h-4 text-yellow-600 mb-1" />
                      <p className="text-xs font-medium">Make Casual</p>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Advanced Tools</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAdvancedAction('translate', { language: 'Spanish' })}
                      disabled={!selectedText}
                      className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Languages className="w-4 h-4 text-blue-600 mb-1" />
                      <p className="text-sm font-medium">Translate to Spanish</p>
                      <p className="text-xs text-gray-600">Translate selected text</p>
                    </button>
                    <button
                      onClick={() => handleAdvancedAction('outline', { topic: 'Document Topic' })}
                      disabled={false}
                      className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      <BookOpen className="w-4 h-4 text-green-600 mb-1" />
                      <p className="text-sm font-medium">Generate Outline</p>
                      <p className="text-xs text-gray-600">Create document structure</p>
                    </button>
                    <button
                      onClick={() => handleAdvancedAction('improve', { style: 'academic' })}
                      disabled={!document.content}
                      className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Award className="w-4 h-4 text-purple-600 mb-1" />
                      <p className="text-sm font-medium">Improve for Academic Style</p>
                      <p className="text-xs text-gray-600">Enhance writing quality</p>
                    </button>
                    <button
                      onClick={() => handleAdvancedAction('citations', { style: 'APA' })}
                      disabled={!document.content}
                      className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      <BookOpen className="w-4 h-4 text-indigo-600 mb-1" />
                      <p className="text-sm font-medium">Generate APA Citations</p>
                      <p className="text-xs text-gray-600">Create bibliography</p>
                    </button>
                    <button
                      onClick={() => handleAdvancedAction('plagiarism')}
                      disabled={!document.content}
                      className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Search className="w-4 h-4 text-red-600 mb-1" />
                      <p className="text-sm font-medium">Check Plagiarism</p>
                      <p className="text-xs text-gray-600">Verify originality</p>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Document Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleAnalyzeDocument}
                      disabled={!document.content}
                      className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      <TrendingUp className="w-4 h-4 text-blue-600 mb-1" />
                      <p className="text-xs font-medium">Analyze Writing</p>
                    </button>
                    <button
                      onClick={handleGrammarCheck}
                      disabled={!document.content}
                      className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600 mb-1" />
                      <p className="text-xs font-medium">Grammar Check</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="p-4 space-y-4 overflow-auto">
                {analysis ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Readability Score</h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${analysis.readabilityScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{analysis.readabilityScore}/100</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Grade Level: {analysis.gradeLevel}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-purple-50 rounded-lg p-3">
                        <p className="text-xs text-purple-600 font-medium">Tone</p>
                        <p className="text-sm font-semibold text-purple-900">{analysis.tone}</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3">
                        <p className="text-xs text-orange-600 font-medium">Sentiment</p>
                        <p className="text-sm font-semibold text-orange-900">{analysis.sentiment}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs text-blue-600 font-medium">Word Complexity</p>
                        <p className="text-sm font-semibold text-blue-900">{analysis.wordComplexity}%</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-xs text-green-600 font-medium">Sentence Variety</p>
                        <p className="text-sm font-semibold text-green-900">{analysis.sentenceVariety}%</p>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                        Strengths
                      </h3>
                      <ul className="space-y-1">
                        {analysis.strengths.map((strength: string, index: number) => (
                          <li key={index} className="text-sm text-gray-700">• {strength}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Lightbulb className="w-4 h-4 text-yellow-600 mr-1" />
                        Suggestions for Improvement
                      </h3>
                      <ul className="space-y-1">
                        {analysis.suggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="text-sm text-gray-700">• {suggestion}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Target className="w-4 h-4 text-orange-600 mr-1" />
                        Areas to Improve
                      </h3>
                      <ul className="space-y-1">
                        {analysis.improvements.map((improvement: string, index: number) => (
                          <li key={index} className="text-sm text-gray-700">• {improvement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 mt-8">
                    <TrendingUp className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-sm">No analysis available</p>
                    <p className="text-xs text-gray-400 mt-1">Use the Tools tab to analyze your document</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'grammar' && (
              <div className="p-4 space-y-4 overflow-auto">
                {grammarCheck ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                        Grammar Check Results
                      </h3>
                      <p className="text-sm text-gray-700">
                        Found {grammarCheck.issues.length} potential issues
                      </p>
                    </div>

                    {grammarCheck.issues.length > 0 ? (
                      <div className="space-y-3">
                        {grammarCheck.issues.map((issue: any, index: number) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex items-start space-x-2">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                issue.type === 'grammar' ? 'bg-red-500' :
                                issue.type === 'spelling' ? 'bg-orange-500' : 'bg-blue-500'
                              }`}></div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 capitalize">
                                  {issue.type} Issue
                                </p>
                                <p className="text-sm text-gray-700">{issue.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Position: {issue.position}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 mt-8">
                        <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3" />
                        <p className="text-sm">No grammar issues found!</p>
                        <p className="text-xs text-gray-400 mt-1">Your document looks great</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 mt-8">
                    <CheckCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-sm">No grammar check available</p>
                    <p className="text-xs text-gray-400 mt-1">Use the Tools tab to check grammar</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const CommentsSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { comments, resolveComment } = useCollaboration();
  return isOpen ? (
    <aside className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-lg z-40 flex flex-col animate-slide-in-up" role="complementary" aria-label="Comments sidebar">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Comments</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close comments sidebar">×</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {comments.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 text-center mt-8">No comments yet.</div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 shadow border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-1">
                <span className="inline-block w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold" title={comment.author.name}>{comment.author.avatar}</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{comment.author.name}</span>
                <span className="text-xs text-gray-400 ml-auto">{new Date(comment.timestamp).toLocaleString()}</span>
              </div>
              <div className="text-gray-800 dark:text-gray-100 mb-2">{comment.text}</div>
              {!comment.resolved && (
                <button
                  className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                  onClick={() => resolveComment(comment.id)}
                  aria-label="Resolve comment"
                >
                  Resolve
                </button>
              )}
              {comment.resolved && <span className="text-xs text-green-600">Resolved</span>}
            </div>
          ))
        )}
      </div>
    </aside>
  ) : null;
};

export default AISidebar;
export { CommentsSidebar };
