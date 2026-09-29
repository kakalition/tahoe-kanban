import type { Task } from './types';

interface TaskCardProps {
  task: Task;
  onDragStart: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isDragged: boolean;
  onDragEnd: () => void;
}

const priorityIcons: Record<Task['priority'], { bg: string; icon: string }> = {
  low: { bg: 'bg-emerald-100', icon: '↓' },
  medium: { bg: 'bg-amber-100', icon: '→' },
  high: { bg: 'bg-rose-100', icon: '↑' },
};

function TaskCard({ task, onDragStart, onEdit, onDelete, isDragged, onDragEnd }: TaskCardProps) {
  const p = priorityIcons[task.priority];

  return (
    <div
      draggable
      onDragStart={() => onDragStart(task.id)}
      onDragEnd={onDragEnd}
      className={`group cursor-grab rounded-xl bg-white/80 p-3.5 shadow-sm transition-all hover:shadow-md active:cursor-grabbing ${
        isDragged ? 'dragging' : ''
      }`}
    >
      {/* Top row */}
      <div className="mb-2 flex items-center justify-between">
        <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${p.bg}`}>
          {p.icon} {task.priority}
        </span>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(task)}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            title="Edit"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
            title="Delete"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Title */}
      <h4 className="mb-1 text-sm font-semibold text-gray-800 leading-snug">{task.title}</h4>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{task.description}</p>
      )}

      {/* Footer */}
      <div className="mt-2.5 flex items-center gap-2 text-[10px] text-gray-400">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </div>
    </div>
  );
}

export default TaskCard;
