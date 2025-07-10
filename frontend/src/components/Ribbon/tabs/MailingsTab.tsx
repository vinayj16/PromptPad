import React, { useState } from 'react';
import { 
  Mail, Users, FileText, Database, 
  Settings, Eye, Send, Printer, 
  ChevronLeft, ChevronRight, Play, 
  Pause, SkipBack, SkipForward
} from 'lucide-react';

const MailingsTab: React.FC = () => {
  const [currentRecord, setCurrentRecord] = useState(1);
  const [totalRecords] = useState(150);
  const [previewMode, setPreviewMode] = useState(false);

  // Modal states for mailings features
  const [showEnvelopes, setShowEnvelopes] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [showMailMerge, setShowMailMerge] = useState(false);
  const [showRecipients, setShowRecipients] = useState(false);
  const [showEditRecipients, setShowEditRecipients] = useState(false);
  const [showHighlightFields, setShowHighlightFields] = useState(false);
  const [showAddressBlock, setShowAddressBlock] = useState(false);
  const [showGreetingLine, setShowGreetingLine] = useState(false);
  const [showInsertMergeField, setShowInsertMergeField] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showMatchFields, setShowMatchFields] = useState(false);
  const [showUpdateLabels, setShowUpdateLabels] = useState(false);
  const [showFindRecipient, setShowFindRecipient] = useState(false);
  const [showAutoCheck, setShowAutoCheck] = useState(false);
  const [showFinishMerge, setShowFinishMerge] = useState(false);
  const [showPrintDocuments, setShowPrintDocuments] = useState(false);
  const [showSendEmail, setShowSendEmail] = useState(false);
  const [showEditDocuments, setShowEditDocuments] = useState(false);

  // Example: Add a MailMergeModal for mail merge
  const [showMailMergeModal, setShowMailMergeModal] = useState(false);

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

  // Add a simple MailMergeModal if not already imported
  const MailMergeModal = ({ onClose }: { onClose: () => void }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-scale-in">
          <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>×</button>
          <h2 className="text-lg font-semibold mb-4">Mail Merge</h2>
          <p className="mb-4 text-gray-700">Upload a CSV file with recipient data to preview and generate personalized documents or emails. (Full feature coming soon, but you can upload and preview your data.)</p>
          <input type="file" accept=".csv" className="mb-4" />
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 py-3 bg-white overflow-x-auto">
      <div className="flex items-center space-x-6 flex-wrap">
        {/* Create Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowEnvelopes(true)}
              title="Envelopes"
              aria-label="Envelopes"
            >
              <Mail className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Envelopes</span>
            </button>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowLabels(true)}
              title="Labels"
              aria-label="Labels"
            >
              <FileText className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Labels</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Create</span>
        </div>
        {/* Start Mail Merge Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2">
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowMailMerge(true)}
              title="Start Mail Merge"
              aria-label="Start Mail Merge"
            >
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">📧</span>
              </div>
              <span className="text-xs">Start Mail Merge</span>
            </button>
            <div className="relative group">
              <button
                className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
                onClick={() => setShowRecipients(true)}
                title="Select Recipients"
                aria-label="Select Recipients"
              >
                <Users className="w-6 h-6 text-gray-700" />
                <span className="text-xs">Select Recipients</span>
              </button>
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-t-lg">Type a New List</button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100">Use an Existing List</button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-b-lg">Select from Outlook Contacts</button>
              </div>
            </div>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowEditRecipients(true)}
              title="Edit Recipient List"
              aria-label="Edit Recipient List"
            >
              <Settings className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Edit Recipient List</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Start Mail Merge</span>
        </div>
        {/* Write & Insert Fields Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2 flex-wrap">
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowHighlightFields(true)}
              title="Highlight Merge Fields"
              aria-label="Highlight Merge Fields"
            >
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">📝</span>
              </div>
              <span className="text-xs">Highlight Merge Fields</span>
            </button>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowAddressBlock(true)}
              title="Address Block"
              aria-label="Address Block"
            >
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">📍</span>
              </div>
              <span className="text-xs">Address Block</span>
            </button>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowGreetingLine(true)}
              title="Greeting Line"
              aria-label="Greeting Line"
            >
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">👋</span>
              </div>
              <span className="text-xs">Greeting Line</span>
            </button>
            <div className="relative group">
              <button
                className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
                onClick={() => setShowInsertMergeField(true)}
                title="Insert Merge Field"
                aria-label="Insert Merge Field"
              >
                <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                  <span className="text-sm">🏷️</span>
                </div>
                <span className="text-xs">Insert Merge Field</span>
              </button>
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-t-lg">First_Name</button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100">Last_Name</button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100">Company</button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100">Address</button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-b-lg">City</button>
              </div>
            </div>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowRules(true)}
              title="Rules"
              aria-label="Rules"
            >
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">📋</span>
              </div>
              <span className="text-xs">Rules</span>
            </button>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowMatchFields(true)}
              title="Match Fields"
              aria-label="Match Fields"
            >
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">🔍</span>
              </div>
              <span className="text-xs">Match Fields</span>
            </button>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowUpdateLabels(true)}
              title="Update Labels"
              aria-label="Update Labels"
            >
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">🔄</span>
              </div>
              <span className="text-xs">Update Labels</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Write & Insert Fields</span>
        </div>
        {/* Preview Results Section */}
        <div className="flex flex-col items-center space-y-2 border-r border-gray-200 pr-6">
          <div className="flex items-center space-x-2 flex-wrap">
            <button 
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex flex-col items-center p-2 rounded-md transition-colors ${
                previewMode ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
              title={previewMode ? "Preview Results" : "Preview Results"}
              aria-label={previewMode ? "Preview Results" : "Preview Results"}
            >
              <Eye className="w-6 h-6" />
              <span className="text-xs">Preview Results</span>
            </button>
            <button 
              onClick={() => setCurrentRecord(1)}
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              title="First Record"
              aria-label="First Record"
            >
              <SkipBack className="w-6 h-6 text-gray-700" />
              <span className="text-xs">First Record</span>
            </button>
            <button 
              onClick={() => setCurrentRecord(Math.max(1, currentRecord - 1))}
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              title="Previous Record"
              aria-label="Previous Record"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Previous Record</span>
            </button>
            <div className="flex flex-col items-center">
              <input 
                type="number" 
                value={currentRecord}
                onChange={(e) => setCurrentRecord(Math.max(1, Math.min(totalRecords, parseInt(e.target.value) || 1)))}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-xs text-center"
                min="1"
                max={totalRecords}
                title={`${currentRecord} of ${totalRecords}`}
                aria-label={`${currentRecord} of ${totalRecords}`}
              />
              <span className="text-xs mt-1">of {totalRecords}</span>
            </div>
            <button 
              onClick={() => setCurrentRecord(Math.min(totalRecords, currentRecord + 1))}
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              title="Next Record"
              aria-label="Next Record"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Next Record</span>
            </button>
            <button 
              onClick={() => setCurrentRecord(totalRecords)}
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              title="Last Record"
              aria-label="Last Record"
            >
              <SkipForward className="w-6 h-6 text-gray-700" />
              <span className="text-xs">Last Record</span>
            </button>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowFindRecipient(true)}
              title="Find Recipient"
              aria-label="Find Recipient"
            >
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">🔍</span>
              </div>
              <span className="text-xs">Find Recipient</span>
            </button>
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowAutoCheck(true)}
              title="Auto Check for Errors"
              aria-label="Auto Check for Errors"
            >
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">✅</span>
              </div>
              <span className="text-xs">Auto Check for Errors</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">Preview Results</span>
        </div>
        {/* Finish Section */}
        <div className="flex flex-col items-center space-y-2">
          <div className="relative group">
            <button
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setShowFinishMerge(true)}
              title="Finish & Merge"
              aria-label="Finish & Merge"
            >
              <div className="w-6 h-6 flex items-center justify-center text-gray-700">
                <span className="text-sm">🏁</span>
              </div>
              <span className="text-xs">Finish & Merge</span>
            </button>
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-t-lg flex items-center space-x-2" onClick={() => setShowPrintDocuments(true)} title="Print Documents" aria-label="Print Documents">
                <Printer className="w-4 h-4" />
                <span>Print Documents</span>
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center space-x-2" onClick={() => setShowSendEmail(true)} title="Send Email Messages" aria-label="Send Email Messages">
                <Send className="w-4 h-4" />
                <span>Send Email Messages</span>
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-b-lg flex items-center space-x-2" onClick={() => setShowEditDocuments(true)} title="Edit Individual Documents" aria-label="Edit Individual Documents">
                <FileText className="w-4 h-4" />
                <span>Edit Individual Documents</span>
              </button>
            </div>
          </div>
          <span className="text-xs text-gray-500">Finish</span>
        </div>
      </div>
      {/* Modals for Mailings features */}
      <Modal show={showEnvelopes} onClose={() => setShowEnvelopes(false)} title="Envelopes">
        <p className="text-gray-700 text-sm">Create and print envelopes. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showLabels} onClose={() => setShowLabels(false)} title="Labels">
        <p className="text-gray-700 text-sm">Create and print labels. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showMailMerge} onClose={() => setShowMailMerge(false)} title="Start Mail Merge">
        <p className="text-gray-700 text-sm">Start a mail merge for letters, emails, envelopes, labels, or directories. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showRecipients} onClose={() => setShowRecipients(false)} title="Select Recipients">
        <p className="text-gray-700 text-sm">Choose or create a recipient list. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showEditRecipients} onClose={() => setShowEditRecipients(false)} title="Edit Recipient List">
        <p className="text-gray-700 text-sm">Edit the selected recipient list. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showHighlightFields} onClose={() => setShowHighlightFields(false)} title="Highlight Merge Fields">
        <p className="text-gray-700 text-sm">Highlight merge fields in your document. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showAddressBlock} onClose={() => setShowAddressBlock(false)} title="Address Block">
        <p className="text-gray-700 text-sm">Insert an address block. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showGreetingLine} onClose={() => setShowGreetingLine(false)} title="Greeting Line">
        <p className="text-gray-700 text-sm">Insert a greeting line. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showInsertMergeField} onClose={() => setShowInsertMergeField(false)} title="Insert Merge Field">
        <p className="text-gray-700 text-sm">Insert a merge field (e.g., First Name, Last Name, etc.). (Feature coming soon.)</p>
      </Modal>
      <Modal show={showRules} onClose={() => setShowRules(false)} title="Rules">
        <p className="text-gray-700 text-sm">Add rules to your mail merge. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showMatchFields} onClose={() => setShowMatchFields(false)} title="Match Fields">
        <p className="text-gray-700 text-sm">Match fields between your data source and document. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showUpdateLabels} onClose={() => setShowUpdateLabels(false)} title="Update Labels">
        <p className="text-gray-700 text-sm">Update all labels in your document. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showFindRecipient} onClose={() => setShowFindRecipient(false)} title="Find Recipient">
        <p className="text-gray-700 text-sm">Find a recipient in your list. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showAutoCheck} onClose={() => setShowAutoCheck(false)} title="Auto Check for Errors">
        <p className="text-gray-700 text-sm">Automatically check for errors in your mail merge. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showFinishMerge} onClose={() => setShowFinishMerge(false)} title="Finish & Merge">
        <p className="text-gray-700 text-sm">Finish the mail merge and create documents. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showPrintDocuments} onClose={() => setShowPrintDocuments(false)} title="Print Documents">
        <p className="text-gray-700 text-sm">Print merged documents. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showSendEmail} onClose={() => setShowSendEmail(false)} title="Send Email Messages">
        <p className="text-gray-700 text-sm">Send merged documents as email messages. (Feature coming soon.)</p>
      </Modal>
      <Modal show={showEditDocuments} onClose={() => setShowEditDocuments(false)} title="Edit Individual Documents">
        <p className="text-gray-700 text-sm">Edit individual merged documents. (Feature coming soon.)</p>
      </Modal>
      {/* Example: Add a MailMergeModal for mail merge */}
      {showMailMergeModal && (
        <MailMergeModal onClose={() => setShowMailMergeModal(false)} />
      )}
    </div>
  );
};

export default MailingsTab;