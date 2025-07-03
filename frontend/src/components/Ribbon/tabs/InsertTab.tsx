import React, { useState } from 'react';
import { 
  FileText, Image, Table, Link, Bookmark, MessageSquare,
  Calendar, Clock, User, MapPin, Hash, AtSign,
  BarChart3, PieChart, LineChart, TrendingUp,
  Shapes, Circle, Square, Triangle, Star,
  Type, Heading1, Heading2, Heading3,
  FileImage, Video, Music, File
} from 'lucide-react';

const InsertTab: React.FC = () => {
  const [showModal, setShowModal] = useState<string | null>(null);

  const insertElement = (type: string) => {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    
    if (!range) return;

    let element: HTMLElement;
    
    switch (type) {
      case 'table':
        element = document.createElement('table');
        element.innerHTML = `
          <tr><td>Cell 1</td><td>Cell 2</td></tr>
          <tr><td>Cell 3</td><td>Cell 4</td></tr>
        `;
        element.style.border = '1px solid #ccc';
        element.style.borderCollapse = 'collapse';
        break;
      case 'image':
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const img = document.createElement('img');
              img.src = e.target?.result as string;
              img.style.maxWidth = '100%';
              range.insertNode(img);
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
        return;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          document.execCommand('createLink', false, url);
        }
        return;
      case 'bookmark':
        const name = prompt('Bookmark name:');
        if (name) {
          element = document.createElement('a');
          element.setAttribute('name', name);
          element.textContent = `[${name}]`;
        } else return;
        break;
      case 'pagebreak':
        element = document.createElement('div');
        element.className = 'page-break';
        element.style.pageBreakAfter = 'always';
        element.style.borderTop = '2px dashed #bbb';
        element.style.margin = '24px 0';
        element.style.height = '0';
        break;
      case 'shape-rect':
        element = document.createElement('span');
        element.innerHTML = `<svg width='60' height='30'><rect width='60' height='30' fill='#4f8cff' stroke='#333'/></svg>`;
        break;
      case 'shape-circle':
        element = document.createElement('span');
        element.innerHTML = `<svg width='32' height='32'><circle cx='16' cy='16' r='14' fill='#ffb347' stroke='#333'/></svg>`;
        break;
      case 'shape-star':
        element = document.createElement('span');
        element.innerHTML = `<svg width='32' height='32' viewBox='0 0 32 32'><polygon points='16,2 20,12 31,12 22,19 25,30 16,23 7,30 10,19 1,12 12,12' fill='#ffd700' stroke='#333'/></svg>`;
        break;
      case 'textbox':
        element = document.createElement('div');
        element.contentEditable = 'true';
        element.style.border = '1px solid #888';
        element.style.padding = '8px 16px';
        element.style.margin = '8px 0';
        element.style.minWidth = '120px';
        element.style.display = 'inline-block';
        element.style.background = '#f9f9f9';
        element.textContent = 'Text Box';
        break;
      case 'symbol-omega':
        element = document.createElement('span');
        element.textContent = 'Ω';
        element.style.fontSize = '1.5em';
        element.style.margin = '0 4px';
        break;
      case 'placeholder':
        element = document.createElement('span');
        element.textContent = '[Coming Soon]';
        element.style.color = '#bbb';
        element.style.fontStyle = 'italic';
        break;
      default:
        setShowModal(type);
        return;
    }

    range.insertNode(element);
    selection?.removeAllRanges();
  };

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

  return (
    <div className="px-4 py-3 bg-white">
      <div className="flex items-center space-x-6">
        {/* Pages Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <FileText className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Cover Page</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <FileText className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Blank Page</span>
            </button>
            <button
              onClick={() => insertElement('pagebreak')}
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
            >
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">---</span>
              </div>
              <span className="text-xs">Page Break</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Pages</span>
        </div>

        {/* Tables Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <button 
            onClick={() => insertElement('table')}
            className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
          >
            <Table className="w-6 h-6 text-gray-700" />
            <span className="text-xs">Table</span>
          </button>
          <span className="text-xs text-gray-500">Tables</span>
        </div>

        {/* Illustrations Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => insertElement('image')}
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
            >
              <Image className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Pictures</span>
            </button>
            <button onClick={() => insertElement('shape-rect')} className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <Square className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Rectangle</span>
            </button>
            <button onClick={() => insertElement('shape-circle')} className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <Circle className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Circle</span>
            </button>
            <button onClick={() => insertElement('shape-star')} className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <Star className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Star</span>
            </button>
            <button onClick={() => insertElement('placeholder')} className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">📊</span>
              </div>
              <span className="text-xs">Icons</span>
            </button>
            <button onClick={() => insertElement('placeholder')} className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">🎨</span>
              </div>
              <span className="text-xs">3D Models</span>
            </button>
            <button onClick={() => insertElement('placeholder')} className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">🎯</span>
              </div>
              <span className="text-xs">SmartArt</span>
            </button>
            <button onClick={() => insertElement('placeholder')} className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <BarChart3 className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Chart</span>
            </button>
            <button onClick={() => insertElement('placeholder')} className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">📷</span>
              </div>
              <span className="text-xs">Screenshot</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Illustrations</span>
        </div>

        {/* Media Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button onClick={() => setShowModal('media')} className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <Video className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Online Videos</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Media</span>
        </div>

        {/* Links Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => insertElement('link')}
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
            >
              <Link className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Link</span>
            </button>
            <button 
              onClick={() => insertElement('bookmark')}
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
            >
              <Bookmark className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Bookmark</span>
            </button>
            <button onClick={() => insertElement('placeholder')} className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">🔗</span>
              </div>
              <span className="text-xs">Cross-reference</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Links</span>
        </div>

        {/* Comments Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <button onClick={() => setShowModal('comment')} className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
            <MessageSquare className="w-6 h-6 text-gray-700" />
            <span className="text-xs">Comment</span>
          </button>
          <span className="text-xs text-gray-500">Comments</span>
        </div>

        {/* Header & Footer Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button onClick={() => setShowModal('header')} className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">📄</span>
              </div>
              <span className="text-xs">Header</span>
            </button>
            <button onClick={() => setShowModal('footer')} className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">📄</span>
              </div>
              <span className="text-xs">Footer</span>
            </button>
            <button onClick={() => setShowModal('pagenumber')} className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <Hash className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Page Number</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Header & Footer</span>
        </div>

        {/* Text Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button onClick={() => insertElement('textbox')} className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <Type className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Text Box</span>
            </button>
            <button onClick={() => setShowModal('quickparts')} className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">A</span>
              </div>
              <span className="text-xs">Quick Parts</span>
            </button>
            <button onClick={() => setShowModal('wordart')} className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">📝</span>
              </div>
              <span className="text-xs">WordArt</span>
            </button>
            <button onClick={() => setShowModal('dropcap')} className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">🔤</span>
              </div>
              <span className="text-xs">Drop Cap</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Text</span>
        </div>

        {/* Symbols Section */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-2">
            <button onClick={() => insertElement('symbol-omega')} className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">Ω</span>
              </div>
              <span className="text-xs">Equation</span>
            </button>
            <button onClick={() => insertElement('symbol-omega')} className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">Ω</span>
              </div>
              <span className="text-xs">Symbol</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Symbols</span>
        </div>
      </div>
      {/* Generic Modal for placeholders */}
      <Modal show={!!showModal} onClose={() => setShowModal(null)} title={showModal ? showModal.charAt(0).toUpperCase() + showModal.slice(1) : ''}>
        <p className="text-gray-700 text-sm">This feature is coming soon.</p>
      </Modal>
    </div>
  );
};

export default InsertTab;