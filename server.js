const express = require('express');
const path = require('path');
const taskRoutes = require('./src/routes/taskRoutes');
const { initializeDatabase } = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 3000;

initializeDatabase();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'task-api' });
});

app.use('/api/tasks', taskRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Application running at http://localhost:${PORT}`);
});
