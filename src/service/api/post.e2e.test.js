"use strict";

const express = require(`express`);
const request = require(`supertest`);

const post = require(`./post`);
const DataService = require(`../data-service/post`);
const CommentService = require(`../data-service/comment`);

const {HttpCode} = require(`../../constants`);

const mockData = [
  /* eslint-disable */
  {
    "id": "i0jWHm",
    "title": "Ёлки. История деревьев.",
    "createdDate": "21.03.2021, 13:31:05",
    "announce": "Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Он написал больше 30 хитов. Из под его пера вышло 8 платиновых альбомов.",
    "fullText": "Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Первая большая ёлка была установлена только в 1938 году. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Программировать не настолько сложно, как об этом говорят. Он написал больше 30 хитов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Ёлки — это не просто красивое дерево. Это прочная древесина. Собрать камни бесконечности легко, если вы прирожденный герой. Золотое сечение — соотношение двух величин, гармоническая пропорция. Достичь успеха помогут ежедневные повторения. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Из под его пера вышло 8 платиновых альбомов. Это один из лучших рок-музыкантов. Как начать действовать? Для начала просто соберитесь. Простые ежедневные упражнения помогут достичь успеха.",
    "category": [
      "Музыка"
    ],
    "comments": [
      {
        "id": "TsfHpq",
        "text": "Мне кажется или я уже читал это где-то?"
      },
      {
        "id": "3_krHZ",
        "text": "Плюсую, но слишком много буквы!"
      },
      {
        "id": "SqwtFz",
        "text": "Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты? Совсем немного..."
      }
    ]
  },
  {
    "id": "D8qF6p",
    "title": "Ёлки. История деревьев.",
    "createdDate": "01.03.2021, 06:41:39",
    "announce": "Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Как начать действовать? Для начала просто соберитесь. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.",
    "fullText": "Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Первая большая ёлка была установлена только в 1938 году. Простые ежедневные упражнения помогут достичь успеха. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Достичь успеха помогут ежедневные повторения. Собрать камни бесконечности легко, если вы прирожденный герой. Это один из лучших рок-музыкантов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Как начать действовать? Для начала просто соберитесь. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Он написал больше 30 хитов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Ёлки — это не просто красивое дерево. Это прочная древесина. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Программировать не настолько сложно, как об этом говорят.",
    "category": [
      "Железо",
      "Без рамки",
      "Музыка",
      "За жизнь",
      "IT"
    ],
    "comments": [
      {
        "id": "OfhOXl",
        "text": "Это где ж такие красоты? Совсем немного... Согласен с автором!"
      },
      {
        "id": "tJUqwQ",
        "text": "Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы!"
      }
    ]
  },
  {
    "id": "ycM9Hn",
    "title": "Лучшие рок-музыканты 20-века.",
    "createdDate": "05.03.2021, 20:59:21",
    "announce": "Как начать действовать? Для начала просто соберитесь. Ёлки — это не просто красивое дерево. Это прочная древесина. Собрать камни бесконечности легко, если вы прирожденный герой. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?",
    "fullText": "Ёлки — это не просто красивое дерево. Это прочная древесина. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Первая большая ёлка была установлена только в 1938 году. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Это один из лучших рок-музыкантов. Программировать не настолько сложно, как об этом говорят. Из под его пера вышло 8 платиновых альбомов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Простые ежедневные упражнения помогут достичь успеха. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Достичь успеха помогут ежедневные повторения. Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой. Он написал больше 30 хитов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Как начать действовать? Для начала просто соберитесь.",
    "category": [
      "За жизнь"
    ],
    "comments": [
      {
        "id": "5vTKR7",
        "text": "Хочу такую же футболку :-) Совсем немного... Планируете записать видосик на эту тему?"
      },
      {
        "id": "HEQWDd",
        "text": "Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Хочу такую же футболку :-)"
      },
      {
        "id": "SkCCfG",
        "text": "Совсем немного... Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете."
      },
      {
        "id": "hFggFy",
        "text": "Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного... Согласен с автором!"
      }
    ]
  },
  {
    "id": "Abt5oK",
    "title": "Самый лучший музыкальный альбом этого года.",
    "createdDate": "18.02.2021, 13:44:47",
    "announce": "Программировать не настолько сложно, как об этом говорят. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Золотое сечение — соотношение двух величин, гармоническая пропорция. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.",
    "fullText": "Он написал больше 30 хитов. Собрать камни бесконечности легко, если вы прирожденный герой. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Программировать не настолько сложно, как об этом говорят. Первая большая ёлка была установлена только в 1938 году. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Ёлки — это не просто красивое дерево. Это прочная древесина. Простые ежедневные упражнения помогут достичь успеха. Из под его пера вышло 8 платиновых альбомов. Как начать действовать? Для начала просто соберитесь. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Это один из лучших рок-музыкантов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Достичь успеха помогут ежедневные повторения. Золотое сечение — соотношение двух величин, гармоническая пропорция.",
    "category": [
      "IT",
      "Деревья",
      "Музыка"
    ],
    "comments": [
      {
        "id": "WHLaWx",
        "text": "Плюсую, но слишком много буквы! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Совсем немного..."
      },
      {
        "id": "L66qRI",
        "text": "Это где ж такие красоты?"
      },
      {
        "id": "pr3v-Q",
        "text": "Согласен с автором!"
      },
      {
        "id": "E1orlY",
        "text": "Мне не нравится ваш стиль. Ощущение, что вы меня поучаете."
      }
    ]
  },
  {
    "id": "6EXN5x",
    "title": "Ёлки. История деревьев.",
    "createdDate": "31.03.2021, 12:20:59",
    "announce": "Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Из под его пера вышло 8 платиновых альбомов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Он написал больше 30 хитов.",
    "fullText": "Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Золотое сечение — соотношение двух величин, гармоническая пропорция. Ёлки — это не просто красивое дерево. Это прочная древесина. Из под его пера вышло 8 платиновых альбомов. Простые ежедневные упражнения помогут достичь успеха. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Он написал больше 30 хитов. Это один из лучших рок-музыкантов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Первая большая ёлка была установлена только в 1938 году. Как начать действовать? Для начала просто соберитесь. Программировать не настолько сложно, как об этом говорят. Достичь успеха помогут ежедневные повторения. Собрать камни бесконечности легко, если вы прирожденный герой.",
    "category": [
      "Без рамки",
      "IT",
      "Программирование",
      "Разное"
    ],
    "comments": [
      {
        "id": "dIl9qn",
        "text": "Это где ж такие красоты?"
      },
      {
        "id": "augZgo",
        "text": "Планируете записать видосик на эту тему? Это где ж такие красоты?"
      },
      {
        "id": "1YKUtJ",
        "text": "Мне кажется или я уже читал это где-то?"
      }
    ]
  }
  /* eslint-enable */
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  post(app, new DataService(cloneData), new CommentService());
  return app;
};

