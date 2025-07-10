import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNotification } from '../App';

interface DocumentState {
  title: string;
  content: string;
  lastModified: Date;
  wordCount: number;
  characterCount: number;
  pageCount: number;
  isModified: boolean;
  autoSave: boolean;
  trackChanges: boolean;
  comments: Comment[];
  bookmarks: Bookmark[];
  headers: Header[];
  footers: Footer[];
  tableOfContents: TOCItem[];
}

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  position: number;
  resolved: boolean;
}

interface Bookmark {
  id: string;
  name: string;
  position: number;
}

interface Header {
  id: string;
  content: string;
  type: 'first' | 'odd' | 'even';
}

interface Footer {
  id: string;
  content: string;
  type: 'first' | 'odd' | 'even';
}

interface TOCItem {
  id: string;
  text: string;
  level: number;
  page: number;
}

interface DocumentVersion {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
}

interface DocumentContextType {
  document: DocumentState;
  updateTitle: (title: string) => void;
  updateContent: (content: string) => void;
  saveDocument: () => void;
  newDocument: () => void;
  openDocument: (file: File) => void;
  exportDocument: (format: string) => void;
  addComment: (text: string, position: number) => void;
  resolveComment: (id: string) => void;
  addBookmark: (name: string, position: number) => void;
  removeBookmark: (id: string) => void;
  updateHeader: (content: string, type: 'first' | 'odd' | 'even') => void;
  updateFooter: (content: string, type: 'first' | 'odd' | 'even') => void;
  generateTOC: () => void;
  toggleAutoSave: () => void;
  toggleTrackChanges: () => void;
  history: DocumentVersion[];
  restoreVersion: (versionId: string) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage if available
  const getInitialDocument = () => {
    const saved = localStorage.getItem('document-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert date strings back to Date objects
      parsed.lastModified = new Date(parsed.lastModified);
      return parsed;
    }
    return {
      title: 'Document1',
      content: '',
      lastModified: new Date(),
      wordCount: 0,
      characterCount: 0,
      pageCount: 1,
      isModified: false,
      autoSave: true,
      trackChanges: false,
      comments: [],
      bookmarks: [],
      headers: [],
      footers: [],
      tableOfContents: [],
    };
  };

  const [document, setDocument] = useState<DocumentState>(getInitialDocument());
  const [history, setHistory] = useState<DocumentVersion[]>([]);
  const { notify } = useNotification();

