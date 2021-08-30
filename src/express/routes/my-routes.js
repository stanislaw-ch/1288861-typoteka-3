'use strict';

const {Router} = require(`express`);
const auth = require(`../middle-wares/auth`);
const api = require(`../api`).getAPI();
const myRouter = new Router();

myRouter.use(auth);

myRouter.get(`/`, async (req, res) => {
  const {user} = req.session;

  if (user.isAdmin) {
    const posts = await api.getPosts({comments: false});
    res.render(`admin/my`, {user, posts});
  } else {
    res.redirect(`/`);
  }
});

myRouter.get(`/comments`, async (req, res) => {
  const {user} = req.session;

  if (user.isAdmin) {
    const posts = await api.getPosts({comments: true});
    res.render(`admin/comments`, {user, posts});
  } else {
    res.redirect(`/`);
  }
});

module.exports = myRouter;
