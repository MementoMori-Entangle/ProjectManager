import * as React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Menu from './Menu';
import Top from './Top';
import ProjectList from './ProjectList';
import TagList from './TagList';
import ProjectAdmin from './ProjectAdmin';

const MainApp: React.FC = () => {
  return (
    <Router>
      <Menu />
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/tags" element={<TagList />} />
        <Route path="/admin" element={<ProjectAdmin />} />
      </Routes>
    </Router>
  );
};

export default MainApp;
