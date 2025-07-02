import React, { useState } from 'react';
import { 
  Box, 
  Drawer, 
  Divider, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Typography, 
  Tabs, 
  Tab, 
  useTheme,
  TextField,
  InputAdornment,
  Tooltip,
  Badge,
  Avatar,
  ListItemAvatar,
  Chip,
  Button
} from '@mui/material';
import { 
  X, 
  FileText, 
  Search, 
  Star, 
  Clock, 
  Folder, 
  Download as DownloadIcon,
  Upload as UploadIcon,
  MessageSquare,
  Users,
  Settings,
  HelpCircle,
  FilePlus,
  FolderPlus,
  FileCheck2,
  ChevronRight,
  MoreVertical,
  Trash2,
  Star as StarFilled,
  File as FileIcon,
  FilePlus2,
  FolderOpen
} from 'lucide-react';
import { useDocument } from '../../context/DocumentContext';
import { useThemeContext } from '../../context/ThemeContext';

const drawerWidth = 280;

const Sidebar = ({ isOpen, onClose, onNewDocument }) => {
  const theme = useTheme();
  const { isDarkMode } = useThemeContext();
  const { 
    document: currentDocument, 
    documents, 
    loadDocument, 
    createNewDocument,
    deleteDocument,
    updateDocument
  } = useDocument();
  
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  
  // Filter documents based on search query and tab
  const filteredDocuments = React.useMemo(() => {
    let docs = documents || [];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      docs = docs.filter(doc => 
        doc.title.toLowerCase().includes(query) ||
        (doc.content && doc.content.toLowerCase().includes(query))
      );
    }
    
    // Apply tab filters
    switch(activeTab) {
      case 0: // Recent
        return [...docs].sort((a, b) => 
          new Date(b.lastModified) - new Date(a.lastModified)
        );
      case 1: // Starred
        return docs.filter(doc => doc.starred);
      case 2: // All
      default:
        return docs;
    }
  }, [documents, searchQuery, activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDocumentClick = (doc) => {
    loadDocument(doc);
    if (window.innerWidth < 900) {
      onClose();
    }
  };

  const handleContextMenu = (event, doc) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4, document: doc }
        : null,
    );
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleStarDocument = (docId, e) => {
    e?.stopPropagation();
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      updateDocument({ ...doc, starred: !doc.starred });
    }
  };

  const handleDeleteDocument = (docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteDocument(docId);
      handleCloseContextMenu();
    }
  };

  // Tab panels
  const TabPanel = ({ children, value, index, ...other }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`sidebar-tabpanel-${index}`}
        aria-labelledby={`sidebar-tab-${index}`}
        style={{ height: '100%' }}
        {...other}
      >
        {value === index && (
          <Box sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {children}
          </Box>
        )}
      </div>
    );
  };

  // Tab properties
  const tabProps = (index) => ({
    id: `sidebar-tab-${index}`,
    'aria-controls': `sidebar-tabpanel-${index}`,
    sx: { 
      minWidth: 'auto', 
      px: 1.5, 
      py: 1, 
      fontSize: '0.75rem',
      textTransform: 'none',
      minHeight: '48px'
    }
  });

  return (
    <>
      <Drawer
        variant={window.innerWidth >= 900 ? 'persistent' : 'temporary'}
        open={isOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: 'none',
            bgcolor: theme.palette.background.paper,
            boxShadow: theme.shadows[2],
          },
        }}
      >
        {/* Header */}
        <Box 
          sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.default,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            My Documents
          </Typography>
          <Box>
            <Tooltip title="New Document">
              <IconButton 
                size="small" 
                onClick={onNewDocument}
                sx={{ mr: 0.5 }}
              >
                <FilePlus2 size={20} />
              </IconButton>
            </Tooltip>
            <IconButton onClick={onClose} size="small">
              <X size={20} />
            </IconButton>
          </Box>
        </Box>

        {/* Search */}
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
              sx: { 
                bgcolor: 'background.paper',
                '& input': { 
                  py: 1,
                  '&::placeholder': {
                    opacity: 0.8,
                  },
                },
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }
            }}
            variant="outlined"
          />
        </Box>

        {/* Tabs */}
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          px: 1,
          '& .MuiTabs-flexContainer': {
            justifyContent: 'space-between',
          }
        }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            aria-label="document navigation tabs"
            variant="fullWidth"
            sx={{
              minHeight: '48px',
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
              '& .MuiTab-root': {
                minHeight: '48px',
                color: theme.palette.text.secondary,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              },
            }}
          >
            <Tab 
              label="Recent" 
              {...tabProps(0)} 
              icon={<Clock size={16} />} 
              iconPosition="start" 
              sx={{ minWidth: 'auto' }}
            />
            <Tab 
              label="Starred" 
              {...tabProps(1)} 
              icon={<Star size={16} />} 
              iconPosition="start" 
              sx={{ minWidth: 'auto' }}
            />
            <Tab 
              label="All" 
              {...tabProps(2)} 
              icon={<FolderOpen size={16} />} 
              iconPosition="start" 
              sx={{ minWidth: 'auto' }}
            />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Recent Documents */}
          <TabPanel value={activeTab} index={0}>
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              <List dense sx={{ p: 0 }}>
                {filteredDocuments.slice(0, 10).map((doc) => (
                  <ListItem 
                    key={doc.id} 
                    disablePadding 
                    secondaryAction={
                      <Tooltip title={new Date(doc.lastModified).toLocaleString()}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                          {new Date(doc.lastModified).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </Typography>
                      </Tooltip>
                    }
                    onContextMenu={(e) => handleContextMenu(e, doc)}
                  >
                    <ListItemButton 
                      selected={currentDocument?.id === doc.id}
                      onClick={() => handleDocumentClick(doc)}
                      sx={{
                        '&.Mui-selected': {
                          bgcolor: theme.palette.action.selected,
                          '&:hover': {
                            bgcolor: theme.palette.action.selected,
                          },
                        },
                        '&:hover .document-actions': {
                          visibility: 'visible',
                        },
                        pl: 2,
                        pr: 1,
                        py: 0.5,
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32, mr: 1 }}>
                        <FileText size={18} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography 
                            noWrap 
                            sx={{ 
                              fontWeight: currentDocument?.id === doc.id ? 500 : 400,
                              fontSize: '0.9rem',
                            }}
                          >
                            {doc.title || 'Untitled Document'}
                          </Typography>
                        } 
                        secondary={
                          <Typography 
                            noWrap 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                              display: 'block',
                              fontSize: '0.75rem',
                              mt: 0.25,
                            }}
                          >
                            {doc.content?.substring(0, 40).replace(/<[^>]*>?/gm, '')}
                            {doc.content?.length > 40 ? '...' : ''}
                          </Typography>
                        }
                        sx={{ my: 0.5 }}
                      />
                      <Box 
                        className="document-actions"
                        sx={{ 
                          display: 'flex',
                          visibility: 'hidden',
                          ml: 1,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleStarDocument(doc.id, e)}
                          sx={{ p: 0.5 }}
                        >
                          {doc.starred ? (
                            <StarFilled size={16} fill={theme.palette.warning.main} />
                          ) : (
                            <Star size={16} />
                          )}
                        </IconButton>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                ))}
                {filteredDocuments.length === 0 && (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <FileText size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                    <Typography variant="body2" color="text.secondary">
                      {searchQuery ? 'No matching documents found' : 'No recent documents'}
                    </Typography>
                  </Box>
                )}
              </List>
            </Box>
          </TabPanel>

          {/* Starred Documents */}
          <TabPanel value={activeTab} index={1}>
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              p: 3
            }}>
              <Star size={48} style={{ 
                opacity: 0.2, 
                marginBottom: 16,
                color: theme.palette.text.secondary
              }} />
              <Typography variant="subtitle1" color="text.secondary">
                No starred documents
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: '80%' }}>
                Star important documents to access them quickly from here
              </Typography>
            </Box>
          </TabPanel>

          {/* All Documents */}
          <TabPanel value={activeTab} index={2}>
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              <List dense sx={{ p: 0 }}>
                {filteredDocuments.map((doc) => (
                  <ListItem 
                    key={doc.id} 
                    disablePadding 
                    secondaryAction={
                      <Tooltip title={new Date(doc.lastModified).toLocaleString()}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                          {new Date(doc.lastModified).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </Typography>
                      </Tooltip>
                    }
                    onContextMenu={(e) => handleContextMenu(e, doc)}
                  >
                    <ListItemButton 
                      selected={currentDocument?.id === doc.id}
                      onClick={() => handleDocumentClick(doc)}
                      sx={{
                        '&.Mui-selected': {
                          bgcolor: theme.palette.action.selected,
                          '&:hover': {
                            bgcolor: theme.palette.action.selected,
                          },
                        },
                        '&:hover .document-actions': {
                          visibility: 'visible',
                        },
                        pl: 2,
                        pr: 1,
                        py: 0.5,
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32, mr: 1 }}>
                        <FileText size={18} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography 
                            noWrap 
                            sx={{ 
                              fontWeight: currentDocument?.id === doc.id ? 500 : 400,
                              fontSize: '0.9rem',
                            }}
                          >
                            {doc.title || 'Untitled Document'}
                          </Typography>
                        } 
                        secondary={
                          <Typography 
                            noWrap 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                              display: 'block',
                              fontSize: '0.75rem',
                              mt: 0.25,
                            }}
                          >
                            {doc.content?.substring(0, 40).replace(/<[^>]*>?/gm, '')}
                            {doc.content?.length > 40 ? '...' : ''}
                          </Typography>
                        }
                        sx={{ my: 0.5 }}
                      />
                      <Box 
                        className="document-actions"
                        sx={{ 
                          display: 'flex',
                          visibility: 'hidden',
                          ml: 1,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleStarDocument(doc.id, e)}
                          sx={{ p: 0.5 }}
                        >
                          {doc.starred ? (
                            <StarFilled size={16} fill={theme.palette.warning.main} />
                          ) : (
                            <Star size={16} />
                          )}
                        </IconButton>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                ))}
                {filteredDocuments.length === 0 && (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <FolderOpen size={48} style={{ 
                      opacity: 0.2, 
                      marginBottom: 16,
                      color: theme.palette.text.secondary
                    }} />
                    <Typography variant="body2" color="text.secondary">
                      {searchQuery ? 'No matching documents found' : 'No documents yet'}
                    </Typography>
                    {!searchQuery && (
                      <Button 
                        variant="outlined" 
                        size="small" 
                        startIcon={<FilePlus2 size={16} />}
                        onClick={onNewDocument}
                        sx={{ mt: 2 }}
                      >
                        Create New Document
                      </Button>
                    )}
                  </Box>
                )}
              </List>
            </Box>
          </TabPanel>
        </Box>

        {/* Bottom Actions */}
        <Box 
          sx={{ 
            p: 1.5, 
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.default,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Settings">
              <IconButton size="small">
                <Settings size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Help">
              <IconButton size="small">
                <HelpCircle size={18} />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {documents?.length || 0} documents
          </Typography>
        </Box>
      </Drawer>

      {/* Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        onClick={handleCloseContextMenu}
        MenuListProps={{
          dense: true,
          sx: { minWidth: 180 }
        }}
      >
        {contextMenu?.document && (
          <>
            <MenuItem 
              onClick={() => handleDocumentClick(contextMenu.document)}
              disabled={currentDocument?.id === contextMenu.document.id}
            >
              <ListItemIcon>
                <ChevronRight size={18} />
              </ListItemIcon>
              <ListItemText>Open</ListItemText>
            </MenuItem>
            <MenuItem 
              onClick={(e) => {
                handleStarDocument(contextMenu.document.id, e);
                handleCloseContextMenu();
              }}
            >
              <ListItemIcon>
                {contextMenu.document.starred ? (
                  <StarFilled size={18} fill={theme.palette.warning.main} />
                ) : (
                  <Star size={18} />
                )}
              </ListItemIcon>
              <ListItemText>
                {contextMenu.document.starred ? 'Remove star' : 'Add star'}
              </ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem 
              onClick={() => handleDeleteDocument(contextMenu.document.id)}
              sx={{ color: theme.palette.error.main }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                <Trash2 size={18} />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

export default Sidebar;