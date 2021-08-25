'use strict';

const Aliases = require(`../models/aliases`);

class PostService {
  constructor(sequelize) {
    this._Post = sequelize.models.Post;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;
  }

  async create(postData) {
    const post = await this._Post.create(postData);
    await post.addCategories(postData.categories);
    return post.get();
  }

  async drop(id) {
    const deletedRows = await this._Post.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findAll(needComments) {
    const include = [
      Aliases.CATEGORIES,
      {
        model: this._User,
        as: Aliases.USERS,
        attributes: {
          exclude: [`passwordHash`]
        }
      }
    ];
    if (needComments) {
      include.push({
        model: this._Comment,
        as: Aliases.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliases.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });
    }
    const posts = await this._Post.findAll({include});
    return posts.map((item) => item.get());
  }

  findOne(id, needComments) {
    const include = [
      Aliases.CATEGORIES,
      {
        model: this._User,
        as: Aliases.USERS,
        attributes: {
          exclude: [`passwordHash`]
        }
      }
    ];
    if (needComments) {
      include.push({
        model: this._Comment,
        as: Aliases.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliases.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });
    }
    return this._Post.findByPk(id, {include});
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Post.findAndCountAll({
      limit,
      offset,
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
      distinct: true
    });
    return {count, posts: rows};
  }

  async update(id, post) {
    const [affectedRows] = await this._Post.update(post, {
      where: {id}
    });
    return !!affectedRows;
  }

}

module.exports = PostService;
