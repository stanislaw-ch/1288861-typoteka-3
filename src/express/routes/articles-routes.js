'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {ensureArray} = require(`../../utils`);

const UPLOAD_DIR = `../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const articlesRouter = new Router();
const api = require(`../api`).getAPI();

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

const POSTS_PER_PAGE = 8;

articlesRouter.get(`/category/:id`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;
  const limit = POSTS_PER_PAGE;
  const offset = (page - 1) * POSTS_PER_PAGE;

  const {id} = req.params;
  const posts = await api.getPosts({limit, offset});
  const categories = await api.getCategories(true);
  res.render(`articles-by-category`, {id, posts, categories});
});

articlesRouter.get(`/add`, async (req, res) => {
  const {error} = req.query;
  const categories = await api.getCategories();
  res.render(`post/new-post`, {categories, error});
});

articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const postData = {
    createdDate: body.date,
    title: body.title,
    picture: file ? file.filename : ``,
    categories: ensureArray(body.category),
    announce: body.announcement,
    fullText: body[`full-text`],
  };
  try {
    await api.createPost(postData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`/articles/add?error=${encodeURIComponent(error.response.data)}`);
  }
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const {error} = req.query;
  const [post, categories] = await Promise.all([
    api.getPost(id),
    api.getCategories()
  ]);
  res.render(`post/edit-post`, {id, post, categories, error});
});

articlesRouter.post(`/edit/:id`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const postData = {
    createdDate: body.date,
    title: body.title,
    picture: file ? file.filename : body[`old-image`],
    categories: ensureArray(body.category),
    announce: body.announcement,
    fullText: body[`full-text`],
  };

  try {
    await api.editPost(id, postData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`/articles/edit/${id}?error=${encodeURIComponent(error.response.data)}`);
  }
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const {error} = req.query;
  const post = await api.getPost(id, true);
  const categories = await api.getCategories(true);
  res.render(`post`, {post, id, error, categories});
});

articlesRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {message} = req.body;

  try {
    await api.createComment(id, {text: message});
    res.redirect(`/articles/${id}`);
  } catch (error) {
    res.redirect(`/articles/${id}?error=${encodeURIComponent(error.response.data)}`);
  }
});

module.exports = articlesRouter;
