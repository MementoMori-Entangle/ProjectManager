const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
import type { Request, Response } from 'express';
import type { ProjectItem, ProjectItemList } from '../types/types';

const DATA_FILE = path.join(process.cwd(), 'data/projects.json');

// データファイルの読み書き
function readData(): ProjectItemList {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeData(data: ProjectItemList): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
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
  // recordUse, // コピーカウント処理に統合(削除保留)
  incrementCopyCount,
};
