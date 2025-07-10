import React, { useState } from 'react';
import { 
  HelpCircle, MessageSquare, Phone, Mail,
  BookOpen, Video, Users, Settings
} from 'lucide-react';

const HelpTab: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showTraining, setShowTraining] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showRate, setShowRate] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Helper for generic modal
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

  // Add a simple HelpModal if not already imported
  const HelpModal = ({ onClose }: { onClose: () => void }) => {
    const [feedback, setFeedback] = useState('');
    const handleSend = () => {
      // For demo, just close and show a notification
      onClose();
      window.dispatchEvent(new CustomEvent('notify', { detail: 'Thank you for your feedback!' }));
    };
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-scale-in">
          <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>×</button>
          <h2 className="text-lg font-semibold mb-4">Help & Feedback</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm mb-4">
            <li>Use the Ribbon tabs to access editing, design, and review features.</li>
            <li>Keyboard shortcuts are available for all major actions (press Ctrl+/ for a list).</li>
            <li>For support, visit our <a href="https://support.promptpad.com" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Support Center</a>.</li>
          </ul>
          <textarea
            className="w-full border rounded px-3 py-2 mb-4"
            placeholder="Send us your feedback..."
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end space-x-2">
            <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Close</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleSend} disabled={!feedback.trim()}>Send Feedback</button>
          </div>
          <div className="mt-4 text-xs text-gray-500">PromptPad v2.0.0 &copy; 2024</div>
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 py-3 bg-white">
      <div className="flex items-center space-x-6">
        {/* Help Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button
              className="ribbon-button"
              title="Help & Feedback"
              onClick={() => setShowHelpModal(true)}
            >
              <HelpCircle className="w-6 h-6 text-gray-700" />
              <span>Help</span>
            </button>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowTraining(true)}
              title="Show Training"
              aria-label="Show Training"
            >
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">💡</span>
              </div>
              <span className="text-xs">Show Training</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Help</span>
        </div>

        {/* Support Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowSupport(true)}
              title="Contact Support"
              aria-label="Contact Support"
            >
              <MessageSquare className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Contact Support</span>
            </button>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => window.open('https://community.example.com', '_blank')}
              title="Community"
              aria-label="Community"
            >
              <Users className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Community</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Support</span>
        </div>

        {/* Learning Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => window.open('https://docs.example.com', '_blank')}
              title="Documentation"
              aria-label="Documentation"
            >
              <BookOpen className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Documentation</span>
            </button>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => window.open('https://youtube.com/playlist?list=EXAMPLE', '_blank')}
              title="Video Tutorials"
              aria-label="Video Tutorials"
            >
              <Video className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Video Tutorials</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Learning</span>
        </div>

        {/* Feedback Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowFeedback(true)}
              title="Send Feedback"
              aria-label="Send Feedback"
            >
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">💬</span>
              </div>
              <span className="text-xs">Send Feedback</span>
            </button>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowRate(true)}
              title="Rate App"
              aria-label="Rate App"
            >
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">⭐</span>
              </div>
              <span className="text-xs">Rate App</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Feedback</span>
        </div>

        {/* About Section */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-2">
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowAbout(true)}
              title="About Word"
              aria-label="About Word"
            >
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">ℹ️</span>
              </div>
              <span className="text-xs">About Word</span>
            </button>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowOptions(true)}
              title="Options"
              aria-label="Options"
            >
              <Settings className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Options</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">About</span>
        </div>
      </div>

      {/* Modals */}
      <Modal show={showHelpModal} onClose={() => setShowHelpModal(false)} title="Help & Tips">
        <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
          <li>Use the Ribbon tabs to access editing, design, and review features.</li>
          <li>Insert tables, images, and shapes from the Insert and Draw tabs.</li>
          <li>Change page layout and color from the Layout and Design tabs.</li>
          <li>Use the AI sidebar for writing assistance and suggestions.</li>
          <li>Your work is auto-saved and will persist after reload.</li>
        </ul>
      </Modal>
      <Modal show={showTraining} onClose={() => setShowTraining(false)} title="Training & Shortcuts">
        <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
          <li>Ctrl+S: Save document</li>
          <li>Ctrl+Z / Ctrl+Y: Undo / Redo</li>
          <li>Ctrl+B/I/U: Bold / Italic / Underline</li>
          <li>Use the Insert tab to add tables, images, and more.</li>
        </ul>
      </Modal>
      <Modal show={showSupport} onClose={() => setShowSupport(false)} title="Contact Support">
        <p className="mb-2 text-gray-700 text-sm">For help, email <a href="mailto:support@example.com" className="text-blue-600 underline">support@example.com</a> or fill out the form below:</p>
        <form className="space-y-2">
          <input className="w-full border rounded px-2 py-1" placeholder="Your email" type="email" />
          <textarea className="w-full border rounded px-2 py-1" placeholder="How can we help?" rows={3} />
          <button type="button" className="bg-blue-600 text-white px-3 py-1 rounded">Send</button>
        </form>
      </Modal>
      <Modal show={showFeedback} onClose={() => setShowFeedback(false)} title="Send Feedback">
        <form className="space-y-2">
          <textarea className="w-full border rounded px-2 py-1" placeholder="Your feedback..." rows={3} />
          <button type="button" className="bg-blue-600 text-white px-3 py-1 rounded">Submit</button>
        </form>
      </Modal>
      <Modal show={showRate} onClose={() => setShowRate(false)} title="Rate App">
        <div className="flex space-x-1 mb-2">
          {[1,2,3,4,5].map(n => <span key={n} className="text-2xl cursor-pointer">⭐</span>)}
        </div>
        <p className="text-gray-700 text-sm">Thank you for rating!</p>
      </Modal>
      <Modal show={showAbout} onClose={() => setShowAbout(false)} title="About Word">
        <p className="text-gray-700 text-sm mb-2">Word Processor v1.0.0</p>
        <p className="text-gray-700 text-sm">Created by Your Team. &copy; 2024</p>
      </Modal>
      <Modal show={showOptions} onClose={() => setShowOptions(false)} title="Options">
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" />
            <span className="text-sm text-gray-700">Enable Auto Save</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" />
            <span className="text-sm text-gray-700">Dark Mode</span>
          </label>
        </div>
      </Modal>
      {/* HelpModal is already rendered above as a Modal, so remove this duplicate. */}
    </div>
  );
};

export default HelpTab;