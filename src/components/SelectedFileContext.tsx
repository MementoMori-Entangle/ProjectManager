import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/config';

export type SelectedFileContextType = {
  selectedFile: string;
  setSelectedFile: (filename: string) => void;
  refreshSelectedFile: () => void;
};

const SelectedFileContext = createContext<SelectedFileContextType | undefined>(undefined);

export const useSelectedFile = () => {
  const ctx = useContext(SelectedFileContext);
  if (!ctx) throw new Error('useSelectedFile must be used within SelectedFileProvider');
  return ctx;
};

export const SelectedFileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState('');

  const refreshSelectedFile = () => {
    fetch(`${API_BASE_URL}/api/selected-file`)
      .then(res => res.json())
      .then(data => {
        if (data.selectedFile) setSelectedFile(data.selectedFile);
      });
  };

  useEffect(() => {
    refreshSelectedFile();
  }, []);

  return (
    <SelectedFileContext.Provider value={{ selectedFile, setSelectedFile, refreshSelectedFile }}>
      {children}
    </SelectedFileContext.Provider>
  );
};
