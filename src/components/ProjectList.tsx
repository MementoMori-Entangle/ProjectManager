
import type { ProjectItem } from '../types/types';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { PAGE_SIZE } from '../config/config';
import { API_BASE_URL } from '../config/config';


function ProjectList() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/projects`)
      .then(res => res.json())
      .then(setProjects);
  }, []);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    fetch(`${API_BASE_URL}/api/projects/${id}/copy`, { method: 'POST' });
  };

  const toggleNote = (id: string) => {
    setExpanded((exp) => ({ ...exp, [id]: !exp[id] }));
  };

  // 検索フィルタ
  const filteredProjects = projects.filter(item => {
    if (!search.trim()) return true;
    const s = search.trim().toLowerCase();
    return (
      (item.projectName && item.projectName.toLowerCase().includes(s)) ||
      (item.content && item.content.toLowerCase().includes(s)) ||
      (item.note && item.note.toLowerCase().includes(s))
    );
  });

  // ページング計算
  const total = filteredProjects.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pagedProjects = filteredProjects.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 検索時は1ページ目に戻す
  React.useEffect(() => { setPage(1); }, [search]);

  return (
    <div>
      <h2>プロジェクト一覧</h2>
      {/* 検索ボックス */}
      <div style={{ marginBottom: 12, textAlign: 'center' }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="プロジェクト名・内容・備考で検索"
          style={{ width: 260, padding: 6, borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }}
        />
      </div>
      {/* ページングUI（上） */}
      <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'center', gap: 8 }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>前へ</button>
        <span style={{ margin: '0 8px' }}>{page} / {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>次へ</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 20 }}>
        {pagedProjects.map((item) => (
          <li key={item.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 18, background: '#fff', boxShadow: '0 2px 8px #f1f5f9' }}>
            <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 4 }}>
              {item.projectName}
              {item.projectPath && item.projectPath.trim() !== '' && (
                <span style={{ color: '#888', fontSize: 13 }}>({item.projectPath})</span>
              )}
            </div>
            <div style={{ margin: '8px 0' }}>
              <span
                style={{ cursor: 'pointer', background: '#f1f5f9', padding: '4px 10px', borderRadius: 6, fontSize: 15, fontFamily: 'monospace', whiteSpace: 'pre-line' }}
                title="クリックでコピー"
                onClick={() => handleCopy(item.content, item.id)}
              >
                {item.content}
              </span>
            </div>
            {item.tags && item.tags.length > 0 && (
              <div style={{ marginBottom: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {item.tags.map((tag, i) => (
                  <span key={i} style={{ background: '#e0e7ff', color: '#3730a3', borderRadius: 8, padding: '2px 10px', fontSize: 12 }}>{tag}</span>
                ))}
              </div>
            )}
            {item.relatedIds && item.relatedIds.length > 0 && (
              <div style={{ fontSize: 13, marginBottom: 4 }}>
                関連ID: {item.relatedIds.map((rid, i) => (
                  <a key={i} href={rid} target="_blank" rel="noopener noreferrer" style={{ marginRight: 8 }}>{rid}</a>
                ))}
              </div>
            )}
            {item.note && (
              <div>
                <button onClick={() => toggleNote(item.id)} style={{ fontSize: 12, marginRight: 4, background: '#f1f5f9', border: 'none', borderRadius: 4, cursor: 'pointer', padding: '2px 8px' }}>+ 備考</button>
                {expanded[item.id] && (
                  <div style={{ background: '#f9fafb', padding: 8, borderRadius: 4 }}>{item.note}</div>
                )}
              </div>
            )}
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
              使用日時: {item.lastUsedAt ? new Date(item.lastUsedAt).toLocaleString() : '-'} ／ 登録: {new Date(item.createdAt).toLocaleString()} ／ 更新: {new Date(item.updatedAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
      {/* ページングUI（下） */}
      <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 8 }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>前へ</button>
        <span style={{ margin: '0 8px' }}>{page} / {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>次へ</button>
      </div>
    </div>
  );
}

export default ProjectList;
