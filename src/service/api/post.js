'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const postValidator = require(`../middle-wares/post-validator`);
const postExist = require(`../middle-wares/post-exists`);
const commentValidator = require(`../middle-wares/comment-validator`);

module.exports = (app, postService, commentService) => {
  const route = new Router();
  app.use(`/articles`, route);

  route.get(`/my/comments`, async (req, res) => {
    try {
      const comments = await commentService.findAll(false);
      return res.status(HttpCode.OK).json(comments);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }


  });

  route.get(`/`, async (req, res) => {
    try {
      const {offset, limit} = req.query;
      let result;

      result = (limit || offset) ? await postService.findPage({limit, offset}) : await postService.findAll(true);

      return res.status(HttpCode.OK).json(result);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }
  });

  route.get(`/popular`, async (req, res) => {
    try {
      const result = await postService.findPopular();

      return res.status(HttpCode.OK).json(result);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }
  });

  route.get(`/comments`, async (req, res) => {
    try {
      const comments = await commentService.findRecent();
      return res.status(HttpCode.OK).json(comments);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }
  });

  route.get(`/:postId`, async (req, res) => {
    try {
      const {postId} = req.params;
      const post = await postService.findOne(postId, true);

      if (!post) {
        return res.status(HttpCode.NOT_FOUND)
          .send(`Not found with ${postId}`);
      }

      return res.status(HttpCode.OK)
        .json(post);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }
  });

  route.post(`/`, postValidator, async (req, res) => {
    try {
      const post = await postService.create(req.body);

      return res.status(HttpCode.CREATED)
      .json(post);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }
  });

  route.put(`/:postId`, postValidator, postExist(postService), async (req, res) => {
    try {
      const {postId} = req.params;

      const updated = await postService.update(postId, req.body);

      if (!updated) {
        return res.status(HttpCode.NOT_FOUND)
          .send(`Not found with ${postId}`);
      }

      const updatedPost = postService.update(postId, req.body);

      return res.status(HttpCode.OK)
        .send(updatedPost);

    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }
  });

  route.delete(`/:postId`, async (req, res) => {
    try {
      const {postId} = req.params;
      const post = await postService.drop(postId);

      if (!post) {
        return res.status(HttpCode.NOT_FOUND)
          .send(`Not found`);
      }

      return res.status(HttpCode.OK)
        .json(post);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }
  });

  route.get(`/:postId/comments`, postExist(postService), async (req, res) => {
    try {
      const {postId} = req.params;
      const comments = await commentService.findAll(postId);

      return res.status(HttpCode.OK)
        .json(comments);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }
  });

  route.delete(`/:postId/comments/:commentId`, postExist(postService), async (req, res) => {
    try {
      const {commentId} = req.params;
      const deleted = await commentService.drop(commentId);

      if (!deleted) {
        return res.status(HttpCode.NOT_FOUND)
          .send(`Not found`);
      }

      return res.status(HttpCode.OK)
        .json(deleted);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }
  });

  route.post(`/:postId/comments`, [postExist(postService), commentValidator], (req, res) => {
    try {
      const {post} = res.locals;
      const comment = commentService.create(post.id, req.body);

      return res.status(HttpCode.CREATED)
        .json(comment);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }
  });
};
