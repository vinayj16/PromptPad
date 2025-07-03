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

interface RibbonProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onFileMenuOpen?: () => void;
}

const Ribbon: React.FC<RibbonProps> = ({ 
  activeTab, 
  setActiveTab, 
  sidebarOpen, 
  setSidebarOpen,
  onFileMenuOpen
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
  ];

  const renderTabContent = () => {
    if (isCollapsed) return null;

    switch (activeTab) {
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
      default:
        return <HomeTab setSidebarOpen={setSidebarOpen} />;
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Tab Navigation */}
      <div className="flex items-center bg-gray-50 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'file' && onFileMenuOpen) {
                onFileMenuOpen();
              } else {
                setActiveTab(tab.id);
              }
            }}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            } ${tab.color || ''}`}
            title={`Go to ${tab.label} tab`}
            data-tooltip={`Go to ${tab.label} tab`}
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

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default Ribbon;