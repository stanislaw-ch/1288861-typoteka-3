'use strict';

class CommentService {
  constructor(sequelize) {
    // this._Post = sequelize.models.Post;
    this._Comment = sequelize.models.Comment;
  }

  create(postId, comment) {
    return this._Comment.create({
      postId,
      ...comment
    });
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  findAll(postId) {
    return this._Comment.findAll({
      where: {postId},
      raw: true
    });
  }
}

module.exports = CommentService;
