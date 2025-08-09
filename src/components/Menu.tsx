import * as React from 'react';
import { Link } from 'react-router-dom';

const Menu: React.FC = () => {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '2rem', background: '#f8fafc', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <Link to="/" style={{ fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>トップ</Link>
      <Link to="/projects" style={{ fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>プロジェクト一覧</Link>
      <Link to="/tags" style={{ fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>タグ一覧</Link>
      <Link to="/admin" style={{ fontWeight: 600, color: '#f59e42', textDecoration: 'none' }}>管理画面</Link>
    </nav>
  );
};

export default Menu;
