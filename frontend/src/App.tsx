import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { DocumentProvider } from './context/DocumentContext';
import { AIProvider } from './context/AIContext';
import { UIProvider, useUI } from './context/UIContext';
import { CollaborationProvider } from './context/CollaborationContext';
import StartScreen from './components/StartScreen/StartScreen';
import TitleBar from './components/TitleBar/TitleBar';
import Ribbon from './components/Ribbon/Ribbon';
import Editor from './components/Editor/Editor';
import AISidebar from './components/Sidebar/AISidebar';
import StatusBar from './components/StatusBar/StatusBar';
import FileMenu from './components/FileMenu/FileMenu';
import WelcomeModal from './components/Modals/WelcomeModal';
import TemplateGallery from './components/Templates/TemplateGallery';
import { useHotkeys } from 'react-hotkeys-hook';
import { CommentsSidebar } from './components/Sidebar/AISidebar';
import { Message as AIMessage } from './components/Sidebar/AISidebar';

// Notification Context
const NotificationContext = createContext<any>(null);
export const useNotification = () => useContext(NotificationContext);

const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<{ id: number; message: string; type?: string }[]>([]);
  const notify = (message: string, type?: string) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 2500);
  };
  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center space-y-2">
        {notifications.map((n) => (
          <div key={n.id} className={`px-6 py-3 rounded shadow-lg bg-white border border-blue-200 text-blue-800 font-medium animate-fade-in ${n.type === 'error' ? 'bg-red-100 text-red-800 border-red-200' : ''}`}>
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

// Dark Mode Effect Component
function DarkModeEffect() {
  const { ui } = useUI();
  React.useEffect(() => {
    if (ui.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [ui.darkMode]);
  return null;
}

function App() {
  const [showStartScreen, setShowStartScreen] = useState(() => {
    // If there is a saved document, skip the start screen
    const savedDoc = localStorage.getItem('document-state');
    return savedDoc ? false : true;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [aiSidebarMessages, setAISidebarMessages] = useState<AIMessage[]>([]);

  // Global keyboard shortcuts
  useHotkeys('ctrl+n', () => setShowStartScreen(true));
  useHotkeys('ctrl+s', () => console.log('Save document'));
  useHotkeys('ctrl+o', () => console.log('Open document'));
  useHotkeys('ctrl+p', () => window.print());
  useHotkeys('f1', () => setShowWelcome(true));
  useHotkeys('ctrl+shift+n', () => setShowTemplates(true));

  // Show welcome modal on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  // Whenever showStartScreen changes, persist it
  useEffect(() => {
    localStorage.setItem('showStartScreen', showStartScreen ? 'true' : 'false');
  }, [showStartScreen]);

  React.useEffect(() => {
    document.title = 'PromptPad';
  }, []);

  const handleAIResult = (result: string, action: string) => {
    setAISidebarMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'ai',
        content: result,
        timestamp: new Date(),
      },
    ]);
    setSidebarOpen(true);
  };

  if (showStartScreen) {
    return (
      <DocumentProvider>
        <AIProvider>
          <UIProvider>
            <CollaborationProvider>
              <DarkModeEffect />
              <StartScreen 
                onClose={() => setShowStartScreen(false)}
                onShowTemplates={() => setShowTemplates(true)}
              />
              {showTemplates && (
                <TemplateGallery 
                  onClose={() => setShowTemplates(false)}
                  onSelectTemplate={(template) => {
                    setShowTemplates(false);
                    setShowStartScreen(false);
                  }}
                />
              )}
            </CollaborationProvider>
          </UIProvider>
        </AIProvider>
      </DocumentProvider>
    );
  }

  return (
    <DocumentProvider>
      <AIProvider>
        <UIProvider>
          <CollaborationProvider>
            <DarkModeEffect />
            <div className="h-screen flex flex-col bg-white overflow-hidden">
              {/* Title Bar (fixed) */}
              <div className="sticky top-0 z-30">
                <TitleBar 
                  onFileClick={() => setFileMenuOpen(true)}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                  onCommentsClick={() => setCommentsOpen((v) => !v)}
                />
                {/* Ribbon Toolbar (fixed below TitleBar) */}
                <Ribbon 
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                  onFileMenuOpen={() => setFileMenuOpen(true)}
                  onAIResult={handleAIResult}
                />
              </div>
              {/* Main Content Area (fills space between header and footer) */}
              <div className="flex-1 flex overflow-hidden relative" style={{ minHeight: 0 }}>
                {/* Editor Area */}
                <div className="flex-1 flex flex-col min-h-0">
                  <Editor />
                </div>
                {/* AI Sidebar */}
                <AISidebar 
                  isOpen={sidebarOpen}
                  onClose={() => setSidebarOpen(false)}
                  injectedMessages={aiSidebarMessages}
                />
                <CommentsSidebar isOpen={commentsOpen} onClose={() => setCommentsOpen(false)} />
              </div>
              {/* Status Bar (fixed at bottom) */}
              <div className="sticky bottom-0 z-30">
                <StatusBar />
              </div>
              {/* File Menu */}
              {fileMenuOpen && (
                <div className="animate-scale-in">
                  <FileMenu 
                    onClose={() => setFileMenuOpen(false)}
                    onNewDocument={() => {
                      setFileMenuOpen(false);
                      setShowStartScreen(true);
                    }}
                  />
                </div>
              )}
              {/* Welcome Modal */}
              {showWelcome && (
                <div className="animate-scale-in">
                  <WelcomeModal onClose={() => setShowWelcome(false)} />
                </div>
              )}
              {/* Template Gallery */}
              {showTemplates && (
                <div className="animate-scale-in">
                  <TemplateGallery 
                    onClose={() => setShowTemplates(false)}
                    onSelectTemplate={(template) => {
                      setShowTemplates(false);
                    }}
                  />
                </div>
              )}
            </div>
          </CollaborationProvider>
        </UIProvider>
      </AIProvider>
    </DocumentProvider>
  );
}

export default function AppWrapper() {
  return (
    <NotificationProvider>
      <App />
    </NotificationProvider>
  );
}