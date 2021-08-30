'use strict';
const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {MAX_COMMENTS} = require(`../../constants`);
const {getRandomInt, getRandomDate, shuffle} = require(`../../utils`);

const getSequelize = require(`../lib/sequelize`);
const passwordUtils = require(`../lib/password`);
const initDatabase = require(`../lib/init-db`);

const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});

const DEFAULT_COUNT = 1;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const pictureNames = [`sea`, `forest`, `skyscraper`, ``];

const getPictureFileName = () => {
  const name = pictureNames[getRandomInt(0, pictureNames.length - 1)];
  if (name === ``) {
    return null;
  }
  return `${name}@1x.jpg`;
};

const generateComments = (count, comments, users) => (
  Array(count).fill({}).map(() => ({
    user: users[getRandomInt(0, users.length - 1)].email,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 4);
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(
            getRandomInt(0, items.length - 1), 1
        )
    );
  }
  return result;
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generatePosts = (count, titles, categories, sentences, comments, users) => (
  Array(count).fill({}).map(() => ({
    user: users[getRandomInt(0, users.length - 1)].email,
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: getRandomDate(),
    announce: shuffle(sentences).slice(1, 5).join(` `),
    fullText: shuffle(sentences).slice(1, sentences.length).join(` `),
    categories: getRandomSubarray(categories),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments, users),
    picture: getPictureFileName(),
  }))
);

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await getSequelize().authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);
    const users = [
      {
        firstName: `Иван`,
        lastName: `Иванов`,
        email: `ivanov@example.com`,
        passwordHash: await passwordUtils.hash(`ivanov`),
        avatar: `avatar-1.png`,
        isAdmin: true,
      },
      {
        firstName: `Пётр`,
        lastName: `Петров`,
        email: `petrov@example.com`,
        passwordHash: await passwordUtils.hash(`petrov`),
        avatar: `avatar-2.png`,
        isAdmin: false,
      }
    ];

    const [count] = args;
    const countPost = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const posts = generatePosts(countPost, titles, categories, sentences, comments, users);

    return initDatabase(getSequelize(), {posts, categories, users});
  }
};
