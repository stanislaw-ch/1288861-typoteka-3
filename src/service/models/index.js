"use strict";

const {Model} = require(`sequelize`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const definePost = require(`./post`);
const defineUser = require(`./user`);
const Aliases = require(`./aliases`);

class PostCategory extends Model {}

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Post = definePost(sequelize);
  const User = defineUser(sequelize);

  Post.hasMany(Comment, {as: Aliases.COMMENTS, foreignKey: `postId`});
  Comment.belongsTo(Post, {foreignKey: `postId`});

  PostCategory.init({}, {sequelize});

  Post.belongsToMany(Category, {through: PostCategory, as: Aliases.CATEGORIES});
  Category.belongsToMany(Post, {through: PostCategory, as: Aliases.POSTS});
  Category.hasMany(PostCategory, {as: Aliases.POST_CATEGORIES});

  User.hasMany(Post, {as: Aliases.POSTS, foreignKey: `userId`});
  Post.belongsTo(User, {as: Aliases.USERS, foreignKey: `userId`});

  User.hasMany(Comment, {as: Aliases.COMMENTS, foreignKey: `userId`});
  Comment.belongsTo(User, {as: Aliases.USERS, foreignKey: `userId`});

  return {Category, Comment, Post, PostCategory, User};
};

module.exports = define;
