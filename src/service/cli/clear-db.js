'use strict';

const getSequelize = require(`../lib/sequelize`);
const {logger} = require(`../lib/logger`);
const initDatabase = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);


module.exports = {
  name: `--cleardb`,
  async run() {
    try {
      logger.info(`Trying to connect to database...`);
      await getSequelize().authenticate();
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

    const users = [
      {
        firstName: `Иван`,
        lastName: `Иванов`,
        email: `ivanov@example.com`,
        passwordHash: await passwordUtils.hash(`ivanov`),
        avatar: `avatar-1.png`,
        isAdmin: true,
      },
    ];

    const posts = [];
    const categories = [];

    return initDatabase(getSequelize(), {posts, categories, users});
  }
};
