import React from 'react';
import { FileText, FolderOpen, Save, Download, Printer, User, Settings, LogOut, HelpCircle, FilePlus, Import, Image as ImageIcon, X } from 'lucide-react';

interface FileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onImport: () => void;
  onExport: () => void;
  onPrint: () => void;
  onAccount: () => void;
  onPreferences: () => void;
  onLogout: () => void;
  onHelp: () => void;
  onImages: () => void;
}

const FileSidebar: React.FC<FileSidebarProps> = ({
  isOpen,
  onClose,
  onNew,
  onOpen,
  onSave,
  onImport,
  onExport,
  onPrint,
  onAccount,
  onPreferences,
  onLogout,
  onHelp,
  onImages,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-40" onClick={onClose} />
      {/* Sidebar */}
      <aside className="relative w-72 bg-white shadow-lg h-full flex flex-col p-6 animate-slide-in-left z-50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold">File</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded" aria-label="Close sidebar">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          <button className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50" onClick={onNew}><FilePlus className="w-5 h-5 text-blue-600" /><span>New</span></button>
          <button className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50" onClick={onOpen}><FolderOpen className="w-5 h-5 text-blue-600" /><span>Open</span></button>
          <button className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50" onClick={onSave}><Save className="w-5 h-5 text-blue-600" /><span>Save</span></button>
          <button className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50" onClick={onImport}><Import className="w-5 h-5 text-blue-600" /><span>Import</span></button>
          <button className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50" onClick={onExport}><Download className="w-5 h-5 text-blue-600" /><span>Export</span></button>
          <button className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50" onClick={onPrint}><Printer className="w-5 h-5 text-blue-600" /><span>Print</span></button>
          <button className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50" onClick={onAccount}><User className="w-5 h-5 text-blue-600" /><span>Account</span></button>
          <button className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50" onClick={onPreferences}><Settings className="w-5 h-5 text-blue-600" /><span>Preferences</span></button>
          <button className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50" onClick={onLogout}><LogOut className="w-5 h-5 text-blue-600" /><span>Logout</span></button>
          <button className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50" onClick={onHelp}><HelpCircle className="w-5 h-5 text-blue-600" /><span>Help</span></button>
          <button className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50" onClick={onImages}><ImageIcon className="w-5 h-5 text-blue-600" /><span>Images</span></button>
        </nav>
      </aside>
    </div>
  );
};

export default FileSidebar;
