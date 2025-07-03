import React from 'react';
import { X, Sparkles, FileText, Bot, Wand2 } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 rounded-lg p-2">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome to AI Word Processor</h1>
              <p className="text-blue-100 mt-1">Microsoft Word meets ChatGPT</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Rich Text Editing</h3>
              </div>
              <p className="text-sm text-blue-700">
                Full-featured word processor with formatting, tables, images, and more.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Bot className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">AI Assistant</h3>
              </div>
              <p className="text-sm text-purple-700">
                Chat with AI, get writing suggestions, and improve your documents.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Wand2 className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Smart Tools</h3>
              </div>
              <p className="text-sm text-green-700">
                Summarize, rewrite, expand, and simplify text with AI-powered tools.
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-orange-900">Writing Insights</h3>
              </div>
              <p className="text-sm text-orange-700">
                Get readability scores, tone analysis, and improvement suggestions.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Getting Started</h3>
            <ol className="text-sm text-gray-700 space-y-1">
              <li>1. Start typing in the editor to create your document</li>
              <li>2. Use the ribbon toolbar for formatting and features</li>
              <li>3. Click the AI Assistant button to open the sidebar</li>
              <li>4. Select text and use AI tools to enhance your writing</li>
              <li>5. Save and export your documents when ready</li>
            </ol>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;