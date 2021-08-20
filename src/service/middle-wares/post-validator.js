'use strict';

const Joi = require(`joi`).extend(require(`@joi/date`));
const {HttpCode} = require(`../../constants`);

const schema = Joi.object({
  title: Joi.string().min(30).max(250).required().messages({
    'string.empty': `"Заголовок" - не может быть пустым`,
    'string.min': `"Заголовок" - должен содержать минимум 30 символов`,
    'string.max': `"Заголовок" - должен содержать максимум 250 символов`,
    'any.required': `"Заголовок" - обязателен для заполнения`
  }),
  createdDate: Joi.date().format(`DD-MM-YYYY`).required(),
  // createdDate: Joi.date().iso().required(),
  categories: Joi.array().items(
      Joi.number().integer().positive()
  ).min(1).required(),
  announce: Joi.string().min(30).max(250).required(),
  picture: Joi.string(),
  fullText: Joi.string().min(30).max(1000),
});

module.exports = (req, res, next) => {
  const newPost = req.body;
  const {error} = schema.validate(newPost, {abortEarly: false});

  if (error) {
    console.log(error);
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
