'use strict';

const axios = require(`axios`);

const {HttpMethod} = require(`../constants`);
const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getPosts({offset, limit, comments}) {
    return this._load(`/articles`, {params: {offset, limit, comments}});
  }

  getPost(id, comments) {
    return this._load(`/articles/${id}`, {params: {comments}});
  }

  getPopularPosts() {
    return this._load(`/articles/popular`);
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories(count) {
    return this._load(`/categories`, {params: {count}});
  }

  getComments() {
    return this._load(`/articles/my/comments`);
  }

  createPost(data) {
    return this._load(`/articles`, {
      method: HttpMethod.POST,
      data
    });
  }

  async editPost(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  getRecentComments() {
    return this._load(`/articles/comments`);
  }

  createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  auth(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }

  deletePost(id) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.DELETE,
    });
  }

  async createCategory(data) {
    return this._load(`/categories/add`, {
      method: HttpMethod.POST,
      data,
    });
  }

  async updateCategory(id, data) {
    return this._load(`/categories/${id}/update`, {
      method: HttpMethod.PUT,
      data,
    });
  }

  async deleteCategory(id) {
    return this._load(`/categories/${id}/delete`, {
      method: HttpMethod.DELETE,
    });
  }

  deleteComment(id, commentId) {
    return this._load(`/articles/${id}/comments/${commentId}`, {
      method: HttpMethod.DELETE,
    });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
