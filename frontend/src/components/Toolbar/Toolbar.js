import React, { useState } from 'react';
import {
  AppBar,
  Toolbar as MuiToolbar,
  IconButton,
  Box,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  Divider,
  Tabs,
  Tab,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  AlignLeft as AlignLeftIcon,
  AlignCenter as AlignCenterIcon,
  AlignRight as AlignRightIcon,
  List as ListIcon,
  ListOrdered as ListOrderedIcon,
  Undo2 as UndoIcon,
  Redo2 as RedoIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Shapes as ShapesIcon,
  BarChart2 as ChartIcon,
  Type as TextBoxIcon,
  FileText as HeaderIcon,
  FileText as FooterIcon,
  Hash as PageNumberIcon,
  Asterisk as SymbolIcon,
  Pencil as PenIcon,
  Highlighter as HighlighterIcon,
  Eraser as EraserIcon,
  Droplet as ColorIcon,
  Minus as WidthIcon,
  Trash2 as ClearIcon,
  Palette as PaletteIcon,
  Paintbrush as PaintbrushIcon,
  Type as TypeIcon,
  Layout as LayoutIcon,
  Columns as ColumnsIcon,
  AlignLeft as IndentLeftIcon,
  AlignRight as IndentRightIcon,
  FileText as PageIcon,
  ArrowUpDown as SpacingIcon,
  BookOpen as TOCIcon,
  Book as CitationIcon,
  Bookmark as FootnoteIcon,
  BookText as BibliographyIcon,
  Image as CaptionIcon,
  Link as CrossRefIcon,
  SpellCheck as SpellCheckIcon,
  MessageCircle as CommentIcon,
  Edit3 as TrackChangesIcon,
  Check as AcceptIcon,
  X as RejectIcon,
  Hash as WordCountIcon,
  Printer as PrintIcon,
  Globe as WebIcon,
  BookOpen as ReadIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Maximize2 as ZoomResetIcon,
  Ruler as RulerIcon,
  Grid as GridIcon,
  List as NavPaneIcon,
  HelpCircle as HelpIcon,
  LifeBuoy as SupportIcon,
  MessageSquare as FeedbackIcon,
  GraduationCap as TrainingIcon,
  Sparkles
} from 'lucide-react';
import { useDocument } from '../../context/DocumentContext';

const TABS = [
  'Home',
  'Insert',
  'Draw',
  'Design',
  'Layout',
  'References',
  'Mailings',
  'Review',
  'View',
  'Help'
];

