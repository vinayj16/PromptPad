import React from 'react';

interface DocumentCardProps {
  document: any;
  viewMode: 'grid' | 'list';
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, viewMode }) => (
  <div className={`border rounded-lg p-4 shadow-sm ${viewMode === 'grid' ? '' : 'flex flex-col'}`}>
    <h3 className="font-semibold text-lg mb-2">{document.title}</h3>
    <p className="text-sm text-gray-500 mb-1">Last Modified: {new Date(document.updatedAt).toLocaleDateString()}</p>
    <p className="text-xs text-gray-400">Words: {document.metadata?.wordCount ?? 0}</p>
  </div>
);

export default DocumentCard; 