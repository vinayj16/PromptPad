import React, { useRef, useEffect, useState } from 'react';
import { useDocument } from '../../context/DocumentContext';
import { useUI } from '../../context/UIContext';
import { Ruler, Grid, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { useNotification } from '../../App';
import { useAI } from '../../context/AIContext';
import { useCollaboration } from '../../context/CollaborationContext';

function splitContentIntoPages(html: string, pageHeightPx: number, pageMargins: number): string[] {
  // Create a temporary container to measure content
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.visibility = 'hidden';
  container.style.width = '794px'; // A4 width at 96dpi
  container.style.fontSize = '16px';
  container.style.padding = `${pageMargins}px`;
  container.style.boxSizing = 'border-box';
  container.innerHTML = html;
  document.body.appendChild(container);

  const blockTags = [
    'P', 'DIV', 'UL', 'OL', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'TABLE', 'BLOCKQUOTE', 'PRE', 'HR', 'BR'
  ];

  const pages: string[] = [];
  let currentPage = document.createElement('div');
  let currentHeight = 0;
  const availableHeight = pageHeightPx - (pageMargins * 2); // Account for margins

  const children = Array.from(container.childNodes);
  let i = 0;
  while (i < children.length) {
    const node = children[i];
    // Handle manual page breaks
    if (
      node.nodeType === 1 &&
      (node as HTMLElement).tagName === 'DIV' &&
      (node as HTMLElement).classList.contains('page-break')
    ) {
      // Push current page and start a new one
      pages.push(currentPage.innerHTML);
      currentPage = document.createElement('div');
      currentHeight = 0;
      i++;
      continue;
    }
    // Only split at block-level elements
    if (node.nodeType === 1 && blockTags.includes((node as HTMLElement).tagName)) {
      const temp = document.createElement('div');
      temp.style.padding = `${pageMargins}px`;
      temp.style.boxSizing = 'border-box';
      temp.appendChild(node.cloneNode(true));
      container.appendChild(temp);
      const nodeHeight = temp.offsetHeight;
      if (currentHeight + nodeHeight > availableHeight && currentPage.childNodes.length > 0) {
        pages.push(currentPage.innerHTML);
        currentPage = document.createElement('div');
        currentHeight = 0;
      }
      currentPage.appendChild(node.cloneNode(true));
      currentHeight += nodeHeight;
      container.removeChild(temp);
    } else {
      // For inline or unknown nodes, just add them
      currentPage.appendChild(node.cloneNode(true));
    }
    i++;
  }
  if (currentPage.childNodes.length > 0) {
    pages.push(currentPage.innerHTML);
  }
  document.body.removeChild(container);
  return pages;
}

const Editor: React.FC = () => {
  const { document, updateContent, updateTitle, saveDocument } = useDocument();
  const { ui } = useUI();
  const { notify } = useNotification();
  const { checkGrammar, processText } = useAI();
  const { addComment, setCursorPosition, users } = useCollaboration();
  const editorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const [cursorPosition, setCursorPositionState] = useState(0);
  const [pageColor, setPageColor] = useState(() => localStorage.getItem('page-color') || '#ffffff');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [grammarIssues, setGrammarIssues] = useState<any[]>([]);
  const [showAIButton, setShowAIButton] = useState(false);
  const [aiButtonPosition, setAIButtonPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentPosition, setCommentPosition] = useState<number | null>(null);
  const myUserId = users[0]?.id;
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

    useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== document.content) {
      editorRef.current.innerHTML = document.content;
    }
    // Auto-focus if document is empty
    if (editorRef.current && !document.content) {
      editorRef.current.focus();
    }
    // On initial load, if content is present, place caret at end
    if (editorRef.current && document.content) {
      const el = editorRef.current;
      el.focus();
      const range = window.document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }, [document.content]);

  // Separate useEffect for event listeners
  useEffect(() => {
    // Listen for save event from header
    const saveHandler = (e: any) => {
      if (editorRef.current) {
        updateContent(editorRef.current.innerHTML);
      }
    };
    
    // Listen for undo/redo events from header
    const undoHandler = () => {
      handleUndo();
    };
    const redoHandler = () => {
      handleRedo();
    };
    
    // Global keyboard shortcuts
    const globalKeyHandler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'n':
            e.preventDefault();
            window.location.reload(); // New document (simulate)
            break;
          case 'o':
            e.preventDefault();
            window.document.getElementById('file-open-btn')?.click(); // Trigger open
            break;
          case 's':
            e.preventDefault();
            saveDocument();
            notify('Document saved');
            break;
          case 'p':
            if (e.shiftKey) {
              e.preventDefault();
              // Ctrl+Shift+P: Select Paragraph (already implemented)
            } else {
              e.preventDefault();
              window.print();
            }
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case 'y':
            e.preventDefault();
            handleRedo();
            break;
          case 'x':
            e.preventDefault();
            window.document.execCommand('cut');
            break;
          case 'c':
            e.preventDefault();
            window.document.execCommand('copy');
            break;
          case 'v':
            e.preventDefault();
            window.document.execCommand('paste');
            break;
          case 'a':
            e.preventDefault();
            // Ctrl+A: Select All in editor (already implemented)
            const editor = window.document.getElementById('editor-main');
            if (editor) {
              const range = window.document.createRange();
              range.selectNodeContents(editor);
              const sel = window.getSelection();
              sel?.removeAllRanges();
              sel?.addRange(range);
            }
            break;
          case 'f':
            e.preventDefault();
            // Open find modal (not implemented, show notification)
            notify('Find (Ctrl+F) coming soon!');
            break;
          case 'h':
            e.preventDefault();
            // Open replace modal (not implemented, show notification)
            notify('Replace (Ctrl+H) coming soon!');
            break;
          case 'b':
            e.preventDefault();
            window.document.execCommand('bold');
            break;
          case 'i':
            e.preventDefault();
            window.document.execCommand('italic');
            break;
          case 'u':
            e.preventDefault();
            window.document.execCommand('underline');
            break;
          case 'l':
            if (e.shiftKey) {
              e.preventDefault();
              window.document.execCommand('insertUnorderedList');
            } else {
              e.preventDefault();
              window.document.execCommand('justifyLeft');
            }
            break;
          case 'e':
            e.preventDefault();
            window.document.execCommand('justifyCenter');
            break;
          case 'r':
            e.preventDefault();
            window.document.execCommand('justifyRight');
            break;
          case 'j':
            e.preventDefault();
            window.document.execCommand('justifyFull');
            break;
          case '>':
            if (e.shiftKey) {
              e.preventDefault();
              window.document.execCommand('increaseFontSize');
            }
            break;
          case '<':
            if (e.shiftKey) {
              e.preventDefault();
              window.document.execCommand('decreaseFontSize');
            }
            break;
          case '1':
            e.preventDefault();
            window.document.execCommand('formatBlock', false, 'p');
            break;
          case '2':
            e.preventDefault();
            window.document.execCommand('formatBlock', false, 'h2');
            break;
          case '5':
            e.preventDefault();
            // 1.5 line spacing (not natively supported, show notification)
            notify('1.5 line spacing (Ctrl+5) coming soon!');
            break;
          case '/':
            e.preventDefault();
            setShowShortcutsModal(true);
            break;
          default:
            break;
        }
        // Navigation shortcuts
        if (e.key === 'Home') {
          e.preventDefault();
          const editor = window.document.getElementById('editor-main');
          if (editor) {
            const range = window.document.createRange();
            range.setStart(editor, 0);
            range.collapse(true);
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        }
        if (e.key === 'End') {
          e.preventDefault();
          const editor = window.document.getElementById('editor-main');
          if (editor) {
            const range = window.document.createRange();
            range.selectNodeContents(editor);
            range.collapse(false);
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        }
        // Word/paragraph navigation (Ctrl+Arrow)
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          // Let browser handle word navigation
        }
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          // Let browser handle paragraph navigation
        }
      }
    };
    
    window.addEventListener('editor-save', saveHandler);
    window.addEventListener('editor-undo', undoHandler);
    window.addEventListener('editor-redo', redoHandler);
    window.addEventListener('keydown', globalKeyHandler);
    
    return () => {
      window.removeEventListener('editor-save', saveHandler);
      window.removeEventListener('editor-undo', undoHandler);
      window.removeEventListener('editor-redo', redoHandler);
      window.removeEventListener('keydown', globalKeyHandler);
    };
  }, []); // Empty dependency array - only run once

  useEffect(() => {
    const handler = (e: any) => {
      setPageColor(e.detail);
    };
    window.addEventListener('page-color-change', handler);
    return () => window.removeEventListener('page-color-change', handler);
  }, []);

  // Update history when content changes (but not on undo/redo)
  const pushToHistory = (content: string) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(content);
      // Limit history size for memory
      if (newHistory.length > 100) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex(idx => Math.min(idx + 1, 99));
  };

  // Notify TitleBar about undo/redo availability
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('undo-redo-state', {
      detail: {
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1
      }
    }));
  }, [historyIndex, history.length]);

  // On content change, push to history (robust for all content types)
  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      // Only push if content actually changed
      if (history[historyIndex] !== newContent) {
        updateContent(newContent);
        pushToHistory(newContent);
      }
    }
  };

  // Undo/Redo handlers (robust for all content types)
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevContent = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      if (editorRef.current) {
        editorRef.current.innerHTML = prevContent;
        updateContent(prevContent);
      }
      notify('Undo');
    }
  };
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextContent = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      if (editorRef.current) {
        editorRef.current.innerHTML = nextContent;
        updateContent(nextContent);
      }
      notify('Redo');
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTitle(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle common keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 's':
          e.preventDefault();
          saveDocument();
          notify('Document saved');
          break;
        case 'b':
          e.preventDefault();
          // Remove any lines like document.execCommand('bold'), document.execCommand('italic'), etc. from this file. All formatting should be handled via the Ribbon/HomeTab using window.document.execCommand.
          break;
        case 'i':
          e.preventDefault();
          // Remove any lines like document.execCommand('italic'), etc. from this file. All formatting should be handled via the Ribbon/HomeTab using window.document.execCommand.
          break;
        case 'u':
          e.preventDefault();
          // Remove any lines like document.execCommand('underline'), etc. from this file. All formatting should be handled via the Ribbon/HomeTab using window.document.execCommand.
          break;
        case 'enter':
          if (e.shiftKey) {
            e.preventDefault();
            // Insert manual page break
            const pageBreak = window.document.createElement('div');
            pageBreak.className = 'page-break';
            pageBreak.style.pageBreakAfter = 'always';
            pageBreak.style.breakAfter = 'page';
            pageBreak.innerHTML = '<br>';
            
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              range.insertNode(pageBreak);
              range.setStartAfter(pageBreak);
              range.setEndAfter(pageBreak);
              selection.removeAllRanges();
              selection.addRange(range);
              updateContent(editorRef.current?.innerHTML || '');
              notify('Page break inserted');
            }
          }
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            // Ctrl+Shift+Z for Redo (alternative to Ctrl+Y)
            handleRedo();
          } else {
            // Ctrl+Z for Undo
            handleUndo();
          }
          break;
        case 'y':
          e.preventDefault();
          handleRedo();
          break;
        case 'a':
          e.preventDefault();
          // Ctrl+A: Select All in editor
          const editor = window.document.getElementById('editor-main');
          if (editor) {
            const range = window.document.createRange();
            range.selectNodeContents(editor);
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
          break;
        case 'f':
          e.preventDefault();
          // Focus search (could be implemented later)
          break;
        case 'n':
          e.preventDefault();
          // New document
          window.dispatchEvent(new CustomEvent('new-document'));
          break;
        case 'o':
          e.preventDefault();
          // Open document
          window.dispatchEvent(new CustomEvent('open-document'));
          break;
        case 'p':
          if (e.shiftKey) {
            e.preventDefault();
            // Ctrl+Shift+P: Select Paragraph
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
              let node = sel.anchorNode;
              while (node && node.nodeType !== 1) node = node.parentNode;
              while (node && node.nodeType === 1 && node.nodeName !== 'P' && node.nodeName !== 'DIV' && node.nodeName !== 'LI') node = node.parentNode;
              if (node && node.nodeType === 1) {
                const range = window.document.createRange();
                range.selectNodeContents(node);
                sel.removeAllRanges();
                sel.addRange(range);
              }
            }
          }
          break;
        case 't':
          if (e.shiftKey) {
            e.preventDefault();
            // Ctrl+Shift+T: Select Table
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
              let node = sel.anchorNode;
              while (node && node.nodeType !== 1) node = node.parentNode;
              while (node && node.nodeType === 1 && node.nodeName !== 'TABLE') node = node.parentNode;
              if (node && node.nodeType === 1 && node.nodeName === 'TABLE') {
                const range = window.document.createRange();
                range.selectNodeContents(node);
                sel.removeAllRanges();
                sel.addRange(range);
              }
            }
          }
          break;
      }
    } else {
      // Handle non-Ctrl shortcuts
      switch (e.key.toLowerCase()) {
        case 'f5':
          e.preventDefault();
          // Refresh/Reload document
          window.location.reload();
          break;
        case 'escape':
          // Clear selection
          const selection = window.getSelection();
          if (selection) {
            selection.removeAllRanges();
          }
          break;
      }
    }
  };

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed && editorRef.current && editorRef.current.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const editorRect = editorRef.current.getBoundingClientRect();
      setToolbarPosition({
        top: rect.top - editorRect.top - 40, // 40px above selection
        left: rect.left - editorRect.left + rect.width / 2,
      });
      setShowToolbar(true);
      setAIButtonPosition({
        top: rect.top - editorRect.top - 32, // 32px above selection
        left: rect.left - editorRect.left + rect.width / 2,
      });
      setShowAIButton(true);
      setCommentPosition(range.startOffset);
      // Set my cursor position in collaboration context
      if (myUserId) setCursorPosition(myUserId, range.startOffset);
    } else {
      setShowToolbar(false);
      setShowAIButton(false);
      setShowAIMenu(false);
      setCommentPosition(null);
      // Set my cursor position to null
      if (myUserId) setCursorPosition(myUserId, -1);
    }
  };

  const getPageStyle = () => {
    const baseStyle = {
      fontSize: `${ui.fontSize}pt`,
      fontFamily: ui.fontFamily,
      zoom: `${ui.zoom}%`,
    };

    switch (ui.viewMode) {
      case 'web':
        return { ...baseStyle, maxWidth: '100%', padding: '20px' };
      case 'outline':
        return { ...baseStyle, fontSize: '14px', lineHeight: '1.4' };
      case 'draft':
        return { ...baseStyle, padding: '10px', border: 'none', boxShadow: 'none' };
      default: // print
        return baseStyle;
    }
  };

  // Map page sizes to dimensions in pixels (A4, Letter, etc.)
  const PAGE_SIZES: Record<string, { width: number; height: number }> = {
    'A4': { width: 794, height: 1122 }, // 210mm x 297mm at 96dpi
    'Letter': { width: 816, height: 1056 }, // 8.5in x 11in at 96dpi
    'A3': { width: 1123, height: 1587 },
    'Legal': { width: 816, height: 1344 },
    'Tabloid': { width: 1056, height: 1632 },
  };
  const defaultSize = PAGE_SIZES[ui.pageSize] || PAGE_SIZES['A4'];
  const isLandscape = ui.pageOrientation === 'landscape';
  const PAGE_WIDTH_PX = isLandscape ? defaultSize.height : defaultSize.width;
  const PAGE_HEIGHT_PX = isLandscape ? defaultSize.width : defaultSize.height;

  const PAGE_MARGINS = 40; // Standard page margins in pixels
  const pages = splitContentIntoPages(document.content, PAGE_HEIGHT_PX, PAGE_MARGINS);

  // Always render at least one page
  const safePages = pages.length === 0 ? [''] : pages;

  // On document/content load, reset history
  useEffect(() => {
    if (editorRef.current) {
      setHistory([document.content]);
      setHistoryIndex(0);
    }
  }, [document.content]);

  // Formatting actions
  const handleFormat = (command: string) => {
    window.document.execCommand(command, false);
    setShowToolbar(false);
  };
  const handleAlign = (command: string) => {
    window.document.execCommand(command, false);
    setShowToolbar(false);
  };

  // Autosave effect
  useEffect(() => {
    if (document.autoSave && document.isModified) {
      const timeout = setTimeout(() => {
        saveDocument();
        notify('Document autosaved');
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [document.content, document.autoSave]);

  // Drag-and-drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    const file = files[0];
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = window.document.createElement('img');
        img.src = ev.target?.result as string;
        img.style.maxWidth = '100%';
        // Insert at caret
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          sel.getRangeAt(0).insertNode(img);
          updateContent(editorRef.current?.innerHTML || '');
          notify('Image inserted');
        }
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('text/')) {
      if (window.confirm('Replace current document with dropped file?')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          updateContent(ev.target?.result as string);
          notify('Text file loaded');
        };
        reader.readAsText(file);
      }
    } else {
      notify('Unsupported file type', 'error');
    }
  };

  // On content change, check grammar
  useEffect(() => {
    let ignore = false;
    const check = async () => {
      if (document.content && document.content.length > 0) {
        try {
          const result = await checkGrammar(document.content.replace(/<[^>]+>/g, ' '));
          if (!ignore) setGrammarIssues(result.issues || []);
        } catch {
          if (!ignore) setGrammarIssues([]);
        }
      } else {
        setGrammarIssues([]);
      }
    };
    check();
    return () => { ignore = true; };
  }, [document.content]);

  // Helper to highlight grammar and spelling issues in HTML
  function highlightIssues(content: string, issues: any[]) {
    if (!issues || issues.length === 0) return content;
    let html = content;
    // Sort issues by position descending to avoid messing up indices
    const sorted = [...issues].sort((a, b) => b.position[0] - a.position[0]);
    for (const issue of sorted) {
      const [start, end] = issue.position;
      if (typeof start === 'number' && typeof end === 'number' && end > start) {
        const className = issue.type === 'spelling' ? 'spelling-issue' : 'grammar-issue';
        html =
          html.slice(0, start) +
          `<span class='${className}' data-tooltip='${issue.message.replace(/'/g, '&apos;')}'>` +
          html.slice(start, end) +
          '</span>' +
          html.slice(end);
      }
    }
    return html;
  }

  // AI action handlers
  const handleAISummarize = async () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      try {
        const summary = await processText(selectedText, 'summarize');
        range.deleteContents();
        range.insertNode(window.document.createTextNode(summary));
        updateContent(editorRef.current?.innerHTML || '');
        notify('Text summarized');
      } catch {
        notify('AI summarization failed', 'error');
      }
      setShowAIMenu(false);
    }
  };
  const handleAIRewrite = async () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      try {
        const rewritten = await processText(selectedText, 'rewrite');
        range.deleteContents();
        range.insertNode(window.document.createTextNode(rewritten));
        updateContent(editorRef.current?.innerHTML || '');
        notify('Text rewritten');
      } catch {
        notify('AI rewrite failed', 'error');
      }
      setShowAIMenu(false);
    }
  };

  // Render collaborator cursors in the editor
  function renderCollaboratorCursors(content: string) {
    let html = content;
    // Render cursors for all users except self
    users.filter(u => u.isOnline && u.id !== myUserId && u.cursor && typeof u.cursor.offset === 'number' && u.cursor.offset >= 0).forEach(u => {
      const { cursor } = u;
      if (!cursor) return;
      const cursorHtml = `<span class='collab-cursor' style='border-left: 2px solid ${u.color}; margin-left: -1px; padding-left: 1px; position: relative;'>
        <span class='collab-cursor-label' style='position: absolute; top: -1.5em; left: 0; background: ${u.color}; color: #fff; border-radius: 4px; font-size: 10px; padding: 0 4px;'>${u.avatar}</span>
      </span>`;
      html = html.slice(0, cursor.offset) + cursorHtml + html.slice(cursor.offset);
    });
    return html;
  }

  // In the main editor container, ensure the first editable div (the main editor) is always focusable and auto-focused on mount.
  // Add a useEffect to focus editorRef on mount and when the editor is rendered.
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  // Clipboard handlers
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');
    let clean = '';
    if (html) {
      // Remove style/script tags and inline styles
      const div = window.document.createElement('div');
      div.innerHTML = html;
      div.querySelectorAll('style,script').forEach(el => el.remove());
      div.querySelectorAll('[style]').forEach(el => el.removeAttribute('style'));
      clean = div.innerHTML;
    } else {
      clean = text;
    }
    window.document.execCommand('insertHTML', false, clean);
    notify('Content pasted');
  };

  const handleCopy = (e: React.ClipboardEvent<HTMLDivElement>) => {
    // Default browser copy is fine, but show notification
    notify('Content copied');
  };

  // Shortcuts help modal
  const shortcutsList = [
    ['Ctrl+N', 'New document'],
    ['Ctrl+O', 'Open document'],
    ['Ctrl+S', 'Save document'],
    ['Ctrl+P', 'Print'],
    ['Ctrl+Z', 'Undo'],
    ['Ctrl+Y', 'Redo'],
    ['Ctrl+X', 'Cut'],
    ['Ctrl+C', 'Copy'],
    ['Ctrl+V', 'Paste'],
    ['Ctrl+A', 'Select all'],
    ['Ctrl+F', 'Find'],
    ['Ctrl+H', 'Replace'],
    ['Ctrl+B', 'Bold'],
    ['Ctrl+I', 'Italic'],
    ['Ctrl+U', 'Underline'],
    ['Ctrl+Shift+L', 'Bulleted list'],
    ['Ctrl+E', 'Center align'],
    ['Ctrl+L', 'Left align'],
    ['Ctrl+R', 'Right align'],
    ['Ctrl+J', 'Justify'],
    ['Ctrl+Shift+>', 'Increase font size'],
    ['Ctrl+Shift+<', 'Decrease font size'],
    ['Ctrl+Shift+N', 'Normal style'],
    ['Ctrl+1', 'Single line spacing'],
    ['Ctrl+2', 'Double line spacing'],
    ['Ctrl+5', '1.5 line spacing'],
    ['Ctrl+Home', 'Go to start'],
    ['Ctrl+End', 'Go to end'],
    ['Ctrl+/', 'Show shortcuts help'],
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-100 relative" role="main" aria-label="Document editor main area">
      {/* Main Editor Container (scrollable paper) */}
      <div className={`flex-1 overflow-auto ${ui.showNavigationPane ? 'ml-64' : ''}`} style={{ maxHeight: 'calc(100vh - 96px)', marginTop: '48px', marginBottom: '48px' }}>
        <div className="max-w-4xl mx-auto px-6 pb-8 flex flex-col items-center">
          {/* Render each page as a separate div */}
          {safePages.map((pageContent, idx) => (
            <div
              key={idx}
              className="page-container bg-white border border-gray-200 min-h-[1122px] mb-12 relative rounded-lg flex flex-col"
              style={{ height: `${PAGE_HEIGHT_PX}px`, width: `${PAGE_WIDTH_PX}px`, backgroundColor: pageColor }}
              onDragOver={idx === 0 ? handleDragOver : undefined}
              onDragLeave={idx === 0 ? handleDragLeave : undefined}
              onDrop={idx === 0 ? handleDrop : undefined}
            >
              {/* Page break indicator for all but the first page */}
              {idx > 0 && (
                <div className="absolute -top-6 left-0 w-full flex items-center justify-center z-20">
                  <div className="page-break-indicator w-full max-w-md" />
                </div>
              )}
              {/* Visual margin guide */}
              <div
                className="absolute z-10 border-2 border-dashed border-blue-200 pointer-events-none"
                style={{
                  top: `${PAGE_MARGINS}px`,
                  left: `${PAGE_MARGINS}px`,
                  right: `${PAGE_MARGINS}px`,
                  bottom: `${PAGE_MARGINS + 32}px`, // leave space for page number
                }}
                aria-hidden="true"
              />
              <div
                ref={idx === 0 ? editorRef : undefined}
                id={idx === 0 ? 'editor-main' : undefined}
                className={`editor-content outline-none min-h-[800px] relative z-20 ${isDragging ? 'ring-4 ring-blue-400' : ''}`}
                style={{ 
                  padding: `${PAGE_MARGINS}px`,
                  boxSizing: 'border-box',
                  minHeight: `${PAGE_HEIGHT_PX - (PAGE_MARGINS * 2) - 32}px`, // leave space for page number
                  maxHeight: `${PAGE_HEIGHT_PX - (PAGE_MARGINS * 2) - 32}px`,
                  overflow: 'auto',
                }}
                contentEditable={idx === 0}
                suppressContentEditableWarning
                spellCheck={true}
                aria-label="Document content editor"
                tabIndex={0}
                autoFocus={idx === 0}
                onInput={idx === 0 ? handleContentChange : undefined}
                onBlur={idx === 0 ? handleContentChange : undefined}
                onKeyDown={idx === 0 ? handleKeyDown : undefined}
                onKeyUp={idx === 0 ? handleSelectionChange : undefined}
                onDragOver={idx === 0 ? handleDragOver : undefined}
                onDragLeave={idx === 0 ? handleDragLeave : undefined}
                onDrop={idx === 0 ? handleDrop : undefined}
                onCopy={idx === 0 ? handleCopy : undefined}
                onPaste={idx === 0 ? handlePaste : undefined}
                data-placeholder="Start writing your document..."
                dangerouslySetInnerHTML={{ __html: idx === 0 ? renderCollaboratorCursors(highlightIssues(pageContent, grammarIssues)) : pageContent }}
              />
              {/* Page number footer */}
              <div className="absolute bottom-0 left-0 w-full text-center text-xs text-gray-400 py-2 z-30 select-none pointer-events-none" aria-hidden="true">
                Page {idx + 1} of {safePages.length}
              </div>
              {/* Placeholder if empty */}
              {idx === 0 && !document.content && (
                <div 
                  className="absolute flex items-center justify-center pointer-events-none select-none"
                  style={{ 
                    left: `${PAGE_MARGINS}px`, 
                    top: `${PAGE_MARGINS}px`, 
                    right: `${PAGE_MARGINS}px`, 
                    bottom: `${PAGE_MARGINS}px` 
                  }}
                >
                  <span className="text-gray-400 text-lg">Start writing your document...</span>
                </div>
              )}
              {isDragging && idx === 0 && (
                <div 
                  className="absolute bg-blue-100 bg-opacity-60 flex items-center justify-center z-50 pointer-events-none animate-fade-in"
                  style={{ 
                    left: `${PAGE_MARGINS}px`, 
                    top: `${PAGE_MARGINS}px`, 
                    right: `${PAGE_MARGINS}px`, 
                    bottom: `${PAGE_MARGINS}px` 
                  }}
                >
                  <span className="text-blue-700 text-lg font-semibold">Drop image or text file here</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Floating Formatting Toolbar */}
      {showToolbar && (
        <div
          style={{ position: 'absolute', top: toolbarPosition.top, left: toolbarPosition.left, zIndex: 50 }}
          className="bg-white border border-gray-200 rounded shadow-lg flex space-x-1 p-1 animate-scale-in"
          role="toolbar"
          aria-label="Formatting toolbar"
        >
          <button title="Bold (Ctrl+B)" onClick={() => handleFormat('bold')} className="p-1 hover:bg-blue-50 rounded" tabIndex={0} aria-label="Bold"><Bold className="w-4 h-4" /></button>
          <button title="Italic (Ctrl+I)" onClick={() => handleFormat('italic')} className="p-1 hover:bg-blue-50 rounded" tabIndex={0} aria-label="Italic"><Italic className="w-4 h-4" /></button>
          <button title="Underline (Ctrl+U)" onClick={() => handleFormat('underline')} className="p-1 hover:bg-blue-50 rounded" tabIndex={0} aria-label="Underline"><Underline className="w-4 h-4" /></button>
          <button title="Align Left" onClick={() => handleAlign('justifyLeft')} className="p-1 hover:bg-blue-50 rounded" tabIndex={0} aria-label="Align Left"><AlignLeft className="w-4 h-4" /></button>
          <button title="Align Center" onClick={() => handleAlign('justifyCenter')} className="p-1 hover:bg-blue-50 rounded" tabIndex={0} aria-label="Align Center"><AlignCenter className="w-4 h-4" /></button>
          <button title="Align Right" onClick={() => handleAlign('justifyRight')} className="p-1 hover:bg-blue-50 rounded" tabIndex={0} aria-label="Align Right"><AlignRight className="w-4 h-4" /></button>
          <button title="Justify" onClick={() => handleAlign('justifyFull')} className="p-1 hover:bg-blue-50 rounded" tabIndex={0} aria-label="Justify"><AlignJustify className="w-4 h-4" /></button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <button 
            title="Insert Page Break (Shift+Enter)" 
            onClick={() => {
              const pageBreak = window.document.createElement('div');
              pageBreak.className = 'page-break';
              pageBreak.style.pageBreakAfter = 'always';
              pageBreak.style.breakAfter = 'page';
              pageBreak.innerHTML = '<br>';
              
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.insertNode(pageBreak);
                range.setStartAfter(pageBreak);
                range.setEndAfter(pageBreak);
                selection.removeAllRanges();
                selection.addRange(range);
                updateContent(editorRef.current?.innerHTML || '');
                notify('Page break inserted');
              }
              setShowToolbar(false);
            }} 
            className="p-1 hover:bg-blue-50 rounded" 
            tabIndex={0} 
            aria-label="Insert Page Break"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      )}

      {showAIButton && (
        <div
          style={{ position: 'absolute', top: aiButtonPosition.top, left: aiButtonPosition.left, zIndex: 50 }}
          className="transition-opacity duration-150"
          role="menu"
          aria-label="AI actions menu"
        >
          <button
            className="bg-blue-600 text-white rounded-full shadow-lg p-2 hover:bg-blue-700 focus:outline-none"
            onClick={() => setShowAIMenu((v) => !v)}
            tabIndex={0}
            aria-label="AI actions"
            title="AI actions for selected text"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#2563eb"/><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#fff">AI</text></svg>
          </button>
          {showAIMenu && (
            <div className="mt-2 bg-white border border-gray-200 rounded shadow-lg p-2 flex flex-col space-y-1 animate-scale-in"
              role="menu"
              aria-label="AI actions submenu"
            >
              <button className="px-3 py-1 text-sm hover:bg-blue-50 rounded" onClick={handleAISummarize} title="Summarize selected text" tabIndex={0} aria-label="Summarize selected text">Summarize</button>
              <button className="px-3 py-1 text-sm hover:bg-blue-50 rounded" onClick={handleAIRewrite} title="Rewrite selected text" tabIndex={0} aria-label="Rewrite selected text">Rewrite</button>
            </div>
          )}
        </div>
      )}

      {/* Floating Add Comment button */}
      {commentPosition !== null && showToolbar && (
        <button
          style={{ position: 'absolute', top: toolbarPosition.top - 36, left: toolbarPosition.left, zIndex: 60 }}
          className="bg-yellow-400 text-black rounded-full shadow-lg p-2 hover:bg-yellow-500 focus:outline-none animate-scale-in"
          onClick={() => setShowCommentModal(true)}
          title="Add comment to selected text"
          aria-label="Add comment"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#facc15"/><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#000">C</text></svg>
        </button>
      )}

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-sm w-full relative animate-scale-in">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowCommentModal(false)}
              aria-label="Close comment modal"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Add Comment</h2>
            <textarea
              className="w-full border border-gray-300 dark:border-gray-700 rounded p-2 mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              rows={3}
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Type your comment..."
              aria-label="Comment text"
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => setShowCommentModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => {
                  if (commentText.trim() && commentPosition !== null) {
                    try {
                      addComment(commentText, commentPosition);
                      notify('Comment added');
                      setShowCommentModal(false);
                      setCommentText('');
                    } catch {
                      notify('Failed to add comment', 'error');
                    }
                  }
                }}
                disabled={!commentText.trim()}
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shortcuts help modal */}
      {showShortcutsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowShortcutsModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4">Keyboard Shortcuts</h2>
            <ul className="space-y-2">
              {shortcutsList.map(([combo, desc]) => (
                <li key={combo} className="flex justify-between text-sm">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">{combo}</span>
                  <span className="text-gray-700">{desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
