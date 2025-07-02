import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { X as CloseIcon } from 'lucide-react';

const SaveDialog = ({ open, onClose, documentTitle, onSave }) => {
  const [title, setTitle] = useState(documentTitle || '');
  const [format, setFormat] = useState('docx');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(documentTitle || '');
      setError('');
    }
  }, [open, documentTitle]);

  const handleSave = () => {
    if (!title.trim()) {
      setError('Document title is required');
      return;
    }
    onSave(title, format);
    onClose();
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (error) setError('');
  };

  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Save Document</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon size={20} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box mb={3}>
          <TextField
            autoFocus
            margin="dense"
            label="Document Title"
            fullWidth
            variant="outlined"
            value={title}
            onChange={handleTitleChange}
            error={!!error}
            helperText={error}
          />
        </Box>
        <Box>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="format-label">Format</InputLabel>
            <Select
              labelId="format-label"
              value={format}
              onChange={handleFormatChange}
              label="Format"
            >
              <MenuItem value="docx">Word Document (.docx)</MenuItem>
              <MenuItem value="pdf">PDF (.pdf)</MenuItem>
              <MenuItem value="txt">Plain Text (.txt)</MenuItem>
            </Select>
            <FormHelperText>Select file format for saving</FormHelperText>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          disabled={!title.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveDialog;