import { useState, useCallback } from 'react';
import type { Task, Column } from './types';
import TaskCard from './TaskCard';

interface KanbanBoardProps {
  tasks: Task[];
  columns: Column[];
  onMove: (taskId: string, status: Task['status']) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  refreshKey: number;
}

const columnGradients: Record<Column['status'], string> = {
  todo: 'from-slate-500 to-slate-600',
  'in-progress': 'from-blue-500 to-cyan-500',
  review: 'from-amber-500 to-orange-500',
  done: 'from-emerald-500 to-teal-500',
};

function KanbanBoard({ tasks, columns, onMove, onEdit, onDelete }: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const handleDragStart = useCallback((taskId: string) => {
    setDraggedTask(taskId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetStatus: Column['status']) => {
      e.preventDefault();
      if (draggedTask) {
        onMove(draggedTask, targetStatus);
      }
      setDraggedTask(null);
      setDragOverColumn(null);
    },
    [draggedTask, onMove]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedTask(null);
    setDragOverColumn(null);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-5">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);
        const isOver = dragOverColumn === col.id;

        return (
          <div
            key={col.id}
            className={`flex flex-col rounded-2xl glass glass-border transition-all ${
              isOver ? 'drag-over ring-2 ring-indigo-300/40' : ''
            }`}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.status)}
          >
            {/* Column header */}
            <div className="flex items-center gap-2 px-4 py-3">
              <div className={`h-2.5 w-2.5 rounded-full bg-gradient-to-br ${columnGradients[col.status]}`} />
              <h3 className="text-sm font-semibold text-gray-700">{col.title}</h3>
              <span className="ml-auto rounded-lg bg-gray-100/80 px-2 py-0.5 text-xs font-medium text-gray-500">
                {colTasks.length}
              </span>
            </div>

            {/* Task list */}
            <div className="flex flex-col gap-3 p-3 pt-0 min-h-[200px]">
              {colTasks.length === 0 && (
                <div className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-gray-200/60">
                  <p className="text-xs text-gray-400">Drop tasks here</p>
                </div>
              )}
              {colTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDragStart={handleDragStart}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isDragged={draggedTask === task.id}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default KanbanBoard;
