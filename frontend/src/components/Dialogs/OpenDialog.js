import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  CircularProgress,
  Tooltip,
  TextField,
  InputAdornment
} from '@mui/material';
import { X as CloseIcon, Search as SearchIcon, FileText as FileIcon } from 'lucide-react';

const OpenDialog = ({ 
  open, 
  onClose, 
  documents = [], 
  onOpen, 
  onDelete,
  loading = false,
  error = null
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDocs, setFilteredDocs] = useState(documents);

  useEffect(() => {
    if (open) {
      setSearchTerm('');
      setFilteredDocs(documents);
    }
  }, [open, documents]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term) {
      setFilteredDocs(documents);
      return;
    }

    const filtered = documents.filter(
      doc => doc.title.toLowerCase().includes(term) || 
             (doc.content && doc.content.toLowerCase().includes(term))
    );
    setFilteredDocs(filtered);
  };

  const handleOpen = (doc) => {
    onOpen(doc);
    onClose();
  };

  const handleDelete = (e, docId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this document?')) {
      onDelete(docId);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Open Document</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon size={20} />
          </IconButton>
        </Box>
        <Box mt={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon size={20} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box p={2} textAlign="center">
            <Typography color="error">{error}</Typography>
          </Box>
        ) : filteredDocs.length === 0 ? (
          <Box p={4} textAlign="center">
            <Typography color="textSecondary">
              {searchTerm ? 'No matching documents found' : 'No documents available'}
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filteredDocs.map((doc, index) => (
              <React.Fragment key={doc.id}>
                <ListItem 
                  button 
                  onClick={() => handleOpen(doc)}
                  sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                >
                  <FileIcon size={20} style={{ marginRight: 16 }} />
                  <ListItemText 
                    primary={doc.title || 'Untitled Document'}
                    secondary={doc.lastModified ? `Last modified: ${new Date(doc.lastModified).toLocaleString()}` : ''}
                    primaryTypographyProps={{
                      noWrap: true,
                      style: { maxWidth: '70%' }
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Delete">
                      <IconButton 
                        edge="end" 
                        onClick={(e) => handleDelete(e, doc.id)}
                        size="small"
                        color="error"
                      >
                        <CloseIcon size={16} />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < filteredDocs.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OpenDialog;
