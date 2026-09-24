const express = require('express');
const cors = require('cors');
const path = require('path');
const taskRoutes = require('./src/routes/taskRoutes');
const { initializeDatabase } = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 3000;

initializeDatabase();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));
app.use(express.json({ limit: '100kb' }));
app.use(express.static(path.join(__dirname, '../frontend/public')));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'taskflow-backend', database: 'ready' });
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

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
