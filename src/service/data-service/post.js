'use strict';

const Aliases = require(`../models/aliases`);

class PostService {
  constructor(sequelize) {
    this._Post = sequelize.models.Post;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;
    this._PostCategory = sequelize.models.PostCategory;
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
    await this._Comment.destroy({
      where: {postId: id}
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
        ],
      });
    }
    const posts = await this._Post.findAll({
      include,
      order: [
        [`createdDate`, `DESC`]
      ]});
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
        Aliases.COMMENTS,
        {
          model: this._User,
          as: Aliases.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
      distinct: true,
      order: [
        [`createdDate`, `DESC`]
      ]
    });
    return {count, posts: rows};
  }

  async update(id, post) {
    await this._Post.update(post, {where: {id}});
    const categoriesIds = post.categories.map((categoryId) => +categoryId);
    const updatedPost = await this.findOne(id);
    await updatedPost.setCategories(categoriesIds);
    return updatedPost.get();
  }

  async findPopular() {
    const articles = await this._Post.findAll({
      attributes: [`announce`, `id`],
      include: Aliases.COMMENTS
    });

    const popular = articles.map((item) => item.get())
      .filter((el) => {
        return el.comments.length > 0;
      });

    const sorted = popular
      .sort((a, b) => {
        return b.comments.length - a.comments.length;
      }).slice(0, 4);

    return sorted;
  }

}

module.exports = PostService;
