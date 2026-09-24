const { database } = require('../config/database');

function findAll() {
  return database.prepare(`
    SELECT id, title, description, completed, created_at AS createdAt, updated_at AS updatedAt
    FROM tasks
    ORDER BY created_at DESC
  `).all().map(normalize);
}

function findById(id) {
  const task = database.prepare(`
    SELECT id, title, description, completed, created_at AS createdAt, updated_at AS updatedAt
    FROM tasks WHERE id = ?
  `).get(id);
  return task ? normalize(task) : null;
}

function create({ title, description = '' }) {
  const result = database.prepare(`
    INSERT INTO tasks (title, description) VALUES (?, ?)
  `).run(title.trim(), description.trim());
  return findById(result.lastInsertRowid);
}

function update(id, { title, description, completed }) {
  const fields = [];
  const values = [];
  if (title !== undefined) { fields.push('title = ?'); values.push(title.trim()); }
  if (description !== undefined) { fields.push('description = ?'); values.push(description.trim()); }
  if (completed !== undefined) { fields.push('completed = ?'); values.push(completed ? 1 : 0); }
  if (!fields.length) return findById(id);

  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);
  database.prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  return findById(id);
}

function remove(id) {
  return database.prepare('DELETE FROM tasks WHERE id = ?').run(id).changes > 0;
}

function normalize(task) {
  return { ...task, completed: Boolean(task.completed) };
}

module.exports = { findAll, findById, create, update, remove };
