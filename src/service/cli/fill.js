'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {
  getRandomInt,
  shuffle,
  getRandomDate,
} = require(`../../utils`);
const {FILE_DATA_PATH} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 4;

const FILE_NAME = `fill-db.sql`;

const PublicationCount = {
  MIN: 1,
  MAX: 1000,
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

const generateComments = (count, postId, userCount, comments) => (
  Array(count).fill({}).map(() => ({
    userId: getRandomInt(1, userCount),
    postId,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

// const getPictureFileName = (number) => `item${number.toString().padStart(2, 0)}.jpg`;

const generatePosts = (count, titles, categoryCount, userCount, sentences, comments) => (
  Array(count).fill({}).map((_, index) => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: getRandomDate(),
    announce: shuffle(sentences).slice(1, 5).join(` `),
    fullText: shuffle(sentences).slice(1, sentences.length).join(` `),
    category: [getRandomInt(1, categoryCount)],
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), index + 1, userCount, comments),
    userId: getRandomInt(1, userCount)
  }))
);

module.exports = {
  name: `--fill`,
  async run(args) {
    const sentences = await readContent(FILE_DATA_PATH.SENTENCES);
    const titles = await readContent(FILE_DATA_PATH.TITLES);
    const categories = await readContent(FILE_DATA_PATH.CATEGORIES);
    const commentSentences = await readContent(FILE_DATA_PATH.COMMENTS);

    const [count] = args;
    const countPost = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countPost > PublicationCount.MAX) {
      console.log(chalk.red(`Не больше 1000 публикаций`));
      return;
    }

    const users = [
      {
        email: `ivanov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Иван`,
        lastName: `Иванов`,
        avatar: `avatar-1.png`
      },
      {
        email: `petrov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Пётр`,
        lastName: `Петров`,
        avatar: `avatar-2.png`
      }
    ];

    const posts = generatePosts(countPost, titles, categories.length, users.length, sentences, commentSentences);

    const comments = posts.flatMap((post) => post.comments);

    const postCategories = posts.map((post, index) => ({postId: index + 1, categoryId: post.category[0]}));

    const userValues = users.map(
        ({email, passwordHash, firstName, lastName, avatar}) =>
          `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
    ).join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const postValues = posts.map(
        ({title, createdDate, announce, fullText, userId}) =>
          `('${title}', '${createdDate}', '${announce}', '${fullText}', ${userId})`
    ).join(`,\n`);

    const postCategoryValues = postCategories.map(
        ({postId, categoryId}) =>
          `(${postId}, ${categoryId})`
    ).join(`,\n`);

    const commentValues = comments.map(
        ({text, userId, postId}) =>
          `('${text}', ${userId}, ${postId})`
    ).join(`,\n`);

    const content = `
INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
${userValues};
INSERT INTO categories(name) VALUES
${categoryValues};
ALTER TABLE posts DISABLE TRIGGER ALL;
INSERT INTO posts(title, created_at, announce, fullText, user_id) VALUES
${postValues};
ALTER TABLE posts ENABLE TRIGGER ALL;
ALTER TABLE post_categories DISABLE TRIGGER ALL;
INSERT INTO post_categories(post_id, category_id) VALUES
${postCategoryValues};
ALTER TABLE post_categories ENABLE TRIGGER ALL;
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO COMMENTS(text, user_id, post_id) VALUES
${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL;`;


    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
