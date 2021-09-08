'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const schema = Joi.object({
  name: Joi.string().min(5).max(30).required().messages({
    'string.empty': `Название категории обязательно для заполнения!`,
    'string.min': `Название категории должено содержать минимум 5 символов!`,
    'string.max': `Название категории должено содержать максимум 30 символов!`,
    'any.required': `Название категории обязательно для заполнения!`
  }),
});

module.exports = (req, res, next) => {
  const category = req.body;

  const {error} = schema.validate(category);

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
