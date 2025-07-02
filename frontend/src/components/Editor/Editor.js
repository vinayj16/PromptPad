import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, useTheme, Paper, Tooltip, IconButton } from '@mui/material';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon
} from 'lucide-react';
import { useDocument } from '../../context/DocumentContext';
import { debounce } from 'lodash';

const Editor = () => {
  const theme = useTheme();
  const { document, updateDocument } = useDocument();
  const [content, setContent] = useState(document?.content || '');
  const [isFocused, setIsFocused] = useState(false);
  const editorRef = useRef(null);
  const [selection, setSelection] = useState(null);
  const [isDictating, setIsDictating] = useState(false);
  const recognitionRef = useRef(null);

  // Update local content when document changes
  useEffect(() => {
    if (document?.content !== content) {
      setContent(document?.content || '');
    }
  }, [document?.content]);

  // Debounced update to prevent too many re-renders
  const debouncedUpdate = useCallback(
    debounce((newContent) => {
      if (newContent !== document.content) {
        updateDocument({ content: newContent });
      }
    }, 300),
    [updateDocument, document?.content]
  );

  // Handle content changes
  const handleChange = (e) => {
    const newContent = e.target.innerHTML;
    setContent(newContent);
    debouncedUpdate(newContent);
    saveSelection();
  };

  // Save current selection
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      setSelection(sel.getRangeAt(0).cloneRange());
    }
  };

  // Restore selection
  const restoreSelection = () => {
    if (selection) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(selection);
    }
  };

  // Format text
  const formatText = (command, value = null) => {
    saveSelection();
    document.execCommand(command, false, value);
    restoreSelection();
    editorRef.current?.focus();
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    // Handle tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '\t');
    }
    // Handle Enter key for lists
    else if (e.key === 'Enter' && !e.shiftKey) {
      const selection = window.getSelection();
      const node = selection.anchorNode;
      
      // Check if we're in a list item
      const listItem = node.nodeType === 3 
        ? node.parentNode.closest('li') 
        : node.closest('li');
      
      if (listItem) {
        e.preventDefault();
        if (e.ctrlKey || e.metaKey) {
          // Create new list item on Ctrl+Enter
          document.execCommand('insertHTML', false, '<li><br></li>');
        } else {
          // Exit list on regular Enter
          document.execCommand('outdent');
        }
      }
    }
  };

  // Handle paste events to clean up content
  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  // Grammar check handler (mock)
  const handleGrammarCheck = async () => {
    // Replace with real API call
    const response = await fetch('https://api.languagetool.org/v2/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        text: content,
        language: 'en-US',
      })
    });
    const data = await response.json();
    if (data.matches && data.matches.length > 0) {
      alert('Grammar issues found: ' + data.matches.map(m => m.message).join('\n'));
    } else {
      alert('No grammar issues found!');
    }
  };

  // Rewrite handler
  const handleRewrite = async (type) => {
    // Get selected text
    const sel = window.getSelection();
    const selectedText = sel && sel.toString();
    if (!selectedText) {
      alert('Please select text to rewrite.');
      return;
    }
    // Mock API call (replace with real endpoint)
    const response = await fetch('http://localhost:5000/ai/rewrite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: selectedText, type })
    });
    const data = await response.json();
    const suggestion = data.result || `AI suggestion for ${type}: ...`;
    if (window.confirm(`AI suggestion:\n\n${suggestion}\n\nReplace selected text?`)) {
      // Replace selected text
      document.execCommand('insertText', false, suggestion);
    }
  };

  // Summarize handler
  const handleSummarize = async () => {
    // Get selected text or all content
    const sel = window.getSelection();
    const selectedText = sel && sel.toString();
    const textToSummarize = selectedText || content;
    if (!textToSummarize.trim()) {
      alert('Nothing to summarize.');
      return;
    }
    // Mock API call (replace with real endpoint)
    const response = await fetch('http://localhost:5000/ai/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: textToSummarize })
    });
    const data = await response.json();
    const summary = data.result || 'AI summary: ...';
    if (window.confirm(`AI summary:\n\n${summary}\n\nInsert summary at cursor?`)) {
      document.execCommand('insertText', false, summary);
    }
  };

  // Tone detector handler
  const handleToneDetect = async () => {
    // Get selected text or all content
    const sel = window.getSelection();
    const selectedText = sel && sel.toString();
    const textToAnalyze = selectedText || content;
    if (!textToAnalyze.trim()) {
      alert('Nothing to analyze.');
      return;
    }
    // Mock API call (replace with real endpoint)
    const response = await fetch('http://localhost:5000/ai/tone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: textToAnalyze })
    });
    const data = await response.json();
    const tone = data.result || 'AI detected tone: ...';
    alert(`Detected tone:\n\n${tone}`);
  };

  // Translate handler
  const handleTranslate = async () => {
    // Get selected text or all content
    const sel = window.getSelection();
    const selectedText = sel && sel.toString();
    const textToTranslate = selectedText || content;
    if (!textToTranslate.trim()) {
      alert('Nothing to translate.');
      return;
    }
    const language = prompt('Enter target language (e.g., fr, es, de, hi, zh):', 'fr');
    if (!language) return;
    // Mock API call (replace with real endpoint)
    const response = await fetch('http://localhost:5000/ai/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: textToTranslate, language })
    });
    const data = await response.json();
    const translation = data.result || 'AI translation: ...';
    if (window.confirm(`AI translation (${language}):\n\n${translation}\n\nInsert translation at cursor?`)) {
      document.execCommand('insertText', false, translation);
    }
  };

  // Explain/Simplify handler
  const handleExplain = async () => {
    // Get selected text or all content
    const sel = window.getSelection();
    const selectedText = sel && sel.toString();
    const textToExplain = selectedText || content;
    if (!textToExplain.trim()) {
      alert('Nothing to explain or simplify.');
      return;
    }
    // Mock API call (replace with real endpoint)
    const response = await fetch('http://localhost:5000/ai/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: textToExplain })
    });
    const data = await response.json();
    const explanation = data.result || 'AI explanation/simplification: ...';
    if (window.confirm(`AI explanation/simplification:\n\n${explanation}\n\nInsert at cursor?`)) {
      document.execCommand('insertText', false, explanation);
    }
  };

  // Voice typing handler
  const handleVoiceTyping = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.execCommand('insertText', false, transcript);
        setIsDictating(false);
      };
      recognitionRef.current.onerror = () => setIsDictating(false);
      recognitionRef.current.onend = () => setIsDictating(false);
    }
    if (!isDictating) {
      recognitionRef.current.start();
      setIsDictating(true);
    } else {
      recognitionRef.current.stop();
      setIsDictating(false);
    }
  };

  // Ask AI (Q&A) handler
  const handleAskAI = async () => {
    // Get selected text
    const sel = window.getSelection();
    const selectedText = sel && sel.toString();
    if (!selectedText) {
      alert('Please select text to ask about.');
      return;
    }
    const question = prompt('What do you want to ask about the selected text?');
    if (!question) return;
    // Mock API call (replace with real endpoint)
    const response = await fetch('http://localhost:5000/ai/qa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: selectedText, question })
    });
    const data = await response.json();
    const answer = data.result || 'AI answer: ...';
    if (window.confirm(`AI answer:\n\n${answer}\n\nInsert at cursor?`)) {
      document.execCommand('insertText', false, answer);
    }
  };

  // Generate Title handler
  const handleGenerateTitle = async () => {
    const textToAnalyze = content;
    if (!textToAnalyze.trim()) {
      alert('Nothing to analyze for title.');
      return;
    }
    // Mock API call (replace with real endpoint)
    const response = await fetch('http://localhost:5000/ai/generate-title', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: textToAnalyze })
    });
    const data = await response.json();
    const title = data.result || 'AI generated title: ...';
    if (window.confirm(`AI generated title:\n\n${title}\n\nInsert at cursor?`)) {
      document.execCommand('insertText', false, title);
    }
  };

  // Generate Outline handler
  const handleGenerateOutline = async () => {
    const textToAnalyze = content;
    if (!textToAnalyze.trim()) {
      alert('Nothing to analyze for outline.');
      return;
    }
    // Mock API call (replace with real endpoint)
    const response = await fetch('http://localhost:5000/ai/generate-outline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: textToAnalyze })
    });
    const data = await response.json();
    const outline = data.result || 'AI generated outline: ...';
    if (window.confirm(`AI generated outline:\n\n${outline}\n\nInsert at cursor?`)) {
      document.execCommand('insertText', false, outline);
    }
  };

  // Smart Citation handler
  const handleSmartCitation = async () => {
    // Get selected text
    const sel = window.getSelection();
    const selectedText = sel && sel.toString();
    if (!selectedText) {
      alert('Please select a statement or paragraph to cite.');
      return;
    }
    // Mock API call (replace with real endpoint)
    const response = await fetch('http://localhost:5000/ai/citation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: selectedText })
    });
    const data = await response.json();
    const citation = data.result || 'AI citation: ...';
    if (window.confirm(`AI suggested citation:\n\n${citation}\n\nInsert at cursor?`)) {
      document.execCommand('insertText', false, citation);
    }
  };

  // Fact Check handler
  const handleFactCheck = async () => {
    // Get selected text
    const sel = window.getSelection();
    const selectedText = sel && sel.toString();
    if (!selectedText) {
      alert('Please select a statement or paragraph to fact check.');
      return;
    }
    // Mock API call (replace with real endpoint)
    const response = await fetch('http://localhost:5000/ai/fact-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: selectedText })
    });
    const data = await response.json();
    const factCheck = data.result || 'AI fact check: ...';
    if (window.confirm(`AI fact check result:\n\n${factCheck}\n\nInsert at cursor?`)) {
      document.execCommand('insertText', false, factCheck);
    }
  };

  // Research Assistant handler
  const handleResearchAssistant = async () => {
    const url = prompt('Enter a web link (URL) to summarize or extract key points:');
    if (!url) return;
    // Mock API call (replace with real endpoint)
    const response = await fetch('http://localhost:5000/ai/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const data = await response.json();
    const researchResult = data.result || 'AI summary/key points: ...';
    if (window.confirm(`AI research result:\n\n${researchResult}\n\nInsert at cursor?`)) {
      document.execCommand('insertText', false, researchResult);
    }
  };

  return (
    <Box 
      sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Editor Content */}
      <Box
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: content }}
        sx={{
          flex: 1,
          p: 3,
          outline: 'none',
          overflowY: 'auto',
          minHeight: '200px',
          bgcolor: theme.palette.background.paper,
          '&:focus': {
            boxShadow: `0 0 0 2px ${theme.palette.primary.main}33`,
          },
          '& *': {
            margin: 0,
            padding: 0,
          },
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            margin: '1em 0 0.5em',
            lineHeight: 1.2,
          },
          '& p': {
            margin: '0 0 1em',
            lineHeight: 1.6,
          },
          '& ul, & ol': {
            margin: '0 0 1em 2em',
            padding: 0,
          },
          '& table': {
            borderCollapse: 'collapse',
            width: '100%',
            margin: '0 0 1em',
            '& th, & td': {
              border: `1px solid ${theme.palette.divider}`,
              padding: '8px',
              textAlign: 'left',
            },
            '& th': {
              backgroundColor: theme.palette.action.hover,
            },
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
          },
        }}
      />
      
      {/* Status Bar */}
      <Box 
        sx={{ 
          p: 1, 
          borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: theme.palette.text.secondary,
          bgcolor: theme.palette.background.paper
        }}
      >
        <Box>
          {isFocused ? 'Ready' : ''}
        </Box>
        <Box>
          Words: {content.trim() ? content.trim().split(/\s+/).length : 0} | 
          Characters: {content.length}
        </Box>
      </Box>
    </Box>
  );
};

export default Editor;