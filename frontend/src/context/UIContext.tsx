import React, { createContext, useContext, useState, useCallback } from 'react';

interface UIState {
  zoom: number;
  viewMode: 'print' | 'web' | 'outline' | 'draft';
  showRuler: boolean;
  showGridlines: boolean;
  showNavigationPane: boolean;
  darkMode: boolean;
  fontSize: number;
  fontFamily: string;
  pageOrientation: 'portrait' | 'landscape';
  pageSize: string;
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

interface UIContextType {
  ui: UIState;
  setZoom: (zoom: number) => void;
  setViewMode: (mode: 'print' | 'web' | 'outline' | 'draft') => void;
  toggleRuler: () => void;
  toggleGridlines: () => void;
  toggleNavigationPane: () => void;
  toggleDarkMode: () => void;
  setFontSize: (size: number) => void;
  setFontFamily: (family: string) => void;
  setPageOrientation: (orientation: 'portrait' | 'landscape') => void;
  setPageSize: (size: string) => void;
  setMargins: (margins: Partial<UIState['margins']>) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialUI = () => {
    const saved = localStorage.getItem('ui-state');
    if (saved) {
      return { ...JSON.parse(saved), darkMode: JSON.parse(saved).darkMode ?? false };
    }
    return {
      zoom: 100,
      viewMode: 'print',
      showRuler: true,
      showGridlines: false,
      showNavigationPane: false,
      darkMode: false,
      fontSize: 11,
      fontFamily: 'Calibri',
      pageOrientation: 'portrait',
      pageSize: 'A4',
      margins: {
        top: 2.54,
        bottom: 2.54,
        left: 2.54,
        right: 2.54,
      },
    };
  };
  const [ui, setUI] = useState<UIState>(getInitialUI());

  React.useEffect(() => {
    localStorage.setItem('ui-state', JSON.stringify(ui));
  }, [ui]);

  const setZoom = useCallback((zoom: number) => {
    setUI(prev => ({ ...prev, zoom }));
  }, []);

  const setViewMode = useCallback((viewMode: 'print' | 'web' | 'outline' | 'draft') => {
    setUI(prev => ({ ...prev, viewMode }));
  }, []);

  const toggleRuler = useCallback(() => {
    setUI(prev => ({ ...prev, showRuler: !prev.showRuler }));
  }, []);

  const toggleGridlines = useCallback(() => {
    setUI(prev => ({ ...prev, showGridlines: !prev.showGridlines }));
  }, []);

  const toggleNavigationPane = useCallback(() => {
    setUI(prev => ({ ...prev, showNavigationPane: !prev.showNavigationPane }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setUI(prev => ({ ...prev, darkMode: !prev.darkMode }));
  }, []);

  const setFontSize = useCallback((fontSize: number) => {
    setUI(prev => ({ ...prev, fontSize }));
  }, []);

  const setFontFamily = useCallback((fontFamily: string) => {
    setUI(prev => ({ ...prev, fontFamily }));
  }, []);

  const setPageOrientation = useCallback((pageOrientation: 'portrait' | 'landscape') => {
    setUI(prev => ({ ...prev, pageOrientation }));
  }, []);

  const setPageSize = useCallback((pageSize: string) => {
    setUI(prev => ({ ...prev, pageSize }));
  }, []);

  const setMargins = useCallback((margins: Partial<UIState['margins']>) => {
    setUI(prev => ({ ...prev, margins: { ...prev.margins, ...margins } }));
  }, []);

  return (
    <UIContext.Provider value={{
      ui,
      setZoom,
      setViewMode,
      toggleRuler,
      toggleGridlines,
      toggleNavigationPane,
      toggleDarkMode,
      setFontSize,
      setFontFamily,
      setPageOrientation,
      setPageSize,
      setMargins,
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};