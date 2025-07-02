import React, { createContext, useContext, useReducer, useCallback, useEffect, useMemo } from 'react';

const DocumentContext = createContext();

// Load saved documents from localStorage
const loadFromLocalStorage = () => {
  try {
    const savedState = localStorage.getItem('wordProcessorDocuments');
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Failed to load documents from localStorage:', error);
  }
  return [];
};

const initialState = {
  // Document state
  documentTitle: 'Untitled Document',
  content: '',
  html: '',
  wordCount: 0,
  charCount: 0,
  
  // Formatting state
  currentFormat: {
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    fontSize: '16px',
    fontFamily: 'Arial',
    textColor: '#000000',
    highlightColor: 'transparent',
    alignment: 'left',
    lineHeight: 1.5,
    textDirection: 'ltr',
    superscript: false,
    subscript: false
  },
  
  // Document management
  savedDocuments: loadFromLocalStorage(),
  activeDocument: null,
  isDocumentModified: false,
  lastSaved: null,
  autoSaveEnabled: true,
  autoSaveInterval: 30000, // 30 seconds
  
  // History and undo/redo
  documentHistory: [],
  historyIndex: -1,
  
  // UI state
  showSaveDialog: false,
  showOpenDialog: false,
  showFindReplace: false,
  findText: '',
  replaceText: '',
  
  // Error handling
  error: null,
  
  // Document metadata
  metadata: {
    author: '',
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    tags: [],
    template: null
  },

  // UI state
  darkMode: false,
  isSidebarOpen: false,
  showOutlineSidebar: false,

  // Formatting state
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isSuperscript: false,
  isSubscript: false,
  fontSize: 16,
  fontFamily: 'Arial',
  textColor: '#000000',
  backgroundColor: 'transparent',
  alignment: 'left',
  lineHeight: 1.5,
  textDirection: 'ltr',

  // AI features
  prompt: '',
  loading: false,
  aiSidebarOpen: true,
  aiPrompt: '',
  aiImage: null,
  aiResult: '',
  writingGoal: 'general',
  aiPersona: 'assistant',
  writingStyle: 'neutral',
  targetAudience: 'general',
  documentType: 'document',
  aiSuggestions: [],
  isAnalyzing: false,
  writingScore: null,
  seoScore: null,
  readabilityScore: null,

  // Drawing state
  drawingMode: null, // 'pen', 'highlighter', 'eraser', or null
  drawColor: '#000000',
  drawWidth: 3,

  // Layout state
  margin: 'normal',
  orientation: 'portrait',
  pageSize: 'A4',
  columns: 1,
  paraSpacing: 1.5,
  indentLeft: 0,
  indentRight: 0,

  // References state
  citations: [],
  footnotes: [],

  // Mailings state
  recipients: [],
  mergePreviewIndex: null,
  mergeFields: ['Name', 'Address'],

  // Review state
  comments: [],
  showComments: false,
  trackChanges: false,
  trackedEdits: [],

  // Smart Collaboration Features
  inlineComments: [],
  aiDiscussions: [],
  collaborativeMode: false,
  documentVersions: [],
  selectedText: '',
  showCollaborationPanel: false,
  collaborators: [],
  realTimeSync: false,

  // View state
  docView: 'print',
  zoom: 1,
  showRuler: false,
  showGridlines: false,
  showNavPane: false,

  // Help state
  showHelp: false,
  showSupport: false,
  showFeedback: false,
  showTraining: false,

  // Templates state
  showTemplates: false,
  vibrantTemplates: [
    { name: 'Resume', icon: null, content: '<h1 style="color:#2563eb;">Jane Doe</h1><h2 style="color:#f59e42;">Software Engineer</h2><p>Email: jane@example.com | Phone: 123-456-7890</p><h3 style="color:#22c55e;">Experience</h3><ul><li>Company A - Developer</li><li>Company B - Intern</li></ul>' },
    { name: 'Report', icon: null, content: '<h1 style="color:#2563eb;">Project Report</h1><h2 style="color:#f59e42;">Executive Summary</h2><p>Lorem ipsum dolor sit amet...</p>' },
    { name: 'Letter', icon: null, content: '<h2 style="color:#2563eb;">Dear Sir/Madam,</h2><p>I am writing to...</p>' },
    { name: 'Blog', icon: null, content: '<h1 style="color:#f59e42;">My Awesome Blog</h1><h2 style="color:#22c55e;">Introduction</h2><p>Welcome to my blog...</p>' },
  ],
};

