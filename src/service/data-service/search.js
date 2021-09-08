'use strict';

const {Op} = require(`sequelize`);
const Aliases = require(`../models/aliases`);

class SearchService {
  constructor(sequelize) {
    this._Post = sequelize.models.Post;
    this._User = sequelize.models.User;
  }

  async findAll(searchText) {
    const posts = await this._Post.findAll({
      where: {
        title: {
          [Op.substring]: searchText
        }
      },
      include: [
        Aliases.CATEGORIES,
        {
          model: this._User,
          as: Aliases.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
      order: [
        [`createdDate`, `DESC`]
      ]
    });
    return posts.map((post) => post.get());
  }
}

module.exports = SearchService;
