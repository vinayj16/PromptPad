import React, { useState } from 'react';
import { Box, Drawer, IconButton, Typography, Button, TextField, CircularProgress, Divider, Tooltip, Chip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { X as CloseIcon, Sparkles, Download, Image as ImageIcon } from 'lucide-react';
import { insertOrReplaceSelection } from './Editor/MainContent';

const quickActions = [
  { label: 'Summarize', type: 'summarize', icon: <Sparkles size={16} /> },
  { label: 'Rewrite', type: 'rewrite', icon: <Sparkles size={16} /> },
  { label: 'Expand', type: 'expand', icon: <Sparkles size={16} /> },
  { label: 'Simplify', type: 'simplify', icon: <Sparkles size={16} /> },
  { label: 'Formalize', type: 'formalize', icon: <Sparkles size={16} /> },
  { label: 'Make Casual', type: 'casualize', icon: <Sparkles size={16} /> },
  { label: 'Make Persuasive', type: 'persuasive', icon: <Sparkles size={16} /> },
  { label: 'Make Creative', type: 'creative', icon: <Sparkles size={16} /> },
];

// Writing Goals
const writingGoals = [
  { value: 'general', label: 'General Writing', icon: '📝' },
  { value: 'academic', label: 'Academic Essay', icon: '🎓' },
  { value: 'business', label: 'Business Document', icon: '💼' },
  { value: 'creative', label: 'Creative Writing', icon: '✨' },
  { value: 'technical', label: 'Technical Document', icon: '⚙️' },
  { value: 'marketing', label: 'Marketing Copy', icon: '📢' },
  { value: 'legal', label: 'Legal Document', icon: '⚖️' },
  { value: 'blog', label: 'Blog Post', icon: '📰' },
  { value: 'resume', label: 'Resume/CV', icon: '📄' },
  { value: 'email', label: 'Email', icon: '📧' }
];
const aiPersonas = [
  { value: 'assistant', label: 'General Assistant', icon: '🤖' },
  { value: 'grammar_expert', label: 'Grammar Expert', icon: '📚' },
  { value: 'copywriter', label: 'Copywriter', icon: '✍️' },
  { value: 'teacher', label: 'Teacher', icon: '👨‍🏫' },
  { value: 'lawyer', label: 'Legal Expert', icon: '⚖️' },
  { value: 'marketer', label: 'Marketing Expert', icon: '📈' },
  { value: 'scientist', label: 'Scientific Writer', icon: '🔬' },
  { value: 'storyteller', label: 'Storyteller', icon: '📖' }
];
const writingStyles = [
  { value: 'neutral', label: 'Neutral', icon: '⚖️' },
  { value: 'formal', label: 'Formal', icon: '🎩' },
  { value: 'casual', label: 'Casual', icon: '😊' },
  { value: 'persuasive', label: 'Persuasive', icon: '💪' },
  { value: 'creative', label: 'Creative', icon: '🎨' },
  { value: 'technical', label: 'Technical', icon: '🔧' },
  { value: 'shakespearean', label: 'Shakespearean', icon: '🎭' },
  { value: 'poetic', label: 'Poetic', icon: '🌹' }
];
const targetAudiences = [
  { value: 'general', label: 'General Public', icon: '👥' },
  { value: 'beginners', label: 'Beginners', icon: '🌱' },
  { value: 'experts', label: 'Experts', icon: '🎯' },
  { value: 'students', label: 'Students', icon: '🎓' },
  { value: 'professionals', label: 'Professionals', icon: '💼' },
  { value: 'children', label: 'Children', icon: '👶' }
];
const documentTypes = [
  { value: 'document', label: 'General Document', icon: '📄' },
  { value: 'essay', label: 'Essay', icon: '📝' },
  { value: 'report', label: 'Report', icon: '📊' },
  { value: 'proposal', label: 'Proposal', icon: '📋' },
  { value: 'story', label: 'Story', icon: '📖' },
  { value: 'article', label: 'Article', icon: '📰' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'presentation', label: 'Presentation', icon: '📽️' }
];

const AISidebar = ({ open, onClose, onInsert, editorContent, selectedText, onResult }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [aiImage, setAiImage] = useState(null);
  const [error, setError] = useState('');
  const [goal, setGoal] = useState('general');
  const [persona, setPersona] = useState('assistant');
  const [style, setStyle] = useState('neutral');
  const [audience, setAudience] = useState('general');
  const [docType, setDocType] = useState('document');
  // Conversation history: [{role: 'user'|'ai', text: string}]
  const [history, setHistory] = useState([]);

  const handleAIAction = async (type, params = {}) => {
    setLoading(true);
    setError('');
    setAiResult('');
    // Add user prompt to history
    setHistory(prev => [...prev, { role: 'user', text: params.prompt || prompt }]);
    try {
      const response = await fetch(`http://localhost:3000/ai/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: selectedText && selectedText.trim() ? selectedText : editorContent,
          prompt,
          writingGoal: goal,
          aiPersona: persona,
          writingStyle: style,
          targetAudience: audience,
          documentType: docType,
          ...params
        })
      });
      if (!response.ok) throw new Error('AI request failed');
      const data = await response.json();
      setAiResult(data.result || 'No response from AI');
      setHistory(prev => [...prev, { role: 'ai', text: data.result || 'No response from AI' }]);
      if (onResult) onResult(data.result);
    } catch (err) {
      setError('Failed to get AI response.');
      setHistory(prev => [...prev, { role: 'ai', text: 'Failed to get AI response.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setAiImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInsert = (result) => {
    if (selectedText && selectedText.trim()) {
      insertOrReplaceSelection(result);
    } else if (onInsert) {
      onInsert(result);
    }
    if (onClose) onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 360, p: 2 } }}>
      <Box display="flex" flexDirection="column" gap={2} height="100%">
        {/* Conversation History */}
        <Box flex={1} overflow="auto" mb={2} sx={{ maxHeight: 320 }}>
          {history.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
              Start a conversation with ChatGPT/AI Assistant!
            </Typography>
          )}
          {history.map((msg, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                mb: 1
              }}
            >
              <Box
                sx={{
                  bgcolor: msg.role === 'user' ? '#2563eb' : '#f3f4f6',
                  color: msg.role === 'user' ? 'white' : 'black',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  maxWidth: '80%',
                  boxShadow: msg.role === 'user' ? 2 : 1,
                  fontSize: '1rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {msg.text}
              </Box>
            </Box>
          ))}
        </Box>
        <Box display="flex" flexDirection="column" gap={1}>
          <FormControl size="small" fullWidth>
            <InputLabel>Writing Goal</InputLabel>
            <Select value={goal} label="Writing Goal" onChange={e => setGoal(e.target.value)}>
              {writingGoals.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.icon} {opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>AI Persona</InputLabel>
            <Select value={persona} label="AI Persona" onChange={e => setPersona(e.target.value)}>
              {aiPersonas.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.icon} {opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>Writing Style</InputLabel>
            <Select value={style} label="Writing Style" onChange={e => setStyle(e.target.value)}>
              {writingStyles.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.icon} {opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>Audience</InputLabel>
            <Select value={audience} label="Audience" onChange={e => setAudience(e.target.value)}>
              {targetAudiences.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.icon} {opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>Document Type</InputLabel>
            <Select value={docType} label="Document Type" onChange={e => setDocType(e.target.value)}>
              {documentTypes.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.icon} {opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6">AI Assistant</Typography>
          <IconButton onClick={onClose} size="small"><CloseIcon size={20} /></IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box mb={2}>
          <TextField
            fullWidth
            label="Custom AI Prompt"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            size="small"
            variant="outlined"
          />
          {selectedText && selectedText.trim() && (
            <Chip label="Using selected text" color="primary" size="small" sx={{ mt: 1, mb: 1 }} />
          )}
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 1 }}
            onClick={() => handleAIAction('custom', { prompt })}
            disabled={loading || !prompt.trim()}
          >
            {loading ? <CircularProgress size={20} /> : 'Ask AI'}
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="subtitle2" gutterBottom>Quick Actions</Typography>
        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          {quickActions.map(action => (
            <Tooltip title={action.label} key={action.type}>
              <Button
                size="small"
                variant="outlined"
                startIcon={action.icon}
                onClick={() => handleAIAction(action.type)}
                disabled={loading}
                sx={{ mb: 1 }}
              >
                {action.label}
              </Button>
            </Tooltip>
          ))}
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="subtitle2" gutterBottom>Image Upload</Typography>
        <Box mb={2}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<ImageIcon size={16} />}
            fullWidth
          >
            Upload Image
            <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
          </Button>
          {aiImage && (
            <Box mt={1}>
              <img src={aiImage} alt="Uploaded" style={{ width: '100%', borderRadius: 8 }} />
            </Box>
          )}
        </Box>
        <Divider sx={{ mb: 2 }} />
        {error && <Typography color="error" mb={2}>{error}</Typography>}
        {aiResult && (
          <Box mb={2}>
            <Typography variant="subtitle2">AI Response</Typography>
            <Box sx={{ background: '#f4f4f4', p: 2, borderRadius: 2, mt: 1, mb: 1 }}>
              <Typography variant="body2">{aiResult}</Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Download size={16} />}
              onClick={() => handleInsert(aiResult)}
              fullWidth
            >
              Insert into Document
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default AISidebar; 