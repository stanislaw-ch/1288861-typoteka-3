'use strict';

const {HttpCode} = require(`../../constants`);

const postKeys = [`title`, `createdDate`, `category`, `announce`];

module.exports = (req, res, next) => {
  const newPost = req.body;
  console.log(`🚀 ~ file: post-validator.js ~ line 9 ~ newPost`, newPost);
  const keys = Object.keys(newPost);
  const keysExists = postKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
  }

  return next();
};
