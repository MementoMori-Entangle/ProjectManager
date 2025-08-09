import * as React from 'react';
import { useEffect, useState } from 'react';
import type { ProjectItem } from '../types/types';
import { PAGE_SIZE } from '../config/config';
import { API_BASE_URL } from '../config/config';

const emptyItem: Omit<ProjectItem, 'id' | 'createdAt' | 'updatedAt'> = {
  projectId: '',
  projectName: '',
  projectPath: '',
  relatedIds: [],
  tags: [],
  content: '',
  order: 0,
  note: '',
  lastUsedAt: '',
};

const ProjectAdmin: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ ...emptyItem });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 必須項目の入力状態を監視し、入力があればloadingをfalseにする
  useEffect(() => {
    if (loading && (form.projectName.trim() && form.content.trim())) {
      setLoading(false);
    }
  }, [form.projectName, form.content]);

  const fetchProjects = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE_URL}/api/projects`);
    setProjects(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'order') {
      setForm(f => ({ ...f, order: value === '' ? 0 : Number(value) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleArrayChange = (name: keyof typeof form, value: string) => {
    // カンマをそのまま許可し、分割のみ行う
    setForm(f => ({ ...f, [name]: value.split(',').map(v => v.trim()) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // 入力チェック: プロジェクト名・内容
    if (!form.projectName.trim() || !form.content.trim()) {
      alert('プロジェクト名と内容は必須です');
      return;
    }
    if (editId) {
      // projectIdが空の場合はidをセット
      const sendData = { ...form, projectId: form.projectId || editId };
      await fetch(`${API_BASE_URL}/api/projects/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sendData) });
    } else {
      // projectIdを送信しない（バックエンドで自動採番）
      const { projectId, ...rest } = form;
      const sendData = { ...rest };
      await fetch(`${API_BASE_URL}/api/projects`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sendData) });
    }
    setForm({ ...emptyItem });
    setEditId(null);
    fetchProjects();
  };

  const handleEdit = (item: ProjectItem) => {
    setForm({ ...item });
    setEditId(item.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('本当に削除しますか？')) return;
    setLoading(true);
    await fetch(`${API_BASE_URL}/api/projects/${id}`, { method: 'DELETE' });
    fetchProjects();
  };

  // ページング計算
  const total = projects.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pagedProjects = projects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h2>プロジェクト管理</h2>
      <form onSubmit={handleSubmit} style={{ background: '#f8fafc', borderRadius: 8, padding: 16, marginBottom: 32 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          {form.projectId && (
            <span style={{ flex: 1, color: '#888', fontSize: 13 }}>ID: {form.projectId}</span>
          )}
          <input name="projectName" value={form.projectName} onChange={handleChange} placeholder="プロジェクト名" required style={{ flex: 2 }} />
          <input name="projectPath" value={form.projectPath} onChange={handleChange} placeholder="パス" style={{ flex: 2 }} />
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          <input name="tags" value={form.tags.join(',')} onChange={e => handleArrayChange('tags', e.target.value)} placeholder="タグ(カンマ区切り)" style={{ flex: 2 }} />
          <input name="relatedIds" value={form.relatedIds.join(',')} onChange={e => handleArrayChange('relatedIds', e.target.value)} placeholder="関連ID(カンマ区切り)" style={{ flex: 2 }} />
        </div>
        <textarea name="content" value={form.content} onChange={handleChange} placeholder="内容" rows={2} style={{ width: '100%', marginTop: 8 }} required />
        <input name="order" type="number" value={form.order} onChange={handleChange} placeholder="配置順位" style={{ width: 120, marginTop: 8 }} />
        <textarea name="note" value={form.note} onChange={handleChange} placeholder="備考" rows={1} style={{ width: '100%', marginTop: 8 }} />
        <div style={{ marginTop: 12 }}>
          <button
            type="submit"
            style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 24px', fontWeight: 600, cursor: (loading) ? 'not-allowed' : 'pointer' }}
            disabled={loading}
          >
            {editId ? '更新' : '新規登録'}
          </button>
          {editId && <button type="button" onClick={() => { setForm({ ...emptyItem }); setEditId(null); }} style={{ marginLeft: 16 }}>キャンセル</button>}
        </div>
      </form>
      <h3>登録済みプロジェクト</h3>
      {/* ページングUI（上） */}
      <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'center', gap: 8 }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>前へ</button>
        <span style={{ margin: '0 8px' }}>{page} / {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>次へ</button>
      </div>
      <table style={{ width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #f1f5f9', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th>プロジェクトID</th><th>名称</th><th>パス</th><th>タグ</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          {pagedProjects.map(item => (
            <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{item.projectId}</td>
              <td>{item.projectName}</td>
              <td>{item.projectPath}</td>
              <td>{item.tags?.join(', ')}</td>
              <td>
                <button onClick={() => handleEdit(item)} style={{ marginRight: 8 }}>編集</button>
                <button onClick={() => handleDelete(item.id)} style={{ color: '#dc2626' }}>削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* ページングUI */}
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 8 }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>前へ</button>
        <span style={{ margin: '0 8px' }}>{page} / {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>次へ</button>
      </div>
    </div>
  );
};

export default ProjectAdmin;
