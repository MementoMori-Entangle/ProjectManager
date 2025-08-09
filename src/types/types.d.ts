export interface ProjectItem {
    id: string;
    projectId: string;
    projectName: string;
    projectPath: string;
    relatedIds: string[];
    tags: string[];
    content: string;
    order: number;
    note?: string;
    lastUsedAt?: string;
    copyCount?: number;
    createdAt: string;
    updatedAt: string;
}
export type ProjectItemList = ProjectItem[];
//# sourceMappingURL=types.d.ts.map