'use strict';

const CategoryService = require(`./category`);
const SearchService = require(`./search`);
const PostService = require(`./post`);
const CommentService = require(`./comment`);

module.exports = {
  CategoryService,
  CommentService,
  SearchService,
  PostService,
};
