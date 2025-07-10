import React, { useState } from 'react';
import { 
  CheckCircle, BookOpen, MessageSquare, Users,
  Eye, EyeOff, Lock, Unlock, Shield, 
  Languages, Volume2, Accessibility,
  ChevronDown, Plus, Trash2, ChevronLeft, ChevronRight, MessageCircleIcon
} from 'lucide-react';
import { useCollaboration } from '../../../context/CollaborationContext';

const ReviewTab: React.FC = () => {
  const { 
    trackChanges, 
    toggleTrackChanges, 
    comments, 
    changes,
    acceptChange,
    rejectChange 
  } = useCollaboration();
  
  const [showMarkupDropdown, setShowMarkupDropdown] = useState(false);
  const [showDisplayDropdown, setShowDisplayDropdown] = useState(false);
  const [markupView, setMarkupView] = useState('Simple Markup');
  const [displayMode, setDisplayMode] = useState('All Markup');

  // Modal states for review features
  const [showSpelling, setShowSpelling] = useState(false);
  const [showThesaurus, setShowThesaurus] = useState(false);
  const [showWordCount, setShowWordCount] = useState(false);
  const [showReadAloud, setShowReadAloud] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showTrackChanges, setShowTrackChanges] = useState(false);
  const [showReviewingPane, setShowReviewingPane] = useState(false);
  const [showAccept, setShowAccept] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showCombine, setShowCombine] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);

  const markupOptions = [
    'Simple Markup',
    'All Markup', 
    'No Markup',
    'Original'
  ];

  const displayOptions = [
    'All Markup',
    'Insertions and Deletions',
    'Insertions',
    'Deletions',
    'Comments',
    'Formatting'
  ];

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

  const insertComment = () => {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    if (!range) return;
    const comment = document.createElement('span');
    comment.className = 'comment-marker';
    comment.style.background = '#fffbe6';
    comment.style.border = '1px dotted #fbbf24';
    comment.style.padding = '2px 4px';
    comment.style.margin = '0 2px';
    comment.title = 'Comment: This is a sample comment.';
    comment.innerText = '\ud83d\udde8\ufe0f';
    range.insertNode(comment);
    selection?.removeAllRanges();
  };

  // Add a simple CommentModal if not already imported
  const CommentModal = ({ onClose }: { onClose: () => void }) => {
    const { addComment } = useCollaboration();
    const [text, setText] = useState('');
    const [position, setPosition] = useState(0); // For demo, default to 0

    const handleAdd = () => {
      if (text.trim()) {
        addComment(text, position);
        onClose();
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative animate-scale-in">
          <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>×</button>
          <h2 className="text-lg font-semibold mb-4">Add Comment</h2>
          <textarea
            className="w-full border rounded px-3 py-2 mb-4"
            placeholder="Enter your comment..."
            value={text}
            onChange={e => setText(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end space-x-2">
            <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Cancel</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleAdd} disabled={!text.trim()}>Add Comment</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 py-3 bg-white w-full overflow-x-auto">
      <div className="flex items-center space-x-6 min-w-max">
        {/* Proofing Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowSpelling(true)}
              title="Spelling & Grammar"
              aria-label="Spelling & Grammar"
            >
              <CheckCircle className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Spelling & Grammar</span>
            </button>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowThesaurus(true)}
              title="Thesaurus"
              aria-label="Thesaurus"
            >
              <BookOpen className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Thesaurus</span>
            </button>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowWordCount(true)}
              title="Word Count"
              aria-label="Word Count"
            >
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">\ud83d\udcca</span>
              </div>
              <span className="text-xs">Word Count</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Proofing</span>
        </div>

        {/* Speech Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowReadAloud(true)}
              title="Read Aloud"
              aria-label="Read Aloud"
            >
              <Volume2 className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Read Aloud</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Speech</span>
        </div>

        {/* Accessibility Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowAccessibility(true)}
              title="Check Accessibility"
              aria-label="Check Accessibility"
            >
              <Accessibility className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Check Accessibility</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Accessibility</span>
        </div>

        {/* Language Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowTranslate(true)}
              title="Translate"
              aria-label="Translate"
            >
              <Languages className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Translate</span>
            </button>
            <div className="relative group">
              <button
                className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
                onClick={() => setShowLanguage(true)}
                title="Language"
                aria-label="Language"
              >
                <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                  <span className="text-sm">🌐</span>
                </div>
                <span className="text-xs">Language</span>
              </button>
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-t-lg">Set Proofing Language</button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-b-lg">Language Preferences</button>
              </div>
            </div>
          </div>
          <span className="text-xs text-gray-500">Language</span>
        </div>

        {/* Comments Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={insertComment}
              title="New Comment"
              aria-label="New Comment"
            >
              <MessageSquare className="w-6 h-6 text-gray-700" />
              <span className="text-xs">New Comment</span>
            </button>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowComments(true)}
              title="Delete"
              aria-label="Delete"
            >
              <Trash2 className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Delete</span>
            </button>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              title="Previous"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Previous</span>
            </button>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              title="Next"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Next</span>
            </button>
            <div className="relative group">
              <button
                className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
                onClick={() => setShowComments(true)}
                title="Show Comments"
                aria-label="Show Comments"
              >
                <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                  <span className="text-sm">💬</span>
                </div>
                <span className="text-xs">Show Comments</span>
              </button>
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-t-lg">Show All Comments</button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100">Hide All Comments</button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-b-lg">Show Comments by Author</button>
              </div>
            </div>
          </div>
          <span className="text-xs text-gray-500">Comments</span>
        </div>

        {/* Tracking Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleTrackChanges}
              className={`flex flex-col items-center p-2 rounded-md transition-colors ${
                trackChanges ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
              title="Track Changes"
              aria-label="Track Changes"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-sm">📝</span>
              </div>
              <span className="text-xs">Track Changes</span>
            </button>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowTrackChanges(true)}
              title="Display for Review"
              aria-label="Display for Review"
            >
              <Eye className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Display for Review</span>
            </button>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowReviewingPane(true)}
              title="Reviewing Pane"
              aria-label="Reviewing Pane"
            >
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">📊</span>
              </div>
              <span className="text-xs">Reviewing Pane</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Tracking</span>
        </div>

        {/* Changes Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <div className="relative group">
              <button
                className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
                onClick={() => setShowAccept(true)}
                title="Accept"
                aria-label="Accept"
              >
                <div className="flex items-center space-x-1">
                  <div className="w-5 h-5 flex items-center justify-center text-green-600">
                    <span className="text-sm">✅</span>
                  </div>
                  <ChevronDown className="w-3 h-3" />
                </div>
                <span className="text-xs">Accept</span>
              </button>
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-t-lg">Accept and Move to Next</button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100">Accept Change</button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-b-lg">Accept All Changes</button>
              </div>
            </div>
            <div className="relative group">
              <button
                className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
                onClick={() => setShowReject(true)}
                title="Reject"
                aria-label="Reject"
              >
                <div className="flex items-center space-x-1">
                  <div className="w-5 h-5 flex items-center justify-center text-red-600">
                    <span className="text-sm">❌</span>
                  </div>
                  <ChevronDown className="w-3 h-3" />
                </div>
                <span className="text-xs">Reject</span>
              </button>
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-t-lg">Reject and Move to Next</button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100">Reject Change</button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-b-lg">Reject All Changes</button>
              </div>
            </div>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              title="Previous"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Previous</span>
            </button>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              title="Next"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Next</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Changes</span>
        </div>

        {/* Compare Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowCompare(true)}
              title="Compare"
              aria-label="Compare"
            >
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">🔍</span>
              </div>
              <span className="text-xs">Compare</span>
            </button>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowCombine(true)}
              title="Combine"
              aria-label="Combine"
            >
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">🔗</span>
              </div>
              <span className="text-xs">Combine</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Compare</span>
        </div>

        {/* Protect Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              title="Restrict Editing"
              aria-label="Restrict Editing"
            >
              <Shield className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Restrict Editing</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Protect</span>
        </div>

        {/* Ink Section */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-2">
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              title="Linked Notes"
              aria-label="Linked Notes"
            >
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">🖊️</span>
              </div>
              <span className="text-xs">Linked Notes</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">OneNote</span>
        </div>
      </div>
      {/* Modals for Review features */}
      <Modal show={showSpelling} onClose={() => setShowSpelling(false)} title="Spelling & Grammar">
        <p className="text-gray-700 text-sm">Check spelling and grammar in your document. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showThesaurus} onClose={() => setShowThesaurus(false)} title="Thesaurus">
        <p className="text-gray-700 text-sm">Find synonyms and related words. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showWordCount} onClose={() => setShowWordCount(false)} title="Word Count">
        <p className="text-gray-700 text-sm">View the word, character, and page count. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showReadAloud} onClose={() => setShowReadAloud(false)} title="Read Aloud">
        <p className="text-gray-700 text-sm">Read the document aloud. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showAccessibility} onClose={() => setShowAccessibility(false)} title="Check Accessibility">
        <p className="text-gray-700 text-sm">Check your document for accessibility issues. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showTranslate} onClose={() => setShowTranslate(false)} title="Translate">
        <p className="text-gray-700 text-sm">Translate your document or selection. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showLanguage} onClose={() => setShowLanguage(false)} title="Language">
        <p className="text-gray-700 text-sm">Set proofing language and language preferences. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showComments} onClose={() => setShowComments(false)} title="Comments">
        <p className="text-gray-700 text-sm">Manage, show, or hide comments. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showTrackChanges} onClose={() => setShowTrackChanges(false)} title="Track Changes">
        <p className="text-gray-700 text-sm">Track changes made to your document. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showReviewingPane} onClose={() => setShowReviewingPane(false)} title="Reviewing Pane">
        <p className="text-gray-700 text-sm">View all tracked changes and comments. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showAccept} onClose={() => setShowAccept(false)} title="Accept Changes">
        <p className="text-gray-700 text-sm">Accept changes in your document. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showReject} onClose={() => setShowReject(false)} title="Reject Changes">
        <p className="text-gray-700 text-sm">Reject changes in your document. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showCompare} onClose={() => setShowCompare(false)} title="Compare Documents">
        <p className="text-gray-700 text-sm">Compare two documents for differences. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showCombine} onClose={() => setShowCombine(false)} title="Combine Documents">
        <p className="text-gray-700 text-sm">Combine changes from multiple documents. (Feature coming soon.)</p>
      </Modal>
      {showCommentModal && (
        <CommentModal onClose={() => setShowCommentModal(false)} />
      )}
    </div>
  );
};

export default ReviewTab;