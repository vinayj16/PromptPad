export const setupCollaborationSocket = (io, logger) => {
  // Store active document sessions
  const documentSessions = new Map();
  
  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);
    
    // Join document room
    socket.on('join-document', (data) => {
      const { documentId, userId, userName, userAvatar, userColor } = data;
      
      socket.join(documentId);
      socket.documentId = documentId;
      socket.userId = userId;
      
      // Track user in document session
      if (!documentSessions.has(documentId)) {
        documentSessions.set(documentId, new Map());
      }
      
      const documentUsers = documentSessions.get(documentId);
      documentUsers.set(userId, {
        socketId: socket.id,
        name: userName,
        avatar: userAvatar,
        color: userColor,
        cursor: null,
        lastSeen: new Date()
      });
      
      // Notify other users in the document
      socket.to(documentId).emit('user-joined', {
        userId,
        name: userName,
        avatar: userAvatar,
        color: userColor
      });
      
      // Send current users to the new user
      const currentUsers = Array.from(documentUsers.values()).map(user => ({
        userId: user.socketId === socket.id ? userId : Object.keys(Object.fromEntries(documentUsers)).find(id => documentUsers.get(id).socketId === user.socketId),
        name: user.name,
        avatar: user.avatar,
        color: user.color,
        cursor: user.cursor
      }));
      
      socket.emit('document-users', currentUsers);
      
      logger.info(`User ${userId} joined document ${documentId}`);
    });
    
    // Handle real-time text changes
    socket.on('text-change', (data) => {
      const { documentId, delta, userId, timestamp } = data;
      
      // Broadcast to other users in the document
      socket.to(documentId).emit('text-change', {
        delta,
        userId,
        timestamp,
        socketId: socket.id
      });
      
      logger.debug(`Text change in document ${documentId} by user ${userId}`);
    });
    
    // Handle cursor position updates
    socket.on('cursor-position', (data) => {
      const { documentId, userId, position } = data;
      
      // Update cursor position in session
      if (documentSessions.has(documentId)) {
        const documentUsers = documentSessions.get(documentId);
        if (documentUsers.has(userId)) {
          documentUsers.get(userId).cursor = position;
        }
      }
      
      // Broadcast cursor position to other users
      socket.to(documentId).emit('cursor-position', {
        userId,
        position
      });
    });
    
    // Handle text selection
    socket.on('text-selection', (data) => {
      const { documentId, userId, selection } = data;
      
      socket.to(documentId).emit('text-selection', {
        userId,
        selection
      });
    });
    
    // Handle comments
    socket.on('add-comment', (data) => {
      const { documentId, comment } = data;
      
      socket.to(documentId).emit('comment-added', comment);
      logger.info(`Comment added to document ${documentId}`);
    });
    
    socket.on('resolve-comment', (data) => {
      const { documentId, commentId } = data;
      
      socket.to(documentId).emit('comment-resolved', { commentId });
    });
    
    // Handle document changes (title, formatting, etc.)
    socket.on('document-update', (data) => {
      const { documentId, update, userId } = data;
      
      socket.to(documentId).emit('document-updated', {
        update,
        userId,
        timestamp: new Date()
      });
    });
    
    // Handle typing indicators
    socket.on('typing-start', (data) => {
      const { documentId, userId } = data;
      
      socket.to(documentId).emit('user-typing', { userId, typing: true });
    });
    
    socket.on('typing-stop', (data) => {
      const { documentId, userId } = data;
      
      socket.to(documentId).emit('user-typing', { userId, typing: false });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      const { documentId, userId } = socket;
      
      if (documentId && documentSessions.has(documentId)) {
        const documentUsers = documentSessions.get(documentId);
        if (userId && documentUsers.has(userId)) {
          documentUsers.delete(userId);
          
          // Notify other users
          socket.to(documentId).emit('user-left', { userId });
          
          // Clean up empty document sessions
          if (documentUsers.size === 0) {
            documentSessions.delete(documentId);
          }
        }
      }
      
      logger.info(`User disconnected: ${socket.id}`);
    });
    
    // Handle force save requests
    socket.on('force-save', (data) => {
      const { documentId } = data;
      
      socket.to(documentId).emit('save-document');
    });
    
    // Handle version creation
    socket.on('create-version', (data) => {
      const { documentId, version } = data;
      
      socket.to(documentId).emit('version-created', version);
    });
    
    // Handle permission changes
    socket.on('permission-changed', (data) => {
      const { documentId, userId, newPermission } = data;
      
      socket.to(documentId).emit('permission-updated', {
        userId,
        permission: newPermission
      });
    });
  });
  
  // Cleanup function for inactive sessions
  setInterval(() => {
    const now = new Date();
    const timeout = 30 * 60 * 1000; // 30 minutes
    
    for (const [documentId, users] of documentSessions.entries()) {
      for (const [userId, user] of users.entries()) {
        if (now - user.lastSeen > timeout) {
          users.delete(userId);
          logger.info(`Cleaned up inactive user ${userId} from document ${documentId}`);
        }
      }
      
      if (users.size === 0) {
        documentSessions.delete(documentId);
        logger.info(`Cleaned up empty document session ${documentId}`);
      }
    }
  }, 5 * 60 * 1000); // Run every 5 minutes
};