import * as React from 'react';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/config';
import { useSelectedFile } from './SelectedFileContext';

const Settings: React.FC<{ onSelect: () => void }> = ({ onSelect }) => {
  const [files, setFiles] = useState<string[]>([]);
  const [newFile, setNewFile] = useState('');
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');
  const { selectedFile, refreshSelectedFile } = useSelectedFile();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/project-files`).then(res => res.json()).then(setFiles);
    setSelected(selectedFile);
  }, [selectedFile]);

  const handleCreate = async () => {
    if (!newFile.match(/^[\w-]+\.json$/)) {
      setError('ファイル名は半角英数・-(ハイフン)のみ、拡張子は.jsonで指定してください');
      return;
    }
    setError('');
    const res = await fetch(`${API_BASE_URL}/api/project-files`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: newFile })
    });
    if (res.ok) {
      setNewFile('');
      fetch(`${API_BASE_URL}/api/project-files`).then(res => res.json()).then(setFiles);
    } else {
      setError('ファイル作成に失敗しました');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>プロジェクトデータ選択</h2>
      <select value={selected} onChange={async e => {
        const filename = e.target.value;
        setSelected(filename);
        if (filename) {
          await fetch(`${API_BASE_URL}/api/selected-file`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename })
          });
          refreshSelectedFile();
          onSelect();
        }
      }} style={{ fontSize: 16, marginBottom: 16 }}>
        <option value="">選択してください</option>
        {files.map(f => <option key={f} value={f}>{f}</option>)}
      </select>
      <div style={{ marginTop: 24 }}>
        <h3>新規プロジェクト（jsonファイル）作成</h3>
        <input type="text" value={newFile} onChange={e => setNewFile(e.target.value)} placeholder="例: myproject.json" style={{ fontSize: 16, marginRight: 8 }} />
        <button onClick={handleCreate}>作成</button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </div>
      <div style={{ marginTop: 32, color: '#888', fontSize: 13 }}>
        ※ファイル名の変更・削除は手動で管理してください。
      </div>
    </div>
  );
};

export default Settings;
