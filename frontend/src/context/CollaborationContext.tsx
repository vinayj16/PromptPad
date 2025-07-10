import React, { createContext, useContext, useState, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
  isOnline: boolean;
  cursor?: { offset: number };
}

interface Comment {
  id: string;
  text: string;
  author: User;
  timestamp: Date;
  position: number;
  resolved: boolean;
  replies: Comment[];
}

interface Change {
  id: string;
  type: 'insert' | 'delete' | 'format';
  content: string;
  position: number;
  author: User;
  timestamp: Date;
  accepted?: boolean;
}

interface CollaborationContextType {
  users: User[];
  comments: Comment[];
  changes: Change[];
  trackChanges: boolean;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  addComment: (text: string, position: number) => void;
  resolveComment: (commentId: string) => void;
  addChange: (change: Omit<Change, 'id' | 'timestamp'>) => void;
  acceptChange: (changeId: string) => void;
  rejectChange: (changeId: string) => void;
  toggleTrackChanges: () => void;
  shareDocument: (permissions: string) => string;
  setCursorPosition: (userId: string, offset: number) => void;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

export const CollaborationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'You',
      email: 'user@example.com',
      avatar: 'VN',
      color: '#3b82f6',
      isOnline: true,
    }
  ]);
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [changes, setChanges] = useState<Change[]>([]);
  const [trackChanges, setTrackChanges] = useState(false);

  const addUser = useCallback((user: User) => {
    setUsers(prev => [...prev, user]);
  }, []);

  const removeUser = useCallback((userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  }, []);

  const addComment = useCallback((text: string, position: number) => {
    const comment: Comment = {
      id: Date.now().toString(),
      text,
      author: users[0], // Current user
      timestamp: new Date(),
      position,
      resolved: false,
      replies: [],
    };
    setComments(prev => [...prev, comment]);
  }, [users]);

  const resolveComment = useCallback((commentId: string) => {
    setComments(prev => prev.map(comment =>
      comment.id === commentId ? { ...comment, resolved: true } : comment
    ));
  }, []);

  const addChange = useCallback((change: Omit<Change, 'id' | 'timestamp'>) => {
    if (!trackChanges) return;
    
    const newChange: Change = {
      ...change,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setChanges(prev => [...prev, newChange]);
  }, [trackChanges]);

  const acceptChange = useCallback((changeId: string) => {
    setChanges(prev => prev.map(change =>
      change.id === changeId ? { ...change, accepted: true } : change
    ));
  }, []);

  const rejectChange = useCallback((changeId: string) => {
    setChanges(prev => prev.filter(change => change.id !== changeId));
  }, []);

  const toggleTrackChanges = useCallback(() => {
    setTrackChanges(prev => !prev);
  }, []);

  const shareDocument = useCallback((permissions: string) => {
    // Generate shareable link
    const shareId = Math.random().toString(36).substring(7);
    return `https://wordai.app/share/${shareId}?permissions=${permissions}`;
  }, []);

  const setCursorPosition = useCallback((userId: string, offset: number) => {
    setUsers(prev => prev.map(user => user.id === userId ? { ...user, cursor: { offset } } : user));
  }, []);

  return (
    <CollaborationContext.Provider value={{
      users,
      comments,
      changes,
      trackChanges,
      addUser,
      removeUser,
      addComment,
      resolveComment,
      addChange,
      acceptChange,
      rejectChange,
      toggleTrackChanges,
      shareDocument,
      setCursorPosition,
    }}>
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};