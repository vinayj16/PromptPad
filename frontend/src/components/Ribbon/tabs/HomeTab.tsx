import React, { useState } from 'react';
import { Save, FileText, Plus, Upload, Download, Clipboard, Scissors, Copy, Bold, Italic, Underline, Strikethrough, Subscript, Superscript, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Indent, Outdent, Weight as LineHeight, Palette, Highlighter, Type, ChevronDown, Bot, SearchIcon } from 'lucide-react';
import { useDocument } from '../../../context/DocumentContext';

interface HomeTabProps {
  setSidebarOpen: (open: boolean) => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ setSidebarOpen }) => {
  const { document, saveDocument, newDocument, exportDocument } = useDocument();

  const [showStyleModal, setShowStyleModal] = useState<string | null>(null);
  const [showFindModal, setShowFindModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);

  const formatText = (command: string, value?: string) => {
    window.document.execCommand(command, false, value);
    focusEditor();
    notify(`Applied: ${command}`);
  };

  const fontSizes = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24', '26', '28', '36', '48', '72'];
  const fontFamilies = ['Calibri', 'Arial', 'Times New Roman', 'Helvetica', 'Georgia', 'Verdana', 'Tahoma'];

  // Map style names to tag and optional style
  const styleMap: Record<string, { tag: string, style?: string }> = {
    'Normal': { tag: 'P' },
    'Body Text': { tag: 'P' },
    'List Paragraph': { tag: 'P' },
    'No Spacing': { tag: 'P', style: 'margin:0;padding:0;' },
    'Table Paragraph': { tag: 'P', style: 'padding:2px 4px;' },
  };

  const applyStyle = () => {
    if (!showStyleModal) return;
    const style = styleMap[showStyleModal];
    if (style) {
      window.document.execCommand('formatBlock', false, style.tag);
      // If style requires inline style, apply it to the selection
      if (style.style) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          let el = range.startContainer.parentElement;
          if (el && el.tagName === style.tag) {
            el.setAttribute('style', style.style);
          }
        }
      }
    }
    setShowStyleModal(null);
  };

  // Generic Modal
  const Modal = ({ show, onClose, title, children }: any) =>
    show ? (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            ×
          </button>
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          {children}
        </div>
      </div>
    ) : null;

  const focusEditor = () => {
    const editor = window.document.getElementById('editor-main');
    if (editor) (editor as HTMLElement).focus();
  };

  const notify = (msg: string) => window.dispatchEvent(new CustomEvent('notify', { detail: msg }));

  // Add a generic handler for unimplemented features
  const comingSoon = (feature: string) => notify(`${feature} coming soon.`);

  // Add a simple FindReplaceModal if not already imported
  const FindReplaceModal = ({ onClose }: { onClose: () => void }) => {
    const { document, updateContent } = useDocument();
    const [find, setFind] = useState('');
    const [replace, setReplace] = useState('');
    const [count, setCount] = useState(0);

    const handleFind = () => {
      if (!find) return;
      const regex = new RegExp(find, 'gi');
      const matches = document.content.match(regex);
      setCount(matches ? matches.length : 0);
    };

    const handleReplace = () => {
      if (!find) return;
      const regex = new RegExp(find, 'gi');
      const newContent = document.content.replace(regex, replace);
      updateContent(newContent);
      setCount(0);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative animate-scale-in">
          <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>×</button>
          <h2 className="text-lg font-semibold mb-4">Find and Replace</h2>
          <div className="mb-3">
            <input
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Find..."
              value={find}
              onChange={e => setFind(e.target.value)}
              onBlur={handleFind}
            />
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Replace with..."
              value={replace}
              onChange={e => setReplace(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Matches: {count}</span>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleReplace} disabled={!find}>Replace All</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 py-3 bg-white">
      <div className="flex items-center space-x-6">
        {/* Clipboard Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => { formatText('cut'); notify('Cut'); }}
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md group"
              title="Cut (Ctrl+X)"
            >
              <Scissors className="w-4 h-4 text-gray-600" />
            </button>
            <button 
              onClick={() => { formatText('copy'); notify('Copied'); }}
              className="p-1 hover:bg-gray-100 rounded"
              title="Copy (Ctrl+C)"
            >
              <Copy className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => { formatText('cut'); notify('Cut'); }}
              className="p-1 hover:bg-gray-100 rounded"
              title="Cut (Ctrl+X)"
            >
              <Scissors className="w-4 h-4 text-gray-600" />
            </button>
            <button 
              onClick={() => { formatText('copy'); notify('Copied'); }}
              className="p-1 hover:bg-gray-100 rounded"
              title="Copy (Ctrl+C)"
            >
              <Copy className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <span className="text-xs text-gray-500">Clipboard</span>
        </div>

        {/* Font Section */}
        <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <select 
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={(e) => formatText('fontName', e.target.value)}
            >
              {fontFamilies.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
            <select 
              className="px-2 py-1 border border-gray-300 rounded text-sm w-16 focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={(e) => formatText('fontSize', e.target.value)}
            >
              {fontSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => formatText('bold')}
              className="p-1 hover:bg-gray-100 rounded border border-gray-300"
              title="Bold (Ctrl+B)"
              aria-label="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button 
              onClick={() => formatText('italic')}
              className="p-1 hover:bg-gray-100 rounded border border-gray-300"
              title="Italic (Ctrl+I)"
              aria-label="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button 
              onClick={() => formatText('underline')}
              className="p-1 hover:bg-gray-100 rounded border border-gray-300"
              title="Underline (Ctrl+U)"
              aria-label="Underline (Ctrl+U)"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button 
              onClick={() => formatText('strikeThrough')}
              className="p-1 hover:bg-gray-100 rounded border border-gray-300"
              title="Strikethrough"
              aria-label="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
            <button 
              onClick={() => formatText('subscript')}
              className="p-1 hover:bg-gray-100 rounded border border-gray-300"
              title="Subscript"
              aria-label="Subscript"
            >
              <Subscript className="w-4 h-4" />
            </button>
            <button 
              onClick={() => formatText('superscript')}
              className="p-1 hover:bg-gray-100 rounded border border-gray-300"
              title="Superscript"
              aria-label="Superscript"
            >
              <Superscript className="w-4 h-4" />
            </button>
            <div className="flex flex-col">
              <button 
                onClick={() => formatText('foreColor', '#000000')}
                className="p-1 hover:bg-gray-100 rounded border border-gray-300"
                title="Font Color"
                aria-label="Font Color"
              >
                <Type className="w-4 h-4" />
              </button>
              <button 
                onClick={() => formatText('hiliteColor', '#ffff00')}
                className="p-1 hover:bg-gray-100 rounded border border-gray-300"
                title="Highlight"
                aria-label="Highlight"
              >
                <Highlighter className="w-4 h-4" />
              </button>
            </div>
          </div>
          <span className="text-xs text-gray-500">Font</span>
        </div>

        {/* Paragraph Section */}
        <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => formatText('insertUnorderedList')}
              className="p-1 hover:bg-gray-100 rounded border border-gray-300"
              title="Bullets"
              aria-label="Bullets"
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => formatText('insertOrderedList')}
              className="p-1 hover:bg-gray-100 rounded border border-gray-300"
              title="Numbering"
              aria-label="Numbering"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button 
              onClick={() => formatText('outdent')}
              className="p-1 hover:bg-gray-100 rounded border border-gray-300"
              title="Decrease Indent"
              aria-label="Decrease Indent"
            >
              <Outdent className="w-4 h-4" />
            </button>
            <button 
              onClick={() => formatText('indent')}
              className="p-1 hover:bg-gray-100 rounded border border-gray-300"
              title="Increase Indent"
              aria-label="Increase Indent"
            >
              <Indent className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => formatText('justifyLeft')}
              className="p-1 hover:bg-gray-100 rounded border border-gray-300"
              title="Align Left"
              aria-label="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => formatText('justifyCenter')}
              className="p-1 hover:bg-gray-100 rounded border border-gray-300"
              title="Center"
              aria-label="Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button 
              onClick={() => formatText('justifyRight')}
              className="p-1 hover:bg-gray-100 rounded border border-gray-300"
              title="Align Right"
              aria-label="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => formatText('justifyFull')}
              className="p-1 hover:bg-gray-100 rounded border border-gray-300"
              title="Justify"
              aria-label="Justify"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
            <button 
              className="p-1 hover:bg-gray-100 rounded border border-gray-300"
              title="Line Spacing"
              aria-label="Line Spacing"
            >
              <LineHeight className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs text-gray-500">Paragraph</span>
        </div>

        {/* Styles Section */}
        <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100" onClick={() => setShowStyleModal('Normal')}>
                Normal
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100" onClick={() => setShowStyleModal('Body Text')}>
                Body Text
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100" onClick={() => setShowStyleModal('List Paragraph')}>
                List Paragraph
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100" onClick={() => setShowStyleModal('No Spacing')}>
                No Spacing
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100" onClick={() => setShowStyleModal('Table Paragraph')}>
                Table Paragraph
              </button>
            </div>
          </div>
          <span className="text-xs text-gray-500">Styles</span>
        </div>

        {/* Editing Section */}
        <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-1">
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowFindModal(true)}>
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-sm">🔍</span>
              </div>
              <span className="text-xs">Find</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowReplaceModal(true)}>
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-sm">↔️</span>
              </div>
              <span className="text-xs">Replace</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowSelectModal(true)}>
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-sm">📝</span>
              </div>
              <span className="text-xs">Select</span>
            </button>
            <button
              className="ribbon-button"
              title="Find and Replace (Ctrl+F)"
              onClick={() => setShowFindReplace(true)}
            >
              <SearchIcon />
              <span>Find/Replace</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Editing</span>
        </div>

        {/* AI Assistant Section */}
        <div className="flex flex-col space-y-2">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center p-2 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200"
          >
            <Bot className="w-6 h-6 text-blue-600" />
            <span className="text-xs text-blue-700">AI Assistant</span>
          </button>
          <span className="text-xs text-gray-500">AI Tools</span>
        </div>
      </div>
      {/* Modals for Styles */}
      <Modal show={!!showStyleModal} onClose={() => setShowStyleModal(null)} title={showStyleModal + ' Style'}>
        <div className="mb-4">
          <div className="border p-3 rounded mb-2">
            <span className="font-semibold">{showStyleModal}</span> preview text.<br />
            <span className="text-xs text-gray-500">(This is a placeholder preview for the {showStyleModal} style.)</span>
          </div>
          <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={applyStyle}>Apply</button>
        </div>
      </Modal>
      {/* Find Modal */}
      <Modal show={showFindModal} onClose={() => setShowFindModal(false)} title="Find">
        <input className="w-full border rounded px-2 py-1 mb-2" placeholder="Find..." />
        <button className="bg-blue-600 text-white px-3 py-1 rounded">Find Next</button>
      </Modal>
      {/* Replace Modal */}
      <Modal show={showReplaceModal} onClose={() => setShowReplaceModal(false)} title="Replace">
        <input className="w-full border rounded px-2 py-1 mb-2" placeholder="Find..." />
        <input className="w-full border rounded px-2 py-1 mb-2" placeholder="Replace with..." />
        <button className="bg-blue-600 text-white px-3 py-1 rounded">Replace</button>
      </Modal>
      {/* Select Modal */}
      <Modal show={showSelectModal} onClose={() => setShowSelectModal(false)} title="Select">
        <div className="space-y-2">
          <button
            className="w-full bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
            onClick={() => {
              const editor = window.document.getElementById('editor-main');
              if (editor) {
                const range = window.document.createRange();
                range.selectNodeContents(editor);
                const sel = window.getSelection();
                sel?.removeAllRanges();
                sel?.addRange(range);
              }
              setShowSelectModal(false);
            }}
          >
            Select All
          </button>
          <button
            className="w-full bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
            onClick={() => {
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
              setShowSelectModal(false);
            }}
          >
            Select Paragraph
          </button>
          <button
            className="w-full bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
            onClick={() => {
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
              setShowSelectModal(false);
            }}
          >
            Select Table
          </button>
        </div>
      </Modal>
      {showFindReplace && (
        <FindReplaceModal onClose={() => setShowFindReplace(false)} />
      )}
    </div>
  );
};

export default HomeTab;