'use strict';

class SearchService {
  constructor(posts) {
    this._posts = posts;
  }

  findAll(searchText) {
    return this._posts.
      filter((post) => post.title.includes(searchText));
  }

}

module.exports = SearchService;
