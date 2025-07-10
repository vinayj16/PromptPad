import React, { useState } from 'react';
import { 
  Palette, Droplets, Type, Image, 
  Layout, Grid, Layers, Eye
} from 'lucide-react';
import { useDocument } from '../../../context/DocumentContext';

const DesignTab: React.FC = () => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pageColor, setPageColor] = useState(() => localStorage.getItem('page-color') || '#ffffff');

  // Modal states for design features
  const [showFormatting, setShowFormatting] = useState<string | null>(null);
  const [showWatermark, setShowWatermark] = useState(false);
  const [showPageColor, setShowPageColor] = useState(false);
  const [showPageBorders, setShowPageBorders] = useState(false);
  const [showTheme, setShowTheme] = useState<string | null>(null);
  const [showColors, setShowColors] = useState(false);
  const [showFonts, setShowFonts] = useState(false);
  const [showEffects, setShowEffects] = useState(false);
  const [showSetDefault, setShowSetDefault] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

  const themes = [
    { name: 'Office', colors: ['#1f497d', '#4f81bd', '#9cbb58', '#f79646'] },
    { name: 'Facet', colors: ['#1f4e79', '#0f6fc6', '#009dd9', '#0bd0d9'] },
    { name: 'Ion', colors: ['#2d5016', '#5f8a3a', '#a4c466', '#d0df00'] },
    { name: 'Retrospect', colors: ['#8b3a3a', '#b85450', '#e8b4b8', '#ebd3c4'] },
    { name: 'Slice', colors: ['#d34817', '#9b2d1f', '#a28b55', '#f5e6a3'] },
  ];

  const documentFormatting = [
    { name: 'Normal', preview: 'Normal', tag: 'p' },
    { name: 'Title', preview: 'TITLE', tag: 'h1' },
    { name: 'Heading 1', preview: 'Heading 1', tag: 'h1' },
    { name: 'Heading 2', preview: 'Heading 2', tag: 'h2' },
    { name: 'Heading 3', preview: 'Heading 3', tag: 'h3' },
    { name: 'Heading 4', preview: 'Heading 4', tag: 'h4' },
    { name: 'Heading 5', preview: 'Heading 5', tag: 'h5' },
    { name: 'Heading 6', preview: 'Heading 6', tag: 'h6' },
    { name: 'Subtitle', preview: 'Subtitle', tag: 'h2' },
  ];

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageColor(e.target.value);
    localStorage.setItem('page-color', e.target.value);
    // Dispatch a custom event so the editor can listen and update
    window.dispatchEvent(new CustomEvent('page-color-change', { detail: e.target.value }));
    setShowColorPicker(false);
  };

  // Generic Modal
  const Modal = ({ show, onClose, title, children }: any) =>
    show ? (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative max-h-[90vh] overflow-y-auto">
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

  // Add a simple ThemeModal if not already imported
  const ThemeModal = ({ onClose }: { onClose: () => void }) => {
    const { updateContent, document } = useDocument();
    const [color, setColor] = useState('#ffffff');

    const handleApply = () => {
      // Wrap content in a div with background color
      const newContent = `<div style='background:${color};padding:1em;'>${document.content}</div>`;
      updateContent(newContent);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs relative animate-scale-in">
          <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>×</button>
          <h2 className="text-lg font-semibold mb-4">Change Page Theme</h2>
          <div className="mb-3 flex space-x-2 items-center">
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-10 border rounded" />
            <span className="ml-2">Pick a color</span>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full" onClick={handleApply}>Apply Theme</button>
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 py-3 bg-white overflow-x-auto">
      <div className="flex items-center space-x-6 flex-wrap">
        {/* Document Formatting Section */}
        <div className="flex flex-col space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-1 overflow-x-auto">
            {documentFormatting.map((format, index) => (
              <button
                key={index}
                className="flex-shrink-0 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                style={{ 
                  fontWeight: format.name.includes('Title') ? 'bold' : 'normal',
                  fontSize: format.name.includes('Heading 1') ? '18px' : 
                           format.name.includes('Heading 2') ? '16px' : 
                           format.name.includes('Heading 3') ? '14px' : '12px'
                }}
                onClick={() => window.document.execCommand('formatBlock', false, format.tag)}
              >
                {format.preview}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-500">Document Formatting</span>
        </div>
        {/* Page Background Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowWatermark(true)}
              title="Watermark"
              aria-label="Watermark"
            >
              <Droplets className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Watermark</span>
            </button>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowPageColor(true)}
              title="Page Color"
              aria-label="Page Color"
            >
              <Palette className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Page Color</span>
            </button>
            {showColorPicker && (
              <input
                type="color"
                value={pageColor}
                onChange={handleColorChange}
                className="ml-2 border rounded"
                style={{ position: 'absolute', zIndex: 50 }}
                autoFocus
                onBlur={() => setShowColorPicker(false)}
              />
            )}
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowPageBorders(true)} title="Page Borders" aria-label="Page Borders">
              <Layout className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Page Borders</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Page Background</span>
        </div>
        {/* Themes Section */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            {themes.map((theme, index) => (
              <button
                key={index}
                className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md group"
                title={theme.name}
                onClick={() => setShowTheme(theme.name)}
              >
                <div className="w-12 h-8 rounded border border-gray-300 overflow-hidden">
                  <div className="flex h-full">
                    {theme.colors.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="flex-1"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs mt-1 group-hover:text-blue-600">{theme.name}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowColors(true)} title="Colors" aria-label="Colors">
              <Palette className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Colors</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowFonts(true)} title="Fonts" aria-label="Fonts">
              <Type className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Fonts</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowEffects(true)} title="Effects" aria-label="Effects">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">✨</span>
              </div>
              <span className="text-xs">Effects</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowSetDefault(true)} title="Set as Default" aria-label="Set as Default">
              <Eye className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Set as Default</span>
            </button>
            <button
              className="ribbon-button"
              title="Change Theme"
              onClick={() => setShowThemeModal(true)}
            >
              <Palette />
              <span>Theme</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Themes</span>
        </div>
      </div>
      {/* Modals for Design features */}
      <Modal show={showWatermark} onClose={() => setShowWatermark(false)} title="Watermark">
        <p className="text-gray-700 text-sm">Add a watermark to your document. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showPageColor} onClose={() => setShowPageColor(false)} title="Page Color">
        <p className="text-gray-700 text-sm">Change the page background color. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showPageBorders} onClose={() => setShowPageBorders(false)} title="Page Borders">
        <p className="text-gray-700 text-sm">Add or edit page borders. (Feature coming soon.)</p>
      </Modal>
      <Modal show={!!showTheme} onClose={() => setShowTheme(null)} title={showTheme ? `${showTheme} Theme` : ''}>
        <p className="text-gray-700 text-sm">Apply the {showTheme} theme. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showColors} onClose={() => setShowColors(false)} title="Colors">
        <p className="text-gray-700 text-sm">Change theme colors. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showFonts} onClose={() => setShowFonts(false)} title="Fonts">
        <p className="text-gray-700 text-sm">Change theme fonts. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showEffects} onClose={() => setShowEffects(false)} title="Effects">
        <p className="text-gray-700 text-sm">Apply visual effects. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showSetDefault} onClose={() => setShowSetDefault(false)} title="Set as Default">
        <p className="text-gray-700 text-sm">Set current formatting as default. (Feature coming soon.)</p>
      </Modal>
      {showThemeModal && (
        <ThemeModal onClose={() => setShowThemeModal(false)} />
      )}
    </div>
  );
};

export default DesignTab;