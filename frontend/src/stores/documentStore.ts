import { create } from 'zustand';
import { documentsAPI } from '../services/api';
import socketService from '../services/socket';

interface Document {
  _id: string;
  title: string;
  content: string;
  owner: any;
  collaborators: any[];
  metadata: {
    wordCount: number;
    characterCount: number;
    pageCount: number;
    readingTime: number;
  };
  settings: {
    trackChanges: boolean;
    autoSave: boolean;
    spellCheck: boolean;
    grammarCheck: boolean;
  };
  formatting: any;
  comments: any[];
  changes: any[];
  versions: any[];
  tags: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
  lastModifiedBy: any;
}

interface DocumentState {
  documents: Document[];
  currentDocument: Document | null;
  isLoading: boolean;
  error: string | null;
  collaborators: any[];
  onlineUsers: any[];
  
  // Actions
  fetchDocuments: (params?: any) => Promise<void>;
  fetchDocument: (id: string) => Promise<void>;
  createDocument: (data: any) => Promise<Document>;
  updateDocument: (id: string, data: any) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  
  // Real-time collaboration
  joinDocument: (documentId: string, user: any) => void;
  leaveDocument: () => void;
  updateContent: (content: string, delta?: any) => void;
  updateCursor: (position: any) => void;
  
  // Comments
  addComment: (text: string, position: number) => Promise<void>;
  resolveComment: (commentId: string) => Promise<void>;
  
  // Collaborators
  addCollaborator: (email: string, permission: string) => Promise<void>;
  removeCollaborator: (userId: string) => Promise<void>;
  
  // Versions
  createVersion: (changes?: string[], major?: boolean) => Promise<void>;
  
  // Utility
  clearError: () => void;
  setCurrentDocument: (document: Document | null) => void;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  currentDocument: null,
  isLoading: false,
  error: null,
  collaborators: [],
  onlineUsers: [],

  fetchDocuments: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await documentsAPI.getAll(params);
      set({
        documents: response.data.documents,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch documents',
        isLoading: false,
      });
    }
  },

  fetchDocument: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await documentsAPI.getById(id);
      set({
        currentDocument: response.data.document,
        collaborators: response.data.document.collaborators,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch document',
        isLoading: false,
      });
    }
  },

  createDocument: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await documentsAPI.create(data);
      const newDocument = response.data.document;
      
      set((state) => ({
        documents: [newDocument, ...state.documents],
        currentDocument: newDocument,
        isLoading: false,
      }));
      
      return newDocument;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to create document',
        isLoading: false,
      });
      throw error;
    }
  },

  updateDocument: async (id, data) => {
    try {
      const response = await documentsAPI.update(id, data);
      const updatedDocument = response.data.document;
      
      set((state) => ({
        documents: state.documents.map(doc => 
          doc._id === id ? updatedDocument : doc
        ),
        currentDocument: state.currentDocument?._id === id ? updatedDocument : state.currentDocument,
      }));
      
      // Send real-time update
      socketService.sendDocumentUpdate(data);
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to update document',
      });
      throw error;
    }
  },

  deleteDocument: async (id) => {
    try {
      await documentsAPI.delete(id);
      
      set((state) => ({
        documents: state.documents.filter(doc => doc._id !== id),
        currentDocument: state.currentDocument?._id === id ? null : state.currentDocument,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to delete document',
      });
      throw error;
    }
  },

  joinDocument: (documentId, user) => {
    socketService.joinDocument(documentId, user);
    
    // Setup real-time event listeners
    socketService.onUserJoined((newUser) => {
      set((state) => ({
        onlineUsers: [...state.onlineUsers, newUser],
      }));
    });
    
    socketService.onUserLeft((data) => {
      set((state) => ({
        onlineUsers: state.onlineUsers.filter(user => user.userId !== data.userId),
      }));
    });
    
    socketService.onDocumentUsers((users) => {
      set({ onlineUsers: users });
    });
    
    socketService.onTextChange((data) => {
      // Handle incoming text changes
      const { delta, userId } = data;
      // Apply delta to current document content
      // This would integrate with your text editor (Quill, etc.)
    });
    
    socketService.onDocumentUpdated((data) => {
      const { update } = data;
      set((state) => ({
        currentDocument: state.currentDocument ? {
          ...state.currentDocument,
          ...update,
        } : null,
      }));
    });
    
    socketService.onCommentAdded((comment) => {
      set((state) => ({
        currentDocument: state.currentDocument ? {
          ...state.currentDocument,
          comments: [...state.currentDocument.comments, comment],
        } : null,
      }));
    });
  },

  leaveDocument: () => {
    socketService.leaveDocument();
    socketService.removeAllListeners();
    set({ onlineUsers: [] });
  },

  updateContent: (content, delta) => {
    const { currentDocument } = get();
    if (!currentDocument) return;
    
    // Update local state
    set({
      currentDocument: {
        ...currentDocument,
        content,
        metadata: {
          ...currentDocument.metadata,
          wordCount: content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.length > 0).length,
          characterCount: content.length,
        },
      },
    });
    
    // Send real-time change
    if (delta) {
      socketService.sendTextChange(delta);
    }
  },

  updateCursor: (position) => {
    socketService.sendCursorPosition(position);
  },

  addComment: async (text, position) => {
    const { currentDocument } = get();
    if (!currentDocument) return;
    
    try {
      const response = await documentsAPI.addComment(currentDocument._id, { text, position });
      const newComment = response.data.comment;
      
      set((state) => ({
        currentDocument: state.currentDocument ? {
          ...state.currentDocument,
          comments: [...state.currentDocument.comments, newComment],
        } : null,
      }));
      
      // Send real-time comment
      socketService.sendComment(newComment);
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to add comment',
      });
      throw error;
    }
  },

  resolveComment: async (commentId) => {
    const { currentDocument } = get();
    if (!currentDocument) return;
    
    try {
      await documentsAPI.resolveComment(currentDocument._id, commentId);
      
      set((state) => ({
        currentDocument: state.currentDocument ? {
          ...state.currentDocument,
          comments: state.currentDocument.comments.map(comment =>
            comment.id === commentId ? { ...comment, resolved: true } : comment
          ),
        } : null,
      }));
      
      // Send real-time update
      socketService.resolveComment(commentId);
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to resolve comment',
      });
      throw error;
    }
  },

  addCollaborator: async (email, permission) => {
    const { currentDocument } = get();
    if (!currentDocument) return;
    
    try {
      const response = await documentsAPI.addCollaborator(currentDocument._id, { email, permission });
      
      set({
        collaborators: response.data.collaborators,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to add collaborator',
      });
      throw error;
    }
  },

  removeCollaborator: async (userId) => {
    const { currentDocument } = get();
    if (!currentDocument) return;
    
    try {
      await documentsAPI.removeCollaborator(currentDocument._id, userId);
      
      set((state) => ({
        collaborators: state.collaborators.filter(collab => collab.user._id !== userId),
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to remove collaborator',
      });
      throw error;
    }
  },

  createVersion: async (changes, major) => {
    const { currentDocument } = get();
    if (!currentDocument) return;
    
    try {
      await documentsAPI.createVersion(currentDocument._id, { changes, major });
      
      // Refresh document to get updated versions
      await get().fetchDocument(currentDocument._id);
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to create version',
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setCurrentDocument: (document) => {
    set({ currentDocument: document });
  },
}));