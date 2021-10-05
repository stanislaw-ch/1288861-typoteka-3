'use strict';

const Joi = require(`joi`).extend(require(`@joi/date`));
const {HttpCode, VALIDATOR} = require(`../../constants`);

const schema = Joi.object({
  createdDate: Joi.date().required(),
  title: Joi.string().min(VALIDATOR.POST.MIN).max(VALIDATOR.POST.MAX).required().messages({
    'string.empty': `"Заголовок" - не может быть пустым`,
    'string.min': `"Заголовок" - должен содержать минимум 30 символов`,
    'string.max': `"Заголовок" - должен содержать максимум 250 символов`,
    'any.required': `"Заголовок" - обязателен для заполнения`
  }),
  picture: Joi.string().allow(null, ``).pattern(/^.*\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)
        .messages({
          'string.pattern.base': `Изображение должно быть в формате png или jpg`,
        }),
  categories: Joi.array().items(
      Joi.number().integer().positive()
  ).min(1).required().messages({
    'number.base': `"Категории" - выберите не менее одной категории`,
  }),
  announce: Joi.string().min(VALIDATOR.POST.MIN).max(VALIDATOR.POST.MAX).required().messages({
    'string.empty': `"Анонс публикации" - не может быть пустым`,
    'string.min': `"Анонс публикации" - должен содержать минимум 30 символов`,
    'string.max': `"Анонс публикации" - должен содержать максимум 250 символов`,
    'any.required': `"Анонс публикации" - обязателен для заполнения`
  }),
  fullText: Joi.string().min(VALIDATOR.POST.MIN).max(VALIDATOR.POST.MAX_FULL_TEXT).allow(null, ``).messages({
    'string.max': `"Полный текст публикации" - должен содержать максимум 1000 символов`,
  }),
  userId: Joi.number().integer().positive().required(),
});

module.exports = (req, res, next) => {
  const newPost = req.body;
  const {error} = schema.validate(newPost, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
