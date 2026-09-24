const ALLOWED_PRIORITIES = ['low', 'medium', 'high'];
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function validateTask(payload = {}, { partial = false } = {}) {
  if (!partial && (!isNonEmptyString(payload.title))) {
    throw badRequest('Title is required');
  }

  if (payload.title !== undefined && !isNonEmptyString(payload.title)) {
    throw badRequest('Title cannot be empty');
  }

  if (payload.description !== undefined && typeof payload.description !== 'string') {
    throw badRequest('Description must be text');
  }

  if (payload.completed !== undefined && typeof payload.completed !== 'boolean') {
    throw badRequest('Completed must be a boolean');
  }

  if (payload.priority !== undefined && !ALLOWED_PRIORITIES.includes(payload.priority)) {
    throw badRequest('Priority must be low, medium, or high');
  }

  if (payload.dueDate !== undefined && payload.dueDate !== null && !DATE_PATTERN.test(payload.dueDate)) {
    throw badRequest('Due date must use YYYY-MM-DD');
  }
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function badRequest(message) {
  return Object.assign(new Error(message), { status: 400 });
}

module.exports = { validateTask };
