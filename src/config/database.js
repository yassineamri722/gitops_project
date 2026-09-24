const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dataDirectory = path.join(__dirname, '../../data');
const database = new Database(path.join(dataDirectory, 'tasks.db'));

database.pragma('journal_mode = WAL');

function initializeDatabase() {
  fs.mkdirSync(dataDirectory, { recursive: true });
  const schema = fs.readFileSync(path.join(__dirname, '../../db/schema.sql'), 'utf8');
  database.exec(schema);
}

module.exports = { database, initializeDatabase };
