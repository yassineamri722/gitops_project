const { database } = require('../config/database');

const columns = `
  id,
  title,
  description,
  completed,
  priority,
  due_date AS "dueDate",
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;

function findAll({ status, search, page = 1, limit = 20 }) {
  const values = [];
  const filters = [];

  if (status === 'completed' || status === 'pending') {
    values.push(status === 'completed');
    filters.push(`completed = ?`);
  }

  if (search) {
    values.push(`%${search}%`);
    filters.push(`(title LIKE ? OR description LIKE ?)`);
  }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const query = `
    SELECT ${columns}, COUNT(*) OVER() AS totalCount
    FROM tasks
    ${where}
    ORDER BY completed ASC, created_at DESC
    LIMIT ? OFFSET ?
  `;

  const rows = database.prepare(query).all(...values, limit, offset).map((task) => ({
    ...task,
    totalCount: Number(task.totalCount || 0)
  }));

  return {
    items: rows.map(({ totalCount, ...item }) => item),
    total: rows[0]?.totalCount || 0,
    page,
    limit
  };
}

function findById(id) {
  const task = database.prepare(`SELECT ${columns} FROM tasks WHERE id = ?`).get(id);
  return task || null;
}

function create({ title, description = '', priority = 'medium', dueDate = null }) {
  const result = database.prepare(`
    INSERT INTO tasks (title, description, priority, due_date)
    VALUES (?, ?, ?, ?)
  `).run(title.trim(), description.trim(), priority, dueDate || null);

  return findById(result.lastInsertRowid);
}

function update(id, { title, description, completed, priority, dueDate }) {
  const fields = [];
  const values = [];

  if (title !== undefined) { fields.push('title = ?'); values.push(title.trim()); }
  if (description !== undefined) { fields.push('description = ?'); values.push(description.trim()); }
  if (completed !== undefined) { fields.push('completed = ?'); values.push(completed ? 1 : 0); }
  if (priority !== undefined) { fields.push('priority = ?'); values.push(priority); }
  if (dueDate !== undefined) { fields.push('due_date = ?'); values.push(dueDate || null); }

  if (!fields.length) return findById(id);

  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  database.prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  return findById(id);
}

function remove(id) {
  return database.prepare('DELETE FROM tasks WHERE id = ?').run(id).changes > 0;
}

module.exports = { findAll, findById, create, update, remove };
