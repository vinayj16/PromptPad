import React, { useState } from 'react';
import { 
  FileText, RotateCcw, RotateCw, Columns, 
  AlignLeft, AlignCenter, AlignRight, 
  Indent, Outdent, ArrowUp, ArrowDown,
  Maximize, Minimize, Grid, Hash, Settings, Layout
} from 'lucide-react';
import { useUI } from '../../../context/UIContext';

const LayoutTab: React.FC = () => {
  const { ui, setPageOrientation, setPageSize, setMargins } = useUI();
  const [showMarginsDropdown, setShowMarginsDropdown] = useState(false);
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);

  // Modal states for layout features
  const [showTheme, setShowTheme] = useState<string | null>(null);
  const [showMargins, setShowMargins] = useState(false);
  const [showOrientation, setShowOrientation] = useState(false);
  const [showSize, setShowSize] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [showBreaks, setShowBreaks] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [showHyphenation, setShowHyphenation] = useState(false);
  const [showParagraph, setShowParagraph] = useState(false);
  const [showPosition, setShowPosition] = useState(false);
  const [showWrapText, setShowWrapText] = useState(false);
  const [showBringForward, setShowBringForward] = useState(false);
  const [showSendBackward, setShowSendBackward] = useState(false);
  const [showAlign, setShowAlign] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [showRotate, setShowRotate] = useState(false);
  const [showPageSettings, setShowPageSettings] = useState(false);
  const [showMarginsModal, setShowMarginsModal] = useState(false);

  const pageSizes = [
    { name: 'Letter', width: '8.5"', height: '11"' },
    { name: 'A4', width: '210mm', height: '297mm' },
    { name: 'A3', width: '297mm', height: '420mm' },
    { name: 'Legal', width: '8.5"', height: '14"' },
    { name: 'Tabloid', width: '11"', height: '17"' }
  ];

  const orientations = [
    { id: 'portrait', name: 'Portrait', icon: '📄' },
    { id: 'landscape', name: 'Landscape', icon: '📃' }
  ];

  const marginPresets = [
    { name: 'Normal', top: 1, bottom: 1, left: 1, right: 1 },
    { name: 'Narrow', top: 0.5, bottom: 0.5, left: 0.5, right: 0.5 },
    { name: 'Moderate', top: 1, bottom: 1, left: 0.75, right: 0.75 },
    { name: 'Wide', top: 1, bottom: 1, left: 2, right: 2 },
    { name: 'Mirrored', top: 1, bottom: 1, left: 1.25, right: 1 }
  ];

  const columnLayouts = [
    { id: 'one', name: 'One', columns: 1, icon: '▌' },
    { id: 'two', name: 'Two', columns: 2, icon: '▌▌' },
    { id: 'three', name: 'Three', columns: 3, icon: '▌▌▌' },
    { id: 'left', name: 'Left', columns: 2, icon: '▌▐' },
    { id: 'right', name: 'Right', columns: 2, icon: '▐▌' }
  ];

  const themes = [
    { name: 'Office', preview: '#1f497d' },
    { name: 'Facet', preview: '#0f6fc6' },
    { name: 'Ion', preview: '#5f8a3a' },
    { name: 'Retrospect', preview: '#8b3a3a' },
    { name: 'Slice', preview: '#d34817' },
    { name: 'Wisp', preview: '#7030a0' },
    { name: 'Aspect', preview: '#d24726' },
    { name: 'Celestial', preview: '#4472c4' }
  ];

  // Add a local Modal implementation for the Page Settings modal.
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

  return (
    <div className="px-4 py-3 bg-white overflow-x-auto">
      <div className="flex items-center space-x-6 flex-wrap">
        {/* Themes Section */}
        <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
          <div className="grid grid-cols-4 gap-1">
            {themes.map((theme, index) => (
              <button
                key={theme.name}
                className="w-12 h-16 border border-gray-300 rounded hover:bg-gray-100 flex flex-col items-center justify-center group relative"
                title={theme.name}
                onClick={() => setShowTheme(theme.name)}
              >
                <div 
                  className="w-8 h-10 rounded"
                  style={{ backgroundColor: theme.preview }}
                />
                <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                  {theme.name}
                </span>
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-500">Themes</span>
        </div>
        {/* Page Setup Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2 flex-wrap">
            {/* Margins */}
            <div className="relative">
              <button 
                onClick={() => setShowMarginsDropdown(v => !v)}
                className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
                title="Margins"
                aria-label="Margins"
              >
                <div className="w-6 h-6 border-2 border-gray-400 relative">
                  <div className="absolute inset-1 border border-gray-300"></div>
                </div>
                <span className="text-xs mt-1">Margins</span>
              </button>
              {showMarginsDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48">
                  {marginPresets.map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        setMargins(preset);
                        setShowMarginsDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-xs text-gray-500">
                        Top: {preset.top}" Bottom: {preset.bottom}" Left: {preset.left}" Right: {preset.right}"
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Orientation */}
            <div className="flex flex-col items-center">
              <div className="flex space-x-1">
                {orientations.map(orientation => (
                  <button
                    key={orientation.id}
                    onClick={() => setPageOrientation(orientation.id as 'portrait' | 'landscape')}
                    className={`p-2 rounded-md transition-colors hover:bg-gray-100 ${ui.pageOrientation === orientation.id ? 'bg-blue-100 border border-blue-400' : ''}`}
                    title={orientation.name}
                  >
                    <span className="text-lg">{orientation.icon}</span>
                  </button>
                ))}
              </div>
              <span className="text-xs mt-1">Orientation</span>
            </div>
            {/* Size */}
            <div className="flex flex-col items-center">
              <select 
                value={ui.pageSize}
                onChange={(e) => setPageSize(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {pageSizes.map(size => (
                  <option key={size.name} value={size.name}>
                    {size.name} ({size.width} × {size.height})
                  </option>
                ))}
              </select>
              <span className="text-xs mt-1">Size</span>
            </div>
            {/* Columns */}
            <div className="relative">
              <button 
                onClick={() => setShowColumns(true)}
                className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              >
                <Columns className="w-6 h-6 text-gray-700" />
                <span className="text-xs mt-1">Columns</span>
              </button>
              {showColumnsDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40">
                  {columnLayouts.map(layout => (
                    <button
                      key={layout.id}
                      onClick={() => setShowColumnsDropdown(false)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg flex items-center space-x-2"
                    >
                      <span className="font-mono text-sm">{layout.icon}</span>
                      <span>{layout.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Breaks */}
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowBreaks(true)}>
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm border-b-2 border-gray-400">---</span>
              </div>
              <span className="text-xs mt-1">Breaks</span>
            </button>
            {/* Line Numbers */}
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowLineNumbers(true)}>
              <Hash className="w-6 h-6 text-gray-700" />
              <span className="text-xs mt-1">Line Numbers</span>
            </button>
            {/* Hyphenation */}
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowHyphenation(true)}>
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">hy-phen</span>
              </div>
              <span className="text-xs mt-1">Hyphenation</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Page Setup</span>
        </div>
        {/* Paragraph Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <button className="w-full flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowParagraph(true)}>
            <span className="text-xs">Open Paragraph Settings</span>
          </button>
          <span className="text-xs text-gray-500">Paragraph</span>
        </div>
        {/* Arrange Section */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-2 flex-wrap">
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowPosition(true)}>
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">📍</span>
              </div>
              <span className="text-xs">Position</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowWrapText(true)}>
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">🔄</span>
              </div>
              <span className="text-xs">Wrap Text</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowBringForward(true)}>
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">⬆️</span>
              </div>
              <span className="text-xs">Bring Forward</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowSendBackward(true)}>
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">⬇️</span>
              </div>
              <span className="text-xs">Send Backward</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowAlign(true)}>
              <AlignLeft className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Align</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowGroup(true)}>
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">🔗</span>
              </div>
              <span className="text-xs">Group</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowRotate(true)}>
              <RotateCw className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Rotate</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Arrange</span>
        </div>
        {/* Page Settings */}
        <button
          className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
          onClick={() => setShowPageSettings(true)}
          title="Page Settings"
          aria-label="Page Settings"
        >
          <Settings className="w-6 h-6 text-gray-700" />
          <span className="text-xs">Page Settings</span>
        </button>
      </div>
      {/* Modals for Layout features */}
      <Modal show={!!showTheme} onClose={() => setShowTheme(null)} title={showTheme ? `${showTheme} Theme` : ''}>
        <p className="text-gray-700 text-sm">Apply the {showTheme} theme. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showColumns} onClose={() => setShowColumns(false)} title="Columns">
        <p className="text-gray-700 text-sm">Set number of columns. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showBreaks} onClose={() => setShowBreaks(false)} title="Breaks">
        <p className="text-gray-700 text-sm">Insert page or section breaks. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showLineNumbers} onClose={() => setShowLineNumbers(false)} title="Line Numbers">
        <p className="text-gray-700 text-sm">Show or hide line numbers. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showHyphenation} onClose={() => setShowHyphenation(false)} title="Hyphenation">
        <p className="text-gray-700 text-sm">Enable or disable hyphenation. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showParagraph} onClose={() => setShowParagraph(false)} title="Paragraph">
        <p className="text-gray-700 text-sm">Adjust paragraph settings. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showPosition} onClose={() => setShowPosition(false)} title="Position">
        <p className="text-gray-700 text-sm">Set object position. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showWrapText} onClose={() => setShowWrapText(false)} title="Wrap Text">
        <p className="text-gray-700 text-sm">Wrap text around objects. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showBringForward} onClose={() => setShowBringForward(false)} title="Bring Forward">
        <p className="text-gray-700 text-sm">Bring object forward. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showSendBackward} onClose={() => setShowSendBackward(false)} title="Send Backward">
        <p className="text-gray-700 text-sm">Send object backward. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showAlign} onClose={() => setShowAlign(false)} title="Align">
        <p className="text-gray-700 text-sm">Align objects. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showGroup} onClose={() => setShowGroup(false)} title="Group">
        <p className="text-gray-700 text-sm">Group objects. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showRotate} onClose={() => setShowRotate(false)} title="Rotate">
        <p className="text-gray-700 text-sm">Rotate objects. (Feature coming soon.)</p>
      </Modal>
      {showPageSettings && (
        <Modal show={showPageSettings} onClose={() => setShowPageSettings(false)} title="Page Settings">
          {/* Margins */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Margins (px)</label>
            <div className="flex space-x-2">
              <input type="number" min="0" placeholder="Top" className="border rounded px-2 py-1 w-16" />
              <input type="number" min="0" placeholder="Bottom" className="border rounded px-2 py-1 w-16" />
              <input type="number" min="0" placeholder="Left" className="border rounded px-2 py-1 w-16" />
              <input type="number" min="0" placeholder="Right" className="border rounded px-2 py-1 w-16" />
            </div>
          </div>
          {/* Orientation */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Orientation</label>
            <select className="border rounded px-2 py-1">
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
          {/* Header/Footer */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Header Content</label>
            <input type="text" className="border rounded px-2 py-1 w-full" placeholder="Header text..." />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Footer Content</label>
            <input type="text" className="border rounded px-2 py-1 w-full" placeholder="Footer text..." />
          </div>
          <div className="flex justify-end space-x-2">
            <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowPageSettings(false)}>Cancel</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setShowPageSettings(false)}>Apply</button>
          </div>
        </Modal>
      )}
      {showMarginsModal && (
        <Modal show={showMarginsModal} onClose={() => setShowMarginsModal(false)} title="Set Margins">
          <div className="mb-4">
            <label className="block font-medium mb-1">Margins (px)</label>
            <div className="flex space-x-2">
              <input type="number" min="0" placeholder="Top" className="border rounded px-2 py-1 w-16" />
              <input type="number" min="0" placeholder="Bottom" className="border rounded px-2 py-1 w-16" />
              <input type="number" min="0" placeholder="Left" className="border rounded px-2 py-1 w-16" />
              <input type="number" min="0" placeholder="Right" className="border rounded px-2 py-1 w-16" />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowMarginsModal(false)}>Cancel</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setShowMarginsModal(false)}>Apply</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LayoutTab;