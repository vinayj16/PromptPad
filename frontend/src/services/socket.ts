/// <reference types="vite/client" />
import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private documentId: string | null = null;
  private userId: string | null = null;

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.setupEventListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinDocument(documentId: string, user: any) {
    if (!this.socket) return;

    this.documentId = documentId;
    this.userId = user.id;

    this.socket.emit('join-document', {
      documentId,
      userId: user.id,
      userName: user.firstName + ' ' + user.lastName,
      userAvatar: user.avatar,
      userColor: user.avatarColor,
    });
  }

  leaveDocument() {
    if (!this.socket || !this.documentId) return;

    this.socket.emit('leave-document', {
      documentId: this.documentId,
      userId: this.userId,
    });

    this.documentId = null;
    this.userId = null;
  }

  // Text editing events
  sendTextChange(delta: any) {
    if (!this.socket || !this.documentId) return;

    this.socket.emit('text-change', {
      documentId: this.documentId,
      delta,
      userId: this.userId,
      timestamp: Date.now(),
    });
  }

  sendCursorPosition(position: any) {
    if (!this.socket || !this.documentId) return;

    this.socket.emit('cursor-position', {
      documentId: this.documentId,
      userId: this.userId,
      position,
    });
  }

  sendTextSelection(selection: any) {
    if (!this.socket || !this.documentId) return;

    this.socket.emit('text-selection', {
      documentId: this.documentId,
      userId: this.userId,
      selection,
    });
  }

  // Document events
  sendDocumentUpdate(update: any) {
    if (!this.socket || !this.documentId) return;

    this.socket.emit('document-update', {
      documentId: this.documentId,
      update,
      userId: this.userId,
    });
  }

  // Comment events
  sendComment(comment: any) {
    if (!this.socket || !this.documentId) return;

    this.socket.emit('add-comment', {
      documentId: this.documentId,
      comment,
    });
  }

  resolveComment(commentId: string) {
    if (!this.socket || !this.documentId) return;

    this.socket.emit('resolve-comment', {
      documentId: this.documentId,
      commentId,
    });
  }

  // Typing indicators
  startTyping() {
    if (!this.socket || !this.documentId) return;

    this.socket.emit('typing-start', {
      documentId: this.documentId,
      userId: this.userId,
    });
  }

  stopTyping() {
    if (!this.socket || !this.documentId) return;

    this.socket.emit('typing-stop', {
      documentId: this.documentId,
      userId: this.userId,
    });
  }

  // Force save
  forceSave() {
    if (!this.socket || !this.documentId) return;

    this.socket.emit('force-save', {
      documentId: this.documentId,
    });
  }

  // Version control
  createVersion(version: any) {
    if (!this.socket || !this.documentId) return;

    this.socket.emit('create-version', {
      documentId: this.documentId,
      version,
    });
  }

  // Event listeners setup
  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  }

  // Event subscription methods
  onUserJoined(callback: (user: any) => void) {
    this.socket?.on('user-joined', callback);
  }

  onUserLeft(callback: (data: any) => void) {
    this.socket?.on('user-left', callback);
  }

  onDocumentUsers(callback: (users: any[]) => void) {
    this.socket?.on('document-users', callback);
  }

  onTextChange(callback: (data: any) => void) {
    this.socket?.on('text-change', callback);
  }

  onCursorPosition(callback: (data: any) => void) {
    this.socket?.on('cursor-position', callback);
  }

  onTextSelection(callback: (data: any) => void) {
    this.socket?.on('text-selection', callback);
  }

  onDocumentUpdated(callback: (data: any) => void) {
    this.socket?.on('document-updated', callback);
  }

  onCommentAdded(callback: (comment: any) => void) {
    this.socket?.on('comment-added', callback);
  }

  onCommentResolved(callback: (data: any) => void) {
    this.socket?.on('comment-resolved', callback);
  }

  onUserTyping(callback: (data: any) => void) {
    this.socket?.on('user-typing', callback);
  }

  onSaveDocument(callback: () => void) {
    this.socket?.on('save-document', callback);
  }

  onVersionCreated(callback: (version: any) => void) {
    this.socket?.on('version-created', callback);
  }

  onPermissionUpdated(callback: (data: any) => void) {
    this.socket?.on('permission-updated', callback);
  }

  // Cleanup method
  removeAllListeners() {
    if (!this.socket) return;

    this.socket.removeAllListeners();
  }
}

export const socketService = new SocketService();
export default socketService;