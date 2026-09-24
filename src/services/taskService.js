const repository = require('../repositories/taskRepository');

function listTasks() {
  return repository.findAll();
}

function getTask(id) {
  const task = repository.findById(id);
  if (!task) throw notFound();
  return task;
}

function createTask(payload) {
  if (!payload || typeof payload.title !== 'string' || !payload.title.trim()) {
    throw badRequest('Title is required');
  }
  return repository.create(payload);
}

function updateTask(id, payload) {
  const existing = getTask(id);
  if (payload.title !== undefined && (typeof payload.title !== 'string' || !payload.title.trim())) {
    throw badRequest('Title cannot be empty');
  }
  if (payload.completed !== undefined && typeof payload.completed !== 'boolean') {
    throw badRequest('Completed must be a boolean');
  }
  return repository.update(existing.id, payload);
}

function deleteTask(id) {
  getTask(id);
  repository.remove(id);
}

function badRequest(message) {
  return Object.assign(new Error(message), { status: 400 });
}
function notFound() {
  return Object.assign(new Error('Task not found'), { status: 404 });
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };
