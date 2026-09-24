const service = require('../services/taskService');

function list(_req, res) {
  res.json(service.listTasks());
}

function get(req, res) {
  res.json(service.getTask(Number(req.params.id)));
}

function create(req, res) {
  res.status(201).json(service.createTask(req.body));
}

function update(req, res) {
  res.json(service.updateTask(Number(req.params.id), req.body));
}

function remove(req, res) {
  service.deleteTask(Number(req.params.id));
  res.status(204).send();
}

module.exports = { list, get, create, update, remove };
