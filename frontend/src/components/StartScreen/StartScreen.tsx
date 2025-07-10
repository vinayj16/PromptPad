import React, { useState } from 'react';
import { 
  FileText, Search, Clock, Star, Download, Upload, 
  Plus, Grid3X3, BookOpen, Briefcase, GraduationCap,
  Calendar, Mail, Award, Users, Presentation
} from 'lucide-react';
import { useDocument } from '../../context/DocumentContext';

interface StartScreenProps {
  onClose: () => void;
  onShowTemplates: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onClose, onShowTemplates }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'recent' | 'templates' | 'local'>('recent');
  const [activeCategory, setActiveCategory] = useState('recent');
  const { newDocument, openDocument } = useDocument();

  const templates = [
    { id: 'blank', name: 'Blank document', icon: FileText, category: 'basic' },
    { id: 'resume', name: 'Bold modern resume', icon: Briefcase, category: 'professional' },
    { id: 'letter', name: 'Business letter', icon: Mail, category: 'professional' },
    { id: 'report', name: 'Modern chronological resume', icon: BookOpen, category: 'academic' },
    { id: 'calendar', name: 'Snapshot calendar', icon: Calendar, category: 'personal' },
    { id: 'presentation', name: 'Table of contents', icon: Presentation, category: 'academic' },
    { id: 'newsletter', name: 'Newsletter', icon: Grid3X3, category: 'marketing' },
    { id: 'invoice', name: 'Invoice', icon: Award, category: 'business' },
    { id: 'agenda', name: 'Meeting agenda', icon: Users, category: 'business' },
    { id: 'thesis', name: 'Academic thesis', icon: GraduationCap, category: 'academic' },
  ];

  const recentDocuments = [
    { name: 'ai-pbl-report[1].docx', location: 'Downloads', modified: 'Just now' },
    { name: 'AI-PBL (2).docx', location: 'Downloads', modified: '17 February' },
    { name: '228R1A05G5.docx', location: 'Downloads', modified: '14 February' },
    { name: 'virtual lab title page (2) 1.docx', location: 'Documents', modified: '14 February' },
    { name: 'Unit-I PHP notes.doc', location: 'Desktop > WT', modified: '13 February' },
    { name: 'PHP Functions.docx', location: 'Desktop > WT', modified: '13 February' },
  ];

  const categories = [
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'pinned', label: 'Pinned', icon: Star },
    { id: 'shared', label: 'Shared with Me', icon: Users },
  ];

  // Helper: Add to recent documents in localStorage
  const addToRecent = (doc: { name: string; content: string; location?: string }) => {
    let recents = JSON.parse(localStorage.getItem('recent-documents') || '[]');
    // Remove any existing entry with the same name
    recents = recents.filter((d: any) => d.name !== doc.name);
    // Add new doc to top
    recents.unshift({
      name: doc.name,
      content: doc.content,
      location: doc.location || 'Local',
      modified: new Date().toLocaleString(),
    });
    // Limit to 10
    recents = recents.slice(0, 10);
    localStorage.setItem('recent-documents', JSON.stringify(recents));
  };

  // Helper: Open recent document (simulate localStorage for now)
  const handleOpenRecent = (doc: { name: string; location: string; modified: string }) => {
    const savedDocs = JSON.parse(localStorage.getItem('recent-documents') || '[]');
    const found = savedDocs.find((d: any) => d.name === doc.name);
    if (found) {
      openDocument(new File([found.content], found.name, { type: 'text/plain' }));
      addToRecent({ name: found.name, content: found.content, location: found.location });
      console.log('Opened recent document:', found.name);
    } else {
      openDocument(new File([''], doc.name, { type: 'text/plain' }));
      addToRecent({ name: doc.name, content: '', location: doc.location });
      console.log('Opened fallback recent document:', doc.name);
    }
    onClose();
  };

  // Helper: Open template (simulate static for now)
  const handleOpenTemplate = (templateId: string) => {
    if (templateId === 'blank') {
      newDocument();
      addToRecent({ name: 'Blank document', content: '', location: 'Templates' });
      console.log('Opened blank template');
    } else {
      const templateContent = `This is a ${templateId} template.`;
      openDocument(new File([templateContent], `${templateId}.docx`, { type: 'text/plain' }));
      addToRecent({ name: `${templateId}.docx`, content: templateContent, location: 'Templates' });
      console.log('Opened template:', templateId);
    }
    onClose();
  };

  // Update recentDocuments from localStorage
  const [recentDocumentsState, setRecentDocumentsState] = useState(recentDocuments);
  React.useEffect(() => {
    const recents = JSON.parse(localStorage.getItem('recent-documents') || '[]');
    setRecentDocumentsState(recents.length > 0 ? recents : recentDocuments);
  }, []);

  // When a file is uploaded locally, add to recent
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        openDocument(new File([content], file.name, { type: 'text/plain' }));
        addToRecent({ name: file.name, content, location: 'Local' });
        console.log('Opened local file:', file.name);
        onClose();
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-4 flex flex-col">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <span className="font-semibold">Word</span>
        </div>

        <nav className="space-y-2 flex-1">
          <button className="w-full flex items-center space-x-3 px-3 py-2 bg-blue-600 rounded-md">
            <FileText className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md">
            <Plus className="w-4 h-4" />
            <span>New</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md">
            <Upload className="w-4 h-4" />
            <span>Open</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md">
            <Users className="w-4 h-4" />
            <span>Share</span>
          </button>
          <hr className="border-gray-600 my-4" />
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md">
            <Download className="w-4 h-4" />
            <span>Get Add-ins</span>
          </button>
          <div className="mt-auto pt-8">
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md">
              <span>Info</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md">
              <span>Account</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md">
              <span>Options</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light mb-2">Good evening</h1>
          <div className="flex space-x-4 mb-6">
            <button
              className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'recent' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setActiveTab('recent')}
            >
              Recent Documents
            </button>
            <button
              className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'templates' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setActiveTab('templates')}
            >
              Templates
            </button>
            <button
              className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'local' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setActiveTab('local')}
            >
              Local Files
            </button>
          </div>

          {/* Search bar remains */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tab content */}
          {activeTab === 'recent' && (
            <div>
              {/* Recent Documents List (from state) */}
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-400 px-4 py-2">
                  <span>Name</span>
                  <span></span>
                  <span>Date modified</span>
                </div>
                {recentDocumentsState.map((doc, index) => (
                  <button
                    key={index}
                    onClick={() => handleOpenRecent(doc)}
                    className="w-full grid grid-cols-3 gap-4 items-center px-4 py-3 hover:bg-gray-800 rounded-md transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span className="text-white">{doc.name}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{doc.location}</span>
                    <span className="text-gray-400 text-sm">{doc.modified}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div>
              {/* Templates List (existing code, expanded) */}
              <div className="grid grid-cols-6 gap-4 mb-8">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleOpenTemplate(template.id)}
                    className="group flex flex-col items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="w-16 h-20 bg-white rounded mb-3 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                      <template.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <span className="text-sm text-center">{template.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'local' && (
            <div className="flex flex-col items-center justify-center py-12">
              <label htmlFor="file-upload" className="cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
                Upload or Open Local File
              </label>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".doc,.docx,.txt,.rtf"
                onChange={handleFileUpload}
              />
              <p className="mt-4 text-gray-400 text-sm">Supported: DOC, DOCX, TXT, RTF</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartScreen;