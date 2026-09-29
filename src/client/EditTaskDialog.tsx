import { useState, useEffect } from 'react';
import type { Task, TaskFormData } from './types';

interface EditTaskDialogProps {
  task: Task;
  open: boolean;
  onClose: () => void;
  onEdit: (data: TaskFormData) => void;
}

function EditTaskDialog({ task, open, onClose, onEdit }: EditTaskDialogProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState<TaskFormData['status']>(task.status);
  const [priority, setPriority] = useState<TaskFormData['priority']>(task.priority);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setPriority(task.priority);
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onEdit({ title: title.trim(), description: description.trim(), status, priority });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative glass glass-border w-full max-w-md rounded-2xl p-6 shadow-2xl">
        <h2 className="mb-5 text-lg font-semibold text-gray-800">Edit Task</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white/60 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              autoFocus
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-white/60 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskFormData['status'])}
                className="w-full rounded-xl border border-gray-200 bg-white/60 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskFormData['priority'])}
                className="w-full rounded-xl border border-gray-200 bg-white/60 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-200/50 transition-all hover:shadow-xl active:scale-95 disabled:opacity-50"
              disabled={!title.trim()}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTaskDialog;
