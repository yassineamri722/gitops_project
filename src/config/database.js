const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'tasks',
  user: process.env.DB_USER || 'tasks_user',
  password: process.env.DB_PASSWORD || 'tasks_password',
  max: Number(process.env.DB_POOL_MAX || 10),
  idleTimeoutMillis: 30_000
});

async function initializeDatabase() {
  const schema = fs.readFileSync(path.join(__dirname, '../../db/schema.sql'), 'utf8');
  await pool.query(schema);
}

async function checkDatabase() {
  const result = await pool.query('SELECT 1 AS ok');
  if (!result.rows[0]?.ok) {
    throw new Error('Database check failed');
  }
}

async function closeDatabase() {
  await pool.end();
}

module.exports = { database: pool, initializeDatabase, checkDatabase, closeDatabase };