const documentReducer = (state, action) => {
  switch (action.type) {
    // Document content management
    case 'SET_CONTENT':
      return { 
        ...state, 
        content: action.payload, 
        isDocumentModified: true,
        metadata: {
          ...state.metadata,
          modified: new Date().toISOString()
        }
      };
      
    case 'SET_HTML':
      return { ...state, html: action.payload };
      
    case 'SET_WORD_COUNT':
      return { 
        ...state, 
        wordCount: action.payload,
        isDocumentModified: true 
      };
      
    case 'SET_CHAR_COUNT':
      return { 
        ...state, 
        charCount: action.payload,
        isDocumentModified: true 
      };
      
    case 'SET_DOCUMENT_TITLE':
      return { 
        ...state, 
        documentTitle: action.payload, 
        isDocumentModified: true 
      };
      
    // Document management actions
    case 'CREATE_NEW_DOCUMENT': {
      const newDocument = action.payload;
      return {
        ...state,
        savedDocuments: [...state.savedDocuments, newDocument],
        activeDocument: newDocument,
        documentTitle: newDocument.title,
        content: newDocument.content,
        html: newDocument.html || '',
        wordCount: newDocument.wordCount || 0,
        charCount: newDocument.charCount || 0,
        isDocumentModified: false,
        lastSaved: new Date().toISOString()
      };
    }
      
    case 'LOAD_DOCUMENT': {
      const documentToLoad = state.savedDocuments.find(doc => doc.id === action.payload);
      if (!documentToLoad) return state;
      
      return {
        ...state,
        activeDocument: documentToLoad,
        documentTitle: documentToLoad.title,
        content: documentToLoad.content,
        html: documentToLoad.html || '',
        wordCount: documentToLoad.wordCount || 0,
        charCount: documentToLoad.charCount || 0,
        isDocumentModified: false,
        lastSaved: documentToLoad.lastModified || new Date().toISOString()
      };
    }
      
    case 'SAVE_DOCUMENT': {
      if (!state.activeDocument) return state;
      
      const updatedDocuments = state.savedDocuments.map(doc => 
        doc.id === state.activeDocument.id ? action.payload : doc
      );
      
      return {
        ...state,
        savedDocuments: updatedDocuments,
        activeDocument: action.payload,
        isDocumentModified: false,
        lastSaved: new Date().toISOString()
      };
    }
      
    case 'DELETE_DOCUMENT':
      return {
        ...state,
        savedDocuments: state.savedDocuments.filter(doc => doc.id !== action.payload),
        activeDocument: state.activeDocument?.id === action.payload ? null : state.activeDocument,
        isDocumentModified: state.activeDocument?.id === action.payload ? false : state.isDocumentModified
      };
      
    case 'DUPLICATE_DOCUMENT':
      return {
        ...state,
        savedDocuments: [...state.savedDocuments, action.payload],
        activeDocument: action.payload,
        documentTitle: action.payload.title,
        content: action.payload.content,
        html: action.payload.html || '',
        wordCount: action.payload.wordCount || 0,
        charCount: action.payload.charCount || 0,
        isDocumentModified: true
      };
      
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        savedDocuments: state.savedDocuments.map(doc => 
          doc.id === action.payload 
            ? { ...doc, isFavorite: !doc.isFavorite } 
            : doc
        )
      };
      
    // Formatting actions
    case 'SET_FORMAT':
      return { 
        ...state, 
        currentFormat: { ...state.currentFormat, ...action.payload },
        isDocumentModified: true
      };
      
    case 'RESET_FORMAT':
      return { 
        ...state, 
        currentFormat: {
          ...initialState.currentFormat,
          fontSize: state.currentFormat.fontSize,
          fontFamily: state.currentFormat.fontFamily
        },
        isDocumentModified: true
      };
      
    case 'SET_DRAW_WIDTH':
      return { ...state, drawWidth: action.payload };
      
    case 'SET_DRAW_COLOR':
      return { ...state, drawColor: action.payload };
      
    case 'SET_DRAWING_MODE':
      return { ...state, drawingMode: action.payload };
      
    // History and undo/redo
    case 'ADD_TO_HISTORY':
      const newHistory = state.documentHistory.slice(0, state.historyIndex + 1);
      return {
        ...state,
        documentHistory: [...newHistory, action.payload],
        historyIndex: newHistory.length,
        isDocumentModified: true
      };
      
    case 'UNDO':
      if (state.historyIndex <= 0) return state;
      return {
        ...state,
        content: state.documentHistory[state.historyIndex - 1],
        historyIndex: state.historyIndex - 1,
        isDocumentModified: true
      };
      
    case 'REDO':
      if (state.historyIndex >= state.documentHistory.length - 1) return state;
      return {
        ...state,
        content: state.documentHistory[state.historyIndex + 1],
        historyIndex: state.historyIndex + 1,
        isDocumentModified: true
      };
      
    // UI state management
    case 'TOGGLE_SAVE_DIALOG':
      return { ...state, showSaveDialog: !state.showSaveDialog };
      
    case 'TOGGLE_OPEN_DIALOG':
      return { ...state, showOpenDialog: !state.showOpenDialog };
      
    case 'TOGGLE_FIND_REPLACE':
      return { ...state, showFindReplace: !state.showFindReplace };
      
    case 'SET_FIND_TEXT':
      return { ...state, findText: action.payload };
      
    case 'SET_REPLACE_TEXT':
      return { ...state, replaceText: action.payload };
      
    // Error handling
    case 'SET_ERROR':
      return { ...state, error: action.payload };
      
    case 'CLEAR_ERROR':
      return { ...state, error: null };
      
    // Auto-save
    case 'SET_AUTO_SAVE':
      return { ...state, autoSaveEnabled: action.payload };
      
    case 'SET_AUTO_SAVE_INTERVAL':
      return { ...state, autoSaveInterval: action.payload };
      
    case 'TOGGLE_AI_SIDEBAR':
      return { ...state, aiSidebarOpen: !state.aiSidebarOpen };
    case 'SET_AI_SIDEBAR_OPEN':
      return { ...state, aiSidebarOpen: action.payload };
      
    case 'SET_SELECTED_TEXT':
      return { ...state, selectedText: action.payload };
      
    default:
      return state;
  }
};

