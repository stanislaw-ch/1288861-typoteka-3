'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);

const upload = require(`../middle-wares/upload`);
const auth = require(`../middle-wares/auth`);
const {ensureArray} = require(`../../utils`);

const api = require(`../api`).getAPI();
const articlesRouter = new Router();

const csrfProtection = csrf();

const POSTS_PER_PAGE = 8;

articlesRouter.get(`/category/:id`, async (req, res) => {
  const {user} = req.session;
  let {page = 1} = req.query;
  page = +page;
  const limit = POSTS_PER_PAGE;
  const offset = (page - 1) * POSTS_PER_PAGE;

  const {id} = req.params;
  const posts = await api.getPosts(true);
  const categories = await api.getCategories(true);
  const category = categories.find((item) => {
    return item.id === +id;
  });
  const postsInCategory = posts.filter((post) => {
    return post.categories.some((item) => {
      return item.id === +id;
    });
  });

  const totalPages = Math.ceil(postsInCategory.length / POSTS_PER_PAGE);
  const postsByPage = postsInCategory.slice(offset, offset + limit);
  res.render(`user/articles-by-category`, {postsByPage, id, category, totalPages, page, categories, user});
});

articlesRouter.get(`/add`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;

  if (user.isAdmin) {
    const categories = await api.getCategories();
    res.render(`admin/new-post`, {categories, user, csrfToken: req.csrfToken()});
  } else {
    res.redirect(`/`);
  }
});

articlesRouter.post(`/add`, auth, upload.single(`upload`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const postData = {
    createdDate: body.date,
    title: body.title,
    picture: file ? file.filename : ``,
    categories: ensureArray(body.category),
    announce: body.announcement,
    fullText: body[`full-text`],
    userId: user.id
  };
  try {
    await api.createPost(postData);
    res.redirect(`/my`);
  } catch (errors) {
    const errorMessages = errors.response.data.split(`\n`);
    const categories = await api.getCategories();
    res.render(`admin/new-post`, {categories, user, errorMessages, csrfToken: req.csrfToken()});
  }
});

articlesRouter.get(`/edit/:id`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  if (user.isAdmin) {
    const [post, categories] = await Promise.all([
      api.getPost(id),
      api.getCategories()
    ]);

    console.log(post.categories);
    res.render(`admin/new-post`, {id, post, categories, user, csrfToken: req.csrfToken()});
  } else {
    res.redirect(`/`);
  }
});

articlesRouter.post(`/edit/:id`, auth, upload.single(`upload`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const {id} = req.params;
  const postData = {
    createdDate: body.date,
    title: body.title,
    picture: file ? file.filename : body[`old-image`],
    categories: ensureArray(body.category),
    announce: body.announcement,
    fullText: body[`full-text`],
    userId: user.id
  };

  try {
    await api.editPost(id, postData);
    res.redirect(`/my`);
  } catch (errors) {
    const errorMessages = errors.response.data.split(`\n`);
    const [post, categories] = await Promise.all([
      api.getPost(id),
      api.getCategories()
    ]);
    res.render(`admin/new-post`, {id, post, categories, user, errorMessages, csrfToken: req.csrfToken()});
  }
});

articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const post = await api.getPost(id, true);
  const categories = await api.getCategories(true);
  res.render(`user/post`, {post, id, user, categories, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/:id/comments`, auth, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {message} = req.body;

  try {
    await api.createComment(id, {userId: user.id, text: message});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const errorMessages = errors.response.data.split(`\n`);
    const post = await api.getPost(id, true);
    const categories = await api.getCategories(true);
    res.render(`user/post`, {post, id, user, categories, errorMessages});
  }
});

module.exports = articlesRouter;
