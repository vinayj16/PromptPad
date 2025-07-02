import React from 'react';
import EditorContainer from './components/Editor/EditorContainer';
import { DocumentProvider } from './context/DocumentContext';

const App = () => {
  return (
    <DocumentProvider>
      <EditorContainer />
    </DocumentProvider>
  );
};

export default App;
