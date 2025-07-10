import React, { useState } from 'react';
import { 
  Eye, Layout, Grid, Ruler, Navigation, ZoomIn, ZoomOut, 
  Maximize, Minimize, Split, Columns, AppWindow as Window,
  BookOpen, FileText, List, Volume2, Headphones
} from 'lucide-react';
import { useUI } from '../../../context/UIContext';

const ViewTab: React.FC = () => {
  const { ui, setViewMode, setZoom, toggleRuler, toggleGridlines, toggleNavigationPane } = useUI();
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  // Modal states for view features
  const [showOnePage, setShowOnePage] = useState(false);
  const [showMultiplePages, setShowMultiplePages] = useState(false);
  const [showPageWidth, setShowPageWidth] = useState(false);
  const [showNewWindow, setShowNewWindow] = useState(false);
  const [showArrangeAll, setShowArrangeAll] = useState(false);
  const [showSplit, setShowSplit] = useState(false);
  const [showSideBySide, setShowSideBySide] = useState(false);
  const [showSyncScroll, setShowSyncScroll] = useState(false);

  // Example: Add a ViewModeModal for changing view modes
  const [showViewModeModal, setShowViewModeModal] = useState(false);

  const viewModes = [
    { id: 'read', label: 'Read Mode', icon: BookOpen },
    { id: 'print', label: 'Print Layout', icon: Layout },
    { id: 'web', label: 'Web Layout', icon: Eye },
    { id: 'outline', label: 'Outline', icon: List },
    { id: 'draft', label: 'Draft', icon: FileText },
  ];

  const zoomLevels = [50, 75, 100, 125, 150, 200];

  const pageMovementOptions = [
    { id: 'vertical', name: 'Vertical', icon: '↕️' },
    { id: 'side-to-side', name: 'Side to Side', icon: '↔️' }
  ];

  // Generic Modal
  const Modal = ({ show, onClose, title, children }: any) =>
    show ? (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            ×
          </button>
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          {children}
        </div>
      </div>
    ) : null;

  // Add a simple ViewModeModal if not already imported
  const ViewModeModal = ({ onClose }: { onClose: () => void }) => {
    const { ui, setViewMode } = useUI();
    const [mode, setMode] = useState(ui.viewMode);

    const handleApply = () => {
      setViewMode(mode);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs relative animate-scale-in">
          <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>×</button>
          <h2 className="text-lg font-semibold mb-4">Change View Mode</h2>
          <div className="mb-3 flex flex-col space-y-2">
            <label className="flex items-center space-x-2">
              <input type="radio" name="viewmode" value="print" checked={mode === 'print'} onChange={() => setMode('print')} />
              <span>Print Layout</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="viewmode" value="web" checked={mode === 'web'} onChange={() => setMode('web')} />
              <span>Web Layout</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="viewmode" value="outline" checked={mode === 'outline'} onChange={() => setMode('outline')} />
              <span>Outline</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="viewmode" value="draft" checked={mode === 'draft'} onChange={() => setMode('draft')} />
              <span>Draft</span>
            </label>
          </div>
          <div className="flex justify-end space-x-2">
            <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Cancel</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleApply}>Apply</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 py-3 bg-white w-full overflow-x-auto">
      <div className="flex items-center space-x-6 min-w-max">
        {/* Views Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            {viewModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={`flex flex-col items-center p-2 rounded-md transition-colors ${
                  ui.viewMode === mode.id 
                    ? 'bg-blue-100 border-2 border-blue-500' 
                    : 'hover:bg-gray-100 border-2 border-transparent'
                }`}
                title={mode.label}
                aria-label={mode.label}
              >
                <mode.icon className="w-6 h-6 text-gray-700" />
                <span className="text-xs">{mode.label}</span>
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-500">Views</span>
        </div>

        {/* Immersive Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setFocusMode(!focusMode)}
              className={`flex flex-col items-center p-2 rounded-md transition-colors ${
                focusMode ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-sm">🎯</span>
              </div>
              <span className="text-xs">Focus</span>
            </button>
            <button 
              onClick={() => setImmersiveMode(!immersiveMode)}
              className={`flex flex-col items-center p-2 rounded-md transition-colors ${
                immersiveMode ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <Headphones className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Immersive Reader</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Immersive</span>
        </div>

        {/* Page Movement Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            {pageMovementOptions.map(option => (
              <button
                key={option.id}
                className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
                title={option.name}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-lg">{option.icon}</span>
                </div>
                <span className="text-xs">{option.name}</span>
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-500">Page Movement</span>
        </div>

        {/* Show Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleRuler}
              className={`flex flex-col items-center p-2 rounded-md transition-colors ${
                ui.showRuler ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <Ruler className="w-6 h-6" />
              <span className="text-xs">Ruler</span>
            </button>
            <button 
              onClick={toggleGridlines}
              className={`flex flex-col items-center p-2 rounded-md transition-colors ${
                ui.showGridlines ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <Grid className="w-6 h-6" />
              <span className="text-xs">Gridlines</span>
            </button>
            <button 
              onClick={toggleNavigationPane}
              className={`flex flex-col items-center p-2 rounded-md transition-colors ${
                ui.showNavigationPane ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <Navigation className="w-6 h-6" />
              <span className="text-xs">Navigation Pane</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Show</span>
        </div>

        {/* Zoom Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setZoom(Math.max(10, ui.zoom - 10))}
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
            >
              <ZoomOut className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Zoom Out</span>
            </button>
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500">{ui.zoom}%</span>
                <input
                  type="range"
                  min="10"
                  max="500"
                  value={ui.zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <span className="text-xs mt-1">Zoom</span>
            </div>
            <button 
              onClick={() => setZoom(Math.min(500, ui.zoom + 10))}
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
            >
              <ZoomIn className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Zoom In</span>
            </button>
            <button 
              onClick={() => setZoom(100)}
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
            >
              <Maximize className="w-6 h-6 text-gray-700" />
              <span className="text-xs">100%</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowOnePage(true)}>
              <Eye className="w-6 h-6 text-gray-700" />
              <span className="text-xs">One Page</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowMultiplePages(true)}>
              <Columns className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Multiple Pages</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowPageWidth(true)}>
              <Window className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Page Width</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Zoom</span>
        </div>

        {/* Window Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowNewWindow(true)}>
              <Window className="w-6 h-6 text-gray-700" />
              <span className="text-xs">New Window</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowArrangeAll(true)}>
              <Split className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Arrange All</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowSplit(true)}>
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">  </span>
              </div>
              <span className="text-xs">Split</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowSideBySide(true)}>
              <Columns className="w-6 h-6 text-gray-700" />
              <span className="text-xs">View Side by Side</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowSyncScroll(true)}>
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">🔄</span>
              </div>
              <span className="text-xs">Synchronous Scrolling</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Window</span>
        </div>

        {/* Macros Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
            <div className="w-6 h-6 flex items-center justify-center text-gray-700">
              <span className="text-sm">⚡</span>
            </div>
            <span className="text-xs">Macros</span>
          </button>
          <span className="text-xs text-gray-500">Macros</span>
        </div>

        {/* SharePoint Section */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-2">
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">📊</span>
              </div>
              <span className="text-xs">Edit Document</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">SharePoint</span>
        </div>
      </div>
      {/* Modals for View features */}
      <Modal show={showOnePage} onClose={() => setShowOnePage(false)} title="One Page View">
        <p className="text-gray-700 text-sm">Shows a single page at a time. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showMultiplePages} onClose={() => setShowMultiplePages(false)} title="Multiple Pages View">
        <p className="text-gray-700 text-sm">Shows multiple pages side by side. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showPageWidth} onClose={() => setShowPageWidth(false)} title="Page Width View">
        <p className="text-gray-700 text-sm">Fits the page to the width of the window. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showNewWindow} onClose={() => setShowNewWindow(false)} title="New Window">
        <p className="text-gray-700 text-sm">Opens the document in a new window. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showArrangeAll} onClose={() => setShowArrangeAll(false)} title="Arrange All">
        <p className="text-gray-700 text-sm">Arranges all open windows side by side. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showSplit} onClose={() => setShowSplit(false)} title="Split View">
        <p className="text-gray-700 text-sm">Splits the window into two panes. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showSideBySide} onClose={() => setShowSideBySide(false)} title="View Side by Side">
        <p className="text-gray-700 text-sm">View two documents side by side. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showSyncScroll} onClose={() => setShowSyncScroll(false)} title="Synchronous Scrolling">
        <p className="text-gray-700 text-sm">Scroll both documents at the same time. (Feature coming soon.)</p>
      </Modal>
      {/* Example: Add a ViewModeModal for changing view modes */}
      {showViewModeModal && (
        <ViewModeModal onClose={() => setShowViewModeModal(false)} />
      )}
    </div>
  );
};

export default ViewTab;