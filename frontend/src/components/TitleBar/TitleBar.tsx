import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, Share, 
  MessageSquare, User as UserIcon, Minimize2, Maximize2, X,
  RotateCcw, RotateCw, Bot, Moon, Sun
} from 'lucide-react';
import { useDocument } from '../../context/DocumentContext';
import { useUI } from '../../context/UIContext';
import { useCollaboration } from '../../context/CollaborationContext';

interface TitleBarProps {
  onFileClick: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onCommentsClick: () => void;
}

const TitleBar: React.FC<TitleBarProps> = ({ onFileClick, sidebarOpen, setSidebarOpen, onCommentsClick }) => {
  const { document: doc, saveDocument } = useDocument();
  const { ui, toggleDarkMode } = useUI();
  const { shareDocument } = useCollaboration();

  // Modal states
  const [showShare, setShowShare] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [sharePerm, setSharePerm] = useState('view');




  // Search logic: highlight and scroll to match in editor
  const handleSearch = () => {
    if (!searchValue.trim()) return;
    const editor = window.document.getElementById('editor-main');
    if (!editor) return;
    const content = editor.innerHTML;
    const regex = new RegExp(searchValue, 'gi');
    const highlighted = content.replace(regex, match => `<mark style="background:yellow;">${match}</mark>`);
    editor.innerHTML = highlighted;
    const firstMark = editor.querySelector('mark');
    if (firstMark) firstMark.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Helper to focus editor and move cursor to end
  const focusEditor = () => {
    const editor = window.document.getElementById('editor-main');
    if (editor) {
      (editor as HTMLElement).focus();
      // Move cursor to end
      const range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
    return editor;
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

  // Comments Modal (replaces 'coming soon')
  const CommentsModal = ({ show, onClose }: { show: boolean; onClose: () => void }) => {
    const { comments, addComment } = useCollaboration();
    const [text, setText] = useState('');
    const [position, setPosition] = useState(0); // For demo, default to 0

    const handleAdd = () => {
      if (text.trim()) {
        addComment(text, position);
        setText('');
      }
    };

    return show ? (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
          <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>×</button>
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          <div className="mb-4 max-h-48 overflow-y-auto space-y-2">
            {comments.length === 0 ? (
              <div className="text-gray-500 text-sm">No comments yet.</div>
            ) : (
              comments.map((c, i) => (
                <div key={c.id || i} className="border-b pb-2 mb-2">
                  <div className="font-medium text-gray-900">{typeof c.author === 'string' ? c.author : (c.author?.name || 'User')}</div>
                  <div className="text-xs text-gray-500">{new Date(c.timestamp).toLocaleString()}</div>
                  <div className="text-gray-700 mt-1">{c.text}</div>
                </div>
              ))
            )}
          </div>
          <textarea
            className="w-full border rounded px-3 py-2 mb-2"
            placeholder="Add a comment..."
            value={text}
            onChange={e => setText(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end space-x-2">
            <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Close</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleAdd} disabled={!text.trim()}>Add Comment</button>
          </div>
        </div>
      </div>
    ) : null;
  };

  // User Profile Modal (replaces 'coming soon')
  const UserProfileModal = ({ show, onClose }: { show: boolean; onClose: () => void }) => {
    // For demo, use local state; in production, use auth context/store
    const [name, setName] = useState('Vinay');
    const [email, setEmail] = useState('user@example.com');

    const handleLogout = () => {
      // For demo, just alert; in production, call logout from auth store
      alert('Logged out!');
      onClose();
    };

    return show ? (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
          <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>×</button>
          <h2 className="text-xl font-semibold mb-4">User Profile</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input className="w-full border rounded px-3 py-2 mb-2" value={name} onChange={e => setName(e.target.value)} />
            <label className="block text-sm font-medium mb-1">Email</label>
            <input className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="flex justify-end space-x-2">
            <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Close</button>
            <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    ) : null;
  };

  // Share Modal (improved, real export/email)
  const ShareModal = ({ show, onClose, link }: { show: boolean; onClose: () => void; link: string }) => {
    const { document } = useDocument();
    const handleExportPDF = () => {
      import('jspdf').then(jsPDFModule => {
        const docPDF = new jsPDFModule.jsPDF();
        docPDF.text(document.content.replace(/<[^>]+>/g, ''), 10, 10);
        docPDF.save(`${document.title}.pdf`);
      });
    };
    const handleEmail = () => {
      window.location.href = `mailto:?subject=Shared Document: ${document.title}&body=Check out this document: ${encodeURIComponent(link)}`;
    };
    return show ? (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
          <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>×</button>
          <h2 className="text-xl font-semibold mb-4">Share</h2>
          <div className="space-y-2">
            <button className="w-full bg-blue-600 text-white px-3 py-1 rounded" onClick={() => {navigator.clipboard.writeText(link); window.dispatchEvent(new CustomEvent('notify', { detail: 'Link copied!' }));}}>Copy Link</button>
            <button className="w-full bg-gray-100 px-3 py-1 rounded" onClick={handleExportPDF}>Export as PDF</button>
            <button className="w-full bg-gray-100 px-3 py-1 rounded" onClick={handleEmail}>Share via Email</button>
          </div>
        </div>
      </div>
    ) : null;
  };

  return (
    <div className="bg-gray-800 text-white flex items-center justify-between px-4 py-2 text-sm">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <span className="font-medium">PromptPad</span>
        </div>
        
        <span className="text-gray-400">|</span>
        
        <div className="flex items-center space-x-2">
          <span className="text-gray-300">{doc.title}</span>
          {'isModified' in doc && doc.isModified && <span className="text-yellow-400">•</span>}
          <span className="text-gray-500">- Saved to this PC</span>
        </div>
      </div>



      {/* Right Section */}
      <div className="flex items-center space-x-2">
        {/* Search */}
        <div className="relative flex items-center">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="pl-7 pr-3 py-1 bg-gray-700 border border-gray-600 rounded text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-32"
          />
          <button onClick={handleSearch} className="ml-1 p-1 text-gray-300 hover:text-white">Go</button>
        </div>

        {/* Dark Mode Toggle */}
        <button
          className="p-2 hover:bg-gray-700 rounded-md transition-colors"
          onClick={toggleDarkMode}
          title="Toggle dark mode"
        >
          {ui.darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Comments Sidebar Toggle */}
        <button
          className="p-2 hover:bg-gray-700 rounded-md transition-colors"
          onClick={onCommentsClick}
          title="Show comments sidebar"
          aria-label="Show comments sidebar"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* Share Button */}
        <button
          className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          onClick={() => {
            setShareLink(shareDocument(sharePerm));
            setShowShareModal(true);
          }}
          title="Share document"
          aria-label="Share document"
        >
          <Share className="w-3 h-3" />
          <span className="text-xs">Share</span>
        </button>

        {/* AI Assistant */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`p-2 rounded-md transition-colors ${
            sidebarOpen ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
          }`}
          title="AI Assistant"
        >
          <Bot className="w-4 h-4" />
        </button>

        {/* User */}
        <button className="p-2 hover:bg-gray-700 rounded-md transition-colors" onClick={() => setShowUser(true)} title="User profile">
          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-white" />
          </div>
        </button>

        {/* Window Controls */}
        <div className="flex items-center ml-4">
          <button className="p-2 hover:bg-gray-700 rounded-md transition-colors" onClick={() => alert('Minimize not available in browser.') } title="Minimize window">
            <Minimize2 className="w-3 h-3" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-md transition-colors" onClick={() => alert('Maximize not available in browser.') } title="Maximize window">
            <Maximize2 className="w-3 h-3" />
          </button>
          <button className="p-2 hover:bg-red-600 rounded-md transition-colors" onClick={() => alert('Close not available in browser.') } title="Close window">
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <ShareModal show={showShare} onClose={() => setShowShare(false)} link={window.location.href} />
      <CommentsModal show={showComments} onClose={() => setShowComments(false)} />
      <UserProfileModal show={showUser} onClose={() => setShowUser(false)} />
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-sm w-full relative animate-scale-in">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowShareModal(false)}
              aria-label="Close share modal"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Share Document</h2>
            <label className="block mb-2 text-gray-700 dark:text-gray-200 font-medium">Permissions:</label>
            <select
              className="w-full border border-gray-300 dark:border-gray-700 rounded p-2 mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={sharePerm}
              onChange={e => setSharePerm(e.target.value)}
              aria-label="Share permissions"
            >
              <option value="view">View only</option>
              <option value="comment">Comment</option>
              <option value="edit">Edit</option>
            </select>
            <label className="block mb-2 text-gray-700 dark:text-gray-200 font-medium">Share Link:</label>
            <div className="flex items-center space-x-2 mb-4">
              <input
                className="flex-1 border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                value={shareLink}
                readOnly
                aria-label="Share link"
              />
              <button
                className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                onClick={() => { navigator.clipboard.writeText(shareLink); alert('Link copied!'); }}
                aria-label="Copy share link"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TitleBar;