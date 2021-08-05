'use strict';

const {Op} = require(`sequelize`);
const Aliases = require(`../models/aliases`);

class SearchService {
  constructor(sequelize) {
    this._Post = sequelize.models.Post;
  }

  async findAll(searchText) {
    const posts = await this._Post.findAll({
      where: {
        title: {
          [Op.substring]: searchText
        }
      },
      include: [Aliases.CATEGORIES],
    });
    return posts.map((post) => post.get());
  }


}

module.exports = SearchService;