const Toolbar = () => {
  const theme = useTheme();
  const { undo, redo, drawingMode, setDrawingMode, drawColor, setDrawColor, drawWidth, setDrawWidth, setAISidebarOpen } = useDocument();
  const [fontSize, setFontSize] = useState(12);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [selectedTab, setSelectedTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const mode = theme.palette.mode;

  const fontFamilies = [
    'Arial',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana',
    'Tahoma',
    'Trebuchet MS',
    'Arial Black',
    'Comic Sans MS',
    'Impact'
  ];

  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

  const showComingSoon = (msg = 'Feature coming soon!') => setSnackbar({ open: true, message: msg, severity: 'info' });

  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    document.getElementById('editor').focus();
  };

  const handleFontChange = (font) => {
    setFontFamily(font);
    handleFormat('fontName', font);
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    handleFormat('fontSize', size);
  };

  const handleUndo = () => {
    document.execCommand('undo', false, null);
    if (undo) undo();
  };

  const handleRedo = () => {
    document.execCommand('redo', false, null);
    if (redo) redo();
  };

  // Insert Tab Actions
  const handleInsertTable = () => {
    // Simple 2x2 table as a placeholder
    document.execCommand('insertHTML', false, '<table border="1" style="width:100px;"><tr><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr></table>');
    document.getElementById('editor').focus();
  };
  const handleInsertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        document.execCommand('insertImage', false, evt.target.result);
        document.getElementById('editor').focus();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  // Draw Tab Actions
  const handleSelectTool = (tool) => {
    setDrawingMode(tool);
  };
  const handleColorChange = (e) => {
    setDrawColor(e.target.value);
  };
  const handleWidthChange = (e) => {
    setDrawWidth(Number(e.target.value));
  };
  const handleClearDrawings = () => showComingSoon('Clear drawings coming soon!');

  // Design Tab Actions
  const handleThemeChange = (theme) => showComingSoon(`Theme '${theme}' coming soon!`);
  const handleBgColorChange = (color) => {
    document.execCommand('hiliteColor', false, color);
    document.getElementById('editor').focus();
  };

  // Layout Tab Actions
  const handleMarginChange = (margin) => showComingSoon(`Margin '${margin}' coming soon!`);
  const handleOrientationChange = (orientation) => showComingSoon(`Orientation '${orientation}' coming soon!`);
  const handlePageSizeChange = (size) => showComingSoon(`Page size '${size}' coming soon!`);
  const handleColumnsChange = (cols) => showComingSoon(`Columns '${cols}' coming soon!`);
  const handleSpacingChange = (spacing) => showComingSoon(`Paragraph spacing '${spacing}' coming soon!`);
  const handleIndentLeft = (val) => showComingSoon(`Indent left '${val}' coming soon!`);
  const handleIndentRight = (val) => showComingSoon(`Indent right '${val}' coming soon!`);

  // References Tab Actions
  const handleInsertTOC = () => showComingSoon('Insert Table of Contents coming soon!');
  const handleInsertFootnote = () => showComingSoon('Insert Footnote coming soon!');
  const handleInsertCitation = () => showComingSoon('Insert Citation coming soon!');
  const handleInsertBibliography = () => showComingSoon('Insert Bibliography coming soon!');
  const handleInsertCaption = () => showComingSoon('Insert Caption coming soon!');
  const handleInsertCrossRef = () => showComingSoon('Insert Cross-reference coming soon!');

  // Review Tab Actions
  const handleSpellCheck = () => showComingSoon('Spell Check coming soon!');
  const handleComments = () => showComingSoon('Comments coming soon!');
  const handleTrackChanges = () => showComingSoon('Track Changes coming soon!');
  const handleAccept = () => showComingSoon('Accept Change coming soon!');
  const handleReject = () => showComingSoon('Reject Change coming soon!');
  const handleWordCount = () => showComingSoon('Word Count coming soon!');

  // View Tab Actions
  const handlePrintLayout = () => showComingSoon('Print Layout coming soon!');
  const handleWebLayout = () => showComingSoon('Web Layout coming soon!');
  const handleReadMode = () => showComingSoon('Read Mode coming soon!');
  const handleZoomIn = () => showComingSoon('Zoom In coming soon!');
  const handleZoomOut = () => showComingSoon('Zoom Out coming soon!');
  const handleZoomReset = () => showComingSoon('Zoom Reset coming soon!');
  const handleRuler = () => showComingSoon('Ruler toggle coming soon!');
  const handleGridlines = () => showComingSoon('Gridlines toggle coming soon!');
  const handleNavPane = () => showComingSoon('Navigation Pane coming soon!');

  // Help Tab Actions
  const handleHelp = () => showComingSoon('Help dialog coming soon!');
  const handleSupport = () => showComingSoon('Support dialog coming soon!');
  const handleFeedback = () => showComingSoon('Feedback dialog coming soon!');
  const handleTraining = () => showComingSoon('Training dialog coming soon!');

  // Ribbon Tab Bar
  const renderTabs = () => (
    <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: mode === 'dark' ? '1px solid #444' : '1px solid #e0e0e0', background: mode === 'dark' ? '#23272f' : '#f8fafc' }}>
      <Tabs
        value={selectedTab}
        onChange={(_, v) => setSelectedTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Ribbon Tabs"
        sx={{ minHeight: 40, '& .MuiTab-root': { minHeight: 40, fontWeight: 600, fontSize: 15 } }}
      >
        {TABS.map((tab, i) => (
          <Tab key={tab} label={tab} />
        ))}
      </Tabs>
    </AppBar>
  );

  // Toolbars for each tab
  const renderToolbar = () => {
    switch (TABS[selectedTab]) {
      case 'Home':
        return (
          <MuiToolbar
            variant="dense"
            sx={{
              backgroundColor: '#f8fafc',
              color: '#374151',
              borderBottom: '1px solid #e5e7eb',
              minHeight: '48px !important',
              overflowX: 'auto',
              px: 2,
              gap: 1,
              '& .MuiToolbar-root': {
                minHeight: '48px !important',
              },
              '& .MuiIconButton-root': {
                borderRadius: 4,
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: '#e0e7ff',
                  color: '#2563eb',
                },
                '&.Mui-selected': {
                  backgroundColor: '#2563eb',
                  color: '#fff',
                }
              },
              '& .MuiDivider-root': {
                backgroundColor: '#e5e7eb',
                margin: '0 8px',
              }
            }}
          >
            {/* Clipboard Group */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 2 }}>
              <Tooltip title="Undo (Ctrl+Z)">
                <IconButton onClick={handleUndo} size="small">
                  <UndoIcon size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Redo (Ctrl+Y)">
                <IconButton onClick={handleRedo} size="small">
                  <RedoIcon size={18} />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider orientation="vertical" flexItem />
            
            {/* Font Group */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
              <FormControl size="small" variant="outlined" sx={{ minWidth: 140 }}>
                <Select
                  value={fontFamily}
                  onChange={(e) => handleFontChange(e.target.value)}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Font Family' }}
                  sx={{
                    height: 32,
                    fontSize: '0.875rem',
                    '& .MuiSelect-select': {
                      paddingTop: '6px',
                      paddingBottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                    },
                  }}
                >
                  {fontFamilies.map((font) => (
                    <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" variant="outlined" sx={{ minWidth: 70 }}>
                <Select
                  value={fontSize}
                  onChange={(e) => handleFontSizeChange(e.target.value)}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Font Size' }}
                  sx={{
                    height: 32,
                    '& .MuiSelect-select': {
                      paddingTop: '6px',
                      paddingBottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                    },
                  }}
                >
                  {fontSizes.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Divider orientation="vertical" flexItem />
            
            {/* Font Style Group */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 2 }}>
              <Tooltip title="Bold (Ctrl+B)">
                <IconButton onClick={() => handleFormat('bold')} size="small">
                  <BoldIcon size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Italic (Ctrl+I)">
                <IconButton onClick={() => handleFormat('italic')} size="small">
                  <ItalicIcon size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Underline (Ctrl+U)">
                <IconButton onClick={() => handleFormat('underline')} size="small">
                  <UnderlineIcon size={18} />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider orientation="vertical" flexItem />
            
            {/* Paragraph Group */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 2 }}>
              <Tooltip title="Align Left">
                <IconButton onClick={() => handleFormat('justifyLeft')} size="small">
                  <AlignLeftIcon size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Center">
                <IconButton onClick={() => handleFormat('justifyCenter')} size="small">
                  <AlignCenterIcon size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Align Right">
                <IconButton onClick={() => handleFormat('justifyRight')} size="small">
                  <AlignRightIcon size={18} />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider orientation="vertical" flexItem />
            
            {/* Insert Group */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 2 }}>
              <Tooltip title="Bulleted List">
                <IconButton onClick={() => handleFormat('insertUnorderedList')} size="small">
                  <ListIcon size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Numbered List">
                <IconButton onClick={() => handleFormat('insertOrderedList')} size="small">
                  <ListOrderedIcon size={18} />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider orientation="vertical" flexItem />
            
            {/* Insert Objects Group */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 2 }}>
              <Tooltip title="Insert Image">
                <IconButton onClick={handleInsertImage} size="small">
                  <ImageIcon size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Insert Table">
                <IconButton onClick={handleInsertTable} size="small">
                  <TableIcon size={18} />
                </IconButton>
              </Tooltip>
            </Box>
            
            {/* AI Assistant Button - right side */}
            <Box sx={{ flexGrow: 1 }} />
            <Tooltip title="AI Assistant">
              <IconButton 
                color="primary" 
                onClick={() => setAISidebarOpen(true)} 
                size="small" 
                sx={{ 
                  ml: 2,
                  backgroundColor: '#e0e7ff',
                  '&:hover': {
                    backgroundColor: '#2563eb',
                    color: '#fff',
                  }
                }}
              >
                <Sparkles size={20} />
              </IconButton>
            </Tooltip>
          </MuiToolbar>
        );
      case 'Insert':
        return (
          <MuiToolbar
            variant="dense"
            sx={{
              backgroundColor: mode === 'dark' ? '#2d2d2d' : '#f5f5f5',
              color: mode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
              borderBottom: mode === 'dark' ? '1px solid #444' : '1px solid #e0e0e0',
              minHeight: '48px !important',
              overflowX: 'auto',
              px: 1,
              '& .MuiToolbar-root': {
                minHeight: '48px !important',
              }
            }}
          >
            {/* Table */}
            <Tooltip title="Insert Table">
              <IconButton onClick={handleInsertTable} size="small">
                <TableIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Image */}
            <Tooltip title="Insert Image">
              <IconButton onClick={handleInsertImage} size="small">
                <ImageIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Shape */}
            <Tooltip title="Insert Shape">
              <IconButton onClick={() => alert('Shape picker coming soon!')} size="small">
                <ShapesIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Chart */}
            <Tooltip title="Insert Chart">
              <IconButton onClick={() => alert('Chart picker coming soon!')} size="small">
                <ChartIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Text Box */}
            <Tooltip title="Insert Text Box">
              <IconButton onClick={() => alert('Text Box coming soon!')} size="small">
                <TextBoxIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Header */}
            <Tooltip title="Insert Header">
              <IconButton onClick={() => alert('Header coming soon!')} size="small">
                <HeaderIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Footer */}
            <Tooltip title="Insert Footer">
              <IconButton onClick={() => alert('Footer coming soon!')} size="small">
                <FooterIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Page Number */}
            <Tooltip title="Insert Page Number">
              <IconButton onClick={() => alert('Page Number coming soon!')} size="small">
                <PageNumberIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Symbol */}
            <Tooltip title="Insert Symbol">
              <IconButton onClick={() => alert('Symbol picker coming soon!')} size="small">
                <SymbolIcon size={20} />
              </IconButton>
            </Tooltip>
          </MuiToolbar>
        );
      case 'Draw':
        return (
          <MuiToolbar
            variant="dense"
            sx={{
              backgroundColor: mode === 'dark' ? '#2d2d2d' : '#f5f5f5',
              color: mode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
              borderBottom: mode === 'dark' ? '1px solid #444' : '1px solid #e0e0e0',
              minHeight: '48px !important',
              overflowX: 'auto',
              px: 1,
              '& .MuiToolbar-root': {
                minHeight: '48px !important',
              }
            }}
          >
            {/* Pen */}
            <Tooltip title="Pen">
              <IconButton color={drawingMode === 'pen' ? 'primary' : 'default'} onClick={() => handleSelectTool('pen')} size="small">
                <PenIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Highlighter */}
            <Tooltip title="Highlighter">
              <IconButton color={drawingMode === 'highlighter' ? 'primary' : 'default'} onClick={() => handleSelectTool('highlighter')} size="small">
                <HighlighterIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Eraser */}
            <Tooltip title="Eraser">
              <IconButton color={drawingMode === 'eraser' ? 'primary' : 'default'} onClick={() => handleSelectTool('eraser')} size="small">
                <EraserIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Color Picker */}
            <Tooltip title="Color">
              <IconButton size="small" component="label">
                <ColorIcon size={20} />
                <input type="color" value={drawColor} onChange={handleColorChange} style={{ display: 'none' }} />
              </IconButton>
            </Tooltip>
            {/* Width Selector */}
            <Tooltip title="Width">
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                <WidthIcon size={18} />
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={drawWidth}
                  onChange={handleWidthChange}
                  style={{ width: 60, marginLeft: 4 }}
                />
              </Box>
            </Tooltip>
            {/* Clear */}
            <Tooltip title="Clear Drawings">
              <IconButton onClick={handleClearDrawings} size="small">
                <ClearIcon size={20} />
              </IconButton>
            </Tooltip>
          </MuiToolbar>
        );
      case 'Design':
        return (
          <MuiToolbar
            variant="dense"
            sx={{
              backgroundColor: mode === 'dark' ? '#2d2d2d' : '#f5f5f5',
              color: mode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
              borderBottom: mode === 'dark' ? '1px solid #444' : '1px solid #e0e0e0',
              minHeight: '48px !important',
              overflowX: 'auto',
              px: 1,
              '& .MuiToolbar-root': {
                minHeight: '48px !important',
              }
            }}
          >
            {/* Theme Selector */}
            <Tooltip title="Theme">
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <PaintbrushIcon size={20} style={{ marginRight: 4 }} />
                <select onChange={e => handleThemeChange(e.target.value)} style={{ fontSize: 14 }}>
                  <option value="vibrant">Vibrant</option>
                  <option value="sunset">Sunset</option>
                  <option value="mint">Mint</option>
                  <option value="night">Night</option>
                  <option value="classic">Classic</option>
                </select>
              </Box>
            </Tooltip>
            {/* Color Palette */}
            <Tooltip title="Text Color">
              <IconButton size="small" component="label">
                <PaletteIcon size={20} />
                <input type="color" onChange={e => handleColorChange(e.target.value)} style={{ display: 'none' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Background Color">
              <IconButton size="small" component="label">
                <PaletteIcon size={20} style={{ opacity: 0.5 }} />
                <input type="color" onChange={e => handleBgColorChange(e.target.value)} style={{ display: 'none' }} />
              </IconButton>
            </Tooltip>
            {/* Font Selector */}
            <Tooltip title="Font">
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                <TypeIcon size={20} style={{ marginRight: 4 }} />
                <select onChange={e => handleFontChange(e.target.value)} style={{ fontSize: 14 }}>
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Tahoma">Tahoma</option>
                  <option value="Trebuchet MS">Trebuchet MS</option>
                  <option value="Arial Black">Arial Black</option>
                  <option value="Comic Sans MS">Comic Sans MS</option>
                  <option value="Impact">Impact</option>
                </select>
              </Box>
            </Tooltip>
          </MuiToolbar>
        );
      case 'Layout':
        return (
          <MuiToolbar
            variant="dense"
            sx={{
              backgroundColor: mode === 'dark' ? '#2d2d2d' : '#f5f5f5',
              color: mode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
              borderBottom: mode === 'dark' ? '1px solid #444' : '1px solid #e0e0e0',
              minHeight: '48px !important',
              overflowX: 'auto',
              px: 1,
              '& .MuiToolbar-root': {
                minHeight: '48px !important',
              }
            }}
          >
            {/* Margins */}
            <Tooltip title="Margins">
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <LayoutIcon size={20} style={{ marginRight: 4 }} />
                <select onChange={e => handleMarginChange(e.target.value)} style={{ fontSize: 14 }}>
                  <option value="normal">Normal</option>
                  <option value="narrow">Narrow</option>
                  <option value="wide">Wide</option>
                  <option value="custom">Custom</option>
                </select>
              </Box>
            </Tooltip>
            {/* Orientation */}
            <Tooltip title="Orientation">
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <PageIcon size={20} style={{ marginRight: 4 }} />
                <select onChange={e => handleOrientationChange(e.target.value)} style={{ fontSize: 14 }}>
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </Box>
            </Tooltip>
            {/* Page Size */}
            <Tooltip title="Page Size">
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <PageIcon size={20} style={{ marginRight: 4 }} />
                <select onChange={e => handlePageSizeChange(e.target.value)} style={{ fontSize: 14 }}>
                  <option value="A4">A4</option>
                  <option value="Letter">Letter</option>
                  <option value="Legal">Legal</option>
                  <option value="Executive">Executive</option>
                </select>
              </Box>
            </Tooltip>
            {/* Columns */}
            <Tooltip title="Columns">
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <ColumnsIcon size={20} style={{ marginRight: 4 }} />
                <select onChange={e => handleColumnsChange(e.target.value)} style={{ fontSize: 14 }}>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
              </Box>
            </Tooltip>
            {/* Paragraph Spacing */}
            <Tooltip title="Paragraph Spacing">
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <SpacingIcon size={20} style={{ marginRight: 4 }} />
                <select onChange={e => handleSpacingChange(e.target.value)} style={{ fontSize: 14 }}>
                  <option value={1}>1.0</option>
                  <option value={1.15}>1.15</option>
                  <option value={1.5}>1.5</option>
                  <option value={2}>2.0</option>
                </select>
              </Box>
            </Tooltip>
            {/* Indent Left */}
            <Tooltip title="Indent Left">
              <IconButton onClick={() => handleIndentLeft('+')} size="small">
                <IndentLeftIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Indent Right */}
            <Tooltip title="Indent Right">
              <IconButton onClick={() => handleIndentRight('+')} size="small">
                <IndentRightIcon size={20} />
              </IconButton>
            </Tooltip>
          </MuiToolbar>
        );
      case 'References':
        return (
          <MuiToolbar
            variant="dense"
            sx={{
              backgroundColor: mode === 'dark' ? '#2d2d2d' : '#f5f5f5',
              color: mode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
              borderBottom: mode === 'dark' ? '1px solid #444' : '1px solid #e0e0e0',
              minHeight: '48px !important',
              overflowX: 'auto',
              px: 1,
              '& .MuiToolbar-root': {
                minHeight: '48px !important',
              }
            }}
          >
            {/* Table of Contents */}
            <Tooltip title="Table of Contents">
              <IconButton onClick={handleInsertTOC} size="small">
                <TOCIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Footnote */}
            <Tooltip title="Footnote">
              <IconButton onClick={handleInsertFootnote} size="small">
                <FootnoteIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Citation */}
            <Tooltip title="Citation">
              <IconButton onClick={handleInsertCitation} size="small">
                <CitationIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Bibliography */}
            <Tooltip title="Bibliography">
              <IconButton onClick={handleInsertBibliography} size="small">
                <BibliographyIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Caption */}
            <Tooltip title="Caption">
              <IconButton onClick={handleInsertCaption} size="small">
                <CaptionIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Cross-reference */}
            <Tooltip title="Cross-reference">
              <IconButton onClick={handleInsertCrossRef} size="small">
                <CrossRefIcon size={20} />
              </IconButton>
            </Tooltip>
          </MuiToolbar>
        );
      case 'Review':
        return (
          <MuiToolbar
            variant="dense"
            sx={{
              backgroundColor: mode === 'dark' ? '#2d2d2d' : '#f5f5f5',
              color: mode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
              borderBottom: mode === 'dark' ? '1px solid #444' : '1px solid #e0e0e0',
              minHeight: '48px !important',
              overflowX: 'auto',
              px: 1,
              '& .MuiToolbar-root': {
                minHeight: '48px !important',
              }
            }}
          >
            {/* Spell Check */}
            <Tooltip title="Spell Check">
              <IconButton onClick={handleSpellCheck} size="small">
                <SpellCheckIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Comments */}
            <Tooltip title="Comments">
              <IconButton onClick={handleComments} size="small">
                <CommentIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Track Changes */}
            <Tooltip title="Track Changes">
              <IconButton onClick={handleTrackChanges} size="small">
                <TrackChangesIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Accept */}
            <Tooltip title="Accept Change">
              <IconButton onClick={handleAccept} size="small">
                <AcceptIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Reject */}
            <Tooltip title="Reject Change">
              <IconButton onClick={handleReject} size="small">
                <RejectIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Word Count */}
            <Tooltip title="Word Count">
              <IconButton onClick={handleWordCount} size="small">
                <WordCountIcon size={20} />
              </IconButton>
            </Tooltip>
          </MuiToolbar>
        );
      case 'View':
        return (
          <MuiToolbar
            variant="dense"
            sx={{
              backgroundColor: mode === 'dark' ? '#2d2d2d' : '#f5f5f5',
              color: mode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
              borderBottom: mode === 'dark' ? '1px solid #444' : '1px solid #e0e0e0',
              minHeight: '48px !important',
              overflowX: 'auto',
              px: 1,
              '& .MuiToolbar-root': {
                minHeight: '48px !important',
              }
            }}
          >
            {/* Print Layout */}
            <Tooltip title="Print Layout">
              <IconButton onClick={handlePrintLayout} size="small">
                <PrintIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Web Layout */}
            <Tooltip title="Web Layout">
              <IconButton onClick={handleWebLayout} size="small">
                <WebIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Read Mode */}
            <Tooltip title="Read Mode">
              <IconButton onClick={handleReadMode} size="small">
                <ReadIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Zoom In */}
            <Tooltip title="Zoom In">
              <IconButton onClick={handleZoomIn} size="small">
                <ZoomInIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Zoom Out */}
            <Tooltip title="Zoom Out">
              <IconButton onClick={handleZoomOut} size="small">
                <ZoomOutIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Zoom Reset */}
            <Tooltip title="Zoom Reset">
              <IconButton onClick={handleZoomReset} size="small">
                <ZoomResetIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Ruler */}
            <Tooltip title="Ruler">
              <IconButton onClick={handleRuler} size="small">
                <RulerIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Gridlines */}
            <Tooltip title="Gridlines">
              <IconButton onClick={handleGridlines} size="small">
                <GridIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Navigation Pane */}
            <Tooltip title="Navigation Pane">
              <IconButton onClick={handleNavPane} size="small">
                <NavPaneIcon size={20} />
              </IconButton>
            </Tooltip>
          </MuiToolbar>
        );
      case 'Help':
        return (
          <MuiToolbar
            variant="dense"
            sx={{
              backgroundColor: mode === 'dark' ? '#2d2d2d' : '#f5f5f5',
              color: mode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
              borderBottom: mode === 'dark' ? '1px solid #444' : '1px solid #e0e0e0',
              minHeight: '48px !important',
              overflowX: 'auto',
              px: 1,
              '& .MuiToolbar-root': {
                minHeight: '48px !important',
              }
            }}
          >
            {/* Help */}
            <Tooltip title="Help">
              <IconButton onClick={handleHelp} size="small">
                <HelpIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Support */}
            <Tooltip title="Support">
              <IconButton onClick={handleSupport} size="small">
                <SupportIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Feedback */}
            <Tooltip title="Feedback">
              <IconButton onClick={handleFeedback} size="small">
                <FeedbackIcon size={20} />
              </IconButton>
            </Tooltip>
            {/* Training */}
            <Tooltip title="Training">
              <IconButton onClick={handleTraining} size="small">
                <TrainingIcon size={20} />
              </IconButton>
            </Tooltip>
          </MuiToolbar>
        );
      default:
        return (
          <MuiToolbar
            variant="dense"
            sx={{
              backgroundColor: mode === 'dark' ? '#2d2d2d' : '#f5f5f5',
              color: mode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
              borderBottom: mode === 'dark' ? '1px solid #444' : '1px solid #e0e0e0',
              minHeight: '48px !important',
              overflowX: 'auto',
              px: 1,
              '& .MuiToolbar-root': {
                minHeight: '48px !important',
              }
            }}
          >
            <Typography variant="body1" sx={{ color: '#888', fontStyle: 'italic' }}>
              {TABS[selectedTab]} Toolbar coming soon...
            </Typography>
          </MuiToolbar>
        );
    }
  };

  return (
    <Box>
      {renderTabs()}
      {renderToolbar()}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Toolbar;