  // Save a new version to history
  const saveVersion = useCallback((doc: DocumentState) => {
    setHistory(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        title: doc.title,
        content: doc.content,
        lastModified: new Date(doc.lastModified),
      },
    ].slice(-20)); // Keep last 20 versions
  }, []);

  // Persist to localStorage on every update
  useEffect(() => {
    localStorage.setItem('document-state', JSON.stringify(document));
  }, [document]);

  const updateTitle = useCallback((title: string) => {
    setDocument(prev => ({
      ...prev,
      title,
      lastModified: new Date(),
      isModified: true,
    }));
  }, []);

  const updateContent = useCallback((content: string) => {
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const characterCount = content.length;
    const pageCount = Math.max(1, Math.ceil(wordCount / 250));
    setDocument(prev => {
      const newDoc = {
        ...prev,
        content,
        wordCount,
        characterCount,
        pageCount,
        lastModified: new Date(),
        isModified: true,
      };
      saveVersion(newDoc);
      return newDoc;
    });
  }, [saveVersion]);

  const saveDocument = useCallback(() => {
    try {
      setDocument(prev => {
        const newDoc = { ...prev, isModified: false };
        saveVersion(newDoc);
        return newDoc;
      });
      console.log('Document saved:', document.title);
    } catch (err) {
      notify('Failed to save document', 'error');
    }
  }, [document.title, saveVersion, notify]);

  const newDocument = useCallback(() => {
    setDocument({
      title: 'Document1',
      content: '',
      lastModified: new Date(),
      wordCount: 0,
      characterCount: 0,
      pageCount: 1,
      isModified: false,
      autoSave: true,
      trackChanges: false,
      comments: [],
      bookmarks: [],
      headers: [],
      footers: [],
      tableOfContents: [],
    });
  }, []);

  const openDocument = useCallback((file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        updateContent(content);
        updateTitle(file.name.replace(/\.[^/.]+$/, ""));
      };
      reader.readAsText(file);
    } catch (err) {
      notify('Failed to open document', 'error');
    }
  }, [updateContent, updateTitle, notify]);

  const exportDocument = useCallback((format: string) => {
    try {
      const blob = new Blob([document.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${document.title}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      notify('Failed to export document', 'error');
    }
  }, [document.content, notify]);

  const addComment = useCallback((text: string, position: number) => {
    const comment: Comment = {
      id: Date.now().toString(),
      text,
      author: 'User',
      timestamp: new Date(),
      position,
      resolved: false,
    };
    setDocument(prev => ({
      ...prev,
      comments: [...prev.comments, comment],
    }));
  }, []);

  const resolveComment = useCallback((id: string) => {
    setDocument(prev => ({
      ...prev,
      comments: prev.comments.map(comment =>
        comment.id === id ? { ...comment, resolved: true } : comment
      ),
    }));
  }, []);

  const addBookmark = useCallback((name: string, position: number) => {
    const bookmark: Bookmark = {
      id: Date.now().toString(),
      name,
      position,
    };
    setDocument(prev => ({
      ...prev,
      bookmarks: [...prev.bookmarks, bookmark],
    }));
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setDocument(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.filter(bookmark => bookmark.id !== id),
    }));
  }, []);

  const updateHeader = useCallback((content: string, type: 'first' | 'odd' | 'even') => {
    setDocument(prev => ({
      ...prev,
      headers: prev.headers.filter(h => h.type !== type).concat({
        id: Date.now().toString(),
        content,
        type,
      }),
    }));
  }, []);

  const updateFooter = useCallback((content: string, type: 'first' | 'odd' | 'even') => {
    setDocument(prev => ({
      ...prev,
      footers: prev.footers.filter(f => f.type !== type).concat({
        id: Date.now().toString(),
        content,
        type,
      }),
    }));
  }, []);

  const generateTOC = useCallback(() => {
    // Extract headings from content and generate TOC
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
    const matches = [...document.content.matchAll(headingRegex)];
    
    const toc: TOCItem[] = matches.map((match, index) => ({
      id: `toc-${index}`,
      text: match[2].replace(/<[^>]*>/g, ''),
      level: parseInt(match[1]),
      page: Math.floor(index / 10) + 1, // Approximate page
    }));

    setDocument(prev => ({
      ...prev,
      tableOfContents: toc,
    }));
  }, [document.content]);

  const toggleAutoSave = useCallback(() => {
    setDocument(prev => ({
      ...prev,
      autoSave: !prev.autoSave,
    }));
  }, []);

  const toggleTrackChanges = useCallback(() => {
    setDocument(prev => ({
      ...prev,
      trackChanges: !prev.trackChanges,
    }));
  }, []);

  const restoreVersion = useCallback((versionId: string) => {
    const version = history.find(v => v.id === versionId);
    if (version) {
      setDocument(prev => ({
        ...prev,
        title: version.title,
        content: version.content,
        lastModified: new Date(version.lastModified),
        isModified: true,
      }));
    }
  }, [history]);

  return (
    <DocumentContext.Provider value={{
      document,
      updateTitle,
      updateContent,
      saveDocument,
      newDocument,
      openDocument,
      exportDocument,
      addComment,
      resolveComment,
      addBookmark,
      removeBookmark,
      updateHeader,
      updateFooter,
      generateTOC,
      toggleAutoSave,
      toggleTrackChanges,
      history,
      restoreVersion,
    }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};