const repository = require('../repositories/taskRepository');

async function listTasks(query = {}) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
  const status = query.status || undefined;

  if (status && !['completed', 'pending'].includes(status)) {
    throw badRequest('Status must be completed or pending');
  }

  return repository.findAll({
    status,
    search: query.search?.trim(),
    page,
    limit
  });
}

async function getTask(id) {
  const task = await repository.findById(parseId(id));
  if (!task) {
    throw notFound();
  }

  return task;
}

async function createTask(payload = {}) {
  validate(payload, { allowPartial: false });
  return repository.create(payload);
}

async function updateTask(id, payload = {}) {
  await getTask(id);
  validate(payload, { allowPartial: true });
  return repository.update(parseId(id), payload);
}

async function deleteTask(id) {
  await getTask(id);
  await repository.remove(parseId(id));
}

function validate(payload, { allowPartial }) {
  if (!allowPartial && (typeof payload.title !== 'string' || !payload.title.trim())) {
    throw badRequest('Title is required');
  }

  if (payload.title !== undefined && (typeof payload.title !== 'string' || !payload.title.trim())) {
    throw badRequest('Title cannot be empty');
  }

  if (payload.description !== undefined && typeof payload.description !== 'string') {
    throw badRequest('Description must be text');
  }

  if (payload.completed !== undefined && typeof payload.completed !== 'boolean') {
    throw badRequest('Completed must be a boolean');
  }

  if (payload.priority !== undefined && !['low', 'medium', 'high'].includes(payload.priority)) {
    throw badRequest('Priority must be low, medium, or high');
  }

  if (payload.dueDate !== undefined && payload.dueDate !== null && !/^\d{4}-\d{2}-\d{2}$/.test(payload.dueDate)) {
    throw badRequest('Due date must use YYYY-MM-DD');
  }
}

function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    throw badRequest('Invalid task id');
  }

  return id;
}

function badRequest(message) {
  return Object.assign(new Error(message), { status: 400 });
}

function notFound() {
  return Object.assign(new Error('Task not found'), { status: 404 });
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };
