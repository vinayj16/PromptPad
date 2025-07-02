import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, useTheme, Snackbar, Alert, Fab, Tooltip, Drawer, SpeedDial, SpeedDialAction } from '@mui/material';
import { useDocument } from '../../context/DocumentContext';
import AppBar from './AppBar';
import Sidebar from '../Sidebar/Sidebar';
import MainContent from './MainContent';
import Toolbar from '../Toolbar/Toolbar';
import SaveDialog from '../Dialogs/SaveDialog';
import OpenDialog from '../Dialogs/OpenDialog';
import AISidebar from '../AISidebar';
import { Sparkles, Wrench, UserPlus, Settings as SettingsIcon, ClipboardList } from 'lucide-react';
import AdvancedToolsDrawer from '../AdvancedToolsDrawer';
import CollaborationSidebar from '../CollaborationSidebar';
import axios from 'axios';
import PreferencesDialog from '../PreferencesDialog';
import TemplatesModal from '../TemplatesModal';
import { saveAs } from 'file-saver';

const EditorContainer = () => {
  const theme = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [collabOpen, setCollabOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [docLoading, setDocLoading] = useState(false);
  const [docError, setDocError] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  
  const {
    // State
    documentTitle,
    content,
    isDocumentModified,
    savedDocuments,
    activeDocument,
    error,
    
    // Actions
    createNewDocument,
    loadDocument,
    setContent,
    setDocumentTitle,
    clearError
  } = useDocument();

  // Handle document loading on mount
  useEffect(() => {
    // Create a new document if none exists
    if (savedDocuments.length === 0) {
      createNewDocument();
    }
  }, [createNewDocument, savedDocuments.length]);

  // Handle errors
  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: error,
        severity: 'error'
      });
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    const prefs = JSON.parse(localStorage.getItem('wordProcessorPrefs') || '{}');
    if (prefs.accessibility) {
      document.body.classList.add('accessibility-mode');
    } else {
      document.body.classList.remove('accessibility-mode');
    }
  }, [showPreferences, showTemplates, collabOpen, aiSidebarOpen, toolsOpen, content]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewDocument = () => {
    createNewDocument();
    setSnackbar({
      open: true,
      message: 'New document created',
      severity: 'success'
    });
  };

  const handleSaveDocument = async (title, format) => {
    try {
      await axios.post('/api/documents', {
        title,
        content,
        format,
      });
      setSnackbar({ open: true, message: 'Document saved', severity: 'success' });
      fetchDocuments();
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to save document', severity: 'error' });
    }
  };

  const handleDocumentSelect = (docId) => {
    loadDocument(docId);
    setShowOpenDialog(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Handler to insert AI result into the document
  const handleInsertAIResult = (result) => {
    setContent((prev) => (prev ? prev + '\n' + result : result));
    setSnackbar({ open: true, message: 'AI result inserted', severity: 'success' });
    setAiSidebarOpen(false);
  };

  // Placeholder handlers for advanced tools
  const onGenerateTOC = async () => {
    try {
      const res = await axios.post('/api/ai/toc', { content });
      if (res.data && res.data.toc) {
        // Optionally insert into document or return for display
        return res.data.toc;
      }
      return 'No TOC generated.';
    } catch (err) {
      return 'Failed to generate TOC.';
    }
  };
  const onGenerateCitations = async () => 'Smart citations inserted!';
  const onImageSuggestions = async () => 'Image suggestions ready!';
  const onFormatCode = async () => 'Code formatted!';
  const onSmartFormat = async () => 'Smart formatting applied!';
  const onExport = async (format = 'txt') => {
    try {
      let blob;
      let extension;
      if (!content) {
        setSnackbar({ open: true, message: 'No content to export', severity: 'error' });
        return;
      }
      switch (format) {
        case 'txt':
          blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
          extension = 'txt';
          break;
        case 'md':
          blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
          extension = 'md';
          break;
        case 'html':
          const htmlContent = `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"UTF-8\">\n  <title>${documentTitle || 'Document'}</title>\n</head>\n<body>\n  <h1>${documentTitle || 'Untitled Document'}</h1>\n  <div>${content.replace(/\n/g, '<br>')}</div>\n</body>\n</html>`;
          blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
          extension = 'html';
          break;
        case 'docx':
        case 'pdf':
          setSnackbar({ open: true, message: 'Export to DOCX/PDF coming soon!', severity: 'info' });
          return;
        default:
          setSnackbar({ open: true, message: 'Unsupported export format', severity: 'error' });
          return;
      }
      const filename = `${documentTitle || 'document'}.${extension}`;
      saveAs(blob, filename);
      setSnackbar({ open: true, message: `Document exported as ${extension.toUpperCase()}`, severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: `Failed to export document: ${error.message}`, severity: 'error' });
    }
  };
  const onPublish = async () => 'Published to platform!';
  const onCloudSave = async () => 'Saved to cloud!';

  // Fetch documents from backend
  const fetchDocuments = async () => {
    setDocLoading(true);
    setDocError('');
    try {
      const res = await axios.get('/api/documents');
      setDocuments(res.data);
    } catch (err) {
      setDocError('Failed to load documents');
    } finally {
      setDocLoading(false);
    }
  };

  // Open dialog handler
  const handleOpenDialog = () => {
    fetchDocuments();
    setShowOpenDialog(true);
  };

  // Open document handler
  const handleOpenDocument = async (doc) => {
    try {
      const res = await axios.get(`/api/documents/${doc.id}`);
      setContent(res.data.content);
      setDocumentTitle(res.data.title);
      fetchDocuments();
      setSnackbar({ open: true, message: 'Document opened', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to open document', severity: 'error' });
    }
  };

  // Delete document handler
  const handleDeleteDocument = async (docId) => {
    try {
      await axios.delete(`/api/documents/${docId}`);
      setSnackbar({ open: true, message: 'Document deleted', severity: 'success' });
      fetchDocuments();
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete document', severity: 'error' });
    }
  };

  // Handler for inserting template content
  const handleInsertTemplate = (templateContent) => {
    setContent(templateContent);
    setSnackbar({ open: true, message: 'Template inserted', severity: 'success' });
    setShowTemplates(false);
  };

  // Handler for saving preferences
  const handleSavePreferences = (prefs) => {
    // Optionally update context or theme here
    setSnackbar({ open: true, message: 'Preferences saved', severity: 'success' });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
      }}
    >
      <CssBaseline />
      <AppBar 
        isSidebarOpen={isSidebarOpen} 
        onToggleSidebar={toggleSidebar}
        onNewDocument={handleNewDocument}
        onSaveDocument={handleSaveDocument}
        onOpenDocument={handleOpenDialog}
        documentTitle={documentTitle}
        isModified={isDocumentModified}
      />
      
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          documents={savedDocuments}
          activeDocumentId={activeDocument?.id}
          onDocumentSelect={handleDocumentSelect}
        />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
          <Toolbar />
          <MainContent 
            content={content}
            onContentChange={setContent}
          />
        </Box>
      </Box>
      
      {/* SpeedDial at the bottom right */}
      <SpeedDial
        ariaLabel="Quick Actions"
        sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 2000 }}
        icon={<span style={{ fontSize: 32 }}>+</span>}
      >
        <SpeedDialAction
          icon={<Sparkles size={20} />}
          tooltipTitle="AI Assistant"
          onClick={() => setAiSidebarOpen(true)}
        />
        <SpeedDialAction
          icon={<Wrench size={20} />}
          tooltipTitle="Advanced Tools"
          onClick={() => setToolsOpen(true)}
        />
        <SpeedDialAction
          icon={<SettingsIcon size={20} />}
          tooltipTitle="Preferences"
          onClick={() => setShowPreferences(true)}
        />
        <SpeedDialAction
          icon={<ClipboardList size={20} />}
          tooltipTitle="Templates"
          onClick={() => setShowTemplates(true)}
        />
        <SpeedDialAction
          icon={<UserPlus size={20} />}
          tooltipTitle="Collaborators"
          onClick={() => setCollabOpen(true)}
        />
      </SpeedDial>
      
      {/* AI Sidebar */}
      <AISidebar
        open={aiSidebarOpen}
        onClose={() => setAiSidebarOpen(false)}
        onInsert={handleInsertAIResult}
        editorContent={content}
      />
      
      {/* Advanced Tools Drawer */}
      <AdvancedToolsDrawer
        open={toolsOpen}
        onClose={() => setToolsOpen(false)}
        onGenerateTOC={onGenerateTOC}
        onGenerateCitations={onGenerateCitations}
        onImageSuggestions={onImageSuggestions}
        onFormatCode={onFormatCode}
        onSmartFormat={onSmartFormat}
        onExport={onExport}
        onPublish={onPublish}
        onCloudSave={onCloudSave}
      />
      
      {/* Collaboration Sidebar Drawer */}
      <Drawer anchor="left" open={collabOpen} onClose={() => setCollabOpen(false)}>
        <CollaborationSidebar open={collabOpen} onClose={() => setCollabOpen(false)} />
      </Drawer>
      
      {/* Dialogs */}
      <SaveDialog
        open={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        documentTitle={documentTitle}
        onSave={handleSaveDocument}
      />
      
      <OpenDialog
        open={showOpenDialog}
        onClose={() => setShowOpenDialog(false)}
        documents={documents}
        onOpen={handleOpenDocument}
        onDelete={handleDeleteDocument}
        loading={docLoading}
        error={docError}
      />
      
      <PreferencesDialog open={showPreferences} onClose={() => setShowPreferences(false)} onSave={handleSavePreferences} />
      <TemplatesModal open={showTemplates} onClose={() => setShowTemplates(false)} onInsert={handleInsertTemplate} />
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditorContainer;
