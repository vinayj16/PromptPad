import React, { useRef } from 'react';
import { 
  X, FileText, FolderOpen, Save, Download, Upload,
  Printer, Share, Settings, Info, User, HelpCircle
} from 'lucide-react';
import { useDocument } from '../../context/DocumentContext';
import { useNotification } from '../../App';

interface FileMenuProps {
  onClose: () => void;
  onNewDocument: () => void;
}

const FileMenu: React.FC<FileMenuProps> = ({ onClose, onNewDocument }) => {
  const { document, saveDocument, exportDocument, updateContent, updateTitle } = useDocument();
  const { notify } = useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          updateContent(event.target?.result as string);
          updateTitle(file.name.replace(/\.[^/.]+$/, ""));
          notify('File opened successfully');
          onClose();
        };
        reader.onerror = () => {
          notify('Failed to open file', 'error');
        };
        reader.readAsText(file);
      } catch {
        notify('Failed to open file', 'error');
      }
    }
  };

  const handleSave = () => {
    try {
      const blob = new Blob([document.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${document.title || 'Document'}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      notify('File saved successfully');
    } catch {
      notify('Failed to save file', 'error');
    }
  };

  const handleSaveAs = () => {
    const filename = prompt('Save as...', document.title || 'Document');
    if (filename) {
      try {
        const blob = new Blob([document.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = `${filename}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        notify('File saved successfully');
      } catch {
        notify('Failed to save file', 'error');
      }
    }
  };

  const menuItems = [
    { id: 'new', label: 'New', icon: FileText, action: onNewDocument },
    { id: 'open', label: 'Open', icon: FolderOpen, action: handleOpen },
    { id: 'save', label: 'Save', icon: Save, action: handleSave },
    { id: 'saveas', label: 'Save As', icon: Save, action: handleSaveAs },
    { id: 'print', label: 'Print', icon: Printer, action: () => window.print() },
    { id: 'share', label: 'Share', icon: Share, action: () => alert('Share is not yet implemented.') },
    { id: 'export', label: 'Export', icon: Download, action: () => exportDocument('pdf') },
    { id: 'close', label: 'Close', icon: X, action: onClose },
  ];

  const bottomItems = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'options', label: 'Options', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-green-600 text-white p-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold">File</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-green-700 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-green-700 rounded-md transition-colors"
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8">
          {bottomItems.map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-green-700 rounded-md transition-colors"
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".txt,.docx,.md,.rtf"
          onChange={handleFileChange}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white p-8">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Recent Documents</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {/* Recent documents would be listed here */}
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-3 mb-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-medium">{document.title}</span>
              </div>
              <p className="text-sm text-gray-500">
                Modified: {document.lastModified.toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Info</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Title:</span>
                <p className="text-gray-600">{document.title}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Word Count:</span>
                <p className="text-gray-600">{document.wordCount}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Character Count:</span>
                <p className="text-gray-600">{document.characterCount}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Pages:</span>
                <p className="text-gray-600">{document.pageCount}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Last Modified:</span>
                <p className="text-gray-600">{document.lastModified.toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Auto Save:</span>
                <p className="text-gray-600">{document.autoSave ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileMenu;