import * as React from 'react';
import { Link } from 'react-router-dom';
import { useSelectedFile } from './SelectedFileContext';

const Menu: React.FC = () => {
  const { selectedFile } = useSelectedFile();
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '2rem', background: '#f8fafc', display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/" style={{ fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>トップ</Link>
        <Link to="/projects" style={{ fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>プロジェクト一覧</Link>
        <Link to="/tags" style={{ fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>タグ一覧</Link>
        <Link to="/admin" style={{ fontWeight: 600, color: '#f59e42', textDecoration: 'none' }}>管理画面</Link>
        <Link to="/settings" style={{ fontWeight: 600, color: '#059669', textDecoration: 'none' }}>設定</Link>
      </div>
      <div style={{ color: '#2563eb', fontWeight: 500, fontSize: '1rem' }}>
        {selectedFile && `選択中: ${selectedFile}`}
      </div>
    </nav>
  );
};

export default Menu;
