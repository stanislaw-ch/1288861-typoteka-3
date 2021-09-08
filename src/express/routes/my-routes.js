'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);

const auth = require(`../middle-wares/auth`);
const api = require(`../api`).getAPI();
const myRouter = new Router();
const csrfProtection = csrf();

myRouter.use(auth);

myRouter.get(`/`, csrfProtection, async (req, res) => {
  const {user} = req.session;

  const posts = await api.getPosts({comments: false});
  res.render(`admin/my`, {user, posts, csrfToken: req.csrfToken()});
});

myRouter.get(`/comments`, csrfProtection, async (req, res) => {
  const {user} = req.session;

  const comments = await api.getComments();
  res.render(`admin/comments`, {user, comments, csrfToken: req.csrfToken()});
});

module.exports = myRouter;
