import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box, Typography, Paper, IconButton, Tooltip, Select, MenuItem, FormControl, InputLabel, Slider, FormControlLabel, TextField, Button } from '@mui/material';
import { useDocument } from '../../context/DocumentContext';
import { useTheme } from '@mui/material/styles'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';


import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';  
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import FormatIndentDecreaseIcon from '@mui/icons-material/FormatIndentDecrease';


const MainContent = () => {
  const theme = useTheme();
  const { 
    content, 
    setContent, 
    setHtml, 
    setWordCount, 
    setCharCount,
    currentFormat,
    setCurrentFormat,
    alignment,  // Added this line    
    setAlignment,
    drawingMode,
    drawColor,
    drawWidth,
    setSelectedText,
    selectedText,
    formatting, 
    setFormatting,
    writingStats,
    setWritingStats
  } = useDocument();
  
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);
  const lastSavePointRef = useRef('');
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);
  const [drawingColor, setDrawingColor] = useState('#000000');
  const [drawingWidth, setDrawingWidth] = useState(2);
  const [isDrawingOnCanvas, setIsDrawingOnCanvas] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);

  // Formatting states
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [lineHeight, setLineHeight] = useState(1.5);
  const [textDirection, setTextDirection] = useState('ltr');

  // Document states
  const [documentTitle, setDocumentTitle] = useState('Untitled Document');
  const [savedDocuments, setSavedDocuments] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showOpenDialog, setShowOpenDialog] = useState(false);

  // --- Added constants for font, size, line height, ribbon tabs ---
  const fontOptions = ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Helvetica', 'Tahoma', 'Trebuchet MS'];
  const fontSizeOptions = [8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 48, 72];
  const lineHeightOptions = [1, 1.2, 1.5, 1.8, 2, 2.5, 3];
  const ribbonTabs = [
    'Home',
    'Insert',
    'Draw',
    'Design',
    'Layout',
    'References',
    'Mailings',
    'Review',
    'View',
    'Help',
  ];
  const [activeTab, setActiveTab] = useState('Home');

  // --- Find/Replace state ---
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Additional State for References ---
  const [footnotes, setFootnotes] = useState([]);
  const [citations, setCitations] = useState([]);
  const [margin, setMargin] = useState('normal');
  const [orientation, setOrientation] = useState('portrait');
  const [pageSize, setPageSize] = useState('A4');
  const [columns, setColumns] = useState(1);
  const [paraSpacing, setParaSpacing] = useState(1.5);
  const [indentLeft, setIndentLeft] = useState(0);
  const [indentRight, setIndentRight] = useState(0);

  // --- Mailings State ---
  const [recipients, setRecipients] = useState([]);
  const [mergePreviewIndex, setMergePreviewIndex] = useState(null);
  const [mergeFields, setMergeFields] = useState(['Name', 'Address']);

  // --- Review State ---
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [trackChanges, setTrackChanges] = useState(false);
  const [trackedEdits, setTrackedEdits] = useState([]);

  // --- View State ---
  const [docView, setDocView] = useState('print');
  const [zoom, setZoom] = useState(1);
  const [showRuler, setShowRuler] = useState(false);
  const [showGridlines, setShowGridlines] = useState(false);
  const [showNavPane, setShowNavPane] = useState(false);

  // --- Help State ---
  const [showHelp, setShowHelp] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showTraining, setShowTraining] = useState(false);

  // --- Export and Advanced Tools State ---
  const [exportOptions, setExportOptions] = useState({
    format: 'docx',
    includeMetadata: true,
    includeTOC: false,
    includeCitations: false
  });
  const [imageSuggestions, setImageSuggestions] = useState([]);
  const [tableOfContents, setTableOfContents] = useState([]);
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);

  // --- AI Sidebar State ---
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);

  // --- Collaboration State ---
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(false);
  const [collaborativeMode, setCollaborativeMode] = useState(false);
  const [realTimeSync, setRealTimeSync] = useState(false);
  const [inlineComments, setInlineComments] = useState([]);
  const [aiDiscussions, setAiDiscussions] = useState([]);
  const [documentVersions, setDocumentVersions] = useState([]);
  const [collaborators, setCollaborators] = useState([]);

  // --- Outline State ---
  const [showOutlineSidebar, setShowOutlineSidebar] = useState(false);
  const [documentOutline, setDocumentOutline] = useState([]);

  // --- Search State ---
  const [smartSearchQuery, setSmartSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // --- Focus Mode State ---
  const [focusMode, setFocusMode] = useState(false);

  // --- Preferences State ---
  const [showPreferences, setShowPreferences] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    theme: 'light',
    fontSize: 'medium',
    fontFamily: 'Arial',
    autoSave: true,
    spellCheck: true,
    grammarCheck: false
  });

  // --- Find/Replace State ---
  const [showFindReplace, setShowFindReplace] = useState(false);

  // --- Templates State ---
  const [vibrantTemplates] = useState([
    { name: 'Business Letter', icon: '📄', content: '<h1>Business Letter Template</h1><p>Dear [Recipient],</p><p>Content here...</p><p>Sincerely,<br/>[Your Name]</p>' },
    { name: 'Resume', icon: '📋', content: '<h1>Professional Resume</h1><h2>Experience</h2><p>Your experience here...</p>' },
    { name: 'Meeting Notes', icon: '📝', content: '<h1>Meeting Notes</h1><h2>Agenda</h2><ul><li>Item 1</li><li>Item 2</li></ul>' },
    { name: 'Project Proposal', icon: '📊', content: '<h1>Project Proposal</h1><h2>Executive Summary</h2><p>Project overview...</p>' }
  ]);

  // --- AI Configuration Constants ---
  const writingGoals = [
    { value: 'inform', label: 'Inform', icon: '📚' },
    { value: 'persuade', label: 'Persuade', icon: '💪' },
    { value: 'entertain', label: 'Entertain', icon: '🎭' },
    { value: 'educate', label: 'Educate', icon: '🎓' }
  ];

  const aiPersonas = [
    { value: 'professional', label: 'Professional', icon: '💼' },
    { value: 'creative', label: 'Creative', icon: '🎨' },
    { value: 'academic', label: 'Academic', icon: '📖' },
    { value: 'casual', label: 'Casual', icon: '😊' }
  ];

  const writingStyles = [
    { value: 'formal', label: 'Formal', icon: '🎩' },
    { value: 'casual', label: 'Casual', icon: '😊' },
    { value: 'technical', label: 'Technical', icon: '🔧' },
    { value: 'creative', label: 'Creative', icon: '🎨' }
  ];

  const targetAudiences = [
    { value: 'general', label: 'General', icon: '👥' },
    { value: 'professionals', label: 'Professionals', icon: '💼' },
    { value: 'students', label: 'Students', icon: '🎓' },
    { value: 'experts', label: 'Experts', icon: '🧠' }
  ];

  const documentTypes = [
    { value: 'article', label: 'Article', icon: '📄' },
    { value: 'report', label: 'Report', icon: '📊' },
    { value: 'email', label: 'Email', icon: '📧' },
    { value: 'story', label: 'Story', icon: '📖' }
  ];



  // --- Mailings Tab Handlers ---
  const startMailMerge = () => {
    alert('Mail merge started. You can now select recipients and insert merge fields.');
  };

  const selectRecipients = () => {
    const csv = prompt('Enter recipients as CSV (Name,Address per line):\nJohn Doe,123 Main St\nJane Smith,456 Oak Ave');
    if (csv) {
      const lines = csv.split('\n').filter(Boolean);
      const recs = lines.map(line => {
        const [Name, Address] = line.split(',');
        return { Name: Name?.trim(), Address: Address?.trim() };
      });
      setRecipients(recs);
      alert(`${recs.length} recipients loaded.`);
    }
  };

  const insertMergeField = () => {
    const field = prompt('Enter merge field name (e.g., Name, Address):', 'Name');
    if (field && editorRef.current) {
      document.execCommand('insertText', false, `{{${field}}}`);
      if (!mergeFields.includes(field)) setMergeFields([...mergeFields, field]);
      setHtml(editorRef.current.innerHTML);
    }
  };

  const previewResults = () => {
    if (!recipients.length) {
      alert('No recipients loaded.');
      return;
    }
    setMergePreviewIndex(0);
    if (editorRef.current) {
      let html = editorRef.current.innerHTML;
      mergeFields.forEach(f => {
        html = html.replaceAll(`{{${f}}}`, recipients[0][f] || '');
      });
      editorRef.current.innerHTML = html;
      setHtml(html);
    }
  };

  const finishAndMerge = () => {
    if (!recipients.length) {
      alert('No recipients loaded.');
      return;
    }
    let mergedDocs = recipients.map(rec => {
      let html = editorRef.current.innerHTML;
      mergeFields.forEach(f => {
        html = html.replaceAll(`{{${f}}}`, rec[f] || '');
      });
      return html;
    });
    alert(`Generated ${mergedDocs.length} merged documents. (Feature: show/download coming soon)`);
  };

  const insertEnvelope = () => {
    if (editorRef.current) {
      document.execCommand('insertHTML', false, `<div class='envelope' style='border:1px dashed #bbb;padding:12px;margin:12px 0;'>Envelope Placeholder</div>`);
      setHtml(editorRef.current.innerHTML);
    }
  };

  const insertLabel = () => {
    if (editorRef.current) {
      document.execCommand('insertHTML', false, `<div class='label' style='border:1px dotted #bbb;padding:6px 12px;display:inline-block;margin:4px;'>Label Placeholder</div>`);
      setHtml(editorRef.current.innerHTML);
    }
  };

  // --- Review Tab Handlers ---
  const spellCheck = () => {
    if (!editorRef.current) return;
    // Simple spell check: highlight words not in a small dictionary
    const dictionary = ['the','and','to','of','a','in','is','it','you','that','he','was','for','on','are','as','with','his','they','I','at','be','this','have','from','or','one','had','by','word','but','not','what','all','were','we','when','your','can','said','there','use','an','each','which','she','do','how','their','if'];
    let html = editorRef.current.innerHTML;
    html = html.replace(/<span class="misspelled">(.*?)<\/span>/g, '$1'); // Remove old highlights
    html = html.replace(/\b(\w+)\b/g, (match) => {
      if (!dictionary.includes(match.toLowerCase())) {
        return `<span class="misspelled" style="background:#fde68a;">${match}</span>`;
      }
      return match;
    });
    editorRef.current.innerHTML = html;
    setHtml(html);
  };

  const showWordCount = () => {
    alert(`Words: ${wordCount}\nCharacters: ${charCount}`);
  };

  const addComment = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      alert('Select some text to comment on.');
      return;
    }
    const commentText = prompt('Enter your comment:');
    if (commentText) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.className = 'commented-text';
      span.style.background = '#bae6fd';
      span.dataset.comment = commentText;
      range.surroundContents(span);
      setComments([...comments, { text: commentText, id: Date.now() }]);
      setHtml(editorRef.current.innerHTML);
    }
  };

  const handleShowComments = () => {
    setShowComments(!showComments);
  };

  const toggleTrackChanges = () => {
    setTrackChanges(!trackChanges);
  };

  const acceptChange = () => {
    // Remove highlight from first tracked edit
    if (!editorRef.current) return;
    let html = editorRef.current.innerHTML;
    html = html.replace(/<span class="tracked-insert">(.*?)<\/span>/, '$1');
    setHtml(html);
    editorRef.current.innerHTML = html;
  };

  const rejectChange = () => {
    // Remove first tracked insert
    if (!editorRef.current) return;
    let html = editorRef.current.innerHTML;
    html = html.replace(/<span class="tracked-insert">(.*?)<\/span>/, '');
    setHtml(html);
    editorRef.current.innerHTML = html;
  };

  const compareDocs = () => {
    alert('Compare feature coming soon!');
  };

  const restrictEditing = () => {
    alert('Restrict editing feature coming soon!');
  };

  // Track changes on input
  useEffect(() => {
    if (!trackChanges || !editorRef.current) return;
    const handler = (e) => {
      if (e.inputType === 'insertText') {
        document.execCommand('undo');
        document.execCommand('insertHTML', false, `<span class='tracked-insert' style='background:#fca5a5;'>${e.data}</span>`);
        setHtml(editorRef.current.innerHTML);
      }
    };
    editorRef.current.addEventListener('beforeinput', handler);
    return () => editorRef.current.removeEventListener('beforeinput', handler);
  }, [trackChanges]);

  // --- View Tab Handlers ---
  const setView = (view) => {
    setDocView(view);
  };

  const zoomIn = () => setZoom(z => Math.min(z + 0.1, 2));
  const zoomOut = () => setZoom(z => Math.max(z - 0.1, 0.5));
  const zoomReset = () => setZoom(1);
  const toggleRuler = () => setShowRuler(r => !r);
  const toggleGridlines = () => setShowGridlines(g => !g);
  const toggleNavPane = () => setShowNavPane(n => !n);
  const newWindow = () => alert('New Window feature coming soon!');
  const arrangeAll = () => alert('Arrange All feature coming soon!');
  const splitWindow = () => alert('Split feature coming soon!');

  // Apply view and zoom styles
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.style.transform = `scale(${zoom})`;
      editorRef.current.style.transformOrigin = 'top left';
      if (docView === 'print') {
        editorRef.current.style.background = '#fff';
        editorRef.current.style.boxShadow = '0 0 8px #bbb';
      } else if (docView === 'web') {
        editorRef.current.style.background = '#f8fafc';
        editorRef.current.style.boxShadow = 'none';
      } else if (docView === 'read') {
        editorRef.current.style.background = '#fef9c3';
        editorRef.current.style.boxShadow = 'none';
      }
    }
  }, [zoom, docView]);

  // --- Help Tab Handlers ---
  const openHelp = () => setShowHelp(true);
  const openSupport = () => setShowSupport(true);
  const openFeedback = () => setShowFeedback(true);
  const openTraining = () => setShowTraining(true);
  const closeAllHelp = () => {
    setShowHelp(false);
    setShowSupport(false);
    setShowFeedback(false);
    setShowTraining(false);
  };

  // --- Advanced Tools Handlers ---
  const generateAITOC = async () => {
    try {
      // Simulate AI-generated table of contents
      const toc = [
        { title: 'Introduction', level: 1 },
        { title: 'Getting Started', level: 1 },
        { title: 'Installation', level: 2 },
        { title: 'Configuration', level: 2 },
        { title: 'Advanced Features', level: 1 },
        { title: 'Conclusion', level: 1 }
      ];
      setTableOfContents(toc);
      alert('AI Table of Contents generated!');
    } catch (error) {
      console.error('Error generating TOC:', error);
      alert('Error generating table of contents');
    }
  };

  const generateSmartCitations = async () => {
    try {
      // Simulate AI-generated citations
      const newCitations = [
        { text: 'Smith, J. (2023). Modern Web Development', source: 'Tech Journal', type: 'Academic' },
        { text: 'Johnson, A. (2023). AI in Software', source: 'Computer Science Review', type: 'Journal' }
      ];
      setCitations(newCitations);
      alert('Smart citations generated!');
    } catch (error) {
      console.error('Error generating citations:', error);
      alert('Error generating citations');
    }
  };

  const generateImageSuggestions = async () => {
    try {
      // Simulate AI-generated image suggestions
      const suggestions = [
        { description: 'Professional team collaboration', keywords: ['team', 'collaboration', 'business'] },
        { description: 'Data visualization chart', keywords: ['data', 'chart', 'analytics'] },
        { description: 'Modern office workspace', keywords: ['office', 'workspace', 'modern'] }
      ];
      setImageSuggestions(suggestions);
      alert('Image suggestions generated!');
    } catch (error) {
      console.error('Error generating image suggestions:', error);
      alert('Error generating image suggestions');
    }
  };

  const formatCode = (code, language) => {
    if (editorRef.current) {
      const formattedCode = `<pre><code class="language-${language}">${code}</code></pre>`;
      document.execCommand('insertHTML', false, formattedCode);
      setHtml(editorRef.current.innerHTML);
    }
  };

  const exportWithOptions = (format) => {
    alert(`Exporting document as ${format.toUpperCase()} with selected options...`);
  };

  const autoPublish = (platform) => {
    alert(`Auto-publishing to ${platform}...`);
  };

  const saveToCloud = (provider) => {
    alert(`Saving to ${provider}...`);
  };

  // --- Collaboration Handlers ---
  const toggleCollaborativeMode = () => setCollaborativeMode(!collaborativeMode);
  const addInlineComment = (comment, text) => setInlineComments([...inlineComments, { id: Date.now(), text, comment, author: 'You', timestamp: new Date().toISOString() }]);
  const startAIDiscussion = (topic) => setAiDiscussions([...aiDiscussions, { id: Date.now(), topic, timestamp: new Date().toISOString(), messages: [] }]);
  const addDiscussionMessage = (discussionId, message) => {
    setAiDiscussions(prev => prev.map(discussion => {
      if (discussion.id === discussionId) {
        const newMessage = {
          id: Date.now(),
          author: 'You',
          content: message,
          timestamp: new Date().toISOString()
        };
        const aiResponse = {
          id: Date.now() + 1,
          author: 'AI Assistant',
          content: `Thank you for your input on "${message}". I'll analyze this and provide insights.`,
          timestamp: new Date().toISOString()
        };
        return {
          ...discussion,
          messages: [...discussion.messages, newMessage, aiResponse]
        };
      }
      return discussion;
    }));
  };
  const saveVersion = () => setDocumentVersions([...documentVersions, { id: Date.now(), content, timestamp: new Date().toISOString() }]);
  const compareVersions = (v1, v2) => alert('Compare not implemented');

  // --- Search Handlers ---
  const performSmartSearch = (query) => {
    if (!editorRef.current || !query.trim()) return;
    
    const text = editorRef.current.innerText;
    const results = [];
    
    // Simple search implementation
    const lines = text.split('\n');
    lines.forEach((line, index) => {
      if (line.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          title: `Line ${index + 1}`,
          snippet: line.substring(0, 100) + '...'
        });
      }
    });
    
    setSearchResults(results);
  };

  // --- Focus Mode Handler ---
  const toggleFocusMode = () => setFocusMode(f => !f);

  // --- Preferences Handlers ---
  const updatePreferences = (key, value) => setUserPreferences(prev => ({ ...prev, [key]: value }));
  const savePreferences = () => {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
      alert('Preferences saved successfully!');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      alert('Failed to save preferences');
    }
  };

  // --- Export Handler ---
  const exportAsText = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText;
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  };



  // --- Themes ---
  const themes = [
    { name: 'Default', font: 'Arial', color: '#000', background: '#fff' },
    { name: 'Dark', font: 'Arial', color: '#fff', background: '#222' },
    { name: 'Elegant', font: 'Georgia', color: '#333', background: '#f8f8f8' },
    { name: 'Ocean', font: 'Tahoma', color: '#0a2540', background: '#e0f7fa' },
  ];
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [globalFont, setGlobalFont] = useState('Arial');
  const [globalTextColor, setGlobalTextColor] = useState('#000');
  const [globalBgColor, setGlobalBgColor] = useState('#fff');

  // Apply theme changes to editor
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.style.fontFamily = globalFont;
      editorRef.current.style.color = globalTextColor;
      editorRef.current.style.background = globalBgColor;
    }
  }, [globalFont, globalTextColor, globalBgColor, content]);

  // Apply layout changes to editor
  useEffect(() => {
    if (editorRef.current) {
      // Margins
      let marginValue = '1in';
      if (margin === 'narrow') marginValue = '0.5in';
      if (margin === 'wide') marginValue = '2in';
      editorRef.current.style.padding = marginValue;
      
      // Orientation
      editorRef.current.style.width = orientation === 'portrait' ? '800px' : '1123px';
      editorRef.current.style.height = orientation === 'portrait' ? '1123px' : '800px';
      
      // Page size
      if (pageSize === 'A4') {
        editorRef.current.style.maxWidth = '8.27in';
        editorRef.current.style.maxHeight = '11.69in';
      } else if (pageSize === 'Letter') {
        editorRef.current.style.maxWidth = '8.5in';
        editorRef.current.style.maxHeight = '11in';
      }
      
      // Columns
      editorRef.current.style.columnCount = columns;
      
      // Paragraph spacing and indent
      editorRef.current.style.lineHeight = paraSpacing;
      editorRef.current.style.textIndent = indentLeft + 'cm';
      editorRef.current.style.marginRight = indentRight + 'cm';
    }
  }, [margin, orientation, pageSize, columns, paraSpacing, indentLeft, indentRight, content]);

  // --- References Tab Handlers ---
  const insertTOC = () => {
    if (editorRef.current) {
      const tocHTML = `<div class='toc' style='border:1px solid #bbb;padding:8px;margin-bottom:12px;'><b>Table of Contents</b><br/><i>(Headings will appear here)</i></div><br/>`;
      editorRef.current.innerHTML = tocHTML + editorRef.current.innerHTML;
      setHtml(editorRef.current.innerHTML);
    }
  };

  const insertFootnote = () => {
    if (editorRef.current) {
      const num = footnotes.length + 1;
      document.execCommand('insertHTML', false, `<sup>[${num}]</sup>`);
      setFootnotes([...footnotes, `Footnote ${num}: `]);
      setHtml(editorRef.current.innerHTML);
    }
  };

  const insertCitation = () => {
    const author = prompt('Enter author:');
    const title = prompt('Enter title:');
    const year = prompt('Enter year:');
    if (author && title && year && editorRef.current) {
      const citation = `${author} (${year}), <i>${title}</i>`;
      document.execCommand('insertHTML', false, `<span class='citation' style='color:#2563eb;'>[${citations.length + 1}]</span>`);
      setCitations([...citations, citation]);
      setHtml(editorRef.current.innerHTML);
    }
  };

  const insertBibliography = () => {
    if (editorRef.current && citations.length > 0) {
      const bibHTML = `<div class='bibliography' style='border-top:1px solid #bbb;margin-top:16px;padding-top:8px;'><b>Bibliography</b><ul>${citations.map(c => `<li>${c}</li>`).join('')}</ul></div>`;
      editorRef.current.innerHTML += bibHTML;
      setHtml(editorRef.current.innerHTML);
    }
  };

  const insertCaption = () => {
    if (editorRef.current) {
      document.execCommand('insertHTML', false, `<div class='caption' style='font-size:0.95em;color:#555;text-align:center;'>Figure/Table Caption</div>`);
      setHtml(editorRef.current.innerHTML);
    }
  };

  const insertCrossReference = () => {
    if (editorRef.current) {
      document.execCommand('insertHTML', false, `<span class='crossref' style='color:#f59e42;'>[Cross-reference]</span>`);
      setHtml(editorRef.current.innerHTML);
    }
  };

  // Update word and character counts
  const updateCounts = useCallback(() => {
    if (!editorRef.current) return { words: 0, chars: 0 };
    
    const text = editorRef.current.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    
    setWordCount(words);
    setCharCount(chars);
    
    return { words, chars };
  }, [setWordCount, setCharCount]);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content || '';
      updateCounts();
      lastSavePointRef.current = content || '';
    }
  }, [content, updateCounts]);

  // Handle input changes
  const handleInput = useCallback((e) => {
    if (!editorRef.current || isComposing) return;
    
    const html = editorRef.current.innerHTML;
    setHtml(html);
    updateCounts();
    
    // Save to history for undo/redo
    if (html !== historyRef.current[historyIndexRef.current]) {
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
      historyRef.current.push(html);
      historyIndexRef.current = historyRef.current.length - 1;
    }
  }, [isComposing, setHtml, updateCounts]);
  
  // Handle paste event to clean up pasted content
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    
    // Clean and insert text
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(text));
    selection.collapseToEnd();
    
    // Trigger input event
    const event = new Event('input', { bubbles: true });
    editorRef.current.dispatchEvent(event);
  }, []);
  
  // Handle key down events for shortcuts
  const handleKeyDown = useCallback((e) => {
    // Handle undo/redo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        // Redo
        if (historyIndexRef.current < historyRef.current.length - 1) {
          historyIndexRef.current++;
          const html = historyRef.current[historyIndexRef.current];
          editorRef.current.innerHTML = html;
          setHtml(html);
          updateCounts();
        }
      } else {
        // Undo
        if (historyIndexRef.current > 0) {
          historyIndexRef.current--;
          const html = historyRef.current[historyIndexRef.current];
          editorRef.current.innerHTML = html;
          setHtml(html);
          updateCounts();
        }
      }
      return;
    }
    
    // Handle tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '\t');
    }
    
    // Handle enter key for lists
    if (e.key === 'Enter' && !e.shiftKey) {
      const selection = window.getSelection();
      const node = selection.anchorNode;
      
      if (node && node.nodeType === Node.TEXT_NODE) {
        const parent = node.parentNode;
        if (parent.tagName === 'LI') {
          e.preventDefault();
          if (e.ctrlKey) {
            // Insert new list item
            document.execCommand('insertOrderedList');
          } else {
            // Continue list
            document.execCommand('insertOrderedList');
          }
        }
      }
    }
  }, [setHtml, updateCounts]);
  
  // Handle composition events for IME input
  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);
  
  const handleCompositionEnd = useCallback(() => {
    setIsComposing(false);
    // Trigger input event after IME composition ends
    const event = new Event('input', { bubbles: true });
    editorRef.current.dispatchEvent(event);
  }, []);
  
  // Handle focus/blur events
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);
  
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    // Save content when editor loses focus
    if (editorRef.current && lastSavePointRef.current !== editorRef.current.innerHTML) {
      const html = editorRef.current.innerHTML;
      setContent(html);
      lastSavePointRef.current = html;
    }
  }, [setContent]);
  
  // Apply current format to selection
  useEffect(() => {
    if (!editorRef.current) return;
    
    // Handle text alignment
    if (alignment) {
      document.execCommand('justify' + alignment.charAt(0).toUpperCase() + alignment.slice(1));
    }
    
    // Handle text formatting
    if (currentFormat) {
      Object.entries(currentFormat).forEach(([command, value]) => {
        if (value) {
          document.execCommand(command, false, value === true ? null : value);
        }
      });
    }
  }, [alignment, currentFormat]);
  
  // Handle click events to update current format
  const handleClick = useCallback(() => {
    if (!editorRef.current) return;
    
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    if (range.collapsed) return;
    
    // Get current format
    const format = {};
    
    // Check bold, italic, underline, etc.
    format.bold = document.queryCommandState('bold');
    format.italic = document.queryCommandState('italic');
    format.underline = document.queryCommandState('underline');
    format.strikeThrough = document.queryCommandState('strikeThrough');
    format.subscript = document.queryCommandState('subscript');
    format.superscript = document.queryCommandState('superscript');
    
    // Check alignment
    const parent = range.startContainer.parentElement;
    if (parent) {
      const textAlign = window.getComputedStyle(parent).textAlign;
      if (textAlign) {
        switch (textAlign) {
          case 'left': setAlignment('left'); break;
          case 'center': setAlignment('center'); break;
          case 'right': setAlignment('right'); break;
          case 'justify': setAlignment('justify'); break;
          default: break;
        }
      }
    }
    
    setCurrentFormat(format);
  }, [setAlignment, setCurrentFormat]);
  
  // Auto-save every 5 seconds if there are changes
  useEffect(() => {
    const interval = setInterval(() => {
      if (editorRef.current && lastSavePointRef.current !== editorRef.current.innerHTML) {
        const html = editorRef.current.innerHTML;
        setContent(html);
        lastSavePointRef.current = html;
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [setContent]);
  
  // Drawing logic
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [drawingMode]);

  const handleCanvasPointerDown = (e) => {
    if (!drawingMode) return;
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    setLastPoint({ x, y });
  };
  const handleCanvasPointerMove = (e) => {
    if (!isDrawing || !drawingMode) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    if (lastPoint) {
      ctx.globalAlpha = drawingMode === 'highlighter' ? 0.3 : 1.0;
      ctx.strokeStyle = drawingMode === 'eraser' ? '#fff' : drawColor;
      ctx.lineWidth = drawWidth;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      setLastPoint({ x, y });
    }
  };
  const handleCanvasPointerUp = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };
  // Resize canvas to match editor
  useEffect(() => {
    if (!canvasRef.current || !editorRef.current) return;
    const canvas = canvasRef.current;
    const editor = editorRef.current;
    canvas.width = editor.offsetWidth;
    canvas.height = editor.offsetHeight;
  }, [drawingMode, content]);
  
  // Get word and character counts for the status bar
  const { words: wordCount, chars: charCount } = updateCounts();

  // Track selected text and update context
  const updateSelectedText = useCallback(() => {
    if (!editorRef.current) return;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current.contains(selection.anchorNode)) {
      setSelectedText(selection.toString());
    } else {
      setSelectedText('');
    }
  }, [setSelectedText]);

  useEffect(() => {
    document.addEventListener('selectionchange', updateSelectedText);
    if (editorRef.current) {
      editorRef.current.addEventListener('mouseup', updateSelectedText);
      editorRef.current.addEventListener('keyup', updateSelectedText);
    }
    return () => {
      document.removeEventListener('selectionchange', updateSelectedText);
      if (editorRef.current) {
        editorRef.current.removeEventListener('mouseup', updateSelectedText);
        editorRef.current.removeEventListener('keyup', updateSelectedText);
      }
    };
  }, [updateSelectedText]);

  // Calculate word and character count
  useEffect(() => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || '';
      setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
      setCharCount(text.length);
    }
  }, [content, setWordCount, setCharCount]);

  // Initialize features on component mount
  useEffect(() => {
    // Load user preferences
    loadPreferences();

    // Load auto-saved content if available
    const hasAutoSaved = loadAutoSavedContent();
    if (hasAutoSaved) {
      console.log('Auto-saved content loaded');
    }

    // Set up text selection listener
    const handleSelection = () => {
      handleTextSelection();
    };

    document.addEventListener('selectionchange', handleSelection);

    // Set up auto-save interval
    const autoSaveInterval = setInterval(() => {
      if (editorRef.current) {
        autoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    // Set up writing stats tracking
    const statsInterval = setInterval(() => {
      if (editorRef.current) {
        trackWritingStats();
      }
    }, 60000); // Update stats every minute

    return () => {
      document.removeEventListener('selectionchange', handleSelection);
      clearInterval(autoSaveInterval);
      clearInterval(statsInterval);
    };
  }, []);

  // Generate outline when document changes
  useEffect(() => {
    generateOutline();
  }, [content]);

  // Handle text formatting
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setHtml(editorRef.current.innerHTML);
    }
  };

  // Helper functions
  const loadPreferences = () => {
    // Load user preferences from localStorage
    try {
      const prefs = localStorage.getItem('wordProcessorPreferences');
      if (prefs) {
        const parsed = JSON.parse(prefs);
        // Apply preferences to editor
        console.log('Preferences loaded:', parsed);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };

  const loadAutoSavedContent = () => {
    // Load auto-saved content from localStorage
    try {
      const autoSaved = localStorage.getItem('wordProcessorAutoSave');
      if (autoSaved) {
        const parsed = JSON.parse(autoSaved);
        if (parsed.content && parsed.timestamp) {
          const age = Date.now() - parsed.timestamp;
          if (age < 24 * 60 * 60 * 1000) { // Less than 24 hours old
            setContent(parsed.content);
            return true;
          }
        }
      }
    } catch (error) {
      console.error('Failed to load auto-saved content:', error);
    }
    return false;
  };

  const handleTextSelection = () => {
    // Handle text selection for AI features
    updateSelectedText();
  };

  const autoSave = () => {
    // Auto-save content to localStorage
    try {
      if (editorRef.current) {
        const autoSaveData = {
          content: editorRef.current.innerHTML,
          timestamp: Date.now()
        };
        localStorage.setItem('wordProcessorAutoSave', JSON.stringify(autoSaveData));
      }
    } catch (error) {
      console.error('Failed to auto-save:', error);
    }
  };

  const trackWritingStats = () => {
    // Track writing statistics
    if (editorRef.current) {
      const text = editorRef.current.innerText || '';
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      const chars = text.length;
      
      // Store stats for analytics
      const stats = {
        words,
        chars,
        timestamp: Date.now()
      };
      
      try {
        const existingStats = JSON.parse(localStorage.getItem('wordProcessorStats') || '[]');
        existingStats.push(stats);
        // Keep only last 100 entries
        if (existingStats.length > 100) {
          existingStats.splice(0, existingStats.length - 100);
        }
        localStorage.setItem('wordProcessorStats', JSON.stringify(existingStats));
      } catch (error) {
        console.error('Failed to save writing stats:', error);
      }
    }
  };

  const generateOutline = () => {
    // Generate document outline from headings
    if (editorRef.current) {
      const headings = editorRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const outline = Array.from(headings).map((el, idx) => ({
        text: el.textContent || '',
        level: parseInt(el.tagName[1], 10),
        id: el.id || `heading-${idx}`
      }));
      
      // Update outline in context if needed
      console.log('Outline generated:', outline);
    }
  };

  // Auto-save functionality
  useEffect(() => {
    const autoSave = () => {
      if (content) {
        localStorage.setItem('autosave-content', content);
        localStorage.setItem('autosave-timestamp', Date.now().toString());
      }
    };

    const interval = setInterval(autoSave, 30000); // Auto-save every 30 seconds
    return () => clearInterval(interval);
  }, [content]);

  // Load user preferences
  useEffect(() => {
    const savedContent = localStorage.getItem('autosave-content');
    const savedPreferences = localStorage.getItem('user-preferences');
    const savedDocs = localStorage.getItem('saved-documents');
    
    if (savedContent) {
      setContent(savedContent);
    }
    
    if (savedPreferences) {
      try {
        const prefs = JSON.parse(savedPreferences);
        setFormatting(prev => ({ ...prev, ...prefs }));
      } catch (e) {
        console.error('Error loading preferences:', e);
      }
    }

    if (savedDocs) {
      try {
        setSavedDocuments(JSON.parse(savedDocs));
      } catch (e) {
        console.error('Error loading saved documents:', e);
      }
    }
  }, []);

  // Track writing stats
  useEffect(() => {
    if (content) {
      const words = content.trim().split(/\s+/).filter(word => word.length > 0).length;
      const characters = content.length;
      const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0).length;
      
      setWritingStats({
        words,
        characters,
        paragraphs,
        lastUpdated: new Date().toISOString()
      });
    }
  }, [content, setWritingStats]);

  const handleTextChange = (e) => {
    const newContent = e.target.innerHTML;
    setContent(newContent);
    
    // Track selection
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setSelectedText(selection.toString());
    } else {
      setSelectedText('');
    }
  };

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setSelectedText(selection.toString());
    } else {
      setSelectedText('');
    }
  };

  const handleFormatting = (type) => {
    switch(type) {
      case 'bold':
        setIsBold(!isBold);
        execCommand('bold');
        break;
      case 'italic':
        setIsItalic(!isItalic);
        execCommand('italic');
        break;
      case 'underline':
        setIsUnderline(!isUnderline);
        execCommand('underline');
        break;
      case 'superscript':
        setIsSuperscript(!isSuperscript);
        execCommand('superscript');
        break;
      case 'subscript':
        setIsSubscript(!isSubscript);
        execCommand('subscript');
        break;
      case 'fontSize':
        execCommand('fontSize', fontSize);
        break;
      case 'fontName':
        execCommand('fontName', fontFamily);
        break;
      case 'foreColor':
        execCommand('foreColor', textColor);
        break;
      case 'hiliteColor':
        execCommand('hiliteColor', backgroundColor);
        break;
      case 'justifyLeft':
      case 'justifyCenter':
      case 'justifyRight':
      case 'justifyFull':
        setAlignment(type.replace('justify', '').toLowerCase());
        execCommand(type);
        break;
      case 'indent':
        execCommand('indent');
        break;
      case 'outdent':
        execCommand('outdent');
        break;
      case 'lineHeight':
        execCommand('lineHeight', lineHeight);
        break;
      case 'ltr':
        setTextDirection('ltr');
        execCommand('ltr');
        break;
      case 'rtl':
        setTextDirection('rtl');
        execCommand('rtl');
        break;
      default:
        execCommand(type);
    }
  };

  // Document operations
  const saveDocument = () => {
    if (editorRef.current) {
      const newDoc = {
        id: Date.now(),
        title: documentTitle,
        content: editorRef.current.innerHTML,
        timestamp: new Date().toISOString(),
        stats: writingStats
      };
      const updatedDocs = [...savedDocuments, newDoc];
      setSavedDocuments(updatedDocs);
      setShowSaveDialog(false);
      try {
        localStorage.setItem(`document_${newDoc.id}`, JSON.stringify(newDoc));
        localStorage.setItem('saved-documents', JSON.stringify(updatedDocs));
        alert("Document Saved Successfully!");
      } catch (error) {
        console.error('Save error:', error);
        alert("Failed to save document to local storage.");
      }
    }
  };

  const openDocument = (doc) => {
    setDocumentTitle(doc.title);
    if (editorRef.current) {
      editorRef.current.innerHTML = doc.content;
      setContent(doc.content);
    }
    setShowOpenDialog(false);
  };

  const createNewDocument = () => {
    setDocumentTitle('Untitled Document');
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
      setContent('');
    }
    // Reset all formatting states
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
    setIsSuperscript(false);
    setIsSubscript(false);
    setFontSize(16);
    setFontFamily('Arial');
    setTextColor('#000000');
    setBackgroundColor('transparent');
    setAlignment('left');
    setLineHeight(1.5);
    setTextDirection('ltr');
  };

  // Drawing functionality
  const startDrawing = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawingOnCanvas(true);
    setLastX(x);
    setLastY(y);
  };

  const draw = (e) => {
    if (!isDrawingOnCanvas || !isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = drawingColor;
    ctx.lineWidth = drawingWidth;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    setLastX(x);
    setLastY(y);
  };

  const stopDrawing = () => {
    setIsDrawingOnCanvas(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const toggleDrawing = () => {
    setIsDrawing(!isDrawing);
  };

  // --- Find Text Handler ---
  const handleFindText = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText;
      const re = new RegExp(findText, 'gi');
      const result = text.match(re);
      if (result) {
        alert(`Found ${result.length} matches.`);
      } else {
        alert('No matches found.');
      }
    }
  };
  // --- Replace Text Handler ---
  const handleReplaceText = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerHTML;
      const re = new RegExp(findText, 'gi');
      const newText = text.replace(re, replaceText);
      editorRef.current.innerHTML = newText;
      setHtml(newText);
    }
  };
  // --- AI Text Generation Handler ---
  const generateText = async () => {
    if (!prompt.trim()) {
      alert("Enter a prompt first!");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate content');
      }
      const data = await response.json();
      const generatedText = data.text || 'No response from AI';
      if (editorRef.current) {
        editorRef.current.innerHTML += `<p>${generatedText}</p>`;
        setHtml(editorRef.current.innerHTML);
      }
      setLoading(false);
    } catch (error) {
      alert("Failed to generate content.");
      setLoading(false);
    }
  };
  // --- Insert Table Handler ---
  const insertTable = () => {
    if (editorRef.current) {
      const tableHTML = `<table border='1' style='border-collapse:collapse;'><tbody>${'<tr>' + '<td>&nbsp;</td>'.repeat(3) + '</tr>'.repeat(3)}</tbody></table><br/>`;
      document.execCommand('insertHTML', false, tableHTML);
      setHtml(editorRef.current.innerHTML);
    }
  };
  // --- Insert Image Handler ---
  const insertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (editorRef.current) {
            const imgHTML = `<img src='${event.target.result}' alt='' style='max-width:300px;cursor:pointer;'/><br/>`;
            document.execCommand('insertHTML', false, imgHTML);
            setHtml(editorRef.current.innerHTML);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };
  // --- Insert Shape Handler ---
  const insertShape = () => {
    if (editorRef.current) {
      const svgHTML = `<svg width='80' height='40' style='vertical-align:middle;'><rect width='80' height='40' fill='#4f8ef7' stroke='#333' stroke-width='2'/></svg>&nbsp;`;
      document.execCommand('insertHTML', false, svgHTML);
      setHtml(editorRef.current.innerHTML);
    }
  };

  // --- AI Sidebar Handlers ---
  const [aiImage, setAiImage] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResult, setAiResult] = useState('');
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setAiImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };
  const handleAIFeature = async (type) => {
    // Placeholder: send aiPrompt (and aiImage if needed) to backend for the selected AI action
    setAiResult(`AI (${type}) result for: "${aiPrompt}"`);
  };

  // --- Templates Handlers ---
  const [showTemplates, setShowTemplates] = useState(false);
  const loadTemplate = (template) => {
    if (editorRef.current) {
      editorRef.current.innerHTML = template.content;
      setHtml(template.content);
      setShowTemplates(false);
    }
  };

  // --- Vibrant Color Palettes for Design Tab ---
  const vibrantThemes = [
    { name: 'Vibrant Blue', font: 'Arial', color: '#fff', background: '#2563eb' },
    { name: 'Sunset', font: 'Georgia', color: '#fff', background: 'linear-gradient(90deg,#f59e42,#f43f5e)' },
    { name: 'Mint', font: 'Tahoma', color: '#222', background: '#22c55e' },
    { name: 'Night', font: 'Verdana', color: '#fff', background: '#0f172a' },
  ];

  // --- Quick Actions, Recent Sidebar, Pinning ---
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showRecentSidebar, setShowRecentSidebar] = useState(false);
  const [pinnedDocs, setPinnedDocs] = useState([]);
  const togglePinDoc = (docId) => {
    setPinnedDocs(pins => pins.includes(docId) ? pins.filter(id => id !== docId) : [...pins, docId]);
  };

  // --- Advanced AI Analysis ---
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [writingScore, setWritingScore] = useState(null);
  const [seoScore, setSeoScore] = useState(null);
  const [readabilityScore, setReadabilityScore] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [writingGoal, setWritingGoal] = useState('');
  const [aiPersona, setAiPersona] = useState('');
  const [writingStyle, setWritingStyle] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [documentType, setDocumentType] = useState('');
  const analyzeDocument = async () => {
    if (!editorRef.current) return;
    setIsAnalyzing(true);
    const text = editorRef.current.innerText;
    try {
      const response = await fetch('http://localhost:3000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, writingGoal, aiPersona, writingStyle, targetAudience, documentType })
      });
      if (response.ok) {
        const data = await response.json();
        setWritingScore(data.writingScore);
        setSeoScore(data.seoScore);
        setReadabilityScore(data.readabilityScore);
        setAiSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- Style Transfer ---
  const transferStyle = async (targetStyle) => {
    if (!editorRef.current) return;
    const selectedText = window.getSelection().toString();
    const text = selectedText || editorRef.current.innerText;
    try {
      const response = await fetch('http://localhost:3000/style-transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetStyle, currentStyle: writingStyle })
      });
      if (response.ok) {
        const data = await response.json();
        if (selectedText) {
          document.execCommand('insertText', false, data.result);
        } else {
          setHtml(data.result);
        }
      }
    } catch (error) {
      console.error('Style transfer failed:', error);
    }
  };

  // --- Context-aware Rewriting ---
  const rewriteWithContext = async (context) => {
    if (!editorRef.current) return;
    const selectedText = window.getSelection().toString();
    const text = selectedText || editorRef.current.innerText;
    try {
      const response = await fetch('http://localhost:3000/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, context, writingGoal, aiPersona, targetAudience })
      });
      if (response.ok) {
        const data = await response.json();
        if (selectedText) {
          document.execCommand('insertText', false, data.result);
        } else {
          setHtml(data.result);
        }
      }
    } catch (error) {
      console.error('Rewrite failed:', error);
    }
  };

  // --- Enhanced AI Feature Handler ---
  const handleAdvancedAIFeature = async (type, params = {}) => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText;
    try {
      const response = await fetch(`http://localhost:3000/ai/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, writingGoal, aiPersona, writingStyle, targetAudience, documentType, ...params })
      });
      if (response.ok) {
        const data = await response.json();
        setAiResult(data.result);
        return data.result;
      }
    } catch (error) {
      console.error(`${type} failed:`, error);
      setAiResult(`Error: ${error.message}`);
    }
  };

  // --- Image Selection and Toolbar State ---
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageToolbarPos, setImageToolbarPos] = useState({ top: 0, left: 0 });
  const [showImageToolbar, setShowImageToolbar] = useState(false);
  const [altText, setAltText] = useState('');
  // --- Shape Picker State ---
  const [showShapePicker, setShowShapePicker] = useState(false);
  const [shapeType, setShapeType] = useState('rectangle');
  const [shapeColor, setShapeColor] = useState('#4f8ef7');
  const [shapeWidth, setShapeWidth] = useState(80);
  const [shapeHeight, setShapeHeight] = useState(40);
  // --- Chart Picker State ---
  const [showChartPicker, setShowChartPicker] = useState(false);
  const [chartType, setChartType] = useState('bar');
  const [chartData, setChartData] = useState('A,10\nB,20\nC,15');
  // --- Table Picker State (if not already present) ---
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [hoverRows, setHoverRows] = useState(0);
  const [hoverCols, setHoverCols] = useState(0);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  // --- Image Click Handler ---
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const handleClick = (e) => {
      if (e.target.tagName === 'IMG') {
        setSelectedImage(e.target);
        setAltText(e.target.alt || '');
        const rect = e.target.getBoundingClientRect();
        setImageToolbarPos({ top: rect.top + window.scrollY - 40, left: rect.left + window.scrollX });
        setShowImageToolbar(true);
      } else {
        setSelectedImage(null);
        setShowImageToolbar(false);
      }
    };
    editor.addEventListener('click', handleClick);
    return () => editor.removeEventListener('click', handleClick);
  }, [editorRef]);

  // --- Image Resizing Logic ---
  useEffect(() => {
    if (!selectedImage) return;
    let startX, startWidth;
    const handleMouseDown = (e) => {
      e.preventDefault();
      startX = e.clientX;
      startWidth = selectedImage.width;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
    const handleMouseMove = (e) => {
      const newWidth = Math.max(40, startWidth + (e.clientX - startX));
      selectedImage.style.width = newWidth + 'px';
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      setHtml(editorRef.current.innerHTML);
    };
    const handleResizeHandle = document.getElementById('resize-handle');
    if (handleResizeHandle) {
      handleResizeHandle.addEventListener('mousedown', handleMouseDown);
    }
    return () => {
      if (handleResizeHandle) {
        handleResizeHandle.removeEventListener('mousedown', handleMouseDown);
      }
    };
  }, [selectedImage]);

  // --- Image Toolbar Actions ---
  const handleAlignImage = (align) => {
    if (selectedImage) {
      selectedImage.style.display = 'block';
      selectedImage.style.margin = align === 'center' ? '0 auto' : align === 'left' ? '0 0 0 0' : '0 0 0 auto';
      setHtml(editorRef.current.innerHTML);
    }
  };
  const handleAltTextChange = (e) => {
    setAltText(e.target.value);
    if (selectedImage) {
      selectedImage.alt = e.target.value;
      setHtml(editorRef.current.innerHTML);
    }
  };

  // --- Shape Picker Handlers ---
  const handleShapePickerClick = () => {
    setShowShapePicker(true);
  };
  const handleInsertShape = () => {
    if (editorRef.current) {
      let svgHTML = '';
      if (shapeType === 'rectangle') {
        svgHTML = `<svg width='${shapeWidth}' height='${shapeHeight}' style='vertical-align:middle;'><rect width='${shapeWidth}' height='${shapeHeight}' fill='${shapeColor}' stroke='#333' stroke-width='2'/></svg>&nbsp;`;
      } else if (shapeType === 'circle') {
        const r = Math.min(shapeWidth, shapeHeight) / 2;
        svgHTML = `<svg width='${shapeWidth}' height='${shapeHeight}' style='vertical-align:middle;'><circle cx='${shapeWidth/2}' cy='${shapeHeight/2}' r='${r}' fill='${shapeColor}' stroke='#333' stroke-width='2'/></svg>&nbsp;`;
      } else if (shapeType === 'arrow') {
        svgHTML = `<svg width='${shapeWidth}' height='${shapeHeight}' style='vertical-align:middle;'><line x1='5' y1='${shapeHeight/2}' x2='${shapeWidth-15}' y2='${shapeHeight/2}' stroke='${shapeColor}' stroke-width='6' marker-end='url(#arrowhead)'/><defs><marker id='arrowhead' markerWidth='10' markerHeight='7' refX='10' refY='3.5' orient='auto'><polygon points='0 0, 10 3.5, 0 7' fill='${shapeColor}'/></marker></defs></svg>&nbsp;`;
      } else if (shapeType === 'triangle') {
        svgHTML = `<svg width='${shapeWidth}' height='${shapeHeight}' style='vertical-align:middle;'><polygon points='${shapeWidth/2},0 ${shapeWidth},${shapeHeight} 0,${shapeHeight}' fill='${shapeColor}' stroke='#333' stroke-width='2'/></svg>&nbsp;`;
      }
      document.execCommand('insertHTML', false, svgHTML);
      setHtml(editorRef.current.innerHTML);
      setShowShapePicker(false);
    }
  };

  // --- Chart Picker Handlers ---
  const handleChartPickerClick = () => {
    setShowChartPicker(true);
  };
  const handleInsertChart = () => {
    if (editorRef.current) {
      // Parse CSV data
      const rows = chartData.split('\n').map(line => line.split(','));
      let svgHTML = '';
      if (chartType === 'bar') {
        // Simple bar chart SVG
        const maxVal = Math.max(...rows.map(r => Number(r[1])));
        const barW = 40, barGap = 20, height = 120, width = rows.length * (barW + barGap);
        svgHTML = `<svg width='${width}' height='${height + 30}' style='vertical-align:middle;'>` +
          rows.map((r, i) => {
            const h = (Number(r[1]) / maxVal) * height;
            return `<rect x='${i * (barW + barGap)}' y='${height - h}' width='${barW}' height='${h}' fill='#2563eb'/><text x='${i * (barW + barGap) + barW/2}' y='${height + 15}' text-anchor='middle' font-size='12'>${r[0]}</text>`;
          }).join('') +
          `</svg>&nbsp;`;
      } else if (chartType === 'line') {
        // Simple line chart SVG
        const maxVal = Math.max(...rows.map(r => Number(r[1])));
        const height = 120, width = (rows.length - 1) * 60 + 40;
        const points = rows.map((r, i) => `${i * 60},${height - (Number(r[1]) / maxVal) * height}`).join(' ');
        svgHTML = `<svg width='${width}' height='${height + 30}' style='vertical-align:middle;'><polyline points='${points}' fill='none' stroke='#2563eb' stroke-width='3'/>` +
          rows.map((r, i) => `<circle cx='${i * 60}' cy='${height - (Number(r[1]) / maxVal) * height}' r='4' fill='#2563eb'/><text x='${i * 60}' y='${height + 15}' text-anchor='middle' font-size='12'>${r[0]}</text>`).join('') +
          `</svg>&nbsp;`;
      } else if (chartType === 'pie') {
        // Simple pie chart SVG
        const total = rows.reduce((sum, r) => sum + Number(r[1]), 0);
        let angle = 0;
        const cx = 60, cy = 60, r = 50;
        svgHTML = `<svg width='140' height='140' style='vertical-align:middle;'>` +
          rows.map((r, i) => {
            const val = Number(r[1]);
            const a0 = angle;
            const a1 = angle + (val / total) * 2 * Math.PI;
            const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
            const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
            const largeArc = a1 - a0 > Math.PI ? 1 : 0;
            const path = `M${cx},${cy} L${x0},${y0} A${r},${r} 0 ${largeArc},1 ${x1},${y1} Z`;
            angle = a1;
            const color = ['#2563eb','#f59e42','#22c55e','#e11d48','#a21caf'][i%5];
            return `<path d='${path}' fill='${color}'/><text x='${cx + (r+15)*Math.cos((a0+a1)/2)}' y='${cy + (r+15)*Math.sin((a0+a1)/2)}' font-size='12' text-anchor='middle'>${r[0]}</text>`;
          }).join('') +
          `</svg>&nbsp;`;
      }
      document.execCommand('insertHTML', false, svgHTML);
      setHtml(editorRef.current.innerHTML);
      setShowChartPicker(false);
    }
  };

  // After destructuring writingStats from useDocument():
  const safeWritingStats = writingStats || { words: 0, characters: 0, paragraphs: 0 };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      position: 'relative'
    }}>
      {/* Toolbar */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 1, 
          mb: 2, 
          border: '1px solid #e5e7eb',
          borderRadius: 2,
          background: '#fff'
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Document Actions */}
          <Box sx={{ display: 'flex', gap: 0.5, borderRight: 1, borderColor: 'divider', pr: 1 }}>
            <Tooltip title="New Document (Ctrl+N)">
              <IconButton size="small" onClick={createNewDocument}>
                <span style={{ fontSize: '1.2rem' }}>📄</span>
              </IconButton>
            </Tooltip>
            <Tooltip title="Save (Ctrl+S)">
              <IconButton size="small" onClick={saveDocument}>
                <SaveIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Print">
              <IconButton size="small" onClick={() => window.print()}>
                <PrintIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Text Formatting */}
          <Box sx={{ display: 'flex', gap: 0.5, borderRight: 1, borderColor: 'divider', pr: 1 }}>
            <Tooltip title="Bold (Ctrl+B)">
              <IconButton 
                size="small" 
                onClick={() => handleFormatting('bold')}
                sx={{ bgcolor: isBold ? 'primary.main' : 'transparent', color: isBold ? 'white' : 'inherit' }}
              >
                <FormatBoldIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Italic (Ctrl+I)">
              <IconButton 
                size="small" 
                onClick={() => handleFormatting('italic')}
                sx={{ bgcolor: isItalic ? 'primary.main' : 'transparent', color: isItalic ? 'white' : 'inherit' }}
              >
                <FormatItalicIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Underline (Ctrl+U)">
              <IconButton 
                size="small" 
                onClick={() => handleFormatting('underline')}
                sx={{ bgcolor: isUnderline ? 'primary.main' : 'transparent', color: isUnderline ? 'white' : 'inherit' }}
              >
                <FormatUnderlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Strikethrough">
              <IconButton size="small" onClick={() => handleFormatting('strikethrough')}>
                <FormatStrikethroughIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Superscript">
              <IconButton 
                size="small" 
                onClick={() => handleFormatting('superscript')}
                sx={{ bgcolor: isSuperscript ? 'primary.main' : 'transparent', color: isSuperscript ? 'white' : 'inherit' }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>x²</span>
              </IconButton>
            </Tooltip>
            <Tooltip title="Subscript">
              <IconButton 
                size="small" 
                onClick={() => handleFormatting('subscript')}
                sx={{ bgcolor: isSubscript ? 'primary.main' : 'transparent', color: isSubscript ? 'white' : 'inherit' }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>x₂</span>
              </IconButton>
            </Tooltip>
          </Box>

          {/* Font Controls */}
          <Box sx={{ display: 'flex', gap: 0.5, borderRight: 1, borderColor: 'divider', pr: 1, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={fontFamily}
                onChange={(e) => {
                  setFontFamily(e.target.value);
                  handleFormatting('fontName');
                }}
                displayEmpty
              >
                {fontOptions.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value={fontSize}
                onChange={(e) => {
                  setFontSize(e.target.value);
                  handleFormatting('fontSize');
                }}
              >
                {fontSizeOptions.map(size => (
                  <MenuItem key={size} value={size}>{size}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Tooltip title="Text Color">
              <IconButton size="small">
                <FormatColorTextIcon />
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => {
                    setTextColor(e.target.value);
                    handleFormatting('foreColor');
                  }}
                  style={{ 
                    position: 'absolute', 
                    opacity: 0, 
                    width: '100%', 
                    height: '100%', 
                    cursor: 'pointer' 
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Background Color">
              <IconButton size="small">
                <FormatColorFillIcon />
                <input
                  type="color"
                  value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
                  onChange={(e) => {
                    setBackgroundColor(e.target.value);
                    handleFormatting('hiliteColor');
                  }}
                  style={{ 
                    position: 'absolute', 
                    opacity: 0, 
                    width: '100%', 
                    height: '100%', 
                    cursor: 'pointer' 
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Line Height Control */}
          <Box sx={{ display: 'flex', gap: 0.5, borderRight: 1, borderColor: 'divider', pr: 1, alignItems: 'center', minWidth: 120 }}>
            <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>Line Height:</Typography>
            <Slider
              value={lineHeight}
              onChange={(_, value) => {
                setLineHeight(value);
                handleFormatting('lineHeight');
              }}
              min={1}
              max={3}
              step={0.1}
              size="small"
              sx={{ width: 80 }}
            />
            <Typography variant="caption" sx={{ minWidth: 30 }}>{lineHeight}</Typography>
          </Box>

          {/* Text Direction */}
          <Box sx={{ display: 'flex', gap: 0.5, borderRight: 1, borderColor: 'divider', pr: 1 }}>
            <Tooltip title="Left to Right">
              <IconButton 
                size="small" 
                onClick={() => handleFormatting('ltr')}
                sx={{ bgcolor: textDirection === 'ltr' ? 'primary.main' : 'transparent', color: textDirection === 'ltr' ? 'white' : 'inherit' }}
              >
                <span style={{ fontSize: '0.9rem' }}>LTR</span>
              </IconButton>
            </Tooltip>
            <Tooltip title="Right to Left">
              <IconButton 
                size="small" 
                onClick={() => handleFormatting('rtl')}
                sx={{ bgcolor: textDirection === 'rtl' ? 'primary.main' : 'transparent', color: textDirection === 'rtl' ? 'white' : 'inherit' }}
              >
                <span style={{ fontSize: '0.9rem' }}>RTL</span>
              </IconButton>
            </Tooltip>
          </Box>

          {/* Alignment */}
          <Box sx={{ display: 'flex', gap: 0.5, borderRight: 1, borderColor: 'divider', pr: 1 }}>
            <Tooltip title="Align Left">
              <IconButton 
                size="small" 
                onClick={() => handleFormatting('justifyLeft')}
                sx={{ bgcolor: alignment === 'left' ? 'primary.main' : 'transparent', color: alignment === 'left' ? 'white' : 'inherit' }}
              >
                <FormatAlignLeftIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Align Center">
              <IconButton 
                size="small" 
                onClick={() => handleFormatting('justifyCenter')}
                sx={{ bgcolor: alignment === 'center' ? 'primary.main' : 'transparent', color: alignment === 'center' ? 'white' : 'inherit' }}
              >
                <FormatAlignCenterIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Align Right">
              <IconButton 
                size="small" 
                onClick={() => handleFormatting('justifyRight')}
                sx={{ bgcolor: alignment === 'right' ? 'primary.main' : 'transparent', color: alignment === 'right' ? 'white' : 'inherit' }}
              >
                <FormatAlignRightIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Justify">
              <IconButton 
                size="small" 
                onClick={() => handleFormatting('justifyFull')}
                sx={{ bgcolor: alignment === 'full' ? 'primary.main' : 'transparent', color: alignment === 'full' ? 'white' : 'inherit' }}
              >
                <FormatAlignJustifyIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Indentation */}
          <Box sx={{ display: 'flex', gap: 0.5, borderRight: 1, borderColor: 'divider', pr: 1 }}>
            <Tooltip title="Increase Indent">
              <IconButton size="small" onClick={() => handleFormatting('indent')}>
                <FormatIndentIncreaseIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Decrease Indent">
              <IconButton size="small" onClick={() => handleFormatting('outdent')}>
                <FormatIndentDecreaseIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 0.5, borderRight: 1, borderColor: 'divider', pr: 1 }}>
            <Tooltip title="Undo (Ctrl+Z)">
              <IconButton size="small" onClick={() => document.execCommand('undo', false, null)}>
                <UndoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Redo (Ctrl+Y)">
              <IconButton size="small" onClick={() => document.execCommand('redo', false, null)}>
                <RedoIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Drawing Tools */}
          <Box sx={{ display: 'flex', gap: 0.5, borderRight: 1, borderColor: 'divider', pr: 1 }}>
            <Tooltip title="Toggle Drawing Mode">
              <IconButton 
                size="small" 
                onClick={toggleDrawing}
                sx={{ 
                  bgcolor: isDrawing ? 'primary.main' : 'transparent',
                  color: isDrawing ? 'white' : 'inherit',
                  '&:hover': {
                    bgcolor: isDrawing ? 'primary.dark' : 'action.hover'
                  }
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>✏️</span>
              </IconButton>
            </Tooltip>
            {isDrawing && (
              <>
                <input
                  type="color"
                  value={drawingColor}
                  onChange={(e) => setDrawingColor(e.target.value)}
                  style={{ width: 32, height: 32, border: 'none', cursor: 'pointer' }}
                />
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={drawingWidth}
                  onChange={(e) => setDrawingWidth(parseInt(e.target.value))}
                  style={{ width: 60 }}
                />
                <Tooltip title="Clear Drawing">
                  <IconButton size="small" onClick={clearCanvas}>
                    <span style={{ fontSize: '1.2rem' }}>🗑️</span>
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>

          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
            <Typography variant="caption" color="text.secondary">
              {safeWritingStats.words} words
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {safeWritingStats.characters} chars
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {safeWritingStats.paragraphs} paragraphs
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Ribbon Tabs */}
      <Paper sx={{ mb: 2, borderRadius: 0 }}>
        <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'divider' }}>
          {ribbonTabs.map(tab => (
            <Box
              key={tab}
              onClick={() => setActiveTab(tab)}
              sx={{
                px: 3,
                py: 1.5,
                cursor: 'pointer',
                borderBottom: activeTab === tab ? 2 : 0,
                borderColor: 'primary.main',
                bgcolor: activeTab === tab ? 'primary.light' : 'transparent',
                color: activeTab === tab ? 'primary.contrastText' : 'text.primary',
                '&:hover': {
                  bgcolor: activeTab === tab ? 'primary.light' : 'action.hover'
                }
              }}
            >
              <Typography variant="body2" fontWeight={activeTab === tab ? 'bold' : 'normal'}>
                {tab}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Ribbon Toolbars */}
        <Box sx={{ p: 2, minHeight: 80 }}>
          {activeTab === 'Design' && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Theme</InputLabel>
                <Select
                  value={selectedTheme?.name || 'Default'}
                  onChange={e => {
                    const theme = vibrantThemes.find(t => t.name === e.target.value) || themes.find(t => t.name === e.target.value);
                    setSelectedTheme(theme);
                    setGlobalFont(theme.font);
                    setGlobalTextColor(theme.color);
                    setGlobalBgColor(theme.background);
                  }}
                  label="Theme"
                >
                  {[...themes, ...vibrantThemes].map(theme => (
                    <MenuItem key={theme.name} value={theme.name}>{theme.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Font</InputLabel>
                <Select value={globalFont} onChange={e => setGlobalFont(e.target.value)} label="Font">
                  <MenuItem value="Arial">Arial</MenuItem>
                  <MenuItem value="Georgia">Georgia</MenuItem>
                  <MenuItem value="Tahoma">Tahoma</MenuItem>
                  <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                  <MenuItem value="Verdana">Verdana</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">Text Color:</Typography>
                <input
                  type="color"
                  value={globalTextColor}
                  onChange={e => setGlobalTextColor(e.target.value)}
                  style={{ width: 32, height: 32, border: 'none', cursor: 'pointer' }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">Background:</Typography>
                <input
                  type="color"
                  value={globalBgColor}
                  onChange={e => setGlobalBgColor(e.target.value)}
                  style={{ width: 32, height: 32, border: 'none', cursor: 'pointer' }}
                />
              </Box>
            </Box>
          )}

          {activeTab === 'Layout' && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Margins</InputLabel>
                <Select value={margin} onChange={e => setMargin(e.target.value)} label="Margins">
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="narrow">Narrow</MenuItem>
                  <MenuItem value="wide">Wide</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Orientation</InputLabel>
                <Select value={orientation} onChange={e => setOrientation(e.target.value)} label="Orientation">
                  <MenuItem value="portrait">Portrait</MenuItem>
                  <MenuItem value="landscape">Landscape</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Page Size</InputLabel>
                <Select value={pageSize} onChange={e => setPageSize(e.target.value)} label="Page Size">
                  <MenuItem value="A4">A4</MenuItem>
                  <MenuItem value="Letter">Letter</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <InputLabel>Columns</InputLabel>
                <Select value={columns} onChange={e => setColumns(Number(e.target.value))} label="Columns">
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Line Spacing</InputLabel>
                <Select value={paraSpacing} onChange={e => setParaSpacing(Number(e.target.value))} label="Line Spacing">
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={1.15}>1.15</MenuItem>
                  <MenuItem value={1.5}>1.5</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">Indent Left:</Typography>
                <input 
                  type="number" 
                  min={0} 
                  max={5} 
                  step={0.1} 
                  value={indentLeft} 
                  onChange={e => setIndentLeft(Number(e.target.value))} 
                  style={{ width: 60, padding: '4px 8px', border: '1px solid #ccc', borderRadius: 4 }}
                />
                <Typography variant="body2">cm</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">Indent Right:</Typography>
                <input 
                  type="number" 
                  min={0} 
                  max={5} 
                  step={0.1} 
                  value={indentRight} 
                  onChange={e => setIndentRight(Number(e.target.value))} 
                  style={{ width: 60, padding: '4px 8px', border: '1px solid #ccc', borderRadius: 4 }}
                />
                <Typography variant="body2">cm</Typography>
              </Box>
            </Box>
          )}

          {activeTab === 'References' && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <IconButton size="small" onClick={insertTOC} title="Table of Contents">
                <Typography variant="body2">TOC</Typography>
              </IconButton>
              <IconButton size="small" onClick={insertFootnote} title="Insert Footnote">
                <Typography variant="body2">Footnote</Typography>
              </IconButton>
              <IconButton size="small" onClick={insertCitation} title="Insert Citation">
                <Typography variant="body2">Citation</Typography>
              </IconButton>
              <IconButton size="small" onClick={insertBibliography} title="Bibliography">
                <Typography variant="body2">Bibliography</Typography>
              </IconButton>
              <IconButton size="small" onClick={insertCaption} title="Insert Caption">
                <Typography variant="body2">Caption</Typography>
              </IconButton>
              <IconButton size="small" onClick={insertCrossReference} title="Cross-reference">
                <Typography variant="body2">Cross-ref</Typography>
              </IconButton>
            </Box>
          )}

          {activeTab === 'Mailings' && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <IconButton size="small" onClick={startMailMerge} title="Start Mail Merge">
                <Typography variant="body2">Start Merge</Typography>
              </IconButton>
              <IconButton size="small" onClick={selectRecipients} title="Select Recipients">
                <Typography variant="body2">Recipients</Typography>
              </IconButton>
              <IconButton size="small" onClick={insertMergeField} title="Insert Merge Field">
                <Typography variant="body2">Merge Field</Typography>
              </IconButton>
              <IconButton size="small" onClick={previewResults} title="Preview Results">
                <Typography variant="body2">Preview</Typography>
              </IconButton>
              <IconButton size="small" onClick={finishAndMerge} title="Finish & Merge">
                <Typography variant="body2">Finish</Typography>
              </IconButton>
              <IconButton size="small" onClick={insertEnvelope} title="Envelopes">
                <Typography variant="body2">Envelope</Typography>
              </IconButton>
              <IconButton size="small" onClick={insertLabel} title="Labels">
                <Typography variant="body2">Label</Typography>
              </IconButton>
            </Box>
          )}

          {activeTab === 'Review' && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <IconButton size="small" onClick={spellCheck} title="Spelling & Grammar">
                <Typography variant="body2">Spell Check</Typography>
              </IconButton>
              <IconButton size="small" onClick={showWordCount} title="Word Count">
                <Typography variant="body2">Word Count</Typography>
              </IconButton>
              <IconButton size="small" onClick={addComment} title="Add Comment">
                <Typography variant="body2">Comment</Typography>
              </IconButton>
              <IconButton size="small" onClick={handleShowComments} title={showComments ? 'Hide Comments' : 'Show Comments'}>
                <Typography variant="body2">{showComments ? 'Hide' : 'Show'} Comments</Typography>
              </IconButton>
              <IconButton size="small" onClick={toggleTrackChanges} title={trackChanges ? 'Disable Track Changes' : 'Enable Track Changes'}>
                <Typography variant="body2">{trackChanges ? 'Disable' : 'Enable'} Track</Typography>
              </IconButton>
              <IconButton size="small" onClick={acceptChange} title="Accept Change">
                <Typography variant="body2">Accept</Typography>
              </IconButton>
              <IconButton size="small" onClick={rejectChange} title="Reject Change">
                <Typography variant="body2">Reject</Typography>
              </IconButton>
              <IconButton size="small" onClick={compareDocs} title="Compare">
                <Typography variant="body2">Compare</Typography>
              </IconButton>
              <IconButton size="small" onClick={restrictEditing} title="Restrict Editing">
                <Typography variant="body2">Restrict</Typography>
              </IconButton>
            </Box>
          )}

          {activeTab === 'View' && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <IconButton size="small" onClick={() => setView('print')} title="Print Layout">
                <Typography variant="body2">Print</Typography>
              </IconButton>
              <IconButton size="small" onClick={() => setView('web')} title="Web Layout">
                <Typography variant="body2">Web</Typography>
              </IconButton>
              <IconButton size="small" onClick={() => setView('read')} title="Read Mode">
                <Typography variant="body2">Read</Typography>
              </IconButton>
              <IconButton size="small" onClick={zoomIn} title="Zoom In">
                <Typography variant="body2">Zoom +</Typography>
              </IconButton>
              <IconButton size="small" onClick={zoomOut} title="Zoom Out">
                <Typography variant="body2">Zoom -</Typography>
              </IconButton>
              <IconButton size="small" onClick={zoomReset} title="100%">
                <Typography variant="body2">100%</Typography>
              </IconButton>
              <IconButton size="small" onClick={toggleRuler} title={showRuler ? 'Hide Ruler' : 'Show Ruler'}>
                <Typography variant="body2">{showRuler ? 'Hide' : 'Show'} Ruler</Typography>
              </IconButton>
              <IconButton size="small" onClick={toggleGridlines} title={showGridlines ? 'Hide Gridlines' : 'Show Gridlines'}>
                <Typography variant="body2">{showGridlines ? 'Hide' : 'Show'} Grid</Typography>
              </IconButton>
              <IconButton size="small" onClick={toggleNavPane} title={showNavPane ? 'Hide Navigation Pane' : 'Show Navigation Pane'}>
                <Typography variant="body2">{showNavPane ? 'Hide' : 'Show'} Nav</Typography>
              </IconButton>
              <IconButton size="small" onClick={newWindow} title="New Window">
                <Typography variant="body2">New Window</Typography>
              </IconButton>
              <IconButton size="small" onClick={arrangeAll} title="Arrange All">
                <Typography variant="body2">Arrange</Typography>
              </IconButton>
              <IconButton size="small" onClick={splitWindow} title="Split">
                <Typography variant="body2">Split</Typography>
              </IconButton>
            </Box>
          )}

          {activeTab === 'Help' && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <IconButton size="small" onClick={openHelp} title="Help">
                <Typography variant="body2">Help</Typography>
              </IconButton>
              <IconButton size="small" onClick={openSupport} title="Contact Support">
                <Typography variant="body2">Support</Typography>
              </IconButton>
              <IconButton size="small" onClick={openFeedback} title="Feedback">
                <Typography variant="body2">Feedback</Typography>
              </IconButton>
              <IconButton size="small" onClick={openTraining} title="Show Training">
                <Typography variant="body2">Training</Typography>
              </IconButton>
            </Box>
          )}

          {activeTab !== 'Home' && activeTab !== 'Insert' && activeTab !== 'Draw' && activeTab !== 'Design' && activeTab !== 'Layout' && activeTab !== 'References' && activeTab !== 'Mailings' && activeTab !== 'Review' && activeTab !== 'View' && activeTab !== 'Help' && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                {activeTab} tab features coming soon!
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Editor Area */}
      <Box sx={{ 
        flex: 1, 
        position: 'relative',
        background: '#fff',
        borderRadius: 2,
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>

        {/* AI Sidebar */}
        {aiSidebarOpen && (
          <Paper sx={{
            position: 'fixed',
            right: 0,
            top: 0,
            width: 350,
            height: '100vh',
            zIndex: 1200,
            overflowY: 'auto',
            p: 2,
            boxShadow: '-4px 0 8px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Advanced AI Assistant</Typography>
              <IconButton size="small" onClick={() => setAiSidebarOpen(false)}>×</IconButton>
            </Box>

            {/* Writing Configuration */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Writing Setup</Typography>
              <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                <InputLabel>Writing Goal</InputLabel>
                <Select value={writingGoal} onChange={(e) => setWritingGoal(e.target.value)} label="Writing Goal">
                  {writingGoals.map(goal => (
                    <MenuItem key={goal.value} value={goal.value}>{goal.icon} {goal.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                <InputLabel>AI Persona</InputLabel>
                <Select value={aiPersona} onChange={(e) => setAiPersona(e.target.value)} label="AI Persona">
                  {aiPersonas.map(persona => (
                    <MenuItem key={persona.value} value={persona.value}>{persona.icon} {persona.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                <InputLabel>Writing Style</InputLabel>
                <Select value={writingStyle} onChange={(e) => setWritingStyle(e.target.value)} label="Writing Style">
                  {writingStyles.map(style => (
                    <MenuItem key={style.value} value={style.value}>{style.icon} {style.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                <InputLabel>Target Audience</InputLabel>
                <Select value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} label="Target Audience">
                  {targetAudiences.map(audience => (
                    <MenuItem key={audience.value} value={audience.value}>{audience.icon} {audience.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Document Type</InputLabel>
                <Select value={documentType} onChange={(e) => setDocumentType(e.target.value)} label="Document Type">
                  {documentTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>{type.icon} {type.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Document Analysis */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Document Analysis</Typography>
              <Button
                variant="contained"
                onClick={analyzeDocument}
                disabled={isAnalyzing}
                fullWidth
                sx={{ mb: 2 }}
              >
                {isAnalyzing ? 'Analyzing...' : '📊 Analyze Document'}
              </Button>

              {/* Analysis Scores */}
              {writingScore && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Writing Score:</Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: writingScore >= 80 ? 'success.main' : writingScore >= 60 ? 'warning.main' : 'error.main',
                        fontWeight: 'bold'
                      }}
                    >
                      {writingScore}/100
                    </Typography>
                  </Box>
                  {seoScore && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">SEO Score:</Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: seoScore >= 80 ? 'success.main' : seoScore >= 60 ? 'warning.main' : 'error.main',
                          fontWeight: 'bold'
                        }}
                      >
                        {seoScore}/100
                      </Typography>
                    </Box>
                  )}
                  {readabilityScore && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Readability:</Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: readabilityScore >= 80 ? 'success.main' : readabilityScore >= 60 ? 'warning.main' : 'error.main',
                          fontWeight: 'bold'
                        }}
                      >
                        {readabilityScore}/100
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* AI Suggestions */}
              {aiSuggestions.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>AI Suggestions</Typography>
                  {aiSuggestions.map((suggestion, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                      <Typography sx={{ mr: 1 }}>💡</Typography>
                      <Typography variant="body2">{suggestion}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* Quick AI Actions */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Quick Actions</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                <Button size="small" onClick={() => handleAdvancedAIFeature('summarize')}>📝 Summarize</Button>
                <Button size="small" onClick={() => handleAdvancedAIFeature('improve')}>✨ Improve</Button>
                <Button size="small" onClick={() => handleAdvancedAIFeature('expand')}>📈 Expand</Button>
                <Button size="small" onClick={() => handleAdvancedAIFeature('simplify')}>🔍 Simplify</Button>
                <Button size="small" onClick={() => handleAdvancedAIFeature('formalize')}>🎩 Make Formal</Button>
                <Button size="small" onClick={() => handleAdvancedAIFeature('casualize')}>😊 Make Casual</Button>
                <Button size="small" onClick={() => handleAdvancedAIFeature('persuasive')}>💪 Make Persuasive</Button>
                <Button size="small" onClick={() => handleAdvancedAIFeature('creative')}>🎨 Make Creative</Button>
              </Box>
            </Box>

            {/* Style Transfer */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Style Transfer</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {writingStyles.filter(style => style.value !== writingStyle).map(style => (
                  <Button
                    key={style.value}
                    size="small"
                    variant="outlined"
                    onClick={() => transferStyle(style.value)}
                    fullWidth
                  >
                    {style.icon} {style.label}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Context Rewriting */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Context Rewriting</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g., Make this more persuasive, beginner-friendly, etc."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    rewriteWithContext(e.target.value);
                    e.target.value = '';
                  }
                }}
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                <Button size="small" onClick={() => rewriteWithContext('Make this more persuasive')}>💪 Persuasive</Button>
                <Button size="small" onClick={() => rewriteWithContext('Make this beginner-friendly')}>🎓 Beginner</Button>
                <Button size="small" onClick={() => rewriteWithContext('Make this more professional')}>💼 Professional</Button>
                <Button size="small" onClick={() => rewriteWithContext('Make this more engaging')}>🎯 Engaging</Button>
              </Box>
            </Box>

            {/* Custom AI Prompt */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Custom AI Prompt</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Ask AI anything about your document..."
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Button 
                fullWidth 
                onClick={() => handleAdvancedAIFeature('custom', { prompt: aiPrompt })}
              >
                🤖 Ask AI
              </Button>
            </Box>

            {/* Image Upload */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Upload Image for AI Analysis</Typography>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                style={{ width: '100%', marginBottom: 8 }}
              />
              {aiImage && (
                <img 
                  src={aiImage} 
                  alt="Uploaded" 
                  style={{ width: '100%', maxHeight: 200, objectFit: 'contain' }}
                />
              )}
            </Box>

            {/* AI Result */}
            {aiResult && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>AI Response:</Typography>
                <Paper sx={{ p: 1, mb: 1, bgcolor: 'grey.50' }}>
                  <Typography variant="body2">{aiResult}</Typography>
                </Paper>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    if (editorRef.current) {
                      document.execCommand('insertText', false, aiResult);
                    }
                  }}
                >
                  📝 Insert into Document
                </Button>
              </Box>
            )}
          </Paper>
        )}

        {!aiSidebarOpen && (
          <Button
            variant="contained"
            sx={{
              position: 'fixed',
              right: 20,
              top: 20,
              zIndex: 1100,
              minWidth: 'auto',
              width: 50,
              height: 50,
              borderRadius: '50%'
            }}
            onClick={() => setAiSidebarOpen(true)}
          >
            AI
          </Button>
        )}

        {/* Collaboration Panel */}
        {showCollaborationPanel && (
          <Paper sx={{
            position: 'fixed',
            right: 0,
            top: 0,
            width: 350,
            height: '100vh',
            zIndex: 1200,
            overflowY: 'auto',
            p: 2,
            boxShadow: '-4px 0 8px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Smart Collaboration</Typography>
              <IconButton size="small" onClick={() => setShowCollaborationPanel(false)}>×</IconButton>
            </Box>

            {/* Collaboration Mode Toggle */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Collaboration Mode</Typography>
              <Button
                variant={collaborativeMode ? 'contained' : 'outlined'}
                onClick={toggleCollaborativeMode}
                fullWidth
                sx={{ mb: 1 }}
              >
                {collaborativeMode ? '🟢 Collaborative Mode ON' : '🔴 Collaborative Mode OFF'}
              </Button>
              {realTimeSync && (
                <Typography variant="body2" color="success.main">🔄 Real-time sync active</Typography>
              )}
            </Box>

            {/* Inline Comments */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Inline Comments</Typography>
              {selectedText && (
                <Paper sx={{ p: 1, mb: 2, bgcolor: 'primary.50' }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Selected:</strong> "{selectedText.substring(0, 50)}..."
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => {
                      const comment = prompt('Add a comment about this text:');
                      if (comment) addInlineComment(comment, selectedText);
                    }}
                  >
                    💬 Add Comment
                  </Button>
                </Paper>
              )}

              <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                {inlineComments.map(comment => (
                  <Paper key={comment.id} sx={{ p: 1, mb: 1, bgcolor: 'grey.50' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" fontWeight="bold">{comment.author}</Typography>
                      <Typography variant="caption">{new Date(comment.timestamp).toLocaleTimeString()}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>"{comment.text}"</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>{comment.comment}</Typography>
                    {comment.aiResponse && (
                      <Paper sx={{ p: 1, bgcolor: 'warning.50' }}>
                        <Typography variant="body2">
                          <strong>AI Response:</strong> {comment.aiResponse}
                        </Typography>
                      </Paper>
                    )}
                  </Paper>
                ))}
              </Box>
            </Box>

            {/* AI Discussions */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>AI Discussions</Typography>
              <Button
                fullWidth
                onClick={() => {
                  const topic = prompt('Start a new AI discussion about:');
                  if (topic) startAIDiscussion(topic);
                }}
                sx={{ mb: 2 }}
              >
                🗣️ Start Discussion
              </Button>

              <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                {aiDiscussions.map(discussion => (
                  <Paper key={discussion.id} sx={{ p: 1, mb: 2, bgcolor: 'grey.50' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2">{discussion.topic}</Typography>
                      <Typography variant="caption">{new Date(discussion.timestamp).toLocaleDateString()}</Typography>
                    </Box>
                    <Box sx={{ maxHeight: 150, overflowY: 'auto', mb: 1 }}>
                      {discussion.messages.map(message => (
                        <Box 
                          key={message.id} 
                          sx={{ 
                            mb: 1, 
                            p: 1, 
                            bgcolor: message.author === 'AI Assistant' ? 'primary.50' : 'grey.100',
                            borderRadius: 1
                          }}
                        >
                          <Typography variant="caption" fontWeight="bold">{message.author}</Typography>
                          <Typography variant="body2">{message.content}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Add to discussion..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          addDiscussionMessage(discussion.id, e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                  </Paper>
                ))}
              </Box>
            </Box>

            {/* Version Management */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Version Management</Typography>
              <Button onClick={saveVersion} fullWidth sx={{ mb: 2 }}>
                💾 Save Version
              </Button>

              <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                {documentVersions.map((version, index) => (
                  <Paper key={version.id} sx={{ p: 1, mb: 1, bgcolor: 'grey.50' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2">Version {index + 1}</Typography>
                      <Typography variant="caption">{new Date(version.timestamp).toLocaleString()}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {version.wordCount} words | {version.charCount} chars
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        onClick={() => setHtml(version.content)}
                      >
                        🔄 Restore
                      </Button>
                      {index > 0 && (
                        <Button
                          size="small"
                          onClick={() => compareVersions(version, documentVersions[index - 1])}
                        >
                          📊 Compare
                        </Button>
                      )}
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>

            {/* Collaborators */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Collaborators</Typography>
              <Box sx={{ mb: 2 }}>
                {collaborators.map(collaborator => (
                  <Box key={collaborator.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ mr: 1 }}>{collaborator.avatar}</Typography>
                    <Typography variant="body2" sx={{ flex: 1 }}>{collaborator.name}</Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: collaborator.status === 'online' ? 'success.main' : 'error.main'
                      }}
                    >
                      {collaborator.status === 'online' ? '🟢' : '🔴'} {collaborator.status}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Button
                fullWidth
                onClick={() => {
                  const name = prompt('Add collaborator name:');
                  if (name) {
                    setCollaborators([...collaborators, {
                      id: Date.now(),
                      name,
                      avatar: '👤',
                      status: 'online'
                    }]);
                  }
                }}
              >
                ➕ Add Collaborator
              </Button>
            </Box>
          </Paper>
        )}

        {!showCollaborationPanel && (
          <Button
            variant="contained"
            sx={{
              position: 'fixed',
              right: 20,
              top: 80,
              zIndex: 1100,
              minWidth: 'auto',
              width: 50,
              height: 50,
              borderRadius: '50%'
            }}
            onClick={() => setShowCollaborationPanel(true)}
          >
            👥
          </Button>
        )}

        {/* Outline Sidebar */}
        {showOutlineSidebar && (
          <Paper sx={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: 300,
            height: '100vh',
            zIndex: 1200,
            overflowY: 'auto',
            p: 2,
            boxShadow: '4px 0 8px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Document Outline</Typography>
              <IconButton size="small" onClick={() => setShowOutlineSidebar(false)}>×</IconButton>
            </Box>
            
            <Button onClick={generateOutline} fullWidth sx={{ mb: 2 }}>
              🔄 Generate Outline
            </Button>

            <Box>
              {documentOutline.length > 0 ? (
                <Box>
                  {documentOutline.map((item, index) => (
                    <Box
                      key={item.id}
                      sx={{
                        pl: item.level * 2,
                        py: 0.5,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                      onClick={() => {
                        const heading = document.querySelector(`h${item.level}`);
                        if (heading) {
                          heading.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      <Typography variant="body2">📄 {item.text}</Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No headings found in document
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use H1-H6 tags to create an outline
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        )}

        {!showOutlineSidebar && (
          <Button
            variant="contained"
            sx={{
              position: 'fixed',
              left: 20,
              top: 20,
              zIndex: 1100,
              minWidth: 'auto',
              width: 50,
              height: 50,
              borderRadius: '50%'
            }}
            onClick={() => setShowOutlineSidebar(true)}
          >
            📋
          </Button>
        )}

        {/* Smart Search Bar */}
        <Box sx={{
          position: 'fixed',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1100,
          width: 400
        }}>
          <TextField
            fullWidth
            size="small"
            placeholder="🔍 Smart search in document..."
            value={smartSearchQuery}
            onChange={(e) => setSmartSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                performSmartSearch(smartSearchQuery);
              }
            }}
            sx={{ bgcolor: 'background.paper' }}
          />
          {searchResults.length > 0 && (
            <Paper sx={{ mt: 1, maxHeight: 200, overflowY: 'auto' }}>
              {searchResults.map((result, index) => (
                <Box key={index} sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="subtitle2">{result.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{result.snippet}</Typography>
                </Box>
              ))}
            </Paper>
          )}
        </Box>

        {/* Focus Mode Toggle */}
        <Button
          variant={focusMode ? 'contained' : 'outlined'}
          sx={{
            position: 'fixed',
            left: 20,
            top: 80,
            zIndex: 1100,
            minWidth: 'auto',
            width: 50,
            height: 50,
            borderRadius: '50%'
          }}
          onClick={toggleFocusMode}
          title="Toggle Focus Mode"
        >
          🎯
        </Button>

        {/* Ruler, Gridlines, Navigation Pane */}
        {showRuler && (
          <Paper sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 30,
            bgcolor: 'grey.100',
            borderBottom: 1,
            borderColor: 'divider',
            zIndex: 5
          }}>
            <Box sx={{ 
              height: '100%', 
              background: 'repeating-linear-gradient(90deg, transparent, transparent 19px, #ccc 20px)',
              position: 'relative'
            }}>
              {Array.from({ length: 40 }).map((_, i) => (
                <Typography
                  key={i}
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    left: i * 20 + 2,
                    top: 2,
                    fontSize: '0.7rem',
                    color: 'text.secondary'
                  }}
                >
                  {i}
                </Typography>
              ))}
            </Box>
          </Paper>
        )}

        {showGridlines && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(0,0,0,0.1) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(0,0,0,0.1) 20px)',
            pointerEvents: 'none',
            zIndex: 2
          }} />
        )}

        {showNavPane && (
          <Paper sx={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: 250,
            height: '100vh',
            zIndex: 1200,
            overflowY: 'auto',
            p: 2,
            boxShadow: '4px 0 8px rgba(0,0,0,0.1)'
          }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Navigation Pane</Typography>
            <Typography variant="body2" color="text.secondary">Headings & Outline</Typography>
          </Paper>
        )}

        {/* Help Dialogs */}
        {showHelp && (
          <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Paper sx={{ p: 3, maxWidth: 500 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>Help</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                This is a web-based MS Word clone. Use the Ribbon tabs to access features. For more, see the README or contact support.
              </Typography>
              <Button variant="contained" onClick={closeAllHelp}>Close</Button>
            </Paper>
          </Box>
        )}

        {showSupport && (
          <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Paper sx={{ p: 3, maxWidth: 500 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>Contact Support</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Email: <a href="mailto:support@example.com">support@example.com</a>
              </Typography>
              <Button variant="contained" onClick={closeAllHelp}>Close</Button>
            </Paper>
          </Box>
        )}

        {showFeedback && (
          <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Paper sx={{ p: 3, maxWidth: 500 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>Feedback</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                We value your feedback! <a href="https://forms.gle/your-feedback-form" target="_blank" rel="noopener noreferrer">Submit feedback</a>
              </Typography>
              <Button variant="contained" onClick={closeAllHelp}>Close</Button>
            </Paper>
          </Box>
        )}

        {showTraining && (
          <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Paper sx={{ p: 3, maxWidth: 500 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>Training</Typography>
              <Box component="ul" sx={{ mb: 2 }}>
                <Typography component="li">Try formatting text using the Home tab.</Typography>
                <Typography component="li">Insert tables, images, and shapes from the Insert tab.</Typography>
                <Typography component="li">Use AI text generation for inspiration.</Typography>
                <Typography component="li">Explore all Ribbon tabs for more features!</Typography>
              </Box>
              <Button variant="contained" onClick={closeAllHelp}>Close</Button>
            </Paper>
          </Box>
        )}

        {/* Templates Modal */}
        {showTemplates && (
          <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Paper sx={{ p: 3, maxWidth: 600, maxHeight: '80vh', overflowY: 'auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">Choose a Template</Typography>
                <IconButton onClick={() => setShowTemplates(false)}>×</IconButton>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                {vibrantTemplates.map(t => (
                  <Button
                    key={t.name}
                    variant="outlined"
                    onClick={() => loadTemplate(t)}
                    sx={{ p: 2, flexDirection: 'column', height: 'auto' }}
                  >
                    <Typography sx={{ fontSize: '2rem', mb: 1 }}>{t.icon}</Typography>
                    <Typography>{t.name}</Typography>
                  </Button>
                ))}
              </Box>
            </Paper>
          </Box>
        )}

        {/* Floating Quick Actions Button */}
        <Button
          variant="contained"
          sx={{
            position: 'fixed',
            right: 20,
            bottom: 140,
            zIndex: 1100,
            minWidth: 'auto',
            width: 60,
            height: 60,
            borderRadius: '50%',
            fontSize: '1.5rem'
          }}
          onClick={() => setShowQuickActions(s => !s)}
          title="Quick Actions"
        >
          +
        </Button>

        {showQuickActions && (
          <Paper sx={{
            position: 'fixed',
            right: 20,
            bottom: 220,
            zIndex: 1100,
            p: 1,
            minWidth: 200
          }}>
            <Button
              fullWidth
              size="small"
              onClick={createNewDocument}
              sx={{ mb: 1, justifyContent: 'flex-start' }}
            >
              📄 New Document
            </Button>
            <Button
              fullWidth
              size="small"
              onClick={saveDocument}
              sx={{ mb: 1, justifyContent: 'flex-start' }}
            >
              💾 Save
            </Button>
            <Button
              fullWidth
              size="small"
              onClick={exportAsText}
              sx={{ mb: 1, justifyContent: 'flex-start' }}
            >
              📥 Export as Text
            </Button>
            <Button
              fullWidth
              size="small"
              onClick={() => setAiSidebarOpen(true)}
              sx={{ mb: 1, justifyContent: 'flex-start' }}
            >
              ✨ AI Help
            </Button>
            <Button
              fullWidth
              size="small"
              onClick={() => setShowTemplates(true)}
              sx={{ justifyContent: 'flex-start' }}
            >
              📋 Templates
            </Button>
          </Paper>
        )}

        {/* Recent Documents Sidebar */}
        <Button
          variant="outlined"
          sx={{
            position: 'fixed',
            right: 20,
            bottom: 200,
            zIndex: 1100,
            minWidth: 'auto',
            width: 50,
            height: 50,
            borderRadius: '50%'
          }}
          onClick={() => setShowRecentSidebar(s => !s)}
          title="Recent Documents"
        >
          📋
        </Button>

        {showRecentSidebar && (
          <Paper sx={{
            position: 'fixed',
            right: 20,
            bottom: 270,
            zIndex: 1100,
            p: 2,
            minWidth: 300,
            maxHeight: 400,
            overflowY: 'auto'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Documents</Typography>
              <IconButton size="small" onClick={() => setShowRecentSidebar(false)}>×</IconButton>
            </Box>
            <Box>
              {[...pinnedDocs.map(id => savedDocuments.find(d => d.id === id)).filter(Boolean), ...savedDocuments.filter(d => !pinnedDocs.includes(d.id))].map(doc => (
                <Box key={doc.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Button
                    size="small"
                    onClick={() => openDocument(doc)}
                    sx={{ flex: 1, justifyContent: 'flex-start' }}
                  >
                    📄 {doc.title}
                  </Button>
                  <IconButton
                    size="small"
                    onClick={() => togglePinDoc(doc.id)}
                  >
                    {pinnedDocs.includes(doc.id) ? '⭐' : '☆'}
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Paper>
        )}

        {/* Advanced Tools Modal */}
        {showAdvancedTools && (
          <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Paper sx={{ p: 3, maxWidth: 800, maxHeight: '90vh', overflowY: 'auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Advanced Document Tools</Typography>
                <IconButton onClick={() => setShowAdvancedTools(false)}>×</IconButton>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>📋 Document Structure</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                  <Button variant="outlined" onClick={generateAITOC} fullWidth>
                    🤖 AI Table of Contents
                  </Button>
                  <Button variant="outlined" onClick={generateSmartCitations} fullWidth>
                    📚 Smart Citations
                  </Button>
                  <Button variant="outlined" onClick={generateImageSuggestions} fullWidth>
                    🖼️ Image Suggestions
                  </Button>
                </Box>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>💻 Code & Formatting</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                  <Button variant="outlined" onClick={() => formatCode('console.log("Hello World");', 'javascript')} fullWidth>
                    🔧 Code Formatter
                  </Button>
                  <Button variant="outlined" onClick={() => handleAdvancedAIFeature('format')} fullWidth>
                    ✨ Smart Formatting
                  </Button>
                  <Button variant="outlined" onClick={() => handleAdvancedAIFeature('structure')} fullWidth>
                    📐 Document Structure
                  </Button>
                </Box>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>📤 Enhanced Export</Typography>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Format</InputLabel>
                  <Select
                    value={exportOptions.format}
                    onChange={(e) => setExportOptions({...exportOptions, format: e.target.value})}
                    label="Format"
                  >
                    <MenuItem value="docx">DOCX</MenuItem>
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="epub">ePub</MenuItem>
                    <MenuItem value="html">HTML</MenuItem>
                    <MenuItem value="txt">Plain Text</MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <input
                        type="checkbox"
                        checked={exportOptions.includeMetadata}
                        onChange={(e) => setExportOptions({...exportOptions, includeMetadata: e.target.checked})}
                      />
                    }
                    label="Include Metadata"
                  />
                  <FormControlLabel
                    control={
                      <input
                        type="checkbox"
                        checked={exportOptions.includeTOC}
                        onChange={(e) => setExportOptions({...exportOptions, includeTOC: e.target.checked})}
                      />
                    }
                    label="Include TOC"
                  />
                  <FormControlLabel
                    control={
                      <input
                        type="checkbox"
                        checked={exportOptions.includeCitations}
                        onChange={(e) => setExportOptions({...exportOptions, includeCitations: e.target.checked})}
                      />
                    }
                    label="Include Citations"
                  />
                </Box>

                <Button variant="contained" onClick={() => exportWithOptions(exportOptions.format)} fullWidth>
                  📤 Export Document
                </Button>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>🚀 Auto-Publish</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
                  <Button variant="outlined" onClick={() => autoPublish('medium')} fullWidth>
                    📰 Medium
                  </Button>
                  <Button variant="outlined" onClick={() => autoPublish('wordpress')} fullWidth>
                    🌐 WordPress
                  </Button>
                  <Button variant="outlined" onClick={() => autoPublish('linkedin')} fullWidth>
                    💼 LinkedIn
                  </Button>
                  <Button variant="outlined" onClick={() => autoPublish('blogger')} fullWidth>
                    📝 Blogger
                  </Button>
                </Box>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>☁️ Cloud Integration</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
                  <Button variant="outlined" onClick={() => saveToCloud('google-drive')} fullWidth>
                    📁 Google Drive
                  </Button>
                  <Button variant="outlined" onClick={() => saveToCloud('dropbox')} fullWidth>
                    📦 Dropbox
                  </Button>
                  <Button variant="outlined" onClick={() => saveToCloud('onedrive')} fullWidth>
                    ☁️ OneDrive
                  </Button>
                  <Button variant="outlined" onClick={() => saveToCloud('github')} fullWidth>
                    🐙 GitHub
                  </Button>
                </Box>
              </Box>

              {/* Image Suggestions Display */}
              {imageSuggestions.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" sx={{ mb: 2 }}>🖼️ Suggested Images</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
                    {imageSuggestions.map((suggestion, index) => (
                      <Paper key={index} sx={{ p: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>{suggestion.description}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                          Keywords: {suggestion.keywords.join(', ')}
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => {
                            alert(`Would insert image: ${suggestion.description}`);
                          }}
                        >
                          📎 Insert Image
                        </Button>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Table of Contents Display */}
              {tableOfContents.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" sx={{ mb: 2 }}>📋 Generated Table of Contents</Typography>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    {tableOfContents.map((item, index) => (
                      <Box key={index} sx={{ pl: (item.level - 1) * 2, py: 0.5 }}>
                        <Typography variant="body2">{item.title}</Typography>
                      </Box>
                    ))}
                  </Paper>
                </Box>
              )}

              {/* Citations Display */}
              {citations.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" sx={{ mb: 2 }}>📚 Generated Citations</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
                    {citations.map((citation, index) => (
                      <Paper key={index} sx={{ p: 2 }}>
                        <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>{citation.text}</Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}><em>Source: {citation.source}</em></Typography>
                        <Typography variant="caption" color="text.secondary">{citation.type}</Typography>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          </Box>
        )}

        {/* Image Toolbar */}
        {showImageToolbar && selectedImage && (
          <Paper sx={{
            position: 'absolute',
            top: imageToolbarPos.top,
            left: imageToolbarPos.left,
            zIndex: 1000,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Button size="small" onClick={() => handleAlignImage('left')}>Left</Button>
            <Button size="small" onClick={() => handleAlignImage('center')}>Center</Button>
            <Button size="small" onClick={() => handleAlignImage('right')}>Right</Button>
            <TextField
              size="small"
              value={altText}
              onChange={handleAltTextChange}
              placeholder="Alt text"
              sx={{ width: 100 }}
            />
          </Paper>
        )}

        {/* Image Resize Handle */}
        {selectedImage && (
          <Box
            sx={{
              position: 'absolute',
              top: selectedImage.getBoundingClientRect().bottom + window.scrollY - 8,
              left: selectedImage.getBoundingClientRect().right + window.scrollX - 8,
              width: 16,
              height: 16,
              bgcolor: 'primary.main',
              borderRadius: '50%',
              cursor: 'nwse-resize',
              zIndex: 1001
            }}
          />
        )}

        {/* Floating Plus Button */}
        <Button
          variant="contained"
          sx={{
            position: 'fixed',
            right: 20,
            bottom: 260,
            zIndex: 1100,
            minWidth: 'auto',
            width: 50,
            height: 50,
            borderRadius: '50%',
            fontSize: '2rem',
            fontWeight: 'bold'
          }}
          onClick={() => setShowQuickMenu(true)}
        >
          +
        </Button>

        {showQuickMenu && (
          <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Paper sx={{ p: 3, maxWidth: 600 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Quick Access</Typography>
                <IconButton onClick={() => setShowQuickMenu(false)}>×</IconButton>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>📋 Outline</Typography>
                  <Button variant="outlined" fullWidth onClick={() => setShowOutlineSidebar(true)}>
                    Show Document Outline
                  </Button>
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>👥 Collaboration</Typography>
                  <Button variant="outlined" fullWidth onClick={() => setShowCollaborationPanel(true)}>
                    Open Collaboration
                  </Button>
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>🔧 Advanced Tools</Typography>
                  <Button variant="outlined" fullWidth onClick={() => setShowAdvancedTools(true)}>
                    Open Advanced Tools
                  </Button>
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>📚 References</Typography>
                  <Button variant="outlined" fullWidth onClick={() => setActiveTab('References')}>
                    Go to References Tab
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        )}
        {/* Drawing Canvas Overlay */}
        {isDrawing && (
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 10,
              cursor: 'crosshair',
              pointerEvents: 'auto'
            }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        )}

        {/* Text Editor */}
        <div
          ref={editorRef}
          contentEditable={true}
          onInput={handleTextChange}
          onSelect={handleSelectionChange}
          onKeyDown={handleKeyDown}
          style={{
            padding: '32px',
            minHeight: '100%',
            outline: 'none',
            fontSize: '1.1rem',
            lineHeight: 1.7,
            color: '#222',
            fontFamily: 'Segoe UI, Roboto, Arial, sans-serif',
            pointerEvents: isDrawing ? 'none' : 'auto',
            position: 'relative',
            zIndex: 1
          }}
          dangerouslySetInnerHTML={{ __html: content || '' }}
        />
      </Box>

      {/* Preferences Modal */}
      {showPreferences && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0,0,0,0.5)',
          zIndex: 1300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Paper sx={{ p: 3, maxWidth: 600, maxHeight: '80vh', overflowY: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">User Preferences</Typography>
              <IconButton onClick={() => setShowPreferences(false)}>×</IconButton>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Appearance</Typography>
              <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                <InputLabel>Theme</InputLabel>
                <Select
                  value={userPreferences.theme}
                  onChange={(e) => updatePreferences('theme', e.target.value)}
                  label="Theme"
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="sepia">Sepia</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                <InputLabel>Font Size</InputLabel>
                <Select
                  value={userPreferences.fontSize}
                  onChange={(e) => updatePreferences('fontSize', e.target.value)}
                  label="Font Size"
                >
                  <MenuItem value="small">Small</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="large">Large</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Font Family</InputLabel>
                <Select
                  value={userPreferences.fontFamily}
                  onChange={(e) => updatePreferences('fontFamily', e.target.value)}
                  label="Font Family"
                >
                  <MenuItem value="Arial">Arial</MenuItem>
                  <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                  <MenuItem value="Georgia">Georgia</MenuItem>
                  <MenuItem value="Verdana">Verdana</MenuItem>
                  <MenuItem value="Courier New">Courier New</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Writing Features</Typography>
              <FormControlLabel
                control={
                  <input
                    type="checkbox"
                    checked={userPreferences.autoSave}
                    onChange={(e) => updatePreferences('autoSave', e.target.checked)}
                  />
                }
                label="Auto-save"
              />
              <FormControlLabel
                control={
                  <input
                    type="checkbox"
                    checked={userPreferences.spellCheck}
                    onChange={(e) => updatePreferences('spellCheck', e.target.checked)}
                  />
                }
                label="Spell check"
              />
              <FormControlLabel
                control={
                  <input
                    type="checkbox"
                    checked={userPreferences.grammarCheck}
                    onChange={(e) => updatePreferences('grammarCheck', e.target.checked)}
                  />
                }
                label="Grammar check"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Writing Statistics</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Words per minute:</Typography>
                  <Typography variant="h6">{safeWritingStats.wordsPerMinute}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Time spent:</Typography>
                  <Typography variant="h6">{Math.floor(safeWritingStats.timeSpent / 60)}m</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Goals achieved:</Typography>
                  <Typography variant="h6">{safeWritingStats.goalsAchieved}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Writing streak:</Typography>
                  <Typography variant="h6">{safeWritingStats.streak} days</Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={savePreferences}>
                💾 Save Preferences
              </Button>
              <Button variant="outlined" onClick={loadPreferences}>
                📂 Load Preferences
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Preferences Button */}
      <Button
        variant="outlined"
        sx={{
          position: 'fixed',
          left: 20,
          bottom: 20,
          zIndex: 1100,
          minWidth: 'auto',
          width: 50,
          height: 50,
          borderRadius: '50%'
        }}
        onClick={() => setShowPreferences(true)}
        title="User Preferences"
      >
        ⚙️
      </Button>

      {/* Advanced Tools Button */}
      <Button
        variant="outlined"
        sx={{
          position: 'fixed',
          left: 20,
          bottom: 80,
          zIndex: 1100,
          minWidth: 'auto',
          width: 50,
          height: 50,
          borderRadius: '50%'
        }}
        onClick={() => setShowAdvancedTools(true)}
        title="Advanced Tools"
      >
        🔧
      </Button>

      {/* Status Bar */}
      <Paper sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        p: 1,
        borderRadius: 0
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2">Document Status: Ready</Typography>
          <Typography variant="body2">Words: {safeWritingStats.words} | Characters: {safeWritingStats.characters}</Typography>
        </Box>
      </Paper>

      {/* Save Dialog */}
      {showSaveDialog && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0,0,0,0.5)',
          zIndex: 1300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Paper sx={{ p: 3, minWidth: 400 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Save Document</Typography>
            <TextField
              fullWidth
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="Document Title"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button variant="contained" onClick={saveDocument}>
                Save
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Open Dialog */}
      {showOpenDialog && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0,0,0,0.5)',
          zIndex: 1300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Paper sx={{ p: 3, minWidth: 400, maxHeight: '80vh', overflowY: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Open Document</Typography>
            <Box sx={{ mb: 2 }}>
              {savedDocuments.length > 0 ? (
                savedDocuments.map(doc => (
                  <Box
                    key={doc.id}
                    sx={{
                      p: 1,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                    onClick={() => openDocument(doc)}
                  >
                    <Typography>{doc.title}</Typography>
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary">No saved documents found</Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setShowOpenDialog(false)}>
                Cancel
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Find and Replace Dialog */}
      {showFindReplace && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0,0,0,0.5)',
          zIndex: 1300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Paper sx={{ p: 3, minWidth: 400 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Find and Replace</Typography>
            <TextField
              fullWidth
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              placeholder="Find"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="Replace"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={handleFindText}>
                Find
              </Button>
              <Button onClick={handleReplaceText}>
                Replace
              </Button>
              <Button onClick={() => setShowFindReplace(false)}>
                Cancel
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Comments Sidebar */}
      {showComments && comments.length > 0 && (
        <Paper sx={{
          position: 'fixed',
          right: 0,
          top: 0,
          width: 300,
          height: '100vh',
          zIndex: 1200,
          overflowY: 'auto',
          p: 2,
          boxShadow: '-4px 0 8px rgba(0,0,0,0.1)'
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Comments</Typography>
          <Box>
            {comments.map(c => (
              <Paper key={c.id} sx={{ p: 1, mb: 1, bgcolor: 'grey.50' }}>
                <Typography variant="body2">{c.text}</Typography>
              </Paper>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

// Utility to insert or replace selection in the editor
export function insertOrReplaceSelection(html) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  range.deleteContents();
  // Create a fragment from the HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;
  const frag = document.createDocumentFragment();
  let node, lastNode;
  while ((node = temp.firstChild)) {
    lastNode = frag.appendChild(node);
  }
  range.insertNode(frag);
  // Move cursor after inserted content
  if (lastNode) {
    range.setStartAfter(lastNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

export default MainContent;
