'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);


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
};
