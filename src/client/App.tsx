import { useState, useEffect, useCallback } from 'react';
import type { Task, Column, TaskFormData } from './types';
import KanbanBoard from './KanbanBoard';
import AddTaskDialog from './AddTaskDialog';
import EditTaskDialog from './EditTaskDialog';

const priorityColors: Record<Task['priority'], string> = {
  low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  high: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      console.error('Failed to fetch tasks:', e);
    }
  }, []);

  const fetchColumns = useCallback(async () => {
    try {
      const res = await fetch('/api/columns');
      const data = await res.json();
      setColumns(data);
    } catch (e) {
      console.error('Failed to fetch columns:', e);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchColumns();
  }, [fetchTasks, fetchColumns]);

  const handleAdd = async (data: TaskFormData) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setIsAddOpen(false);
    } catch (e) {
      console.error('Failed to add task:', e);
    }
  };

  const handleEdit = async (data: TaskFormData) => {
    if (!editingTask) return;
    try {
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
      setEditingTask(null);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      console.error('Failed to update task:', e);
    }
  };

  const handleMove = async (taskId: string, status: Task['status']) => {
    try {
      const res = await fetch('/api/tasks/move', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, status }),
      });
      const updated = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
      setRefreshKey((k) => k + 1);
    } catch (e) {
      console.error('Failed to move task:', e);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setRefreshKey((k) => k + 1);
    } catch (e) {
      console.error('Failed to delete task:', e);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 glass glass-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <line x1="8" y1="3" x2="8" y2="21" />
                <line x1="16" y1="3" x2="16" y2="21" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800 tracking-tight">Tahoe Kanban</h1>
              <p className="text-xs text-gray-500">Project Management</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-200/50 transition-all hover:shadow-xl hover:shadow-indigo-200/60 active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Task
          </button>
        </div>
      </header>

      {/* Stats bar */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="glass glass-border rounded-2xl p-4">
          <div className="grid grid-cols-4 gap-4">
            {columns.map((col) => {
              const count = tasks.filter((t) => t.status === col.status).length;
              return (
                <div key={col.id} className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{count}</div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{col.title}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="mx-auto max-w-7xl px-6 pb-8">
        <KanbanBoard
          tasks={tasks}
          columns={columns}
          onMove={handleMove}
          onEdit={setEditingTask}
          onDelete={handleDelete}
          refreshKey={refreshKey}
        />
      </div>

      {/* Dialogs */}
      <AddTaskDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAdd}
      />
      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          open={!!editingTask}
          onClose={() => setEditingTask(null)}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}

export default App;
