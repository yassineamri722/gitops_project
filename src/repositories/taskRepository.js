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

async function findAll({ status, search, page = 1, limit = 20 }) {
  const values = [];
  const filters = [];

  if (status === 'completed' || status === 'pending') {
    values.push(status === 'completed');
    filters.push(`completed = $${values.length}`);
  }

  if (search) {
    values.push(`%${search}%`);
    filters.push(`(title ILIKE $${values.length} OR description ILIKE $${values.length})`);
  }

  const offset = (page - 1) * limit;
  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  values.push(limit, offset);

  const result = await database.query(`
    SELECT ${columns}, COUNT(*) OVER()::integer AS "totalCount"
    FROM tasks
    ${where}
    ORDER BY completed ASC, created_at DESC
    LIMIT $${values.length - 1} OFFSET $${values.length}
  `, values);

  const items = result.rows.map(normalize);

  return {
    items,
    total: items[0]?.totalCount || 0,
    page,
    limit
  };
}

async function findById(id) {
  const result = await database.query(`SELECT ${columns} FROM tasks WHERE id = $1`, [id]);
  return result.rows[0] ? normalize(result.rows[0]) : null;
}

async function create({ title, description = '', priority = 'medium', dueDate = null }) {
  const result = await database.query(`
    INSERT INTO tasks (title, description, priority, due_date)
    VALUES ($1, $2, $3, $4)
    RETURNING ${columns}
  `, [title.trim(), description.trim(), priority, dueDate || null]);

  return normalize(result.rows[0]);
}

async function update(id, { title, description, completed, priority, dueDate }) {
  const fields = [];
  const values = [];

  const addField = (field, value) => {
    values.push(value);
    fields.push(`${field} = $${values.length}`);
  };

  if (title !== undefined) addField('title', title.trim());
  if (description !== undefined) addField('description', description.trim());
  if (completed !== undefined) addField('completed', completed);
  if (priority !== undefined) addField('priority', priority);
  if (dueDate !== undefined) addField('due_date', dueDate || null);

  if (!fields.length) {
    return findById(id);
  }

  values.push(id);

  const result = await database.query(`
    UPDATE tasks
    SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $${values.length}
    RETURNING ${columns}
  `, values);

  return result.rows[0] ? normalize(result.rows[0]) : null;
}

async function remove(id) {
  const result = await database.query('DELETE FROM tasks WHERE id = $1', [id]);
  return result.rowCount > 0;
}

function normalize(task) {
  const safeTask = { ...task };
  delete safeTask.totalCount;
  return safeTask;
}

module.exports = { findAll, findById, create, update, remove };
