CREATE TABLE IF NOT EXISTS tasks (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(120) NOT NULL CHECK (length(trim(title)) > 0),
  description VARCHAR(500) NOT NULL DEFAULT '',
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  priority VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks (completed);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks (created_at DESC);
