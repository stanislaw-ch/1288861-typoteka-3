"use strict";

const {Model} = require(`sequelize`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const definePost = require(`./post`);
const Aliases = require(`./aliases`);

class PostCategory extends Model {}

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Post = definePost(sequelize);

  Post.hasMany(Comment, {as: Aliases.COMMENTS, foreignKey: `postId`});
  Comment.belongsTo(Post, {foreignKey: `postId`});

  PostCategory.init({}, {sequelize});

  Post.belongsToMany(Category, {through: PostCategory, as: Aliases.CATEGORIES});
  Category.belongsToMany(Post, {through: PostCategory, as: Aliases.POSTS});
  Category.hasMany(PostCategory, {as: Aliases.POST_CATEGORIES});

  return {Category, Comment, Post, PostCategory};
};

module.exports = define;
