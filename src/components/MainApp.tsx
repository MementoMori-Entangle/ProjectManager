import * as React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Menu from './Menu';
import Top from './Top';
import ProjectList from './ProjectList';
import TagList from './TagList';
import ProjectAdmin from './ProjectAdmin';
import Settings from './Settings';
import { SelectedFileProvider } from './SelectedFileContext';

const MainApp: React.FC = () => {
  return (
    <SelectedFileProvider>
      <Router>
        <Menu />
        <Routes>
          <Route path="/" element={<Top />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/tags" element={<TagList />} />
          <Route path="/admin" element={<ProjectAdmin />} />
          <Route path="/settings" element={<SettingsWrapper />} />
        </Routes>
      </Router>
    </SelectedFileProvider>
  );
};

// Settings画面ラッパー
import { useSelectedFile } from './SelectedFileContext';
const SettingsWrapper: React.FC = () => {
  const { selectedFile, refreshSelectedFile } = useSelectedFile();
  return <>
    <Settings onSelect={() => refreshSelectedFile()} />
    {selectedFile && <div style={{ marginTop: 16, color: '#059669' }}>選択中: {selectedFile}</div>}
  </>;
};

export default MainApp;
