'use strict';

const CategoryService = require(`./category`);
const SearchService = require(`./search`);
const PostService = require(`./post`);
const CommentService = require(`./comment`);
const UserService = require(`./user`);

module.exports = {
  CategoryService,
  CommentService,
  SearchService,
  PostService,
  UserService,
};
