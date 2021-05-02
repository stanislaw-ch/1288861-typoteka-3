'use strict';

const {Router} = require(`express`);
const myRouter = new Router();
const api = require(`../api`).getAPI();

myRouter.get(`/`, async (req, res) => {
  const posts = await api.getPosts();
  res.render(`my`, {posts});
});

myRouter.get(`/comments`, async (req, res) => {
  const posts = await api.getPosts();
  res.render(`comments`, {posts});
});

module.exports = myRouter;
