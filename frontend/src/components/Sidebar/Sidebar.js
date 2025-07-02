import React, { useState, useMemo, useCallback } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemIcon, 
  ListItemText, 
  ListItemSecondaryAction,
  Box, 
  IconButton, 
  TextField, 
  InputAdornment, 
  Tooltip,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  Button,
  Divider
} from '@mui/material';
import {
  FileText as FileTextIcon,
  FilePlus as FilePlusIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  X as CloseIcon,
  Trash2 as TrashIcon,
  Copy as DuplicateIcon,
  Star as StarIcon,
  Clock as ClockIcon,
  Filter as FilterFilledIcon,
  Grid as GridIcon,
  List as ListIcon,
  Plus as PlusIcon
} from 'lucide-react';
import { useDocument } from '../../context/DocumentContext';
import { formatDistanceToNow } from 'date-fns';
import { insertOrReplaceSelection } from '../Editor/MainContent';

const Sidebar = ({ isOpen, onClose, width = 300 }) => {
  const { 
    createNewDocument, 
    deleteDocument, 
    duplicateDocument,
    toggleFavorite,
    savedDocuments,
    activeDocument,
    loadDocument,
  } = useDocument();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [filters, setFilters] = useState({
    favorites: false,
    recent: false,
    modified: false
  });
  
  const filteredDocuments = useMemo(() => {
    let result = [...savedDocuments];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(doc => 
        doc.title.toLowerCase().includes(query) ||
        (doc.content && doc.content.toLowerCase().includes(query))
      );
    }
    
    // Apply additional filters
    if (filters.favorites) {
      result = result.filter(doc => doc.isFavorite);
    }
    
    if (filters.recent) {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      result = result.filter(doc => new Date(doc.lastModified) > oneWeekAgo);
    }
    
    if (filters.modified) {
      result = result.filter(doc => doc.isDocumentModified);
    }
    
    // Sort by last modified (newest first)
    return result.sort((a, b) => 
      new Date(b.lastModified) - new Date(a.lastModified)
    );
  }, [savedDocuments, searchQuery, filters]);
  
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);
  
  const handleCreateNew = useCallback(() => {
    const newDoc = createNewDocument();
    if (newDoc) {
      loadDocument(newDoc.id);
    }
    onClose?.();
  }, [createNewDocument, loadDocument, onClose]);
  
  const handleDocumentClick = useCallback((docId) => {
    loadDocument(docId);
    onClose?.();
  }, [loadDocument, onClose]);
  
  const handleDeleteDocument = useCallback((e, docId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteDocument(docId);
    }
  }, [deleteDocument]);
  
  const handleDuplicateDocument = useCallback((e, doc) => {
    e.stopPropagation();
    duplicateDocument(doc.id);
  }, [duplicateDocument]);
  
  const handleToggleFavorite = useCallback((e, docId) => {
    e.stopPropagation();
    toggleFavorite(docId);
  }, [toggleFavorite]);
  
  const handleToggleFilter = useCallback((filter) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  }, []);
  
  const handleViewModeChange = useCallback((event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  }, []);
  
  const theme = useTheme();

  const renderDocumentItem = (doc) => (
    <ListItem 
      key={doc.id}
      disablePadding
      sx={{
        mb: 0.5,
        borderRadius: 1,
        backgroundColor: activeDocument?.id === doc.id 
          ? theme.palette.primary.main
          : 'transparent',
        '&:hover': {
          backgroundColor: theme.palette.primary.main,
        },
      }}
    >
      <ListItemButton 
        onClick={() => handleDocumentClick(doc.id)}
        sx={{ borderRadius: 1, py: 1 }}
      >
        <ListItemIcon sx={{ minWidth: 36 }}>
          {doc.isFavorite ? (
            <StarIcon size={18} fill={theme.palette.warning.main} color={theme.palette.warning.main} />
          ) : (
            <FileTextIcon size={18} />
          )}
        </ListItemIcon>
        <ListItemText 
          primary={
            <Typography noWrap sx={{ fontWeight: 500 }}>
              {doc.title || 'Untitled Document'}
            </Typography>
          }
          secondary={
            <Typography variant="caption" color="text.secondary" noWrap>
              {doc.lastModified && `Modified ${formatDistanceToNow(new Date(doc.lastModified).getTime() ? new Date(doc.lastModified) : new Date(), { addSuffix: true })}`}
            </Typography>
          }
          sx={{ my: 0 }}
        />
        <ListItemSecondaryAction>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title={doc.isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
              <IconButton 
                size="small" 
                onClick={(e) => handleToggleFavorite(e, doc.id)}
                sx={{ color: doc.isFavorite ? theme.palette.warning.main : 'inherit' }}
              >
                <StarIcon size={16} fill={doc.isFavorite ? theme.palette.warning.main : 'none'} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Duplicate">
              <IconButton 
                size="small" 
                onClick={(e) => handleDuplicateDocument(e, doc)}
              >
                <DuplicateIcon size={16} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Delete">
              <IconButton 
                size="small" 
                onClick={(e) => handleDeleteDocument(e, doc.id)}
                color="error"
              >
                <TrashIcon size={16} />
              </IconButton>
            </Tooltip>
          </Box>
        </ListItemSecondaryAction>
      </ListItemButton>
    </ListItem>
  );

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={onClose}
      variant="temporary"
      sx={{
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton onClick={onClose} size="small" sx={{ mr: 1 }}>
              <CloseIcon size={20} />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              My Documents
            </Typography>
            <Tooltip title="View settings">
              <IconButton size="small">
                <SettingsIcon size={18} />
              </IconButton>
            </Tooltip>
          </Box>
          
          {/* Search */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon size={16} />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }}
            sx={{ mb: 2 }}
          />
          
          {/* Filters and View Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Favorites">
                <IconButton 
                  size="small" 
                  onClick={() => handleToggleFilter('favorites')}
                  color={filters.favorites ? 'primary' : 'default'}
                >
                  {filters.favorites ? 
                    <StarIcon size={16} fill={theme.palette.warning.main} color={theme.palette.warning.main} /> : 
                    <StarIcon size={16} />
                  }
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Recent">
                <IconButton 
                  size="small" 
                  onClick={() => handleToggleFilter('recent')}
                  color={filters.recent ? 'primary' : 'default'}
                >
                  <ClockIcon size={16} />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Modified">
                <IconButton 
                  size="small" 
                  onClick={() => handleToggleFilter('modified')}
                  color={filters.modified ? 'primary' : 'default'}
                >
                  <FilterFilledIcon size={16} />
                </IconButton>
              </Tooltip>
            </Box>
            
            <ToggleButtonGroup
              size="small"
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              aria-label="view mode"
            >
              <ToggleButton value="list" size="small" aria-label="list view">
                <ListIcon size={16} />
              </ToggleButton>
              <ToggleButton value="grid" size="small" aria-label="grid view">
                <GridIcon size={16} />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
        
        {/* Document List */}
        <Box sx={{ flex: 1, overflowY: 'auto', mx: -2, px: 2 }}>
          {viewMode === 'list' ? (
            <List dense disablePadding>
              {filteredDocuments.map(renderDocumentItem)}
            </List>
          ) : (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: 2,
              pb: 2
            }}>
              {filteredDocuments.map((doc) => (
                <Box 
                  key={doc.id}
                  onClick={() => handleDocumentClick(doc.id)}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: activeDocument?.id === doc.id 
                      ? theme.palette.primary.main 
                      : theme.palette.divider,
                    backgroundColor: activeDocument?.id === doc.id 
                      ? theme.palette.primary.main
                      : theme.palette.background.paper,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: theme.palette.primary.main,
                    },
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ 
                    mb: 1, 
                    height: 80,
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.palette.text.secondary
                  }}>
                    <FileTextIcon size={32} />
                  </Box>
                  <Typography 
                    variant="body2" 
                    noWrap 
                    sx={{ 
                      fontWeight: 500,
                      mb: 0.5 
                    }}
                  >
                    {doc.title || 'Untitled'}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    noWrap
                    sx={{ display: 'block' }}
                  >
                    {doc.lastModified && formatDistanceToNow(new Date(doc.lastModified), { addSuffix: true })}
                  </Typography>
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 4, 
                      right: 4,
                      display: 'flex',
                      gap: 0.5
                    }}
                  >
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(e, doc.id);
                      }}
                      sx={{
                        p: 0.5,
                        backgroundColor: theme.palette.background.paper,
                        backdropFilter: 'blur(4px)',
                        '&:hover': {
                          backgroundColor: theme.palette.background.paper,
                        }
                      }}
                    >
                      {doc.isFavorite ? (
                        <StarIcon size={14} fill={theme.palette.warning.main} color={theme.palette.warning.main} />
                      ) : (
                        <StarIcon size={14} />
                      )}
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
          
          {filteredDocuments.length === 0 && (
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '60%',
                textAlign: 'center',
                p: 3,
                borderRadius: 2,
                backgroundColor: theme.palette.primary.main
              }}
            >
              <FileTextIcon 
                size={48} 
                style={{ 
                  color: theme.palette.text.disabled,
                  marginBottom: 16,
                  opacity: 0.5
                }} 
              />
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {searchQuery ? 'No matching documents' : 'No documents yet'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 240 }}>
                {searchQuery 
                  ? 'Try adjusting your search or filters' 
                  : 'Create your first document to get started'}
              </Typography>
              {!searchQuery && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<FilePlusIcon size={16} />}
                  onClick={handleCreateNew}
                  sx={{ borderRadius: 2 }}
                >
                  New Document
                </Button>
              )}
            </Box>
          )}
        </Box>
        
        {/* Footer */}
        <Box sx={{ mt: 'auto', pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<FilePlusIcon size={18} />}
            onClick={handleCreateNew}
            sx={{ borderRadius: 2, py: 1 }}
          >
            New Document
          </Button>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {savedDocuments.filter(doc => doc.isFavorite).length} starred
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

// OutlineSidebar: shows document outline (headings)
export const OutlineSidebar = ({ isOpen, onClose, width = 300 }) => {
  const { outline } = useDocument();
  const theme = useTheme();
  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={onClose}
      variant="temporary"
      sx={{
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={onClose} size="small" sx={{ mr: 1 }}>
            <CloseIcon size={20} />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
            Outline
          </Typography>
          <Button
            size="small"
            variant="outlined"
            startIcon={<PlusIcon size={16} />}
            sx={{ ml: 1, minWidth: 0, px: 1, py: 0.5 }}
            onClick={() => {
              insertOrReplaceSelection('<h2>New Heading</h2>');
              if (onClose) onClose();
            }}
          >
            Add Heading
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {outline.length === 0 ? (
            <Typography color="text.secondary">No headings found.</Typography>
          ) : (
            <List dense disablePadding>
              {outline.map(h => (
                <ListItemButton
                  key={h.id}
                  sx={{ pl: 2 + (h.level - 1) * 2 }}
                  onClick={() => {
                    // Scroll to heading in editor
                    const el = document.getElementById(h.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                >
                  <ListItemText
                    primary={h.text}
                    primaryTypographyProps={{
                      fontWeight: 400 + (6 - h.level) * 50,
                      fontSize: `${1.2 - (h.level - 1) * 0.1}em`,
                      noWrap: true
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;