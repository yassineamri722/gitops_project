const repository = require('../repositories/taskRepository');
const { validateTask } = require('../validators/taskValidator');

async function listTasks(query = {}) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
  const status = query.status || undefined;

  if (status && !['completed', 'pending'].includes(status)) {
    throw badRequest('Status must be completed or pending');
  }

  return repository.findAll({ status, search: query.search?.trim(), page, limit });
}

async function getTask(id) {
  const task = await repository.findById(parseId(id));
  if (!task) throw notFound();
  return task;
}

async function createTask(payload = {}) {
  validateTask(payload);
  return repository.create(payload);
}

async function updateTask(id, payload = {}) {
  await getTask(id);
  validateTask(payload, { partial: true });
  return repository.update(parseId(id), payload);
}

async function deleteTask(id) {
  await getTask(id);
  await repository.remove(parseId(id));
}

function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) throw badRequest('Invalid task id');
  return id;
}

function badRequest(message) { return Object.assign(new Error(message), { status: 400 }); }
function notFound() { return Object.assign(new Error('Task not found'), { status: 404 }); }

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };
