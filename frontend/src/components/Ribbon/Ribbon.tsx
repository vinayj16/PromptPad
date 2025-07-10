import React, { useState } from 'react';
import HomeTab from './tabs/HomeTab';
import InsertTab from './tabs/InsertTab';
import DrawTab from './tabs/DrawTab';
import DesignTab from './tabs/DesignTab';
import LayoutTab from './tabs/LayoutTab';
import ReferencesTab from './tabs/ReferencesTab';
import MailingsTab from './tabs/MailingsTab';
import ReviewTab from './tabs/ReviewTab';
import ViewTab from './tabs/ViewTab';
import HelpTab from './tabs/HelpTab';
import FileTab from './tabs/Filetab';
import FileSidebar from './tabs/Filetab';
import { useAI } from '../../context/AIContext';
import { useDocument } from '../../context/DocumentContext';
import { useNotification } from '../../App';

interface RibbonProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onFileMenuOpen?: () => void;
  onAIResult?: (result: string, action: string) => void;
}

const Ribbon: React.FC<RibbonProps> = ({ 
  activeTab, 
  setActiveTab, 
  sidebarOpen, 
  setSidebarOpen,
  onFileMenuOpen,
  onAIResult
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [fileSidebarOpen, setFileSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const importInputRef = React.useRef<HTMLInputElement>(null);
  const { processText, generateContent, analyzeWriting, checkGrammar, translateText, generateOutline, improveWriting, generateCitations, checkPlagiarism } = useAI();
  const { newDocument, openDocument, saveDocument, exportDocument } = useDocument();
  const { notify } = useNotification();

  const tabs = [
    { id: 'file', label: 'File', color: 'bg-green-600' },
    { id: 'home', label: 'Home' },
    { id: 'insert', label: 'Insert' },
    { id: 'draw', label: 'Draw' },
    { id: 'design', label: 'Design' },
    { id: 'layout', label: 'Layout' },
    { id: 'references', label: 'References' },
    { id: 'mailings', label: 'Mailings' },
    { id: 'review', label: 'Review' },
    { id: 'view', label: 'View' },
    { id: 'help', label: 'Help' },
    { id: 'ai', label: 'AI Tools', color: 'bg-purple-600 text-white' },
  ];

  const handleAIAction = async (action: string) => {
    try {
      const selection = window.getSelection();
      const selectedText = selection && selection.rangeCount > 0 ? selection.toString() : '';
      let result = '';
      switch (action) {
        case 'summarize':
          if (!selectedText) return notify('Select text to summarize.');
          result = await processText(selectedText, 'summarize');
          break;
        case 'rewrite':
          if (!selectedText) return notify('Select text to rewrite.');
          result = await processText(selectedText, 'rewrite');
          break;
        case 'expand':
          if (!selectedText) return notify('Select text to expand.');
          result = await processText(selectedText, 'expand');
          break;
        case 'simplify':
          if (!selectedText) return notify('Select text to simplify.');
          result = await processText(selectedText, 'simplify');
          break;
        case 'formal':
          if (!selectedText) return notify('Select text to make formal.');
          result = await improveWriting(selectedText, 'formal');
          break;
        case 'casual':
          if (!selectedText) return notify('Select text to make casual.');
          result = await improveWriting(selectedText, 'casual');
          break;
        case 'translate-es':
          if (!selectedText) return notify('Select text to translate.');
          result = await translateText(selectedText, 'Spanish');
          break;
        case 'translate-selected':
          if (!selectedText) return notify('Select text to translate.');
          result = await translateText(selectedText, 'Spanish');
          break;
        case 'outline':
          if (!selectedText) return notify('Select text to outline.');
          result = await generateOutline(selectedText);
          break;
        case 'academic':
          if (!selectedText) return notify('Select text to improve for academic style.');
          result = await improveWriting(selectedText, 'academic');
          break;
        case 'citations':
          if (!selectedText) return notify('Select text to generate citations.');
          result = await generateCitations(selectedText, 'APA');
          break;
        case 'plagiarism':
          if (!selectedText) return notify('Select text to check plagiarism.');
          result = JSON.stringify(await checkPlagiarism(selectedText));
          break;
        case 'analyze':
          if (!selectedText) return notify('Select text to analyze.');
          result = JSON.stringify(await analyzeWriting(selectedText));
          break;
        case 'grammar':
          if (!selectedText) return notify('Select text to check grammar.');
          result = JSON.stringify(await checkGrammar(selectedText));
          break;
        default:
          notify('Feature coming soon.');
          return;
      }
      if (onAIResult && result) {
        setSidebarOpen(true);
        onAIResult(result, action);
      } else if (result) {
        notify(result);
      }
    } catch (err) {
      notify('AI action failed.');
    }
  };

  const handleFileSidebarOpen = () => setFileSidebarOpen(true);
  const handleFileSidebarClose = () => setFileSidebarOpen(false);

  const handleNew = () => {
    newDocument();
    notify('New file opened!', 'success');
  };
  const handleOpen = () => {
    fileInputRef.current?.click();
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      openDocument(file);
      notify('File opened!', 'success');
    } else {
      notify('Failed to open file', 'error');
    }
  };
  const handleSave = () => {
    try {
      saveDocument();
      notify('File saved!', 'success');
    } catch {
      notify('Failed to save file', 'error');
    }
  };
  const handleImport = () => {
    importInputRef.current?.click();
  };
  const handleImportInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      openDocument(file);
      notify('File imported!', 'success');
    } else {
      notify('Failed to import file', 'error');
    }
  };
  const handleExport = () => {
    try {
      exportDocument('txt'); // or let user choose format
      notify('File exported!', 'success');
    } catch {
      notify('Failed to export file', 'error');
    }
  };
  const handlePrint = () => { window.print(); };
  const handleAccount = () => { notify('Account page coming soon!', 'info'); };
  const handlePreferences = () => { setShowSettings(true); };
  const handleLogout = () => { notify('Logged out!', 'info'); };
  const handleHelp = () => { notify('Help page coming soon!', 'info'); };
  const handleImages = () => { notify('Images feature coming soon!', 'info'); };

  const renderTabContent = () => {
    if (isCollapsed) return null;

    switch (activeTab) {
      case 'file':
        return <FileSidebar
          isOpen={activeTab === 'file' && fileSidebarOpen}
          onClose={handleFileSidebarClose}
          onNew={handleNew}
          onOpen={handleOpen}
          onSave={handleSave}
          onImport={handleImport}
          onExport={handleExport}
          onPrint={handlePrint}
          onAccount={handleAccount}
          onPreferences={handlePreferences}
          onLogout={handleLogout}
          onHelp={handleHelp}
          onImages={handleImages}
        />;
      case 'home':
        return <HomeTab setSidebarOpen={setSidebarOpen} />;
      case 'insert':
        return <InsertTab />;
      case 'draw':
        return <DrawTab />;
      case 'design':
        return <DesignTab />;
      case 'layout':
        return <LayoutTab />;
      case 'references':
        return <ReferencesTab />;
      case 'mailings':
        return <MailingsTab />;
      case 'review':
        return <ReviewTab />;
      case 'view':
        return <ViewTab />;
      case 'help':
        return <HelpTab />;
      case 'ai':
        return (
          <div className="px-4 py-3 bg-white grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <button onClick={() => handleAIAction('summarize')} title="Summarize" aria-label="Summarize" className="p-3 bg-purple-50 hover:bg-purple-100 rounded">Summarize</button>
            <button onClick={() => handleAIAction('rewrite')} title="Rewrite" aria-label="Rewrite" className="p-3 bg-purple-50 hover:bg-purple-100 rounded">Rewrite</button>
            <button onClick={() => handleAIAction('expand')} title="Expand" aria-label="Expand" className="p-3 bg-purple-50 hover:bg-purple-100 rounded">Expand</button>
            <button onClick={() => handleAIAction('simplify')} title="Simplify" aria-label="Simplify" className="p-3 bg-purple-50 hover:bg-purple-100 rounded">Simplify</button>
            <button onClick={() => handleAIAction('formal')} title="Make Formal" aria-label="Make Formal" className="p-3 bg-purple-50 hover:bg-purple-100 rounded">Make Formal</button>
            <button onClick={() => handleAIAction('casual')} title="Make Casual" aria-label="Make Casual" className="p-3 bg-purple-50 hover:bg-purple-100 rounded">Make Casual</button>
            <button onClick={() => handleAIAction('translate-es')} title="Translate to Spanish" aria-label="Translate to Spanish" className="p-3 bg-purple-50 hover:bg-purple-100 rounded">Translate to Spanish</button>
            <button onClick={() => handleAIAction('translate-selected')} title="Translate Selected Text" aria-label="Translate Selected Text" className="p-3 bg-purple-50 hover:bg-purple-100 rounded">Translate Selected Text</button>
            <button onClick={() => handleAIAction('outline')} title="Generate Outline" aria-label="Generate Outline" className="p-3 bg-purple-50 hover:bg-purple-100 rounded">Generate Outline</button>
            <button onClick={() => handleAIAction('academic')} title="Academic Style" aria-label="Academic Style" className="p-3 bg-purple-50 hover:bg-purple-100 rounded">Academic Style</button>
            <button onClick={() => handleAIAction('citations')} title="APA Citations" aria-label="APA Citations" className="p-3 bg-purple-50 hover:bg-purple-100 rounded">APA Citations</button>
            <button onClick={() => handleAIAction('plagiarism')} title="Check Plagiarism" aria-label="Check Plagiarism" className="p-3 bg-purple-50 hover:bg-purple-100 rounded">Check Plagiarism</button>
            <button onClick={() => handleAIAction('analyze')} title="Analyze Writing" aria-label="Analyze Writing" className="p-3 bg-purple-50 hover:bg-purple-100 rounded">Analyze Writing</button>
            <button onClick={() => handleAIAction('grammar')} title="Grammar Check" aria-label="Grammar Check" className="p-3 bg-purple-50 hover:bg-purple-100 rounded">Grammar Check</button>
          </div>
        );
      default:
        return <HomeTab setSidebarOpen={setSidebarOpen} />;
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Tab Navigation */}
      <div className="flex items-center bg-gray-50 border-b border-gray-200 overflow-x-auto scrollbar-thin whitespace-nowrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'file') {
                setActiveTab('file');
                handleFileSidebarOpen();
              } else {
                setActiveTab(tab.id);
                handleFileSidebarClose();
              }
            }}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === tab.id && tab.id !== 'file'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            } ${tab.color || ''}`}
            title={`Go to ${tab.label} tab`}
            data-tooltip={`Go to ${tab.label} tab`}
            tabIndex={0}
            aria-label={`Go to ${tab.label} tab`}
          >
            {tab.label}
          </button>
        ))}
        
        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto mr-4 p-1 text-gray-400 hover:text-gray-600"
          title={isCollapsed ? 'Expand Ribbon' : 'Collapse Ribbon'}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d={isCollapsed ? "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" : "M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"} clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {/* File Sidebar */}
      <FileSidebar
        isOpen={activeTab === 'file' && fileSidebarOpen}
        onClose={handleFileSidebarClose}
        onNew={handleNew}
        onOpen={handleOpen}
        onSave={handleSave}
        onImport={handleImport}
        onExport={handleExport}
        onPrint={handlePrint}
        onAccount={handleAccount}
        onPreferences={handlePreferences}
        onLogout={handleLogout}
        onHelp={handleHelp}
        onImages={handleImages}
      />
      {/* Hidden file inputs for Open/Import */}
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".txt,.docx,.rtf,.md" onChange={handleFileInput} />
      <input type="file" ref={importInputRef} style={{ display: 'none' }} accept=".txt,.docx,.rtf,.md" onChange={handleImportInput} />
      {/* Settings Modal/Page */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowSettings(false)}>×</button>
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <p className="text-gray-700">Editor and app preferences go here.</p>
          </div>
        </div>
      )}
      {/* Tab Content (except File) */}
      {!fileSidebarOpen && !isCollapsed && renderTabContent()}
    </div>
  );
};

export default Ribbon;