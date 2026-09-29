export type TaskColumn = 'todo' | 'in-progress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  column: TaskColumn;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  column: TaskColumn;
  priority: Priority;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  column?: TaskColumn;
  priority?: Priority;
}

export const COLUMNS: { id: TaskColumn; title: string; color: string; icon: string }[] = [
  { id: 'todo', title: 'To Do', color: '#6366f1', icon: '📋' },
  { id: 'in-progress', title: 'In Progress', color: '#f59e0b', icon: '⚡' },
  { id: 'review', title: 'Review', color: '#8b5cf6', icon: '🔍' },
  { id: 'done', title: 'Done', color: '#10b981', icon: '✅' },
];