export const DocumentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(documentReducer, initialState);
  
  // Save to localStorage whenever documents change
  useEffect(() => {
    try {
      localStorage.setItem('wordProcessorDocuments', JSON.stringify(state.savedDocuments));
    } catch (error) {
      console.error('Failed to save documents to localStorage:', error);
    }
  }, [state.savedDocuments]);

  // Auto-save effect
  useEffect(() => {
    if (!state.autoSaveEnabled || !state.isDocumentModified) return;
    
    const timer = setTimeout(() => {
      if (state.activeDocument) {
        saveDocument();
      } else if (state.content) {
        // If no active document but there's content, create a new one
        const newDoc = {
          id: Date.now().toString(),
          title: state.documentTitle || 'Untitled Document',
          content: state.content,
          html: state.html,
          lastModified: new Date().toISOString(),
          wordCount: state.wordCount,
          charCount: state.charCount
        };
        dispatch({ type: 'CREATE_NEW_DOCUMENT', payload: newDoc });
      }
    }, state.autoSaveInterval);

    return () => clearTimeout(timer);
  }, [state.content, state.autoSaveEnabled, state.autoSaveInterval, state.isDocumentModified, state.activeDocument]);

  // Document actions
  const createNewDocument = useCallback((initialDoc = null) => {
    const newDoc = initialDoc || {
      id: Date.now().toString(),
      title: 'Untitled Document',
      content: '',
      html: '',
      lastModified: new Date().toISOString(),
      wordCount: 0,
      charCount: 0,
      isFavorite: false
    };
    
    dispatch({ type: 'CREATE_NEW_DOCUMENT', payload: newDoc });
    return newDoc;
  }, []);
  
  const loadDocument = useCallback((documentId) => {
    dispatch({ type: 'LOAD_DOCUMENT', payload: documentId });
  }, []);
  
  const saveDocument = useCallback(() => {
    if (!state.activeDocument) return;
    
    const updatedDoc = {
      ...state.activeDocument,
      title: state.documentTitle,
      content: state.content,
      html: state.html,
      lastModified: new Date().toISOString(),
      wordCount: state.wordCount,
      charCount: state.charCount
    };
    
    dispatch({ type: 'SAVE_DOCUMENT', payload: updatedDoc });
  }, [state.activeDocument, state.documentTitle, state.content, state.html, state.wordCount, state.charCount]);
  
  const deleteDocument = useCallback((documentId) => {
    dispatch({ type: 'DELETE_DOCUMENT', payload: documentId });
  }, []);
  
  const toggleFavorite = useCallback((documentId) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: documentId });
  }, []);
  
  // Content actions
  const setContent = useCallback((content) => {
    dispatch({ type: 'SET_CONTENT', payload: content });
  }, []);
  
  const setHtml = useCallback((html) => {
    dispatch({ type: 'SET_HTML', payload: html });
  }, []);
  
  const setDocumentTitle = useCallback((title) => {
    dispatch({ type: 'SET_DOCUMENT_TITLE', payload: title });
  }, []);
  
  // Formatting actions
  const setFormat = useCallback((format) => {
    dispatch({ type: 'SET_FORMAT', payload: format });
  }, []);
  
  const resetFormat = useCallback(() => {
    dispatch({ type: 'RESET_FORMAT' });
  }, []);
  
  // History actions
  const addToHistory = useCallback((content) => {
    dispatch({ type: 'ADD_TO_HISTORY', payload: content });
  }, []);
  
  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);
  
  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);
  
  // UI actions
  const toggleSaveDialog = useCallback(() => {
    dispatch({ type: 'TOGGLE_SAVE_DIALOG' });
  }, []);
  
  const toggleOpenDialog = useCallback(() => {
    dispatch({ type: 'TOGGLE_OPEN_DIALOG' });
  }, []);
  
  const toggleFindReplace = useCallback(() => {
    dispatch({ type: 'TOGGLE_FIND_REPLACE' });
  }, []);
  
  const setFindText = useCallback((text) => {
    dispatch({ type: 'SET_FIND_TEXT', payload: text });
  }, []);
  
  const setReplaceText = useCallback((text) => {
    dispatch({ type: 'SET_REPLACE_TEXT', payload: text });
  }, []);
  
  // Auto-save settings
  const setAutoSave = useCallback((enabled) => {
    dispatch({ type: 'SET_AUTO_SAVE', payload: enabled });
  }, []);
  
  const setAutoSaveInterval = useCallback((interval) => {
    dispatch({ type: 'SET_AUTO_SAVE_INTERVAL', payload: interval });
  }, []);
  
  // Error handling
  const setError = useCallback((error) => {
    console.error('Document Error:', error);
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);
  
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);
  
  // Word and character count actions
  const setWordCount = useCallback((count) => {
    dispatch({ type: 'SET_WORD_COUNT', payload: count });
  }, []);
  
  const setCharCount = useCallback((count) => {
    dispatch({ type: 'SET_CHAR_COUNT', payload: count });
  }, []);

  const setDrawWidth = useCallback((width) => {
    dispatch({ type: 'SET_DRAW_WIDTH', payload: width });
  }, []);

  const setDrawColor = useCallback((color) => {
    dispatch({ type: 'SET_DRAW_COLOR', payload: color });
  }, []);

  const setDrawingMode = useCallback((mode) => {
    dispatch({ type: 'SET_DRAWING_MODE', payload: mode });
  }, []);
  
  // Calculate word and character count
  const updateWordCount = useCallback((text) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(text.length);
  }, [setWordCount, setCharCount]);
  
  // Effect to update word count when content changes
  useEffect(() => {
    updateWordCount(state.content);
  }, [state.content, updateWordCount]);

  const toggleAISidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_AI_SIDEBAR' });
  }, []);

  const setAISidebarOpen = useCallback((open) => {
    dispatch({ type: 'SET_AI_SIDEBAR_OPEN', payload: open });
  }, []);

  const setSelectedText = useCallback((text) => {
    dispatch({ type: 'SET_SELECTED_TEXT', payload: text });
  }, []);

  // Outline extraction from HTML content
  const outline = useMemo(() => {
    if (!state.content) return [];
    const div = document.createElement('div');
    div.innerHTML = state.content;
    const headings = Array.from(div.querySelectorAll('h1, h2, h3, h4, h5, h6')).map((el, idx) => ({
      text: el.textContent || '',
      level: parseInt(el.tagName[1], 10),
      id: el.id || `heading-${idx}`
    }));
    return headings;
  }, [state.content]);

  const value = {
    ...state,
    createNewDocument,
    loadDocument,
    saveDocument,
    deleteDocument,
    setContent,
    setHtml,
    setDocumentTitle,
    setFormat,
    resetFormat,
    addToHistory,
    undo,
    redo,
    toggleSaveDialog,
    toggleOpenDialog,
    toggleFindReplace,
    setFindText,
    setReplaceText,
    setAutoSave,
    setAutoSaveInterval,
    setError,
    clearError,
    updateWordCount,
    setWordCount,
    setCharCount,
    setDrawWidth,
    setDrawColor,
    setDrawingMode,
    toggleAISidebar,
    setAISidebarOpen,
    setSelectedText,
    outline,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};
