const express = require('express');
const cors = require('cors');
const taskRoutes = require('./src/routes/taskRoutes');
const { initializeDatabase, closeDatabase, checkDatabase } = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));
app.use(express.json({ limit: '100kb' }));
app.use(express.static('public'));

app.get('/health', async (_req, res, next) => {
  try {
    await checkDatabase();
    res.json({ status: 'ok', service: 'task-api', database: 'ok' });
  } catch (error) {
    next(error);
  }
});

app.use('/api/tasks', taskRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({
    error: error.status ? error.message : 'Internal server error'
  });
});

async function start() {
  await initializeDatabase();

  const server = app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await closeDatabase();
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

start().catch((error) => {
  console.error('Unable to start API:', error);
  process.exit(1);
});
