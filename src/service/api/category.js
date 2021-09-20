'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const isCategoryExist = require(`../middle-wares/category-exists`);
const categoryValidator = require(`../middle-wares/category-validator`);
const categoryCount = require(`../middle-wares/category-count`);


module.exports = (app, service) => {
  const route = new Router();
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    try {
      const {count} = req.query;
      const categories = await service.findAll(count);
      return res.status(HttpCode.OK)
        .json(categories);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }
  });

  route.post(`/add`, [categoryValidator, isCategoryExist(service)], async (req, res) => {
    try {
      const {name} = req.body;
      const category = await service.create(name);

      const io = req.app.locals.socketio;
      io.emit(`category:create`, category);

      return res.status(HttpCode.OK)
        .json(category);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }
  });

  route.put(`/:id/update`, [categoryValidator, isCategoryExist(service)], async (req, res) => {
    try {
      const {id} = req.params;
      const {name} = req.body;

      const category = await service.update(id, name);
      return res.status(HttpCode.OK)
        .json(category);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }
  });

  route.delete(`/:id/delete`, categoryCount(service), async (req, res) => {
    try {
      const {id} = req.params;

      const category = await service.drop(id);
      return res.status(HttpCode.OK)
        .json(category);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }
  });
};
