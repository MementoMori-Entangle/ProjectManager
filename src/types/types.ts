// 管理データの型定義
export interface ProjectItem {
  id: string; // 管理ID
  projectId: string; // プロジェクトID
  projectName: string; // プロジェクト名
  projectPath: string; // プロジェクトパス
  relatedIds: string[]; // プロジェクト関連ID（複数可）
  tags: string[]; // タグ（複数可）
  content: string; // 内容
  order: number; // 配置順位
  note?: string; // 備考（補足説明など）
  lastUsedAt?: string; // 使用日時（ISO8601）
  copyCount?: number; // コピー回数
  createdAt: string; // 登録日時（ISO8601）
  updatedAt: string; // 更新日時（ISO8601）
}

// データ全体の型
export type ProjectItemList = ProjectItem[];
