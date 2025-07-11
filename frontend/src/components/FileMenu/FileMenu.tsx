import React, { useRef, useState } from 'react';
import { 
  X, FileText, FolderOpen, Save, Download, Upload,
  Printer, Share, Settings, Info, User, HelpCircle, FilePlus, Import, LogOut, Image as ImageIcon
} from 'lucide-react';
import { useDocument } from '../../context/DocumentContext';
import { useNotification } from '../../App';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { useAuthStore } from '../../stores/authStore';

interface FileMenuProps {
  onClose: () => void;
  onNewDocument: () => void;
}

const FileMenu: React.FC<FileMenuProps> = ({ onClose, onNewDocument }) => {
  const { document, updateContent, updateTitle, saveDocument, exportDocument, newDocument, openDocument } = useDocument();
  const { notify } = useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const [showImagesModal, setShowImagesModal] = useState(false);

  // Modal states for settings/help
  const [showAccount, setShowAccount] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const { logout } = useAuthStore();

  // Open file handler
  const handleOpen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      openDocument(file);
      onClose();
    }
  };

  // Import file handler (same as open for now)
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      openDocument(file);
      onClose();
    }
  };

  // Save as .txt
  const handleSave = () => {
    const blob = new Blob([document.content], { type: 'text/plain' });
    saveAs(blob, `${document.title || 'Document'}.txt`);
    saveDocument();
    onClose();
  };

  // Save As (prompt for new name)
  const handleSaveAs = () => {
    const name = prompt('Save as...', document.title);
    if (name) {
      updateTitle(name);
      handleSave();
    }
  };

  // Export as PDF
  const handleExportPDF = async () => {
    const editor = window.document.getElementById('editor-main');
    if (editor) {
      const canvas = await html2canvas(editor as HTMLElement);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`${document.title || 'Document'}.pdf`);
      onClose();
    }
  };

  // Export as DOCX
  const handleExportDocx = async () => {
    // Lazy import to reduce bundle size
    const { Document, Packer, Paragraph } = await import('docx');
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph(document.content.replace(/<[^>]+>/g, '')),
          ],
        },
      ],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${document.title || 'Document'}.docx`);
    onClose();
  };

  // Export as TXT
  const handleExportTxt = () => {
    const blob = new Blob([document.content], { type: 'text/plain' });
    saveAs(blob, `${document.title || 'Document'}.txt`);
    onClose();
  };

  // Recent files from localStorage
  const [recentFiles, setRecentFiles] = useState(() => {
    return JSON.parse(localStorage.getItem('recent-documents') || '[]');
  });

  // Open recent file handler
  const handleOpenRecentFile = (file: any) => {
    openDocument(new File([file.content], file.name, { type: 'text/plain' }));
    // Add to recent (move to top)
    let recents = JSON.parse(localStorage.getItem('recent-documents') || '[]');
    recents = recents.filter((d: any) => d.name !== file.name);
    recents.unshift({ ...file, modified: new Date().toLocaleString() });
    recents = recents.slice(0, 10);
    localStorage.setItem('recent-documents', JSON.stringify(recents));
    setRecentFiles(recents);
    onClose();
  };

  // Update recent files when FileMenu opens
  React.useEffect(() => {
    setRecentFiles(JSON.parse(localStorage.getItem('recent-documents') || '[]'));
  }, []);

  const handleLogout = () => {
    logout();
    onClose();
  };

  const menuItems = [
    { id: 'new', label: 'New', icon: FilePlus, action: () => { newDocument(); onClose(); } },
    { id: 'open', label: 'Open', icon: FolderOpen, action: () => fileInputRef.current?.click() },
    { id: 'save', label: 'Save', icon: Save, action: handleSave },
    { id: 'saveas', label: 'Save As', icon: Save, action: handleSaveAs },
    { id: 'import', label: 'Import', icon: Import, action: () => importInputRef.current?.click() },
    { id: 'export', label: 'Export', icon: Download, action: undefined, submenu: [
      { id: 'export-txt', label: 'Export as TXT', action: handleExportTxt },
      { id: 'export-docx', label: 'Export as DOCX', action: handleExportDocx },
      { id: 'export-pdf', label: 'Export as PDF', action: handleExportPDF },
    ] },
    { id: 'print', label: 'Print', icon: Printer, action: () => window.print() },
    { id: 'account', label: 'Account Settings', icon: User, action: () => setShowAccount(true) },
    { id: 'preferences', label: 'Preferences', icon: Settings, action: () => setShowPreferences(true) },
    { id: 'logout', label: 'Logout', icon: LogOut, action: handleLogout },
    { id: 'images', label: 'Images', icon: ImageIcon, action: () => setShowImagesModal(true) },
    { id: 'help', label: 'Help', icon: HelpCircle, action: () => setShowHelp(true) },
  ];

  const bottomItems = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'options', label: 'Options', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  // Helper to extract images from document content
  const getImagesFromContent = () => {
    if (!document.content) return [];
    const div = window.document.createElement('div');
    div.innerHTML = document.content;
    return Array.from(div.getElementsByTagName('img')).map((img, idx) => {
      const image = img as HTMLImageElement;
      return {
        src: image.src,
        alt: image.alt || `Image ${idx + 1}`
      };
    });
  };

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

        {/* Recent Files Section */}
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-2">Recent Files</h3>
          {recentFiles.length === 0 && <div className="text-gray-200 text-sm">No recent files</div>}
          <div className="space-y-1">
            {recentFiles.map((file: any, idx: number) => (
              <button
                key={file.name + idx}
                onClick={() => handleOpenRecentFile(file)}
                className="w-full flex items-center space-x-2 px-2 py-1 rounded hover:bg-green-700 text-left"
                title={file.name}
              >
                <FileText className="w-4 h-4 text-white opacity-80" />
                <span className="truncate flex-1">{file.name}</span>
                <span className="text-xs text-gray-200">{file.modified}</span>
              </button>
            ))}
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else if (item.submenu) {
                  // Show submenu as a modal or dropdown (not just notification)
                  // For now, do nothing (submenu handled in UI)
                }
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-green-700 rounded-md transition-colors"
              title={item.label}
              aria-label={item.label}
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

        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".txt,.docx,.rtf,.md" onChange={handleOpen} />
        <input type="file" ref={importInputRef} style={{ display: 'none' }} accept=".txt,.docx,.rtf,.md" onChange={handleImport} />
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

        {/* Images Modal */}
        {showImagesModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowImagesModal(false)}
                aria-label="Close images modal"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold mb-4 flex items-center"><ImageIcon className="w-5 h-5 mr-2" />Images in Document</h2>
              <div className="grid grid-cols-2 gap-4 max-h-80 overflow-y-auto">
                {getImagesFromContent().length === 0 ? (
                  <div className="col-span-2 text-gray-500">No images found in this document.</div>
                ) : (
                  getImagesFromContent().map((img, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <img src={img.src} alt={img.alt} className="w-24 h-24 object-contain border rounded mb-2" />
                      <span className="text-xs text-gray-600 truncate max-w-[6rem]">{img.alt}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals for Account, Preferences, Help, Logout */}
      {showAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowAccount(false)}>×</button>
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <p className="text-gray-700">User profile and account settings go here.</p>
          </div>
        </div>
      )}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowPreferences(false)}>×</button>
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>
            <p className="text-gray-700">Editor and app preferences go here.</p>
          </div>
        </div>
      )}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowHelp(false)}>×</button>
            <h2 className="text-xl font-semibold mb-4">Help</h2>
            <p className="text-gray-700">Help and documentation go here.</p>
          </div>
        </div>
      )}
      {showLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowLogout(false)}>×</button>
            <h2 className="text-xl font-semibold mb-4">Logout</h2>
            <p className="text-gray-700">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowLogout(false)}>Cancel</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileMenu;