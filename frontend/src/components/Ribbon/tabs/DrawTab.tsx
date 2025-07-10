import React, { useState } from 'react';
import { 
  Pen, Pencil, Highlighter, Eraser, 
  Circle, Square, Triangle, ArrowRight,
  Palette, Ruler, RotateCcw, Play, HelpCircle
} from 'lucide-react';
import { useDocument } from '../../../context/DocumentContext';

const DrawTab: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState('pen');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [showDrawShape, setShowDrawShape] = useState(false);

  const tools = [
    { id: 'pen', icon: Pen, label: 'Pen' },
    { id: 'pencil', icon: Pencil, label: 'Pencil' },
    { id: 'highlighter', icon: Highlighter, label: 'Highlighter' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
  ];

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000'
  ];

  const shapes = [
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'square', icon: Square, label: 'Rectangle' },
    { id: 'triangle', icon: Triangle, label: 'Triangle' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
  ];

  const insertShape = (shape: string) => {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    if (!range) return;
    let svg: Element | null = null;
    switch (shape) {
      case 'circle':
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        if (svg) {
          svg.setAttribute('width', '60');
          svg.setAttribute('height', '60');
          svg.innerHTML = `<circle cx="30" cy="30" r="25" fill="${selectedColor}" />`;
        }
        break;
      case 'square':
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        if (svg) {
          svg.setAttribute('width', '60');
          svg.setAttribute('height', '60');
          svg.innerHTML = `<rect x="10" y="10" width="40" height="40" fill="${selectedColor}" />`;
        }
        break;
      case 'arrow':
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        if (svg) {
          svg.setAttribute('width', '60');
          svg.setAttribute('height', '60');
          svg.innerHTML = `<line x1="10" y1="30" x2="50" y2="30" stroke="${selectedColor}" stroke-width="4" marker-end="url(#arrowhead)" />
            <defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="${selectedColor}"/></marker></defs>`;
        }
        break;
      default:
        return;
    }
    if (svg) {
      range.insertNode(svg);
      selection?.removeAllRanges();
    }
  };

  // Add a simple DrawShapeModal if not already imported
  const DrawShapeModal = ({ onClose }: { onClose: () => void }) => {
    const { updateContent, document } = useDocument();
    const [shape, setShape] = useState('rectangle');
    const [color, setColor] = useState('#000000');

    const handleInsert = () => {
      let svg = '';
      if (shape === 'rectangle') {
        svg = `<svg width='100' height='60'><rect width='100' height='60' fill='${color}' /></svg>`;
      } else if (shape === 'circle') {
        svg = `<svg width='60' height='60'><circle cx='30' cy='30' r='30' fill='${color}' /></svg>`;
      } else if (shape === 'triangle') {
        svg = `<svg width='60' height='60'><polygon points='30,0 60,60 0,60' fill='${color}' /></svg>`;
      }
      updateContent(document.content + svg);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs relative animate-scale-in">
          <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>×</button>
          <h2 className="text-lg font-semibold mb-4">Insert Shape</h2>
          <div className="mb-3 flex space-x-2">
            <select value={shape} onChange={e => setShape(e.target.value)} className="border rounded px-2 py-1">
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
              <option value="triangle">Triangle</option>
            </select>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-10 border rounded" />
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full" onClick={handleInsert}>Insert Shape</button>
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 py-3 bg-white">
      <div className="flex items-center space-x-6">
        {/* Drawing Tools Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="grid grid-cols-2 gap-1">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`flex flex-col items-center p-2 rounded-md transition-colors ${
                  selectedTool === tool.id 
                    ? 'bg-blue-100 border-2 border-blue-500' 
                    : 'hover:bg-gray-100 border-2 border-transparent'
                }`}
                title={tool.label}
                aria-label={tool.label}
              >
                <tool.icon className="w-5 h-5 text-gray-700" />
                <span className="text-xs">{tool.label}</span>
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-500">Drawing Tools</span>
        </div>

        {/* Stencils Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <Ruler className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Ruler</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">📐</span>
              </div>
              <span className="text-xs">Format Background</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Stencils</span>
        </div>

        {/* Edit Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">🖱️</span>
              </div>
              <span className="text-xs">Ink to Shape</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">📝</span>
              </div>
              <span className="text-xs">Ink to Math</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">🎨</span>
              </div>
              <span className="text-xs">Drawing Canvas</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Edit</span>
        </div>

        {/* Convert Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">🔄</span>
              </div>
              <span className="text-xs">Ink to Shape</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">📐</span>
              </div>
              <span className="text-xs">Ink to Math</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Convert</span>
        </div>

        {/* Replay Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <Play className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Ink Replay</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Replay</span>
        </div>

        {/* Help Section */}
        <div className="flex flex-col items-center space-y-2">
          <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
            <HelpCircle className="w-6 h-6 text-gray-700" />
            <span className="text-xs">Ink Help</span>
          </button>
          <span className="text-xs text-gray-500">Help</span>
        </div>

        {/* Color Palette */}
        <div className="flex flex-col items-center space-y-2 ml-6">
          <div className="grid grid-cols-5 gap-1">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded border-2 ${
                  selectedColor === color ? 'border-gray-800' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">Colors</span>
        </div>

        {/* Shapes Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => insertShape('circle')}
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
            >
              <Circle className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Circle</span>
            </button>
            <button
              onClick={() => insertShape('square')}
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
            >
              <Square className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Rectangle</span>
            </button>
            <button
              onClick={() => insertShape('arrow')}
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
            >
              <ArrowRight className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Arrow</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Shapes</span>
        </div>
      </div>
    </div>
  );
};

export default DrawTab;