import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, Box, Typography, TextField, Switch, FormControlLabel
} from '@mui/material';

const fontFamilies = [
  'Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Arial Black', 'Comic Sans MS', 'Impact'
];

const PreferencesDialog = ({ open, onClose, onSave }) => {
  const [theme, setTheme] = useState('system');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(16);
  const [autosave, setAutosave] = useState(true);
  const [autosaveInterval, setAutosaveInterval] = useState(30);
  const [accessibility, setAccessibility] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage
    const prefs = JSON.parse(localStorage.getItem('wordProcessorPrefs') || '{}');
    if (prefs.theme) setTheme(prefs.theme);
    if (prefs.fontFamily) setFontFamily(prefs.fontFamily);
    if (prefs.fontSize) setFontSize(prefs.fontSize);
    if (prefs.autosave !== undefined) setAutosave(prefs.autosave);
    if (prefs.autosaveInterval) setAutosaveInterval(prefs.autosaveInterval);
    if (prefs.accessibility !== undefined) setAccessibility(prefs.accessibility);
  }, [open]);

  const handleSave = () => {
    const prefs = { theme, fontFamily, fontSize, autosave, autosaveInterval, accessibility };
    localStorage.setItem('wordProcessorPrefs', JSON.stringify(prefs));
    if (onSave) onSave(prefs);
    if (onClose) onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Preferences</DialogTitle>
      <DialogContent dividers>
        <Box mb={2}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Theme</InputLabel>
            <Select value={theme} label="Theme" onChange={e => setTheme(e.target.value)}>
              <MenuItem value="system">System</MenuItem>
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Font Family</InputLabel>
            <Select value={fontFamily} label="Font Family" onChange={e => setFontFamily(e.target.value)}>
              {fontFamilies.map(font => (
                <MenuItem key={font} value={font} style={{ fontFamily: font }}>{font}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Font Size (px)"
            type="number"
            value={fontSize}
            onChange={e => setFontSize(Number(e.target.value))}
            fullWidth
            sx={{ mb: 2 }}
            inputProps={{ min: 8, max: 72 }}
          />
          <FormControlLabel
            control={<Switch checked={autosave} onChange={e => setAutosave(e.target.checked)} />}
            label="Enable Autosave"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Autosave Interval (seconds)"
            type="number"
            value={autosaveInterval}
            onChange={e => setAutosaveInterval(Number(e.target.value))}
            fullWidth
            sx={{ mb: 2 }}
            inputProps={{ min: 5, max: 300 }}
            disabled={!autosave}
          />
          <FormControlLabel
            control={<Switch checked={accessibility} onChange={e => setAccessibility(e.target.checked)} />}
            label="Accessibility Mode"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreferencesDialog; 