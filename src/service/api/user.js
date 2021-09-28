'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const userValidator = require(`../middle-wares/user-validator`);
const passwordUtils = require(`../lib/password`);

const route = new Router();

const ErrorAuthMessage = {
  EMAIL: `Электронный адрес не существует`,
  PASSWORD: `Неверный пароль`
};

module.exports = (app, service) => {
  app.use(`/user`, route);

  route.post(`/`, userValidator(service), async (req, res) => {
    try {
      const data = req.body;
      console.log(`🚀 ~ file: user.js ~ line 21 ~ route.post ~ data`, data);

      data.passwordHash = await passwordUtils.hash(data.password);

      const result = await service.create(data);

      delete result.passwordHash;

      return res.status(HttpCode.CREATED)
        .json(result);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }
  });

  route.post(`/auth`, async (req, res) => {
    try {
      const {email, password} = req.body;
      const user = await service.findByEmail(email);
      if (!user) {
        res.status(HttpCode.UNAUTHORIZED).send(ErrorAuthMessage.EMAIL);
        return;
      }
      const passwordIsCorrect = await passwordUtils.compare(password, user.passwordHash);
      if (passwordIsCorrect) {
        delete user.passwordHash;
        res.status(HttpCode.OK).json(user);
      } else {
        res.status(HttpCode.UNAUTHORIZED).send(ErrorAuthMessage.PASSWORD);
      }
    } catch (e) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }
  });
};
