'use strict';

const Joi = require(`joi`);
const {HttpCode, VALIDATOR} = require(`../../constants`);

const schema = Joi.object({
  postId: Joi.number().integer().min(VALIDATOR.ROUTE.MIN),
  commentId: Joi.number().integer().min(VALIDATOR.ROUTE.MIN)
});

module.exports = (req, res, next) => {
  const params = req.params;

  const {error} = schema.validate(params);

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }
  return next();
};
