'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const schema = Joi.object({
  text: Joi.string().min(20).required().messages({
    'string.empty': `Комментарий не может быть пустым, напишите что-нибудь!`,
    'string.min': `Комментарий должен содержать минимум 20 символов`,
    'any.required': `Комментарий не может быть пустым, напишите что-нибудь!`
  }),
  userId: Joi.number().integer().positive().required()
});

module.exports = (req, res, next) => {
  const comment = req.body;

  const {error} = schema.validate(comment);

  console.log(error);
  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
