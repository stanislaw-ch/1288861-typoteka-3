'use strict';

module.exports = {
  DEFAULT_COMMAND: `--help`,
  USER_ARGV_INDEX: 2,
  ExitCode: {
    error: 1,
    success: 0,
  },
  HttpCode: {
    OK: 200,
    CREATED: 201,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    FORBIDDEN: 403,
    UNAUTHORIZED: 401,
    BAD_REQUEST: 400,
  },
  MAX_ID_LENGTH: 6,
  MAX_COMMENTS: 4,
  API_PREFIX: `/api`,
  Env: {
    DEVELOPMENT: `development`,
    PRODUCTION: `production`
  },
  HttpMethod: {
    GET: `GET`,
    POST: `POST`,
    PUT: `PUT`,
    DELETE: `DELETE`
  },
  FILE_DATA_PATH: {
    SENTENCES: `./data/sentences.txt`,
    TITLES: `./data/titles.txt`,
    CATEGORIES: `./data/categories.txt`,
    COMMENTS: `./data/comments.txt`
  },
  VALIDATOR: {
    CATEGORY: {
      MIN: 5,
      MAX: 30,
    },
    COMMENT: {
      MIN: 20,
    },
    USER: {
      MIN: 6,
    },
    POST: {
      MIN: 30,
      MAX: 250,
      MAX_FULL_TEXT: 1000,
    },
    ROUTE: {
      MIN: 1,
    },
  },
};
