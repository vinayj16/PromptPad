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

  const handleTemplateSelect = (templateId: string) => {
    if (templateId === 'blank') {
      newDocument();
    } else {
      // Load template content
      newDocument();
    }
    onClose();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      openDocument(file);
      onClose();
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
          <h2 className="text-xl text-gray-300 mb-6">New</h2>
          
          {/* Search */}
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

          {/* Templates */}
          <div className="grid grid-cols-6 gap-4 mb-8">
            {templates.slice(0, 6).map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className="group flex flex-col items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="w-16 h-20 bg-white rounded mb-3 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                  <template.icon className="w-8 h-8 text-blue-600" />
                </div>
                <span className="text-sm text-center">{template.name}</span>
              </button>
            ))}
          </div>

          <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1">
            <span>More templates</span>
            <span>→</span>
          </button>
        </div>

        {/* Recent Documents */}
        <div>
          <div className="flex space-x-6 mb-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  activeCategory === category.id
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span>{category.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-400 px-4 py-2">
              <span>Name</span>
              <span></span>
              <span>Date modified</span>
            </div>
            {recentDocuments.map((doc, index) => (
              <button
                key={index}
                onClick={() => onClose()}
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

        {/* Hidden file input */}
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".doc,.docx,.txt,.rtf"
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
};

export default StartScreen;