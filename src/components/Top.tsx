import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ProjectItem } from '../types/types';
import { API_BASE_URL } from '../config/config';

const Top: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/projects`).then(res => res.json()).then(setProjects);
  }, []);

  // コピー回数上位5件
  const topCopied = [...projects]
    .filter(p => p.copyCount && p.copyCount > 0)
    .sort((a, b) => (b.copyCount || 0) - (a.copyCount || 0))
    .slice(0, 5);

  // 使用日時が新しい順5件
  const topRecent = [...projects]
    .filter(p => p.lastUsedAt)
    .sort((a, b) => (b.lastUsedAt || '').localeCompare(a.lastUsedAt || ''))
    .slice(0, 5);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#2563eb', marginBottom: 16 }}>プロジェクト管理ツール</h1>
      <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: 32 }}>よく使うプロジェクトやタグを素早く管理・検索できます。</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
        <Link to="/projects" style={{ background: '#2563eb', color: '#fff', padding: '1rem 2rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem' }}>プロジェクト一覧へ</Link>
        <Link to="/tags" style={{ background: '#e0e7ff', color: '#3730a3', padding: '1rem 2rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem' }}>タグ一覧へ</Link>
        <Link to="/admin" style={{ background: '#fbbf24', color: '#92400e', padding: '1rem 2rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem' }}>管理画面</Link>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 48 }}>
        <div style={{ minWidth: 320 }}>
          <h2 style={{ fontSize: '1.2rem', color: '#2563eb', marginBottom: 8 }}>よく使う内容（コピー回数順）</h2>
          <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0 }}>
            {topCopied.length === 0 && <li style={{ color: '#888' }}>データなし</li>}
            {topCopied.map(p => (
              <li key={p.id} style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>{p.projectName}</span>（コピー回数: {p.copyCount}）<br />
                <span
                  style={{ fontSize: 13, color: '#555', cursor: 'pointer', background: '#f1f5f9', padding: '2px 8px', borderRadius: 4, whiteSpace: 'pre-line' }}
                  title="クリックでコピー"
                  onClick={async () => {
                    await navigator.clipboard.writeText(p.content);
                    await fetch(`${API_BASE_URL}/api/projects/${p.id}/copy`, { method: 'POST' });
                    fetch(`${API_BASE_URL}/api/projects`).then(res => res.json()).then(setProjects);
                  }}
                >{p.content}</span>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ minWidth: 320 }}>
          <h2 style={{ fontSize: '1.2rem', color: '#2563eb', marginBottom: 8 }}>履歴（最新順）</h2>
          <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0 }}>
            {topRecent.length === 0 && <li style={{ color: '#888' }}>データなし</li>}
            {topRecent.map(p => (
              <li key={p.id} style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>{p.projectName}</span><br />
                <span
                  style={{ fontSize: 13, color: '#555', cursor: 'pointer', background: '#f1f5f9', padding: '2px 8px', borderRadius: 4, whiteSpace: 'pre-line' }}
                  title="クリックでコピー"
                  onClick={async () => {
                    await navigator.clipboard.writeText(p.content);
                    await fetch(`${API_BASE_URL}/api/projects/${p.id}/copy`, { method: 'POST' });
                    fetch(`${API_BASE_URL}/api/projects`).then(res => res.json()).then(setProjects);
                  }}
                >{p.content}</span><br />
                <span style={{ fontSize: 12, color: '#888' }}>最終使用: {p.lastUsedAt ? new Date(p.lastUsedAt).toLocaleString() : '-'}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Top;
