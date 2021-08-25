'use strict';

const {Router} = require(`express`);
const category = require(`../api/category`);
const post = require(`../api/post`);
const search = require(`../api/search`);
const user = require(`../api/user`);

const getSequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const {
  CategoryService,
  SearchService,
  PostService,
  CommentService,
  UserService,
} = require(`../data-service`);

const getRoutes = async () => {
  const router = new Router();
  defineModels(getSequelize());

  category(router, new CategoryService(getSequelize()));
  search(router, new SearchService(getSequelize()));
  post(router, new PostService(getSequelize()), new CommentService(getSequelize()));
  user(router, new UserService(getSequelize()));

  return router;
};

module.exports = getRoutes;
