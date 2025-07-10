import React, { useState } from 'react';
import { 
  BookOpen, Quote, FileText, List, 
  Hash, Bookmark, Link, Search, Plus
} from 'lucide-react';

const ReferencesTab: React.FC = () => {
  const [citationStyle, setCitationStyle] = useState('APA');
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);

  // Modal states for references features
  const [showTOC, setShowTOC] = useState(false);
  const [showAddText, setShowAddText] = useState(false);
  const [showUpdateTable, setShowUpdateTable] = useState(false);
  const [showFootnote, setShowFootnote] = useState(false);
  const [showEndnote, setShowEndnote] = useState(false);
  const [showNextFootnote, setShowNextFootnote] = useState(false);
  const [showShowNotes, setShowShowNotes] = useState(false);
  const [showInsertCitation, setShowInsertCitation] = useState(false);
  const [showManageSources, setShowManageSources] = useState(false);
  const [showBibliography, setShowBibliography] = useState(false);
  const [showInsertCaption, setShowInsertCaption] = useState(false);
  const [showInsertTableOfFigures, setShowInsertTableOfFigures] = useState(false);
  const [showUpdateTableFigures, setShowUpdateTableFigures] = useState(false);
  const [showCrossReference, setShowCrossReference] = useState(false);
  const [showMarkEntry, setShowMarkEntry] = useState(false);
  const [showInsertIndex, setShowInsertIndex] = useState(false);
  const [showUpdateIndex, setShowUpdateIndex] = useState(false);
  const [showMarkCitation, setShowMarkCitation] = useState(false);
  const [showInsertTableAuthorities, setShowInsertTableAuthorities] = useState(false);
  const [showUpdateTableAuthorities, setShowUpdateTableAuthorities] = useState(false);

  // Example: Add a TOCModal for inserting a Table of Contents
  const [showTOCModal, setShowTOCModal] = useState(false);

  const citationStyles = [
    'APA', 'MLA', 'Chicago', 'Turabian', 'AMA', 'IEEE', 'Harvard', 'Vancouver'
  ];

  const tocStyles = [
    { name: 'Automatic Table 1', preview: 'Contents with dots' },
    { name: 'Automatic Table 2', preview: 'Contents with lines' },
    { name: 'Manual Table', preview: 'Custom formatting' }
  ];

  const insertTOC = () => {
    setShowTOC(true);
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

  return (
    <div className="px-4 py-3 bg-white overflow-x-auto">
      <div className="flex items-center space-x-6 flex-wrap">
        {/* Table of Contents Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <div className="relative group">
              <button
                className="ribbon-button"
                title="Insert Table of Contents"
                onClick={() => setShowTOCModal(true)}
              >
                <BookOpen className="w-6 h-6 text-gray-700" />
                <span>TOC</span>
              </button>
              {showTOCModal && (
                <Modal show={showTOCModal} onClose={() => setShowTOCModal(false)} title="Table of Contents">
                  <p className="text-gray-700 text-sm">Insert a table of contents. (Feature coming soon.)</p>
                </Modal>
              )}
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
                {tocStyles.map((style, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="font-medium text-sm">{style.name}</div>
                    <div className="text-xs text-gray-500">{style.preview}</div>
                  </button>
                ))}
                <hr className="my-1" />
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-b-lg text-blue-600 text-sm">
                  Custom Table of Contents...
                </button>
              </div>
            </div>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowAddText(true)} title="Add Text" aria-label="Add Text">
              <Plus className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Add Text</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowUpdateTable(true)} title="Update Table" aria-label="Update Table">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">🔄</span>
              </div>
              <span className="text-xs">Update Table</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Table of Contents</span>
        </div>
        {/* Footnotes Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowFootnote(true)} title="Insert Footnote" aria-label="Insert Footnote">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm font-bold">¹</span>
              </div>
              <span className="text-xs">Insert Footnote</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowEndnote(true)} title="Insert Endnote" aria-label="Insert Endnote">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm font-bold">ⁱ</span>
              </div>
              <span className="text-xs">Insert Endnote</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowNextFootnote(true)} title="Next Footnote" aria-label="Next Footnote">
              <Search className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Next Footnote</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowShowNotes(true)} title="Show Notes" aria-label="Show Notes">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">📋</span>
              </div>
              <span className="text-xs">Show Notes</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Footnotes</span>
        </div>
        {/* Citations & Bibliography Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button 
                onClick={() => setShowStyleDropdown(!showStyleDropdown)}
                className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
                title={showStyleDropdown ? "Hide style options" : "Show style options"}
                aria-label={showStyleDropdown ? "Hide style options" : "Show style options"}
              >
                <div className="px-2 py-1 border border-gray-300 rounded text-xs font-medium">
                  {citationStyle}
                </div>
                <span className="text-xs mt-1">Style</span>
              </button>
              {showStyleDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-32">
                  {citationStyles.map(style => (
                    <button
                      key={style}
                      onClick={() => {
                        setCitationStyle(style);
                        setShowStyleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                        citationStyle === style ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowInsertCitation(true)} title="Insert Citation" aria-label="Insert Citation">
              <Quote className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Insert Citation</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowManageSources(true)} title="Manage Sources" aria-label="Manage Sources">
              <BookOpen className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Manage Sources</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowBibliography(true)} title="Bibliography" aria-label="Bibliography">
              <FileText className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Bibliography</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Citations & Bibliography</span>
        </div>
        {/* Captions Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowInsertCaption(true)} title="Insert Caption" aria-label="Insert Caption">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">📷</span>
              </div>
              <span className="text-xs">Insert Caption</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowInsertTableOfFigures(true)} title="Insert Table of Figures" aria-label="Insert Table of Figures">
              <List className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Insert Table of Figures</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowUpdateTableFigures(true)} title="Update Table" aria-label="Update Table">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">🔄</span>
              </div>
              <span className="text-xs">Update Table</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowCrossReference(true)} title="Cross-reference" aria-label="Cross-reference">
              <Link className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Cross-reference</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Captions</span>
        </div>
        {/* Index Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowMarkEntry(true)} title="Mark Entry" aria-label="Mark Entry">
              <Hash className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Mark Entry</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowInsertIndex(true)} title="Insert Index" aria-label="Insert Index">
              <FileText className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Insert Index</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowUpdateIndex(true)} title="Update Index" aria-label="Update Index">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">🔄</span>
              </div>
              <span className="text-xs">Update Index</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Index</span>
        </div>
        {/* Table of Authorities Section */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-2">
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowMarkCitation(true)} title="Mark Citation" aria-label="Mark Citation">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">⚖️</span>
              </div>
              <span className="text-xs">Mark Citation</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowInsertTableAuthorities(true)} title="Insert Table of Authorities" aria-label="Insert Table of Authorities">
              <FileText className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Insert Table of Authorities</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md" onClick={() => setShowUpdateTableAuthorities(true)} title="Update Table" aria-label="Update Table">
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">🔄</span>
              </div>
              <span className="text-xs">Update Table</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Table of Authorities</span>
        </div>
      </div>
      {/* Modals for References features */}
      <Modal show={showTOC} onClose={() => setShowTOC(false)} title="Table of Contents">
        <p className="text-gray-700 text-sm">Insert a table of contents. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showAddText} onClose={() => setShowAddText(false)} title="Add Text">
        <p className="text-gray-700 text-sm">Add text to the table of contents. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showUpdateTable} onClose={() => setShowUpdateTable(false)} title="Update Table">
        <p className="text-gray-700 text-sm">Update the table of contents. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showFootnote} onClose={() => setShowFootnote(false)} title="Insert Footnote">
        <p className="text-gray-700 text-sm">Insert a footnote. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showEndnote} onClose={() => setShowEndnote(false)} title="Insert Endnote">
        <p className="text-gray-700 text-sm">Insert an endnote. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showNextFootnote} onClose={() => setShowNextFootnote(false)} title="Next Footnote">
        <p className="text-gray-700 text-sm">Go to the next footnote. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showShowNotes} onClose={() => setShowShowNotes(false)} title="Show Notes">
        <p className="text-gray-700 text-sm">Show all notes. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showInsertCitation} onClose={() => setShowInsertCitation(false)} title="Insert Citation">
        <p className="text-gray-700 text-sm">Insert a citation. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showManageSources} onClose={() => setShowManageSources(false)} title="Manage Sources">
        <p className="text-gray-700 text-sm">Manage citation sources. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showBibliography} onClose={() => setShowBibliography(false)} title="Bibliography">
        <p className="text-gray-700 text-sm">Insert a bibliography. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showInsertCaption} onClose={() => setShowInsertCaption(false)} title="Insert Caption">
        <p className="text-gray-700 text-sm">Insert a caption. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showInsertTableOfFigures} onClose={() => setShowInsertTableOfFigures(false)} title="Insert Table of Figures">
        <p className="text-gray-700 text-sm">Insert a table of figures. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showUpdateTableFigures} onClose={() => setShowUpdateTableFigures(false)} title="Update Table of Figures">
        <p className="text-gray-700 text-sm">Update the table of figures. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showCrossReference} onClose={() => setShowCrossReference(false)} title="Cross-reference">
        <p className="text-gray-700 text-sm">Insert a cross-reference. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showMarkEntry} onClose={() => setShowMarkEntry(false)} title="Mark Entry">
        <p className="text-gray-700 text-sm">Mark an entry for the index. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showInsertIndex} onClose={() => setShowInsertIndex(false)} title="Insert Index">
        <p className="text-gray-700 text-sm">Insert an index. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showUpdateIndex} onClose={() => setShowUpdateIndex(false)} title="Update Index">
        <p className="text-gray-700 text-sm">Update the index. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showMarkCitation} onClose={() => setShowMarkCitation(false)} title="Mark Citation">
        <p className="text-gray-700 text-sm">Mark a citation for the table of authorities. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showInsertTableAuthorities} onClose={() => setShowInsertTableAuthorities(false)} title="Insert Table of Authorities">
        <p className="text-gray-700 text-sm">Insert a table of authorities. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showUpdateTableAuthorities} onClose={() => setShowUpdateTableAuthorities(false)} title="Update Table of Authorities">
        <p className="text-gray-700 text-sm">Update the table of authorities. (Feature coming soon.)</p>
      </Modal>
    </div>
  );
};

export default ReferencesTab;