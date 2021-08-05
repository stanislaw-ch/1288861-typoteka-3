'use strict';

const {Router} = require(`express`);
const myRouter = new Router();
const api = require(`../api`).getAPI();

myRouter.get(`/`, async (req, res) => {
  const posts = await api.getPosts({comments: false});
  res.render(`my`, {posts});
});

myRouter.get(`/comments`, async (req, res) => {
  const posts = await api.getPosts({comments: true});
  res.render(`comments`, {posts: posts.slice(0, 3)});
});

module.exports = myRouter;
