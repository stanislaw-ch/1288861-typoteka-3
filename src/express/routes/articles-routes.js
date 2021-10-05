'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);

const upload = require(`../middle-wares/upload`);
const auth = require(`../middle-wares/auth`);
const isAdmin = require(`../middle-wares/admin`);
const {ensureArray, convertDate} = require(`../../utils`);
const {HttpCode} = require(`../../constants`);

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
  try {
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
  } catch (error) {
    res.status(HttpCode.BAD_REQUEST).render(`errors/404`);
  }
});

articlesRouter.get(`/add`, isAdmin, csrfProtection, async (req, res) => {
  const {user} = req.session;
  try {
    const categories = await api.getCategories();
    res.render(`admin/new-post`, {categories, user, csrfToken: req.csrfToken()});
  } catch (error) {
    res.status(HttpCode.BAD_REQUEST).render(`errors/404`);
  }
});

articlesRouter.post(`/add`, isAdmin, upload.single(`upload`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const date = body.date;
  const postData = {
    createdDate: convertDate(date),
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

articlesRouter.get(`/edit/:id`, isAdmin, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  try {
    const [post, categories] = await Promise.all([
      api.getPost(id),
      api.getCategories()
    ]);

    res.render(`admin/new-post`, {id, post, categories, user, csrfToken: req.csrfToken()});
  } catch (error) {
    res.status(HttpCode.BAD_REQUEST).render(`errors/404`);
  }
});

articlesRouter.post(`/edit/:id`, isAdmin, upload.single(`upload`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const {id} = req.params;
  const date = body.date;
  const postData = {
    createdDate: convertDate(date),
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
  const previousPage = req.headers.referer;
  try {
    const post = await api.getPost(id, true);
    const categories = await api.getCategories(true);
    const sortCommentsByDate = post.comments.sort((a, b) => new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? -1 : 1);
    res.render(`user/post`, {sortCommentsByDate, post, id, user, categories, previousPage, csrfToken: req.csrfToken()});
  } catch (error) {
    res.status(HttpCode.BAD_REQUEST).render(`errors/404`);
  }
});

articlesRouter.post(`/:id`, isAdmin, csrfProtection, async (req, res) => {
  const {id} = req.params;

  try {
    await api.deletePost(id);
    res.redirect(`/my`);
  } catch (error) {
    res.status(HttpCode.BAD_REQUEST).render(`errors/404`);
  }

});

const onChange = async (req) => {
  const io = req.app.get(`socketio`);
  const [posts, comments] = await Promise.all([
    api.getPopularPosts(),
    api.getRecentComments()
  ]);
  io.emit(`comment`, {posts, comments});
};

articlesRouter.post(`/:id/comments`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {message} = req.body;

  try {
    await api.createComment(id, {userId: user.id, text: message});
    res.redirect(`/articles/${id}`);
    onChange(req);
  } catch (errors) {
    const errorMessages = errors.response.data.split(`\n`);
    const post = await api.getPost(id, true);
    const categories = await api.getCategories(true);
    res.render(`user/post`, {post, id, user, categories, errorMessages, csrfToken: req.csrfToken()});
  }
});


articlesRouter.post(`/:id/comment/:commentId`, isAdmin, csrfProtection, async (req, res) => {
  const {id, commentId} = req.params;
  try {
    await api.deleteComment(id, commentId);
    onChange(req);
    res.redirect(`/my/comments`);
  } catch (error) {
    res.status(HttpCode.BAD_REQUEST).render(`errors/404`);
  }
});

module.exports = articlesRouter;
