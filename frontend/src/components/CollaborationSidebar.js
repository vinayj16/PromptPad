import React from 'react';
import { Box, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText, IconButton, Tooltip, Divider, Button } from '@mui/material';
import { UserPlus, Link as LinkIcon, Circle } from 'lucide-react';

const mockCollaborators = [
  { id: 1, name: 'Alice', online: true },
  { id: 2, name: 'Bob', online: false },
  { id: 3, name: 'Charlie', online: true },
];

const CollaborationSidebar = ({ open, onClose }) => (
  <Box sx={{ width: 300, p: 2, bgcolor: 'background.paper', height: '100%', boxShadow: 3 }}>
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
      <Typography variant="h6">Collaborators</Typography>
      <Tooltip title="Coming soon!">
        <span>
          <IconButton size="small" disabled><UserPlus size={20} /></IconButton>
        </span>
      </Tooltip>
    </Box>
    <Divider sx={{ mb: 2 }} />
    <List>
      {mockCollaborators.map(user => (
        <ListItem key={user.id}>
          <ListItemAvatar>
            <Avatar>{user.name[0]}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={user.name}
            secondary={user.online ? 'Online' : 'Offline'}
            secondaryTypographyProps={{ color: user.online ? 'success.main' : 'text.secondary' }}
          />
          <Circle size={12} color={user.online ? 'green' : 'gray'} />
        </ListItem>
      ))}
    </List>
    <Divider sx={{ my: 2 }} />
    <Tooltip title="Coming soon!">
      <span>
        <Button variant="outlined" startIcon={<LinkIcon size={18} />} disabled>Copy Invite Link</Button>
      </span>
    </Tooltip>
  </Box>
);

export default CollaborationSidebar; 