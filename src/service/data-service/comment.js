'use strict';

const Aliases = require(`../models/aliases`);
class CommentService {
  constructor(sequelize) {
    this._Post = sequelize.models.Post;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
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

  async findRecent() {
    return await this._Comment.findAll({
      include: [
        {
          model: this._User,
          as: Aliases.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }, Aliases.POSTS],
      order: [
        [`createdAt`, `DESC`]
      ],
      limit: 4,
    });
  }

}

module.exports = CommentService;
