'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../lib/init-db`);
const userRoutes = require(`../user-routes/user-routes`);
const {UsersService, TokenService} = require(`../../data-service`);

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

const mockUsers = [{
  "email": `admin@local.localhost`,
  "name": `Admin`,
  "password": `222222`,
  "confirm_password": `222222`
}];

const {HttpCode} = require(`../../../constants`);

const createApp = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, offers: mockOffers, users: mockUsers});

  const app = express();
  app.use(express.json());
  userRoutes(app, new UsersService(mockDB), new TokenService(mockDB));

  return app;
};

describe(`AUTH: User registration`, () => {
  let app;
  let response;
  let newUser;

  beforeAll(async () => {
    app = await createApp();
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

describe(`AUTH: User login`, () => {
  let app;
  let loginResponse;
  let user;

  beforeAll(async () => {
    app = await createApp();
    user = {
      "email": `admin@local.localhost`,
      "password": `222222`,
    };
  });

  describe(`Correctly`, () => {
    beforeAll(async () => {
      loginResponse = await request(app)
        .post(`/user/login`)
        .send(user);
    });

    test(`Status code 200`, () => {
      expect(loginResponse.statusCode).toBe(HttpCode.OK);
    });

    test(`Response body to have accessToken & refreshToken`, () => {
      expect(loginResponse.body).toHaveProperty(`accessToken`);
      expect(loginResponse.body).toHaveProperty(`refreshToken`);
    });
  });

  describe(`Incorrectly`, () => {
    const badUser = {...user};

    test(`Status code 400`, async () => {
      for (const key of Object.keys(user)) {
        delete badUser[key];

        const badResponse = await request(app)
          .post(`/user/login`)
          .send(badUser);

        expect(badResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
      }
    });
  });

  describe(`Incorrectly - email`, () => {
    let badUser;
    let badResponse;

    beforeEach(async () => {
      badUser = {...user};
      badUser.email = `user2@local.localhost`;

      badResponse = await request(app)
        .post(`/user/login`)
        .send(badUser);
    });

    test(`Status code 403`, async () => {
      expect(badResponse.statusCode).toBe(HttpCode.FORBIDDEN);
    });

    test(`Response body to equal`, async () => {
      expect(badResponse.body).toEqual({"message": `Пользователь с таким email не зарегистрирован`});
    });
  });

  describe(`Incorrectly - password`, () => {
    let badUser;
    let badResponse;

    beforeEach(async () => {
      badUser = {...user};
      badUser.password = `654321`;

      badResponse = await request(app)
        .post(`/user/login`)
        .send(badUser);
    });

    test(`Status code 403`, async () => {
      expect(badResponse.statusCode).toBe(HttpCode.FORBIDDEN);
    });

    test(`Response body to equal`, async () => {
      expect(badResponse.body).toEqual({"message": `Неправильно введён логин или пароль`});
    });
  });
});

describe(`AUTH: User refresh token`, () => {
  let app;
  let response;
  let user;

  beforeAll(async () => {
    app = await createApp();
    user = {
      "email": `admin@local.localhost`,
      "password": `222222`,
    };
  });

  describe(`Correctly`, () => {
    let refreshResponse;

    beforeAll(async () => {
      response = await request(app)
        .post(`/user/login`)
        .send(user);

      refreshResponse = await request(app)
        .post(`/user/refresh`)
        .send({token: response.body.refreshToken});
    });

    test(`Status code 200`, () => {
      expect(refreshResponse.statusCode).toBe(HttpCode.OK);
    });

    test(`Response body to have accessToken & refreshToken`, () => {
      expect(refreshResponse.body).toHaveProperty(`accessToken`);
      expect(refreshResponse.body).toHaveProperty(`refreshToken`);
    });
  });

  describe(`Incorrectly, bad response`, () => {
    let refreshResponse;

    test(`Status code 400`, async () => {
      refreshResponse = await request(app)
        .post(`/user/refresh`)
        .send();

      expect(refreshResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });

  describe(`Incorrectly, not found token`, () => {
    let refreshResponse;

    test(`Status code 404`, async () => {
      refreshResponse = await request(app)
        .post(`/user/refresh`)
        .send({token: `123`});

      expect(refreshResponse.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

describe(`AUTH: User logout`, () => {
  let app;
  let user;
  let loginResponse;

  beforeAll(async () => {
    app = await createApp();
    user = {
      "email": `admin@local.localhost`,
      "password": `222222`,
    };

    loginResponse = await request(app)
      .post(`/user/login`)
      .send(user);
  });

  describe(`Correctly`, () => {
    let logoutResponse;

    beforeAll(async () => {
      logoutResponse = await request(app)
        .delete(`/user/logout`)
        .set(`authorization`, `Bearer ${loginResponse.body.accessToken}`)
        .send({token: loginResponse.body.refreshToken});
    });

    test(`Status code 204`, () => {
      expect(logoutResponse.statusCode).toBe(HttpCode.NO_CONTENT);
    });
  });

  describe(`Incorrectly`, () => {
    test(`Without headers, status code 401`, async () => {
      const logoutResponse = await request(app)
        .delete(`/user/logout`)
        .send({token: loginResponse.body.refreshToken});

      expect(logoutResponse.statusCode).toBe(HttpCode.UNAUTHORIZED);
    });

    test(`Without token, Status code 401`, async () => {
      const logoutResponse = await request(app)
        .delete(`/user/logout`)
        .set(`authorization`, ``)
        .send({token: loginResponse.body.refreshToken});

      expect(logoutResponse.statusCode).toBe(HttpCode.UNAUTHORIZED);
    });

    test(`Incorrect accessToken, Status code 403`, async () => {
      const logoutResponse = await request(app)
        .delete(`/user/logout`)
        .set(`authorization`, `Bearer 123`)
        .send({token: loginResponse.body.refreshToken});

      expect(logoutResponse.statusCode).toBe(HttpCode.FORBIDDEN);
    });

    test(`Without body, Status code 400`, async () => {
      const logoutResponse = await request(app)
        .delete(`/user/logout`)
        .set(`authorization`, `Bearer ${loginResponse.body.accessToken}`);

      expect(logoutResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`With empty body, Status code 400`, async () => {
      const logoutResponse = await request(app)
        .delete(`/user/logout`)
        .set(`authorization`, `Bearer ${loginResponse.body.accessToken}`)
        .send({});

      expect(logoutResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`Incorrect refreshToken, Status code 404`, async () => {
      const logoutResponse = await request(app)
        .delete(`/user/logout`)
        .set(`authorization`, `Bearer ${loginResponse.body.accessToken}`)
        .send({token: `123`});

      expect(logoutResponse.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});
