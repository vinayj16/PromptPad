/// <reference types="vite/client" />
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: any) => api.post('/api/auth/register', userData),
  login: (credentials: any) => api.post('/api/auth/login', credentials),
  logout: () => api.post('/api/auth/logout'),
  getMe: () => api.get('/api/auth/me'),
  updatePreferences: (preferences: any) => api.patch('/api/auth/preferences', { preferences }),
};

// Documents API
export const documentsAPI = {
  getAll: (params?: any) => api.get('/api/documents', { params }),
  getById: (id: string) => api.get(`/api/documents/${id}`),
  create: (documentData: any) => api.post('/api/documents', documentData),
  update: (id: string, data: any) => api.patch(`/api/documents/${id}`, data),
  delete: (id: string) => api.delete(`/api/documents/${id}`),
  addCollaborator: (id: string, collaboratorData: any) => 
    api.post(`/api/documents/${id}/collaborators`, collaboratorData),
  removeCollaborator: (id: string, userId: string) => 
    api.delete(`/api/documents/${id}/collaborators/${userId}`),
  addComment: (id: string, commentData: any) => 
    api.post(`/api/documents/${id}/comments`, commentData),
  resolveComment: (id: string, commentId: string) => 
    api.patch(`/api/documents/${id}/comments/${commentId}/resolve`),
  createVersion: (id: string, versionData: any) => 
    api.post(`/api/documents/${id}/versions`, versionData),
  getStats: (id: string) => api.get(`/api/documents/${id}/stats`),
};

// AI API
export const aiAPI = {
  processText: (data: any) => api.post('/api/ai/process', data),
  analyzeDocument: (data: any) => api.post('/api/ai/analyze', data),
  checkGrammar: (data: any) => api.post('/api/ai/grammar-check', data),
  generateContent: (data: any) => api.post('/api/ai/generate', data),
  checkPlagiarism: (data: any) => api.post('/api/ai/plagiarism-check', data),
  getUsage: () => api.get('/api/ai/usage'),
};

// Templates API
export const templatesAPI = {
  getAll: (params?: any) => api.get('/api/templates', { params }),
  getById: (id: string) => api.get(`/api/templates/${id}`),
  create: (templateData: any) => api.post('/api/templates', templateData),
  update: (id: string, data: any) => api.patch(`/api/templates/${id}`, data),
  delete: (id: string) => api.delete(`/api/templates/${id}`),
  rate: (id: string, rating: number) => api.post(`/api/templates/${id}/rate`, { rating }),
};

// Legacy API for backward compatibility
export const legacyAPI = {
  generate: (prompt: string) => api.post('/generate', { prompt }),
  grammar: (text: string) => api.post('/grammar', { text }),
};

export default api;