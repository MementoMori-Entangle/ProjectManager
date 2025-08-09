
import * as React from 'react';
import type { ProjectItem } from '../types/types';
import { PAGE_SIZE } from '../config/config';
import { API_BASE_URL } from '../config/config';


const TagList: React.FC = () => {
  const [tags, setTags] = React.useState<string[]>([]);
  const [projects, setProjects] = React.useState<ProjectItem[]>([]);
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/api/projects`)
      .then(res => res.json())
      .then((projects: ProjectItem[]) => {
        setProjects(projects);
        const allTags = Array.from(new Set(projects.flatMap(p => p.tags)));
        setTags(allTags);
      });
  }, []);

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setPage(1);
    setExpanded({});
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    fetch(`${API_BASE_URL}/api/projects/${id}/copy`, { method: 'POST' });
  };

  const toggleNote = (id: string) => {
    setExpanded((exp) => ({ ...exp, [id]: !exp[id] }));
  };

  const filteredProjects = selectedTag ? projects.filter(p => p.tags?.includes(selectedTag)) : [];
  const total = filteredProjects.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pagedProjects = filteredProjects.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>タグ一覧</h2>
      <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', listStyle: 'none', padding: 0, marginBottom: 24 }}>
        {tags.map(tag => (
          <li
            key={tag}
            style={{ background: selectedTag === tag ? '#6366f1' : '#e0e7ff', color: selectedTag === tag ? '#fff' : '#3730a3', borderRadius: 8, padding: '0.5rem 1rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </li>
        ))}
      </ul>

      {selectedTag && (
        <div>
          <h3 style={{ marginBottom: 12 }}>{selectedTag} に属するプロジェクト一覧</h3>
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
                  <span style={{ cursor: 'pointer', background: '#f1f5f9', padding: '4px 10px', borderRadius: 6, fontSize: 15, fontFamily: 'monospace' }}
                    title="クリックでコピー"
                    onClick={() => handleCopy(item.content, item.id)}>{item.content}</span>
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
      )}
    </div>
  );
};

export default TagList;
