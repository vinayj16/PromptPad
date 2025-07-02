import React, { useCallback, useRef, useState, useEffect } from 'react';
import { 
  AppBar as MuiAppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Box, 
  useTheme, 
  Tooltip, 
  Menu, 
  MenuItem, 
  Divider, 
  Snackbar, 
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Moon, 
  Sun,
  FileText,
  FilePlus,
  FileDown,
  FileUp,
  Save,
  X,
  Check,
  Edit2,
  MoreVertical,
  FolderOpen,
  Printer
} from 'lucide-react';
import { useThemeContext } from '../../context/ThemeContext';
import { useDocument } from '../../context/DocumentContext';
import { saveAs } from 'file-saver';

const AppBar = ({ 
  isSidebarOpen, 
  onToggleSidebar, 
  onNewDocument, 
  onSaveDocument, 
  onOpenDocument,
  documentTitle,
  isDocumentModified = false,
  isModified = false, // Default value for isDocumentModified
  resetDocument = () => {}, // Default empty function
  loadDocument = () => {} // Default empty function
}) => {
  const theme = useTheme();
  const { toggleColorMode } = useThemeContext();
  const { 
    documentTitle: contextDocTitle,
    setDocumentTitle
  } = useDocument();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [exportMenuAnchorEl, setExportMenuAnchorEl] = useState(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(documentTitle);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const fileInputRef = useRef(null);
  const [format, setFormat] = useState('txt');
  const [blob, setBlob] = useState(null);
  
  const exportFormats = [
    { id: 'txt', label: 'Text File (.txt)', icon: <FileText size={16} /> },
    { id: 'md', label: 'Markdown (.md)', icon: <FileText size={16} /> },
    { id: 'html', label: 'HTML (.html)', icon: <FileText size={16} /> },
    { id: 'docx', label: 'Word Document (.docx)', icon: <FileText size={16} /> },
    { id: 'pdf', label: 'PDF (.pdf)', icon: <FileText size={16} /> },
  ];
  
  // Update local title when document title changes
  React.useEffect(() => {
    setEditedTitle(documentTitle);
  }, [documentTitle]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleExportMenuOpen = (event) => {
    setExportMenuAnchorEl(event.currentTarget);
  };
  
  const handleExportMenuClose = () => {
    setExportMenuAnchorEl(null);
  };
  
  const handleExportFormatSelect = (format) => {
    handleExportMenuClose();
    handleExport(format);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleNewDocument = () => {
    if (isDocumentModified && !window.confirm('You have unsaved changes. Are you sure you want to create a new document?')) {
      return;
    }
    resetDocument();
    showSnackbar('New document created');
    handleMenuClose();
  };

  const handleSave = async () => {
    try {
      onSaveDocument();
      showSnackbar('Document saved successfully');
    } catch (error) {
      console.error('Error saving document:', error);
      showSnackbar('Failed to save document', 'error');
    }
  };
  
  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };
  
  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (editedTitle.trim() !== documentTitle) {
      setDocumentTitle(editedTitle);
      showSnackbar('Document title updated');
    }
  };
  
  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setEditedTitle(documentTitle);
      setIsEditingTitle(false);
    }
  };
  
  const startTitleEditing = () => {
    setEditedTitle(documentTitle);
    setIsEditingTitle(true);
  };

  const handleExport = useCallback(async (format) => {
    try {
      let blob;
      let extension;
      if (!document || !document.content) {
        showSnackbar('No content to export', 'error');
        return;
      }
      switch (format) {
        case 'txt':
          blob = new Blob([document.content], { type: 'text/plain;charset=utf-8' });
          extension = 'txt';
          break;
        case 'md':
          blob = new Blob([document.content], { type: 'text/markdown;charset=utf-8' });
          extension = 'md';
          break;
        case 'html':
          const htmlContent = `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"UTF-8\">\n  <title>${document.title || 'Document'}</title>\n</head>\n<body>\n  <h1>${document.title || 'Untitled Document'}</h1>\n  <div>${document.content.replace(/\n/g, '<br>')}</div>\n</body>\n</html>`;
          blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
          extension = 'html';
          break;
        case 'docx':
        case 'pdf':
          showSnackbar('Export to DOCX/PDF coming soon!', 'info');
          return;
        default:
          showSnackbar('Unsupported export format', 'error');
          return;
      }
      const filename = `${document.title || 'document'}.${extension}`;
      saveAs(blob, filename);
      showSnackbar(`Document exported as ${extension.toUpperCase()}`);
    } catch (error) {
      showSnackbar(`Failed to export document: ${error.message}`, 'error');
    }
  }, [document]);

  const handleImport = (event) => {
    if (isDocumentModified && !window.confirm('You have unsaved changes. Are you sure you want to import a new document?')) {
      return;
    }
    
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        loadDocument({
          title: file.name.replace(/\.[^/.]+$/, ''),
          content,
          lastModified: new Date().toISOString()
        });
        showSnackbar('Document imported successfully');
      } catch (error) {
        console.error('Error importing document:', error);
        showSnackbar('Failed to import document', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+S - Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      // Ctrl+N - New Document
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNewDocument();
      }
      // Ctrl+O - Open File
      if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        fileInputRef.current?.click();
      }
      // Ctrl+P - Print
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handlePrint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSave, handlePrint]);

  // Handle beforeunload to warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDocumentModified) {
        const message = 'You have unsaved changes. Are you sure you want to leave?';
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDocumentModified]);

  return (
    <MuiAppBar 
      position="static"
      elevation={1}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: theme.palette.mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
      }}
    >
      <Toolbar variant="dense" sx={{ px: 2 }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={onToggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          {isEditingTitle ? (
            <TextField
              autoFocus
              fullWidth
              variant="standard"
              value={editedTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setIsEditingTitle(false)}
                      edge="end"
                    >
                      <X size={16} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: '1.25rem',
                  fontWeight: 500,
                  color: 'inherit',
                  py: 0.5,
                },
              }}
            />
          ) : (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                '&:hover': {
                  '& .edit-icon': {
                    opacity: 1,
                  }
                }
              }}
              onClick={startTitleEditing}
            >
              <Typography 
                variant="h6" 
                noWrap 
                component="div" 
                sx={{ 
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                {documentTitle || 'Untitled Document'}
                {isModified && ' *'}
                <Edit2 
                  className="edit-icon" 
                  size={16} 
                  style={{ 
                    opacity: 0,
                    transition: 'opacity 0.2s',
                  }} 
                />
              </Typography>
            </Box>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          {/* File Menu */}
          <Tooltip title="File options">
            <IconButton
              size="small"
              color="inherit"
              onClick={handleMenuOpen}
              sx={{ p: 1 }}
            >
              <MoreVertical size={18} />
            </IconButton>
          </Tooltip>
          
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1, bgcolor: 'divider' }} />
          
          {/* Quick Actions */}
          <Tooltip title="New Document">
            <IconButton 
              size="small" 
              color="inherit" 
              onClick={handleNewDocument}
              sx={{ p: 1 }}
            >
              <FilePlus size={18} />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Open">
            <IconButton 
              size="small" 
              color="inherit" 
              onClick={() => fileInputRef.current?.click()}
              sx={{ p: 1 }}
            >
              <FolderOpen size={18} />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Save">
            <IconButton 
              size="small" 
              color="inherit" 
              onClick={handleSave}
              disabled={!isModified}
              sx={{ p: 1 }}
            >
              <Save size={18} />
            </IconButton>
          </Tooltip>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".txt,.md,.docx"
            style={{ display: 'none' }}
          />
          
          <Tooltip title="Import">
            <IconButton 
              size="small" 
              color="inherit" 
              onClick={() => fileInputRef.current?.click()}
              sx={{ p: 1 }}
            >
              <FileDown size={18} />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Export">
            <IconButton 
              size="small" 
              color="inherit" 
              onClick={handleExportMenuOpen}
              disabled={!document?.content}
              sx={{ p: 1 }}
              aria-controls="export-menu"
              aria-haspopup="true"
            >
              <FileUp size={18} />
            </IconButton>
          </Tooltip>
          
          <Menu
            id="export-menu"
            anchorEl={exportMenuAnchorEl}
            open={Boolean(exportMenuAnchorEl)}
            onClose={handleExportMenuClose}
            MenuListProps={{ 'aria-labelledby': 'export-button' }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {exportFormats.map((format) => (
              <MenuItem 
                key={format.id} 
                onClick={() => handleExportFormatSelect(format.id)}
                disabled={format.id === 'docx' || format.id === 'pdf'}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {format.icon}
                  {format.label}
                  {(format.id === 'docx' || format.id === 'pdf') && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      (Coming Soon)
                    </Typography>
                  )}
                </Box>
              </MenuItem>
            ))}
          </Menu>
          
          <Tooltip title="Print (Ctrl+P)">
            <IconButton 
              size="small" 
              color="inherit" 
              onClick={handlePrint}
              sx={{ p: 1, mr: 0.5 }}
            >
              <Printer size={18} />
            </IconButton>
          </Tooltip>
          
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1, bgcolor: 'divider' }} />
          
          {/* Theme Toggle */}
          <Tooltip title={theme.palette.mode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <IconButton 
              size="small" 
              color="inherit" 
              onClick={toggleColorMode}
              sx={{ p: 1 }}
            >
              {theme.palette.mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </IconButton>
          </Tooltip>
        </Box>
        
        {/* File Menu Dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '\"\"',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleNewDocument}>
            <FilePlus size={18} style={{ marginRight: 8 }} />
            New Document
          </MenuItem>
          <MenuItem onClick={() => fileInputRef.current?.click()}>
            <FolderOpen size={18} style={{ marginRight: 8 }} />
            Open...
          </MenuItem>
          <MenuItem onClick={handleSave} disabled={!isDocumentModified}>
            <Save size={18} style={{ marginRight: 8 }} />
            Save
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleExport} disabled={!document?.content}>
            <FileUp size={18} style={{ marginRight: 8 }} />
            Export as...
          </MenuItem>
          <MenuItem onClick={handlePrint}>
            <Printer size={18} style={{ marginRight: 8 }} />
            Print
          </MenuItem>
        </Menu>
        
        {/* Snackbar for notifications */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={3000} 
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
