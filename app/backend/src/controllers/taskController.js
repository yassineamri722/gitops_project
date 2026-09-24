const service = require('../services/taskService');

async function list(_req, res, next) {
  try {
    res.json(await service.listTasks(_req.query));
  } catch (error) {
    next(error);
  }
}

async function get(req, res, next) {
  try {
    res.json(await service.getTask(Number(req.params.id)));
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const task = await service.createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    res.json(await service.updateTask(Number(req.params.id), req.body));
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await service.deleteTask(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { list, get, create, update, remove };
