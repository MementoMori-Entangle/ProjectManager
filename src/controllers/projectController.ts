const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
import type { Request, Response } from 'express';
import type { ProjectItem, ProjectItemList } from '../types/types';
import { PROJECTS_FILE_NAME, SELECTED_PROJECT_FILE_NAME } from '../config/config';

let selectedFile = PROJECTS_FILE_NAME;
const DATA_DIR = path.join(process.cwd(), 'data');
const SELECTED_FILE_PATH = path.join(DATA_DIR, SELECTED_PROJECT_FILE_NAME);

function loadSelectedFile() {
  if (fs.existsSync(SELECTED_FILE_PATH)) {
    try {
      const obj = JSON.parse(fs.readFileSync(SELECTED_FILE_PATH, 'utf-8'));
      if (obj && typeof obj.selectedFile === 'string') {
        selectedFile = obj.selectedFile;
      }
    } catch {}
  }
}
function saveSelectedFile() {
  fs.writeFileSync(SELECTED_FILE_PATH, JSON.stringify({ selectedFile }), 'utf-8');
}
// サーバー起動時に選択ファイルを復元
loadSelectedFile();
function getDataFile() {
  return path.join(DATA_DIR, selectedFile);
}

// データファイルの読み書き
function readData(): ProjectItemList {
  const file = getDataFile();
  if (!fs.existsSync(file)) return [];
  const raw = fs.readFileSync(file, 'utf-8');
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeData(data: ProjectItemList): void {
  fs.writeFileSync(getDataFile(), JSON.stringify(data, null, 2), 'utf-8');
}

function getProjects(req: Request, res: Response): void {
  const data = readData();
  res.json(data);
}

function addProject(req: Request, res: Response): void {
  const data = readData();
  const now = new Date().toISOString();
  const newId = (crypto && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2);
  const { projectId, ...rest } = req.body;
  const item: ProjectItem = {
    ...rest,
    id: newId,
    projectId: newId,
    createdAt: now,
    updatedAt: now,
  };
  data.push(item);
  writeData(data);
  res.status(201).json(item);
}

function updateProject(req: Request, res: Response): void {
  const data = readData();
  const idx = data.findIndex((p: ProjectItem) => p.id === req.params.id);
  if (idx === -1) {
    res.status(404).end();
    return;
  }
  data[idx] = { ...data[idx], ...req.body, updatedAt: new Date().toISOString() };
  writeData(data);
  res.json(data[idx]);
}

function deleteProject(req: Request, res: Response): void {
  let data = readData();
  const idx = data.findIndex((p: ProjectItem) => p.id === req.params.id);
  if (idx === -1) {
    res.status(404).end();
    return;
  }
  const removed = data.splice(idx, 1);
  writeData(data);
  res.json(removed[0]);
}

function recordUse(req: Request, res: Response): void {
  const data = readData();
  const idx = data.findIndex((p: ProjectItem) => p.id === req.params.id);
  if (idx === -1) {
    res.status(404).end();
    return;
  }
  if (data[idx]) {
    data[idx].lastUsedAt = new Date().toISOString();
    writeData(data);
    res.json(data[idx]);
  } else {
    res.status(404).end();
  }

}

// コピー回数をインクリメント
function incrementCopyCount(req: Request, res: Response): void {
  const data = readData();
  const idx = data.findIndex((p: ProjectItem) => p.id === req.params.id);
  if (idx === -1 || !data[idx]) {
    res.status(404).end();
    return;
  }
  data[idx].copyCount = (data[idx].copyCount || 0) + 1;
  data[idx].lastUsedAt = new Date().toISOString();
  writeData(data);
  res.json(data[idx]);
}

module.exports = {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  incrementCopyCount,
  // dataフォルダのjson一覧取得
  getProjectFiles: (req: Request, res: Response) => {
  fs.readdir(DATA_DIR, (err: NodeJS.ErrnoException | null, files: string[] = []) => {
    if (err) return res.status(500).json({ error: 'dataフォルダが見つかりません' });
    // 選択管理ファイルは選択肢から除外
    res.json(files.filter((f: string) => f.endsWith('.json') && f !== SELECTED_PROJECT_FILE_NAME));
  });
  },
  // jsonファイル新規作成
  createProjectFile: (req: Request, res: Response) => {
    const { filename } = req.body;
    if (!filename || !filename.match(/^[\w-]+\.json$/)) {
      return res.status(400).json({ error: 'ファイル名不正' });
    }
    const filePath = path.join(DATA_DIR, filename);
    if (fs.existsSync(filePath)) {
      return res.status(409).json({ error: '既に存在します' });
    }
    fs.writeFileSync(filePath, '[]', 'utf-8');
    res.status(201).json({ filename });
  },
  // 選択中ファイル取得・変更
  getSelectedFile: (req: Request, res: Response) => {
    res.json({ selectedFile });
  },
  setSelectedFile: (req: Request, res: Response) => {
    const { filename } = req.body;
    if (!filename || !filename.match(/^[\w-]+\.json$/)) {
      return res.status(400).json({ error: 'ファイル名不正' });
    }
    if (!fs.existsSync(path.join(DATA_DIR, filename))) {
      return res.status(404).json({ error: 'ファイルが存在しません' });
    }
    selectedFile = filename;
    // 選択管理ファイルが存在しない場合も必ず新規作成
    saveSelectedFile();
    res.json({ selectedFile });
  },
};
