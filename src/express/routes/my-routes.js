'use strict';

const {Router} = require(`express`);
const auth = require(`../middle-wares/auth`);
const api = require(`../api`).getAPI();
const myRouter = new Router();
const {isAdmin} = require(`../../utils`);

myRouter.use(auth);

myRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  const admin = isAdmin(user);
  const posts = await api.getPosts({comments: false});

  if (admin) {
    res.render(`admin/my`, {user, admin, posts});
  } else {
    res.redirect(`/`);
  }
});

myRouter.get(`/comments`, async (req, res) => {
  const {user} = req.session;
  const admin = isAdmin(user);
  const posts = await api.getPosts({comments: true});

  if (admin) {
    res.render(`admin/comments`, {user, admin, posts});
  } else {
    res.redirect(`/`);
  }
});

module.exports = myRouter;
