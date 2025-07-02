import { useEffect, useCallback } from 'react';

export const useKeyboardShortcuts = ({
  onSave,
  onNewDocument,
  onUndo,
  onRedo,
  onBold,
  onItalic,
  onUnderline,
  onFind,
  onPrint,
  disabled = false
}) => {
  const handleKeyDown = useCallback((event) => {
    // Ignore if typing in an input field or textarea
    if (
      event.target.tagName === 'INPUT' ||
      event.target.tagName === 'TEXTAREA' ||
      event.target.isContentEditable
    ) {
      return;
    }

    // Check for Ctrl/Cmd + key combinations
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case 's':
          event.preventDefault();
          if (onSave) onSave();
          break;
        case 'n':
          event.preventDefault();
          if (onNewDocument) onNewDocument();
          break;
        case 'z':
          event.preventDefault();
          if (event.shiftKey) {
            if (onRedo) onRedo();
          } else {
            if (onUndo) onUndo();
          }
          break;
        case 'y':
          event.preventDefault();
          if (onRedo) onRedo();
          break;
        case 'b':
          event.preventDefault();
          if (onBold) onBold();
          break;
        case 'i':
          event.preventDefault();
          if (onItalic) onItalic();
          break;
        case 'u':
          event.preventDefault();
          if (onUnderline) onUnderline();
          break;
        case 'f':
          event.preventDefault();
          if (onFind) onFind();
          break;
        case 'p':
          event.preventDefault();
          if (onPrint) onPrint();
          break;
        default:
          break;
      }
    }
  }, [onSave, onNewDocument, onUndo, onRedo, onBold, onItalic, onUnderline, onFind, onPrint]);

  useEffect(() => {
    if (disabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, disabled]);

  return null;
};

export default useKeyboardShortcuts;
