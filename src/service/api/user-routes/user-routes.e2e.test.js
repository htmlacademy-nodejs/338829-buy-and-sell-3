'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../lib/init-db`);
const userRoutes = require(`../user-routes/user-routes`);
const {UsersService} = require(`../../data-service`);

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

describe(`CREATE: API user`, () => {
  let response;
  let newUser;

  beforeAll(async () => {
    await initDB(mockDB, {categories: mockCategories, offers: mockOffers});
    userRoutes(app, new UsersService(mockDB));

    newUser = {
      "name": `User Test`,
      "password": `111111`,
      "confirm_password": `111111`,
      "email": `user@local.localhost`,
      "avatar": `avatar.jpg`
    };
  });

  describe(`Correctly`, () => {
    beforeAll(async () => {
      response = await request(app)
        .post(`/user`)
        .send(newUser);
    });

    test(`Status code 201`, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });
  });

  describe(`Incorrectly`, () => {
    const badUser = {...newUser};

    test(`Status code 400`, async () => {
      for (const key of Object.keys(newUser)) {
        delete badUser[key];

        const badResponse = await request(app)
          .post(`/user`)
          .send(badUser);

        expect(badResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
      }
    });
  });
});
