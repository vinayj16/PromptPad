import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

const templates = [
  {
    name: 'Resume',
    content: '<h1>Jane Doe</h1><h2>Software Engineer</h2><p>Email: jane@example.com | Phone: 123-456-7890</p><h3>Experience</h3><ul><li>Company A - Developer</li><li>Company B - Intern</li></ul>'
  },
  {
    name: 'Report',
    content: '<h1>Project Report</h1><h2>Executive Summary</h2><p>Lorem ipsum dolor sit amet...</p>'
  },
  {
    name: 'Letter',
    content: '<h2>Dear Sir/Madam,</h2><p>I am writing to...</p>'
  },
  {
    name: 'Blog',
    content: '<h1>My Awesome Blog</h1><h2>Introduction</h2><p>Welcome to my blog...</p>'
  }
];

const TemplatesModal = ({ open, onClose, onInsert }) => {
  const [selected, setSelected] = useState(null);

  const handleInsert = () => {
    if (selected !== null && onInsert) {
      onInsert(templates[selected].content);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Choose a Template</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" gap={3}>
          <List sx={{ minWidth: 200 }}>
            {templates.map((tpl, idx) => (
              <ListItem
                button
                key={tpl.name}
                selected={selected === idx}
                onClick={() => setSelected(idx)}
              >
                <ListItemText primary={tpl.name} />
              </ListItem>
            ))}
          </List>
          <Box flex={1}>
            {selected !== null ? (
              <Paper sx={{ p: 2, minHeight: 200 }}>
                <Typography variant="h6" gutterBottom>Preview</Typography>
                <Box sx={{ background: '#f9f9f9', p: 2, borderRadius: 2 }}>
                  <div dangerouslySetInnerHTML={{ __html: templates[selected].content }} />
                </Box>
              </Paper>
            ) : (
              <Typography color="text.secondary">Select a template to preview</Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleInsert} variant="contained" disabled={selected === null}>Insert</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplatesModal; 