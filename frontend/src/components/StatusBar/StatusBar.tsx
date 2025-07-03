import React from 'react';
import { FileText, Clock, Target, Users, Wifi, Zap } from 'lucide-react';
import { useDocument } from '../../context/DocumentContext';
import { useUI } from '../../context/UIContext';
import { useNotification } from '../../App';
import { useState } from 'react';
import { useCollaboration } from '../../context/CollaborationContext';

const StatusBar: React.FC = () => {
  const { document, history, restoreVersion } = useDocument();
  const { ui, setZoom, setViewMode } = useUI();
  const { notify } = useNotification();
  const { users } = useCollaboration();
  const [showHistory, setShowHistory] = useState(false);

  const readingTime = Math.ceil(document.wordCount / 200); // Assuming 200 words per minute

  return (
    <div className="bg-blue-600 text-white px-4 py-1 flex items-center justify-between text-sm">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-1">
          <span>Page {document.pageCount > 0 ? 1 : 0} of {document.pageCount}</span>
        </div>
        <div className="flex items-center space-x-1">
          <FileText className="w-3 h-3" />
          <span>{document.wordCount} words</span>
        </div>
        <div className="flex items-center space-x-1">
          <Target className="w-3 h-3" />
          <span>{document.characterCount} characters</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{readingTime} min read</span>
        </div>
        {document.trackChanges && (
          <div className="flex items-center space-x-1">
            <Zap className="w-3 h-3" />
            <span>Track Changes</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        {document.isModified && (
          <span className="text-yellow-300 font-medium">Unsaved changes</span>
        )}
        
        {document.autoSave && (
          <div className="flex items-center space-x-1">
            <Wifi className="w-3 h-3" />
            <span>AutoSave</span>
          </div>
        )}

        <div className="flex items-center space-x-1">
          <Users className="w-3 h-3" />
          <span>{users.filter(u => u.isOnline).length} user{users.filter(u => u.isOnline).length !== 1 ? 's' : ''} online</span>
          <div className="flex -space-x-2 ml-2" aria-label="Online collaborators">
            {users.filter(u => u.isOnline).map(u => (
              <span
                key={u.id}
                className="inline-flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-blue-500 text-xs font-bold text-white shadow"
                style={{ backgroundColor: u.color }}
                title={u.name}
                aria-label={u.name}
              >
                {u.avatar}
              </span>
            ))}
          </div>
        </div>

        {/* View Mode Selector */}
        <select 
          value={ui.viewMode}
          onChange={(e) => setViewMode(e.target.value as any)}
          className="bg-blue-700 text-white border border-blue-500 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-300"
        >
          <option value="print">Print Layout</option>
          <option value="web">Web Layout</option>
          <option value="outline">Outline</option>
          <option value="draft">Draft</option>
        </select>

        {/* Zoom Control */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setZoom(Math.max(10, ui.zoom - 10))}
            className="px-2 py-1 bg-blue-700 hover:bg-blue-800 rounded text-xs"
            title="Zoom out"
          >
            -
          </button>
          <select 
            value={ui.zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="bg-blue-700 text-white border border-blue-500 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-300"
            title="Zoom level"
          >
            <option value={50}>50%</option>
            <option value={75}>75%</option>
            <option value={100}>100%</option>
            <option value={125}>125%</option>
            <option value={150}>150%</option>
            <option value={200}>200%</option>
          </select>
          <button 
            onClick={() => setZoom(Math.min(500, ui.zoom + 10))}
            className="px-2 py-1 bg-blue-700 hover:bg-blue-800 rounded text-xs"
            title="Zoom in"
          >
            +
          </button>
        </div>

        <button
          className="px-3 py-1 bg-blue-700 hover:bg-blue-800 rounded text-xs font-medium border border-blue-500"
          onClick={() => setShowHistory(true)}
          title="View document version history"
        >
          History
        </button>
      </div>

      {/* Version History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowHistory(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Version History</h2>
            {history.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No versions yet.</div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {history.slice().reverse().map((v) => (
                  <div key={v.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{v.title}</div>
                      <div className="text-xs text-gray-500">{new Date(v.lastModified).toLocaleString()}</div>
                    </div>
                    <button
                      className="ml-4 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium"
                      onClick={() => { restoreVersion(v.id); setShowHistory(false); notify('Version restored'); }}
                    >
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusBar;