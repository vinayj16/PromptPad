import React from 'react';

interface WelcomeModalProps {
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
      <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>×</button>
      <h2 className="text-2xl font-bold mb-4">Welcome to PromptPad!</h2>
      <p className="text-gray-700 mb-4">Start creating, editing, and collaborating on documents with AI-powered features.</p>
      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={onClose}>Get Started</button>
    </div>
  </div>
);

export default WelcomeModal; 