const service = require('../services/taskService');

const list = async (req, res, next) => {
  try {
    res.json(await service.listTasks(req.query));
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    res.json(await service.getTask(req.params.id));
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const task = await service.createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const task = await service.updateTask(req.params.id, req.body);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await service.deleteTask(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { list, get, create, update, remove };
