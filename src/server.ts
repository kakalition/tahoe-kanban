import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

interface Column {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  order: number;
}

let columns: Column[] = [
  { id: 'todo', title: 'To Do', status: 'todo', order: 0 },
  { id: 'in-progress', title: 'In Progress', status: 'in-progress', order: 1 },
  { id: 'review', title: 'Review', status: 'review', order: 2 },
  { id: 'done', title: 'Done', status: 'done', order: 3 },
];

let tasks: Task[] = [
  {
    id: '1',
    title: 'Design system setup',
    description: 'Create color palette, typography, and component library',
    status: 'done',
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Authentication flow',
    description: 'Implement login, register, and password reset',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Kanban board API',
    description: 'REST endpoints for task CRUD operations',
    status: 'review',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Unit tests',
    description: 'Write tests for core business logic',
    status: 'todo',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Documentation',
    description: 'API docs and user guides',
    status: 'todo',
    priority: 'low',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let nextTaskId = 6;

const app = new Elysia()
  .use(cors())
  .get('/api/columns', () => columns)
  .get('/api/tasks', ({ query }) => {
    const status = query?.status;
    if (status) {
      return tasks.filter((t) => t.status === status);
    }
    return tasks;
  })
  .post('/api/tasks', ({ body }) => {
    const now = new Date().toISOString();
    const task: Task = {
      id: String(nextTaskId++),
      title: body.title,
      description: body.description || '',
      status: body.status || 'todo',
      priority: body.priority || 'medium',
      createdAt: now,
      updatedAt: now,
    };
    tasks.push(task);
    return task;
  })
  .put('/api/tasks/:id', ({ params, body }) => {
    const task = tasks.find((t) => t.id === params.id);
    if (!task) return { error: 'Not found' };
    task.title = body.title ?? task.title;
    task.description = body.description ?? task.description;
    task.status = body.status ?? task.status;
    task.priority = body.priority ?? task.priority;
    task.updatedAt = new Date().toISOString();
    return task;
  })
  .delete('/api/tasks/:id', ({ params }) => {
    tasks = tasks.filter((t) => t.id !== params.id);
    return { success: true };
  })
  .put('/api/tasks/move', ({ body }) => {
    const { taskId, status, targetColumnId } = body;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return { error: 'Not found' };
    task.status = status;
    task.updatedAt = new Date().toISOString();
    return task;
  })
  .listen({ port: 10002, hostname: '0.0.0.0' });

console.log(`\n  🚀 Tahoe Kanban API`);
console.log(`  → http://localhost:${app.server?.port ?? 10002}\n`);
