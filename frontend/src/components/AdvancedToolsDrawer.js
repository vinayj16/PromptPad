import React, { useState } from 'react';
import { Drawer, Box, Typography, IconButton, Divider, Button, CircularProgress, Menu, MenuItem } from '@mui/material';
import { X as CloseIcon, BookOpen, Book, Image as ImageIcon, Code, Sparkles, Download, Cloud, Share2 } from 'lucide-react';

const tools = [
  { label: 'AI Table of Contents', icon: <BookOpen size={18} />, handler: 'onGenerateTOC' },
  { label: 'Smart Citations', icon: <Book size={18} />, handler: 'onGenerateCitations' },
  { label: 'Image Suggestions', icon: <ImageIcon size={18} />, handler: 'onImageSuggestions' },
  { label: 'Code Formatter', icon: <Code size={18} />, handler: 'onFormatCode' },
  { label: 'Smart Formatting', icon: <Sparkles size={18} />, handler: 'onSmartFormat' },
  { label: 'Enhanced Export', icon: <Download size={18} />, handler: 'onExport' },
  { label: 'Auto-Publish', icon: <Share2 size={18} />, handler: 'onPublish' },
  { label: 'Cloud Save', icon: <Cloud size={18} />, handler: 'onCloudSave' },
];

const AdvancedToolsDrawer = ({ open, onClose, ...handlers }) => {
  const [loading, setLoading] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);

  const handleTool = async (tool, event) => {
    setLoading(tool.label);
    setError('');
    setResult('');
    try {
      if (tool.handler === 'onExport') {
        setExportMenuAnchor(event.currentTarget);
        setLoading('');
        return;
      }
      if (handlers[tool.handler]) {
        const res = await handlers[tool.handler]();
        setResult(res || 'Done!');
      } else {
        setResult('Feature coming soon!');
      }
    } catch (err) {
      setError('Failed to run tool.');
    } finally {
      setLoading('');
    }
  };

  const handleExportFormat = async (format) => {
    setExportMenuAnchor(null);
    if (handlers.onExport) {
      await handlers.onExport(format);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 400, p: 2 } }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Advanced Tools</Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon size={20} /></IconButton>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box display="flex" flexDirection="column" gap={2}>
        {tools.map(tool => (
          tool.handler === 'onExport' ? (
            <Button
              key={tool.label}
              variant="outlined"
              startIcon={tool.icon}
              onClick={e => handleTool(tool, e)}
              disabled={!!loading}
              sx={{ justifyContent: 'flex-start' }}
              fullWidth
            >
              {loading === tool.label ? <CircularProgress size={18} sx={{ mr: 1 }} /> : tool.label}
            </Button>
          ) : (
            <Button
              key={tool.label}
              variant="outlined"
              startIcon={tool.icon}
              onClick={() => handleTool(tool)}
              disabled={!!loading}
              sx={{ justifyContent: 'flex-start' }}
              fullWidth
            >
              {loading === tool.label ? <CircularProgress size={18} sx={{ mr: 1 }} /> : tool.label}
            </Button>
          )
        ))}
      </Box>
      <Menu
        anchorEl={exportMenuAnchor}
        open={!!exportMenuAnchor}
        onClose={() => setExportMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleExportFormat('txt')}>Export as TXT</MenuItem>
        <MenuItem onClick={() => handleExportFormat('md')}>Export as Markdown</MenuItem>
        <MenuItem onClick={() => handleExportFormat('html')}>Export as HTML</MenuItem>
        <MenuItem disabled>Export as DOCX (Coming soon!)</MenuItem>
        <MenuItem disabled>Export as PDF (Coming soon!)</MenuItem>
      </Menu>
      <Divider sx={{ my: 2 }} />
      {error && <Typography color="error" mb={2}>{error}</Typography>}
      {result && <Box sx={{ background: '#f4f4f4', p: 2, borderRadius: 2, mt: 1 }}>
        <Typography variant="body2">{result}</Typography>
      </Box>}
    </Drawer>
  );
};

export default AdvancedToolsDrawer; 