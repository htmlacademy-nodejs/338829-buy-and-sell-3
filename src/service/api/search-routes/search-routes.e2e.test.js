'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../lib/init-db`);
const searchRoutes = require(`./search-routes`);
const {SearchService} = require(`../../data-service`);

const mockCategories = [
  `Животные`,
  `Журналы`,
  `Игры`
];

const mockOffers = [
  {
    "title": `Продам камаз или обменяю на Citroen.`,
    "picture": `item11.jpg`,
    "description": `Кажется что это хрупкая вещь. Имеется коробка и все документы. Если есть какие-то вопросы - пишите, на все отвечу :) Если товар не понравится — верну всё до последней копейки.`,
    "type": `SALE`,
    "sum": 22806,
    "categories": [`Животные`],
    "comments": [
      {"text": `Оплата наличными или перевод на карту? Вы что?! В магазине дешевле.`},
      {"text": `Почему в таком ужасном состоянии?`},
      {"text": `Неплохо, но дорого. Продаю в связи с переездом. Отрываю от сердца. А сколько игр в комплекте?`},
      {"text": `С чем связана продажа? Почему так дешёво?`}
    ]
  },
  {
    "title": `Джинсовые сумки.`,
    "picture": `item07.jpg`,
    "description": `Никаких нареканий или недостатков. Все детали в рабочем состоянии. Кажется что это хрупкая вещь. Две страницы заляпаны свежим кофе.`,
    "type": `OFFER`,
    "sum": 30699,
    "categories": [`Журналы`, `Игры`],
    "comments": [
      {"text": `А где блок питания? Неплохо, но дорого. Вы что?! В магазине дешевле.`},
      {"text": `Оплата наличными или перевод на карту?`},
      {"text": `А где блок питания? С чем связана продажа? Почему так дешёво? Продаю в связи с переездом. Отрываю от сердца.`}
    ]
  }
];

const {HttpCode} = require(`../../../constants`);

const app = express();
app.use(express.json());

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

describe(`API returns offer based on search query`, () => {
  let response;

  beforeAll(async () => {
    await initDB(mockDB, {categories: mockCategories, offers: mockOffers});
    searchRoutes(app, new SearchService(mockDB));

    response = await request(app)
      .get(`/search`)
      .query({
        query: `Citroen`
      });
  });

  test(`Status code 200`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`1 offer found`, () => {
    expect(response.body.length).toBe(1);
  });

  test(`Offer has correct title`, () => {
    expect(response.body[0].title).toBe(`Продам камаз или обменяю на Citroen.`);
  });
});

describe(`API returns code 404 if nothing is found`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Куплю`
      });
  });

  test(`Status code 404`, () => {
    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`Response text to equal "Not found"`, () => {
    expect(response.text).toBe(`Not found`);
  });
});

describe(`API returns code 400 when query string is absent`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`);
  });

  test(`Status code 400`, () => {
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });
});