describe(`API returns a list of all articles`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));

  test(`First article's id equals "i0jWHm"`, () => expect(response.body[0].id).toBe(`i0jWHm`));

});

describe(`API returns an article with given id`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/i0jWHm`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer's title is "Ёлки. История деревьев."`, () => expect(response.body.title).toBe(`Ёлки. История деревьев.`));

});

describe(`API creates an article if data is valid`, () => {

  const newPost = {
    title: `Рок — это протест.`,
    createdDate: `27.02.2021, 00:15:27`,
    announce: `Как начать действовать? Для начала просто соберитесь. Ёлки — это не просто красивое дерево. Это прочная древесина. Из под его пера вышло 8 платиновых альбомов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    category: [
      `Кино`,
    ],
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send(newPost);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));


  test(`Returns article created`, () => expect(response.body).toEqual(expect.objectContaining(newPost)));

  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );

});

describe(`API refuses to create an article if data is invalid`, () => {

  const newPost = {
    category: [
      `Кино`,
      `Деревья`,
      `Железо`,
      `IT`,
      `Программирование`,
      `За жизнь`,
      `Без рамки`,
      `Музыка`
    ],
    title: `Рок — это протест.`,
    announce: `Как начать действовать? Для начала просто соберитесь. Ёлки — это не просто красивое дерево. Это прочная древесина. Из под его пера вышло 8 платиновых альбомов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    createdDate: `27.02.2021, 00:15:27`,
  };
  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newPost)) {
      const badPost = {...newPost};
      delete badPost[key];
      await request(app)
        .post(`/articles`)
        .send(badPost)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

});

describe(`API changes existent article`, () => {

  const newPost = {
    category: [
      `Железо`,
      `Без рамки`,
      `Музыка`,
      `За жизнь`,
      `IT`
    ],
    title: `Дам погладить котика`,
    announce: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Как начать действовать? Для начала просто соберитесь. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    createdDate: `01.03.2021, 06:41:39`,
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/D8qF6p`)
      .send(newPost);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newPost)));

  test(`Offer is really changed`, () => request(app)
    .get(`/articles/D8qF6p`)
    .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`))
  );

});

test(`API returns status code 404 when trying to change non-existent article`, () => {

  const app = createAPI();

  const validPost = {
    category: `Это`,
    title: `валидный`,
    announce: `объект`,
    createdDate: `объявления`,
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(validPost)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {

  const app = createAPI();

  const invalidPost = {
    category: `Это`,
    title: `невалидный`,
    announce: `объект объявления`,
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(invalidPost)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/D8qF6p`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted article`, () => expect(response.body.id).toBe(`D8qF6p`));

  test(`Article count is 4 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );

});

test(`API refuses to delete non-existent article`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);

});

describe(`API returns a list of comments to given article`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/6EXN5x/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 3 comments`, () => expect(response.body.length).toBe(3));

  test(`First comment's id is "dIl9qn"`, () => expect(response.body[0].id).toBe(`dIl9qn`));

});

describe(`API creates a comment if data is valid`, () => {

  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/6EXN5x/comments`)
      .send(newComment);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));


  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));

  test(`Comments count is changed`, () => request(app)
    .get(`/articles/6EXN5x/comments`)
    .expect((res) => expect(res.body.length).toBe(4))
  );

});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {

  const app = createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {

  const app = createAPI();

  return request(app)
    .post(`/articles/6EXN5x/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);

});

describe(`API correctly deletes a comment`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/6EXN5x/comments/dIl9qn`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`dIl9qn`));

  test(`Comments count is 3 now`, () => request(app)
    .get(`/articles/6EXN5x/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );

});

test(`API refuses to delete non-existent comment`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/articles/6EXN5x/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to delete a comment to non-existent article`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST/comments/kqME9j`)
    .expect(HttpCode.NOT_FOUND);

});
