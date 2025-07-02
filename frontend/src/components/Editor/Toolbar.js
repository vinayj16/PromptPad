import React, { useState } from 'react';
import { 
  Box, 
  ToggleButtonGroup, 
  ToggleButton, 
  Divider, 
  IconButton, 
  Tooltip,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Popover,
  Typography,
  Slider,
  Button,
  Input
} from '@mui/material';
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough as StrikethroughIcon,
  Code as CodeIcon,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Type as FontIcon,
  Type as Heading1Icon,
  Type as Heading2Icon,
  Type as Heading3Icon,
  Type as Heading4Icon,
  Type as Heading5Icon,
  Type as Heading6Icon,
  Palette as ColorIcon,
  Highlighter as HighlightIcon,
  ChevronDown as ChevronDownIcon,
  AlignLeft as AlignLeftIcon,
  AlignCenter as AlignCenterIcon,
  AlignRight as AlignRightIcon,
  AlignJustify as AlignJustifyIcon,
  List as ListIcon,
  ListOrdered as ListOrderedIcon,
  Indent as IndentIcon,
  Outdent as OutdentIcon,
  Link2 as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Minus as HorizontalRuleIcon,
  Quote as BlockquoteIcon,
  Code as CodeBlockIcon,
  Undo2 as UndoIcon,
  Redo2 as RedoIcon,
  Search as FindIcon,
  Replace as ReplaceIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Fullscreen as FullscreenIcon,
  Settings as SettingsIcon,
  HelpCircle as HelpIcon,
  HelpOutline as HelpOutlineIcon
} from 'lucide-react';
import SpellCheckIcon from '@mui/icons-material/Spellcheck';
import EditIcon from '@mui/icons-material/Edit';
import SummarizeIcon from '@mui/icons-material/Summarize';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import TranslateIcon from '@mui/icons-material/Translate';
import MicIcon from '@mui/icons-material/Mic';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import TitleIcon from '@mui/icons-material/Title';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import LinkIcon from '@mui/icons-material/Link';

