'use strict';

const {Router} = require(`express`);

const mainRouter = new Router();
const api = require(`../api`).getAPI();
const upload = require(`../middle-wares/upload`);
const isAdmin = require(`../middle-wares/admin`);
const csrf = require(`csurf`);
const csrfProtection = csrf();

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
    api.getPopularPosts(true),
    api.getRecentComments()
  ]);

  const totalPages = Math.ceil(count / POSTS_PER_PAGE);
  res.render(`main`, {posts, categories, page, totalPages, postInTrends, commentsInTrends, user});
});

mainRouter.get(`/register`, csrfProtection, (req, res) => {
  const {user} = req.session;
  res.render(`user/sign-up`, {user, csrfToken: req.csrfToken()});
});

mainRouter.post(`/register`, upload.single(`avatar`), csrfProtection, async (req, res) => {
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
    res.render(`user/sign-up`, {errorMessages, user, csrfToken: req.csrfToken()});
  }
});

mainRouter.get(`/login`, csrfProtection, (req, res) => {
  const {user} = req.session;
  res.render(`user/login`, {user, csrfToken: req.csrfToken()});
});

mainRouter.post(`/login`, csrfProtection, async (req, res) => {
  try {
    const user = await api.auth(req.body.email, req.body.password);
    req.session.user = user;
    res.redirect(`/?_cache=timestamp`);
  } catch (errors) {
    const errorMessages = errors.response.data.split(`\n`);
    const {user} = req.session;
    res.render(`user/login`, {user, errorMessages, csrfToken: req.csrfToken()});
  }
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.destroy();
  res.redirect(`/?_cache=timestamp`);
});

mainRouter.get(`/search`, csrfProtection, async (req, res) => {
  const {user} = req.session;

  try {
    const {search} = req.query;
    const results = await api.search(search);

    if (search === undefined) {
      res.render(`user/search`, {
        user,
        csrfToken: req.csrfToken()
      });
      return;
    }

    res.render(`user/search`, {
      results,
      user,
      csrfToken: req.csrfToken()
    });
  } catch (error) {
    res.render(`user/search`, {
      results: [],
      user,
      csrfToken: req.csrfToken()
    });
  }
});

mainRouter.get(`/categories`, isAdmin, csrfProtection, async (req, res) => {
  const {user} = req.session;

  const categories = await api.getCategories();
  res.render(`admin/all-categories`, {categories, user, csrfToken: req.csrfToken()});
});

mainRouter.post(`/categories/add`, isAdmin, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {category} = req.body;

  try {
    await api.createCategory({name: category});

    res.redirect(`/categories`);
  } catch (errors) {
    const errorMessages = errors.response.data.split(`\n`);
    const categories = await api.getCategories();
    res.render(`admin/all-categories`, {categories, user, errorMessages, csrfToken: req.csrfToken()});
  }
});

mainRouter.post(`/categories/:id/update`, isAdmin, csrfProtection, async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;
  const {category} = req.body;

  try {
    await api.updateCategory(id, {name: category});
    res.redirect(`/categories`);
  } catch (errors) {
    const errorMessages = errors.response.data.split(`\n`);
    const categories = await api.getCategories();
    res.render(`admin/all-categories`, {categories, user, errorMessages, csrfToken: req.csrfToken()});
  }
});

mainRouter.get(`/categories/:id/delete`, isAdmin, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  try {
    await api.deleteCategory(id);
    res.redirect(`/categories`);
  } catch (errors) {
    const errorMessages = errors.response.data.split(`\n`);
    const categories = await api.getCategories();
    res.render(`admin/all-categories`, {categories, user, errorMessages, csrfToken: req.csrfToken()});
  }
});

module.exports = mainRouter;
