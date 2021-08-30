'use strict';

const {Router} = require(`express`);

const mainRouter = new Router();
const api = require(`../api`).getAPI();
const upload = require(`../middle-wares/upload`);

const POSTS_PER_PAGE = 8;

mainRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  let {page = 1} = req.query;
  page = +page;
  const limit = POSTS_PER_PAGE;
  const offset = (page - 1) * POSTS_PER_PAGE;

  const [
    {count, posts},
    categories,
    postInTrends,
    commentsInTrends,
  ] = await Promise.all([
    api.getPosts({limit, offset}),
    api.getCategories(true),
    api.getPopularArticles(true),
    api.getRecentComments()
  ]);

  const totalPages = Math.ceil(count / POSTS_PER_PAGE);

  res.render(`main`, {posts, categories, page, totalPages, postInTrends, commentsInTrends, user});
});

mainRouter.get(`/register`, (req, res) => {
  const {user} = req.session;
  res.render(`user/sign-up`, {user});
});

mainRouter.post(`/register`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const userData = {
    avatar: file ? file.filename : ``,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
    passwordRepeated: body[`repeat-password`],
    isAdmin: false,
  };
  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (errors) {
    const errorMessages = errors.response.data.split(`\n`);
    const {user} = req.session;
    res.render(`user/sign-up`, {errorMessages, user});
  }
});

mainRouter.get(`/login`, (req, res) => {
  const {user} = req.session;
  res.render(`user/login`, {user});
});

mainRouter.post(`/login`, async (req, res) => {
  try {
    const user = await api.auth(req.body.email, req.body.password);
    req.session.user = user;
    res.redirect(`/`);
  } catch (errors) {
    const errorMessages = errors.response.data.split(`\n`);
    const {user} = req.session;
    res.render(`user/login`, {user, errorMessages});
  }
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  res.redirect(`/`);
});

mainRouter.get(`/search`, async (req, res) => {
  const {user} = req.session;

  try {
    const {search} = req.query;
    const results = await api.search(search);

    if (search === undefined) {
      res.render(`user/search`, {
        user,
      });
      return;
    }

    res.render(`user/search`, {
      results,
      user,
    });
  } catch (error) {
    res.render(`user/search`, {
      results: [],
      user,
    });
  }
});

mainRouter.get(`/categories`, async (req, res) => {
  const {user} = req.session;

  if (user.isAdmin) {
    const categories = await api.getCategories();
    res.render(`admin/all-categories`, {categories, user});
  } else {
    res.redirect(`/`);
  }
});

module.exports = mainRouter;
