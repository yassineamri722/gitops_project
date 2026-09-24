const form = document.querySelector('#task-form');
const titleInput = document.querySelector('#title');
const descriptionInput = document.querySelector('#description');
const taskList = document.querySelector('#task-list');
const taskCount = document.querySelector('#task-count');
const message = document.querySelector('#message');

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(body.error || 'Request failed');
  }
  return response.status === 204 ? null : response.json();
}

async function loadTasks() {
  const result = await request('/api/tasks');
  const tasks = Array.isArray(result) ? result : result.items;
  const total = Array.isArray(result) ? tasks.length : result.total;

  taskList.innerHTML = tasks.length
    ? tasks.map(renderTask).join('')
    : '<li class="empty">No tasks yet. Add your first one.</li>';
  taskCount.textContent = `${total} task${total === 1 ? '' : 's'}`;
}

function renderTask(task) {
  return `<li class="task ${task.completed ? 'done' : ''}">
    <label><input type="checkbox" data-action="toggle" data-id="${task.id}" ${task.completed ? 'checked' : ''}><span>${escapeHtml(task.title)}</span></label>
    <p>${escapeHtml(task.description || 'No description')}</p>
    <button class="delete" data-action="delete" data-id="${task.id}">Delete</button>
  </li>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[character]));
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  try {
    await request('/api/tasks', { method: 'POST', body: JSON.stringify({ title: titleInput.value, description: descriptionInput.value }) });
    form.reset();
    showMessage('Task added.');
    await loadTasks();
  } catch (error) { showMessage(error.message, true); }
});

taskList.addEventListener('click', async event => {
  const target = event.target.closest('[data-action="delete"]');
  if (!target) return;
  try { await request(`/api/tasks/${target.dataset.id}`, { method: 'DELETE' }); await loadTasks(); }
  catch (error) { showMessage(error.message, true); }
});

taskList.addEventListener('change', async event => {
  if (event.target.dataset.action !== 'toggle') return;
  try { await request(`/api/tasks/${event.target.dataset.id}`, { method: 'PATCH', body: JSON.stringify({ completed: event.target.checked }) }); await loadTasks(); }
  catch (error) { showMessage(error.message, true); }
});

function showMessage(text, isError = false) {
  message.textContent = text;
  message.className = `message ${isError ? 'error' : ''}`;
}

loadTasks().catch(error => showMessage(error.message, true));
