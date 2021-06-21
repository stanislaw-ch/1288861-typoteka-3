'use strict';

const {Router} = require(`express`);
const category = require(`../api/category`);
const post = require(`../api/post`);
const search = require(`../api/search`);

const getMockData = require(`../lib/get-mock-data`);

const {
  CategoryService,
  SearchService,
  PostService,
  CommentService,
} = require(`../data-service`);

const getRoutes = async () => {
  const router = new Router();
  const mockData = await getMockData();

  category(router, new CategoryService(mockData));
  search(router, new SearchService(mockData));
  post(router, new PostService(mockData), new CommentService());

  return router;
};

module.exports = getRoutes;
