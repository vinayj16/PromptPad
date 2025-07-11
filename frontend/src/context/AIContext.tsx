import React, { createContext, useContext, useState, useCallback } from 'react';

interface AIContextType {
  isProcessing: boolean;
  processText: (text: string, action: string) => Promise<string>;
  generateContent: (prompt: string) => Promise<string>;
  analyzeWriting: (text: string) => Promise<any>;
  checkGrammar: (text: string) => Promise<any>;
  translateText: (text: string, targetLanguage: string) => Promise<string>;
  generateOutline: (topic: string) => Promise<string>;
  improveWriting: (text: string, style: string) => Promise<string>;
  generateCitations: (text: string, style: string) => Promise<string>;
  checkPlagiarism: (text: string) => Promise<any>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

// Use the Vite global type for import.meta.env
const API_BASE = (import.meta as ImportMeta & { env: { VITE_API_URL?: string } }).env.VITE_API_URL || '';

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processText = useCallback(async (text: string, action: string): Promise<string> => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/api/ai/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, action }),
      });
      const data = await res.json();
      setIsProcessing(false);
      if (data.error) throw new Error(data.error);
      return data.result || data.text || JSON.stringify(data);
    } catch (err) {
      setIsProcessing(false);
      throw err;
    }
  }, []);

  const generateContent = useCallback(async (prompt: string): Promise<string> => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setIsProcessing(false);
      if (data.error) throw new Error(data.error);
      return data.content || data.text;
    } catch (err) {
      setIsProcessing(false);
      throw err;
    }
  }, []);

  const analyzeWriting = useCallback(async (text: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/api/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setIsProcessing(false);
      if (data.error) throw new Error(data.error);
      return data.analysis || data;
    } catch (err) {
      setIsProcessing(false);
      throw err;
    }
  }, []);

  const checkGrammar = useCallback(async (text: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/api/ai/grammar-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setIsProcessing(false);
      if (data.error) throw new Error(data.error);
      return { issues: data.issues || [], correctedText: text };
    } catch (err) {
      setIsProcessing(false);
      throw err;
    }
  }, []);

  const translateText = useCallback(async (text: string, targetLanguage: string): Promise<string> => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/api/ai/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, action: 'translate', context: { language: targetLanguage } }),
      });
      const data = await res.json();
      setIsProcessing(false);
      if (data.error) throw new Error(data.error);
      return data.result || data.text;
    } catch (err) {
      setIsProcessing(false);
      throw err;
    }
  }, []);

  const generateOutline = useCallback(async (topic: string): Promise<string> => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: topic, type: 'outline' }),
      });
      const data = await res.json();
      setIsProcessing(false);
      if (data.error) throw new Error(data.error);
      return data.content || JSON.stringify(data);
    } catch (err) {
      setIsProcessing(false);
      throw err;
    }
  }, []);

  const improveWriting = useCallback(async (text: string, style: string): Promise<string> => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/api/ai/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, action: 'improve', context: { tone: style } }),
      });
      const data = await res.json();
      setIsProcessing(false);
      if (data.error) throw new Error(data.error);
      return data.result || data.text || JSON.stringify(data);
    } catch (err) {
      setIsProcessing(false);
      throw err;
    }
  }, []);

  const generateCitations = useCallback(async (text: string, style: string): Promise<string> => {
    setIsProcessing(true);
    try {
      // Not implemented in backend, placeholder
      return 'Citation generation coming soon.';
    } catch (err) {
      setIsProcessing(false);
      throw err;
    }
  }, []);

  const checkPlagiarism = useCallback(async (text: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/api/ai/plagiarism-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setIsProcessing(false);
      if (data.error) throw new Error(data.error);
      return data;
    } catch (err) {
      setIsProcessing(false);
      throw err;
    }
  }, []);

  return (
    <AIContext.Provider value={{
      isProcessing,
      processText,
      generateContent,
      analyzeWriting,
      checkGrammar,
      translateText,
      generateOutline,
      improveWriting,
      generateCitations,
      checkPlagiarism,
    }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};