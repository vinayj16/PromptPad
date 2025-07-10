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

const API_BASE = 'http://localhost:5000';

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processText = useCallback(async (text: string, action: string): Promise<string> => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/ai/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, aiPersona: 'AI Assistant', writingGoal: 'general', targetAudience: 'general' }),
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
      const res = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setIsProcessing(false);
      if (data.error) throw new Error(data.error);
      return data.text;
    } catch (err) {
      setIsProcessing(false);
      throw err;
    }
  }, []);

  const analyzeWriting = useCallback(async (text: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, writingGoal: 'general', aiPersona: 'AI Assistant', writingStyle: 'general', targetAudience: 'general', documentType: 'document' }),
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

  const checkGrammar = useCallback(async (text: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/grammar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setIsProcessing(false);
      if (data.error) throw new Error(data.error);
      return { issues: data.suggestions || [], correctedText: text };
    } catch (err) {
      setIsProcessing(false);
      throw err;
    }
  }, []);

  const translateText = useCallback(async (text: string, targetLanguage: string): Promise<string> => {
    setIsProcessing(true);
    try {
      const prompt = `Translate this text to ${targetLanguage}: ${text}`;
      const res = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setIsProcessing(false);
      if (data.error) throw new Error(data.error);
      return data.text;
    } catch (err) {
      setIsProcessing(false);
      throw err;
    }
  }, []);

  const generateOutline = useCallback(async (topic: string): Promise<string> => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/generate-toc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: topic, writingGoal: 'general', documentType: 'document', aiPersona: 'AI Assistant' }),
      });
      const data = await res.json();
      setIsProcessing(false);
      if (data.error) throw new Error(data.error);
      return JSON.stringify(data.toc, null, 2);
    } catch (err) {
      setIsProcessing(false);
      throw err;
    }
  }, []);

  const improveWriting = useCallback(async (text: string, style: string): Promise<string> => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/ai/improve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, aiPersona: 'AI Assistant', writingGoal: style, targetAudience: 'general' }),
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
      const res = await fetch(`${API_BASE}/generate-citations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, writingGoal: style, documentType: 'document' }),
      });
      const data = await res.json();
      setIsProcessing(false);
      if (data.error) throw new Error(data.error);
      return JSON.stringify(data.citations, null, 2);
    } catch (err) {
      setIsProcessing(false);
      throw err;
    }
  }, []);

  const checkPlagiarism = useCallback(async (text: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/plagiarism-check`, {
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