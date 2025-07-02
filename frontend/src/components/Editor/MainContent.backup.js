import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { useDocument } from '../../context/DocumentContext';
import { useTheme } from '@mui/material/styles';

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
    alignment,
    setAlignment
  } = useDocument();
  
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);
  const lastSavePointRef = useRef('');

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content || '';
      updateCounts();
      lastSavePointRef.current = content || '';
    }
  }, [content]);

  // Update word and character counts
  const updateCounts = useCallback(() => {
    if (!editorRef.current) return;
    
    const text = editorRef.current.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    
    setWordCount(words);
    setCharCount(chars);
    
    return { words, chars };
  }, [setWordCount, setCharCount]);

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
  
  const handleCompositionEnd = useCallback((e) => {
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
      sx={{
        flex: 1,
        p: 3,
        outline: 'none',
        overflowY: 'auto',
        minHeight: '100%',
        '&:focus': {
          outline: 'none',
        },
        '&:empty:before': {
          content: '"Start typing..."',
          color: 'text.disabled',
          pointerEvents: 'none',
          display: 'block',
        },
        '& *': {
          margin: 0,
          padding: 0,
          lineHeight: 1.5,
        },
        '& h1, & h2, & h3, & h4, & h5, & h6': {
          margin: '1.5em 0 0.5em 0',
          lineHeight: 1.2,
        },
        '& h1': { fontSize: '2em' },
        '& h2': { fontSize: '1.5em' },
        '& h3': { fontSize: '1.17em' },
        '& p': {
          margin: '0.5em 0',
          minHeight: '1.2em',
        },
        '& ul, & ol': {
          margin: '0.5em 0',
          paddingLeft: '2em',
        },
        '& blockquote': {
          borderLeft: `4px solid ${theme.palette.divider}`,
          margin: '0.5em 0',
          paddingLeft: '1em',
          color: 'text.secondary',
        },
        '& pre, & code': {
          fontFamily: 'monospace',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          padding: '0.2em 0.4em',
          borderRadius: 3,
          fontSize: '0.9em',
        },
        '& pre': {
          padding: '1em',
          overflowX: 'auto',
        },
        '& table': {
          borderCollapse: 'collapse',
          width: '100%',
          margin: '0.5em 0',
          '& th, & td': {
            border: `1px solid ${theme.palette.divider}`,
            padding: '0.5em',
            textAlign: 'left',
          },
          '& th': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            fontWeight: 'bold',
          },
        },
        '& img': {
          maxWidth: '100%',
          height: 'auto',
          borderRadius: theme.shape.borderRadius,
        },
        '& a': {
          color: theme.palette.primary.main,
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      }}
    />
    
    {/* Status Bar */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: 0.5,
        borderTop: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.default,
        color: 'text.secondary',
        fontSize: '0.75rem',
        '& > *': {
          mr: 2,
          display: 'flex',
          alignItems: 'center',
        },
  };

  // Get word and character counts for the status bar
  const { words: wordCount, chars: charCount } = updateCounts();

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        flex: 1,
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      {/* Editor Container */}
      <Box
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleClick}
        sx={{
          flex: 1,
          p: 3,
          outline: 'none',
          overflowY: 'auto',
          minHeight: '100%',
          '&:focus': {
            outline: 'none',
          },
          '&:empty:before': {
            content: '"Start typing..."',
            color: 'text.disabled',
            pointerEvents: 'none',
            display: 'block',
          },
          '& *': {
            margin: 0,
            padding: 0,
            lineHeight: 1.5,
          },
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            margin: '1.5em 0 0.5em 0',
            lineHeight: 1.2,
          },
          '& h1': { fontSize: '2em' },
          '& h2': { fontSize: '1.5em' },
          '& h3': { fontSize: '1.17em' },
          '& p': {
            margin: '0.5em 0',
            minHeight: '1.2em',
          },
          '& ul, & ol': {
            margin: '0.5em 0',
            paddingLeft: '2em',
          },
          '& blockquote': {
            borderLeft: `4px solid ${theme.palette.divider}`,
            margin: '0.5em 0',
            paddingLeft: '1em',
            color: 'text.secondary',
          },
          '& pre, & code': {
            fontFamily: 'monospace',
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            padding: '0.2em 0.4em',
            borderRadius: 3,
            fontSize: '0.9em',
          },
          '& pre': {
            padding: '1em',
            overflowX: 'auto',
          },
          '& table': {
            borderCollapse: 'collapse',
            width: '100%',
            margin: '0.5em 0',
            '& th, & td': {
              border: `1px solid ${theme.palette.divider}`,
              padding: '0.5em',
              textAlign: 'left',
            },
            '& th': {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              fontWeight: 'bold',
            },
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: theme.shape.borderRadius,
          },
          '& a': {
            color: theme.palette.primary.main,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          },
        }}
      />
      
      {/* Status Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 0.5,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.default,
          color: 'text.secondary',
          fontSize: '0.75rem',
          '& > *': {
            mr: 2,
            display: 'flex',
            alignItems: 'center',
          },
        }}
      >
        <Box>
          <Typography variant="caption">
            {wordCount} words • {charCount} characters
          </Typography>
        </Box>
        <Box sx={{ ml: 'auto' }}>
          <Typography variant="caption">
            {isFocused ? 'Editing' : 'Ready'}
          </Typography>
        </Box>
      </Box>
        p: 3,
        backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
        color: mode === 'dark' ? '#e0e0e0' : '#333333',
        transition: 'background-color 0.3s, color 0.3s',
      }}
    >
      <Box
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          outline: 'none',
          minHeight: 'calc(100% - 40px)',
          padding: '20px',
          backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
          borderRadius: '4px',
          border: isFocused 
            ? `2px solid ${mode === 'dark' ? '#90caf9' : '#1976d2'}`
            : `1px solid ${mode === 'dark' ? '#333' : '#e0e0e0'}`,
          boxShadow: isFocused ? '0 0 0 2px rgba(25, 118, 210, 0.2)' : 'none',
          transition: 'border 0.2s, box-shadow 0.2s',
        }}
        data-placeholder="Start typing here..."
      />
    </Box>
  );
};

export default MainContent;
