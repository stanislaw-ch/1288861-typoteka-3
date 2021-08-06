'use strict';

const {Router} = require(`express`);

const mainRouter = new Router();
const api = require(`../api`).getAPI();

const POSTS_PER_PAGE = 8;

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = POSTS_PER_PAGE;

  const offset = (page - 1) * POSTS_PER_PAGE;
  const [
    {count, posts},
    categories
  ] = await Promise.all([
    api.getPosts({limit, offset}),
    api.getCategories(true)
  ]);

  const totalPages = Math.ceil(count / POSTS_PER_PAGE);

  res.render(`main`, {posts, categories, postInTrends: posts.slice(0, 4), page, totalPages});
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, async (req, res) => {
  try {
    const {search} = req.query;
    if (search === undefined) {
      res.render(`search`);
      return;
    }
    const results = await api.search(search);

    res.render(`search`, {
      results
    });
  } catch (error) {
    res.render(`search`, {
      results: []
    });
  }
});

mainRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = mainRouter;
