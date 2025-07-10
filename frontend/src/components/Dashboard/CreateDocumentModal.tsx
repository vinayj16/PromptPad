import React from 'react';

interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateDocumentModal: React.FC<CreateDocumentModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>×</button>
        <h2 className="text-xl font-semibold mb-4">Create New Document</h2>
        <form>
          <input className="w-full border rounded px-3 py-2 mb-4" placeholder="Document Title" />
          <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded" onClick={onClose}>Create</button>
        </form>
      </div>
    </div>
  );
};

export default CreateDocumentModal; 