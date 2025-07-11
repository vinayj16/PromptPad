import React, { createContext, useCallback, useState } from 'react';
import { aiAPI } from '../services/api';

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

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processText = useCallback(async (text: string, action: string): Promise<string> => {
    setIsProcessing(true);
    try {
      const res = await aiAPI.processText({ text, action });
      setIsProcessing(false);
      if (res.data.error) throw new Error(res.data.error);
      return res.data.result || res.data.text || JSON.stringify(res.data);
    } catch (err: any) {
      setIsProcessing(false);
      throw err;
    }
  }, []);

  const generateContent = useCallback(async (prompt: string): Promise<string> => {
    setIsProcessing(true);
    try {
      const res = await aiAPI.generateContent({ prompt });
      setIsProcessing(false);
      if (res.data.error) throw new Error(res.data.error);
      return res.data.content || res.data.text;
    } catch (err: any) {
      setIsProcessing(false);
      throw err;
    }
  }, []);

  const analyzeWriting = useCallback(async (text: string) => {
    setIsProcessing(true);
    try {
      const res = await aiAPI.analyzeDocument({ text });
      setIsProcessing(false);
      if (res.data.error) throw new Error(res.data.error);
      return res.data.analysis || res.data;
    } catch (err: any) {
      setIsProcessing(false);
      throw err;
    }
  }, []);

  const checkGrammar = useCallback(async (text: string) => {
    setIsProcessing(true);
    try {
      const res = await aiAPI.checkGrammar({ text });
      setIsProcessing(false);
      if (res.data.error) throw new Error(res.data.error);
      return { issues: res.data.issues || [], correctedText: text };
    } catch (err: any) {
      setIsProcessing(false);
      throw err;
    }
  }, []);

  const translateText = useCallback(async (text: string, targetLanguage: string): Promise<string> => {
    setIsProcessing(true);
    try {
      const res = await aiAPI.processText({ text, action: 'translate', context: { language: targetLanguage } });
      setIsProcessing(false);
      if (res.data.error) throw new Error(res.data.error);
      return res.data.result || res.data.text;
    } catch (err: any) {
      setIsProcessing(false);
      throw err;
    }
  }, []);

  const generateOutline = useCallback(async (topic: string): Promise<string> => {
    setIsProcessing(true);
    try {
      const res = await aiAPI.generateContent({ prompt: topic, type: 'outline' });
      setIsProcessing(false);
      if (res.data.error) throw new Error(res.data.error);
      return res.data.content || JSON.stringify(res.data);
    } catch (err: any) {
      setIsProcessing(false);
      throw err;
    }
  }, []);

  const improveWriting = useCallback(async (text: string, style: string): Promise<string> => {
    setIsProcessing(true);
    try {
      const res = await aiAPI.processText({ text, action: 'improve', context: { tone: style } });
      setIsProcessing(false);
      if (res.data.error) throw new Error(res.data.error);
      return res.data.result || res.data.text || JSON.stringify(res.data);
    } catch (err: any) {
      setIsProcessing(false);
      throw err;
    }
  }, []);

  const generateCitations = useCallback(async (text: string, style: string): Promise<string> => {
    setIsProcessing(true);
    try {
      // Not implemented in backend, placeholder
      setIsProcessing(false);
      return 'Citation generation coming soon.';
    } catch (err: any) {
      setIsProcessing(false);
      throw err;
    }
  }, []);

  const checkPlagiarism = useCallback(async (text: string) => {
    setIsProcessing(true);
    try {
      const res = await aiAPI.checkPlagiarism({ text });
      setIsProcessing(false);
      if (res.data.error) throw new Error(res.data.error);
      return res.data;
    } catch (err: any) {
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
  const context = React.useContext(AIContext);
  if (!context) throw new Error('useAI must be used within an AIProvider');
  return context;
};