const Toolbar = ({ onGrammarCheck, onRewrite, onSummarize, onToneDetect, onTranslate, onExplain, onVoiceTyping, isDictating, onAskAI, onGenerateTitle, onGenerateOutline, onSmartCitation, onFactCheck, onResearchAssistant }) => {
  const theme = useTheme();
  const [fontMenuAnchor, setFontMenuAnchor] = useState(null);
  const [textColorAnchor, setTextColorAnchor] = useState(null);
  const [highlightColorAnchor, setHighlightColorAnchor] = useState(null);
  const [fontSize, setFontSize] = useState(14);
  const [format, setFormat] = useState(() => []);
  const [alignment, setAlignment] = useState('left');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rewriteAnchor, setRewriteAnchor] = useState(null);

  const handleFormat = (event, newFormats) => {
    setFormat(newFormats);
  };

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  const handleFontMenuOpen = (event) => {
    setFontMenuAnchor(event.currentTarget);
  };

  const handleFontMenuClose = () => {
    setFontMenuAnchor(null);
  };

  const handleTextColorClick = (event) => {
    setTextColorAnchor(event.currentTarget);
  };

  const handleTextColorClose = () => {
    setTextColorAnchor(null);
  };

  const handleHighlightColorClick = (event) => {
    setHighlightColorAnchor(event.currentTarget);
  };

  const handleHighlightColorClose = () => {
    setHighlightColorAnchor(null);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // Implement actual fullscreen logic here
  };

  const handleRewriteClick = (event) => setRewriteAnchor(event.currentTarget);
  const handleRewriteClose = () => setRewriteAnchor(null);
  const handleRewriteType = (type) => {
    handleRewriteClose();
    if (onRewrite) onRewrite(type);
  };

  // Font families and sizes
  const fonts = [
    'Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia', 
    'Trebuchet MS', 'Arial Black', 'Comic Sans MS', 'Impact', 'Lucida Console'
  ];

  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

  const colors = [
    '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF',
    '#980000', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF',
    '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC',
    '#DD7E6B', '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#A4C2F4', '#9FC5E8', '#B4A7D6', '#D5A6BD',
    '#CC4125', '#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6D9EEB', '#6FA8DC', '#8E7CC3', '#C27BA0',
    '#A61C00', '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3C78D8', '#3D85C6', '#674EA7', '#A64D79',
    '#85200C', '#990000', '#B45F06', '#BF9000', '#38761D', '#134F5C', '#1155CC', '#0B5394', '#351C75', '#741B47',
    '#5B0F00', '#660000', '#783F04', '#7F6000', '#274E13', '#0C343D', '#1C4587', '#073763', '#20124D', '#4C1130'
  ];

  return (
    <Box 
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 0.5,
        p: 1,
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        position: 'sticky',
        top: 0,
        zIndex: theme.zIndex.appBar,
        boxShadow: theme.shadows[1]
      }}
    >
      {/* Font Family */}
      <Tooltip title="Font">
        <Button
          size="small"
          onClick={handleFontMenuOpen}
          endIcon={<ChevronDownIcon size={16} />}
          sx={{ 
            textTransform: 'none',
            minWidth: 'auto',
            px: 1.5,
            '& .MuiButton-endIcon': { ml: 0.5 }
          }}
        >
          <span style={{ fontFamily: 'Arial' }}>Arial</span>
        </Button>
      </Tooltip>
      <Menu
        anchorEl={fontMenuAnchor}
        open={Boolean(fontMenuAnchor)}
        onClose={handleFontMenuClose}
        MenuListProps={{ sx: { py: 0 } }}
        PaperProps={{
          style: {
            maxHeight: 300,
            width: 200,
          },
        }}
      >
        {fonts.map((font) => (
          <MenuItem 
            key={font} 
            onClick={() => {
              // Handle font change
              handleFontMenuClose();
            }}
            sx={{ fontFamily: font }}
          >
            {font}
          </MenuItem>
        ))}
      </Menu>

      {/* Font Size */}
      <Tooltip title="Font Size">
        <Button
          size="small"
          onClick={() => {}}
          endIcon={<ChevronDownIcon size={16} />}
          sx={{ 
            textTransform: 'none',
            minWidth: 'auto',
            px: 1.5,
            '& .MuiButton-endIcon': { ml: 0.5 }
          }}
        >
          {fontSize}pt
        </Button>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Text Formatting */}
      <ToggleButtonGroup
        size="small"
        value={format}
        onChange={handleFormat}
        aria-label="text formatting"
        sx={{ '& .MuiToggleButton-root': { p: 0.75 } }}
      >
        <ToggleButton value="bold" aria-label="bold">
          <Tooltip title="Bold (Ctrl+B)">
            <BoldIcon size={18} />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="italic" aria-label="italic">
          <Tooltip title="Italic (Ctrl+I)">
            <ItalicIcon size={18} />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="underline" aria-label="underline">
          <Tooltip title="Underline (Ctrl+U)">
            <UnderlineIcon size={18} />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="strikethrough" aria-label="strikethrough">
          <Tooltip title="Strikethrough">
            <StrikethroughIcon size={18} />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="subscript" aria-label="subscript">
          <Tooltip title="Subscript">
            <SubscriptIcon size={18} />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="superscript" aria-label="superscript">
          <Tooltip title="Superscript">
            <SuperscriptIcon size={18} />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="code" aria-label="code">
          <Tooltip title="Code">
            <CodeIcon size={18} />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Text Color */}
      <Tooltip title="Text Color">
        <IconButton size="small" onClick={handleTextColorClick}>
          <ColorIcon size={18} />
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(textColorAnchor)}
        anchorEl={textColorAnchor}
        onClose={handleTextColorClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, width: 200 }}>
          <Typography variant="subtitle2" gutterBottom>Text Color</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {colors.slice(0, 30).map((color) => (
              <Box 
                key={color}
                onClick={() => {
                  // Handle color change
                  handleTextColorClose();
                }}
                sx={{
                  width: 20,
                  height: 20,
                  bgcolor: color,
                  border: '1px solid #ddd',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    transform: 'scale(1.1)'
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      </Popover>

      {/* Highlight Color */}
      <Tooltip title="Text Highlight Color">
        <IconButton size="small" onClick={handleHighlightColorClick}>
          <HighlightIcon size={18} />
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(highlightColorAnchor)}
        anchorEl={highlightColorAnchor}
        onClose={handleHighlightColorClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, width: 200 }}>
          <Typography variant="subtitle2" gutterBottom>Highlight Color</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {colors.slice(30, 60).map((color) => (
              <Box 
                key={color}
                onClick={() => {
                  // Handle highlight color change
                  handleHighlightColorClose();
                }}
                sx={{
                  width: 20,
                  height: 20,
                  bgcolor: color,
                  border: '1px solid #ddd',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    transform: 'scale(1.1)'
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      </Popover>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Text Alignment */}
      <ToggleButtonGroup
        size="small"
        value={alignment}
        exclusive
        onChange={handleAlignment}
        aria-label="text alignment"
        sx={{ '& .MuiToggleButton-root': { p: 0.75 } }}
      >
        <ToggleButton value="left" aria-label="left aligned">
          <Tooltip title="Align Left (Ctrl+Alt+L)">
            <AlignLeftIcon size={18} />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="center" aria-label="centered">
          <Tooltip title="Center (Ctrl+Alt+C)">
            <AlignCenterIcon size={18} />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="right" aria-label="right aligned">
          <Tooltip title="Align Right (Ctrl+Alt+R)">
            <AlignRightIcon size={18} />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="justify" aria-label="justified">
          <Tooltip title="Justify (Ctrl+Alt+J)">
            <AlignJustifyIcon size={18} />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Lists and Indentation */}
      <ToggleButtonGroup
        size="small"
        value={format}
        onChange={handleFormat}
        aria-label="list formatting"
        sx={{ '& .MuiToggleButton-root': { p: 0.75 } }}
      >
        <ToggleButton value="bullet" aria-label="bullet list">
          <Tooltip title="Bullet List">
            <ListIcon size={18} />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="number" aria-label="number list">
          <Tooltip title="Numbered List">
            <ListOrderedIcon size={18} />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="indent" aria-label="increase indent">
          <Tooltip title="Increase Indent (Tab)">
            <IndentIcon size={18} />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="outdent" aria-label="decrease indent">
          <Tooltip title="Decrease Indent (Shift+Tab)">
            <OutdentIcon size={18} />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Insert Options */}
      <Tooltip title="Insert Link">
        <IconButton size="small">
          <LinkIcon size={18} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Insert Image">
        <IconButton size="small">
          <ImageIcon size={18} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Insert Table">
        <IconButton size="small">
          <TableIcon size={18} />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Undo/Redo */}
      <Tooltip title="Undo (Ctrl+Z)">
        <span>
          <IconButton size="small" disabled={!format.includes('undo')}>
            <UndoIcon size={18} />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Redo (Ctrl+Y)">
        <span>
          <IconButton size="small" disabled={!format.includes('redo')}>
            <RedoIcon size={18} />
          </IconButton>
        </span>
      </Tooltip>

      <Box sx={{ flexGrow: 1 }} />

      {/* Zoom and View Options */}
      <Tooltip title="Zoom Out (Ctrl+-)">
        <IconButton size="small" onClick={handleZoomOut}>
          <ZoomOutIcon size={18} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Zoom Level">
        <Button size="small" sx={{ minWidth: 60 }}>
          {zoom}%
        </Button>
      </Tooltip>
      <Tooltip title="Zoom In (Ctrl++)">
        <IconButton size="small" onClick={handleZoomIn}>
          <ZoomInIcon size={18} />
        </IconButton>
      </Tooltip>

      <Tooltip title={isFullscreen ? 'Exit Full Screen (F11)' : 'Full Screen (F11)'}>
        <IconButton size="small" onClick={toggleFullscreen}>
          {isFullscreen ? <FullscreenExitIcon size={18} /> : <FullscreenIcon size={18} />}
        </IconButton>
      </Tooltip>

      <Tooltip title="Grammar Check">
        <IconButton size="small" onClick={onGrammarCheck}>
          <SpellCheckIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Rewrite (Shorten, Expand, Rephrase)">
        <IconButton size="small" onClick={handleRewriteClick}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={rewriteAnchor} open={Boolean(rewriteAnchor)} onClose={handleRewriteClose}>
        <MenuItem onClick={() => handleRewriteType('shorten')}>Shorten</MenuItem>
        <MenuItem onClick={() => handleRewriteType('expand')}>Expand</MenuItem>
        <MenuItem onClick={() => handleRewriteType('rephrase')}>Rephrase</MenuItem>
      </Menu>

      <Tooltip title="Summarize">
        <IconButton size="small" onClick={onSummarize}>
          <SummarizeIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Tone Detector">
        <IconButton size="small" onClick={onToneDetect}>
          <EmojiObjectsIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Translate">
        <IconButton size="small" onClick={onTranslate}>
          <TranslateIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Explain / Simplify">
        <IconButton size="small" onClick={onExplain}>
          <HelpOutlineIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title={isDictating ? "Stop Voice Typing" : "Start Voice Typing"}>
        <IconButton size="small" color={isDictating ? "primary" : undefined} onClick={onVoiceTyping}>
          <MicIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Ask AI (about selected text)">
        <IconButton size="small" onClick={onAskAI}>
          <QuestionAnswerIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Generate Title">
        <IconButton size="small" onClick={onGenerateTitle}>
          <TitleIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Generate Outline">
        <IconButton size="small" onClick={onGenerateOutline}>
          <FormatListBulletedIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Smart Citation">
        <IconButton size="small" onClick={onSmartCitation}>
          <MenuBookIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Fact Check">
        <IconButton size="small" onClick={onFactCheck}>
          <FactCheckIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Research Assistant (Summarize Web Link)">
        <IconButton size="small" onClick={onResearchAssistant}>
          <LinkIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default Toolbar;