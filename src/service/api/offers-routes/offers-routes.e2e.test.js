'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../lib/init-db`);
const offersRoutes = require(`./offers-routes`);
const {OffersService, CommentsService} = require(`../../data-service`);

const mockCategories = [
  `Животные`,
  `Журналы`,
  `Игры`
];

const mockOffers = [
  {
    "title": `Куплю вязаные носки.`,
    "picture": `item11.jpg`,
    "description": `Готов скинуть в пределах разумного. Мой дед не мог её сломать. Любые проверки на месте. Все оригинал.`,
    "type": `OFFER`,
    "sum": 60513,
    "categories": [`Животные`],
    "comments": [
      {"text": `Оплата наличными или перевод на карту? Вы что?! В магазине дешевле.`},
      {"text": `Почему в таком ужасном состоянии?`},
      {"text": `Неплохо, но дорого. Продаю в связи с переездом. Отрываю от сердца. А сколько игр в комплекте?`},
      {"text": `С чем связана продажа? Почему так дешёво?`}
    ]
  },
  {
    "title": `Отдам в хорошие руки подшивку «Мурзилка».`,
    "picture": `item02.jpg`,
    "description": `Кажется что это хрупкая вещь. При покупке с меня бесплатная доставка в черте города. Никаких нареканий или недостатков. Кому нужен этот новый телефон если тут такое...`,
    "type": `SALE`,
    "sum": 62577,
    "categories": [`Журналы`, `Игры`],
    "comments": [
      {"text": `А где блок питания? Неплохо, но дорого. Вы что?! В магазине дешевле.`},
      {"text": `Оплата наличными или перевод на карту?`},
      {"text": `А где блок питания? С чем связана продажа? Почему так дешёво? Продаю в связи с переездом. Отрываю от сердца.`}
    ]
  }
];

const {HttpCode} = require(`../../../constants`);

const createApp = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, offers: mockOffers});

  const app = express();
  app.use(express.json());
  offersRoutes(app, new OffersService(mockDB), new CommentsService(mockDB));

  return app;
};

describe(`READ: API offers`, () => {
  let app;
  let response;

  describe(`correctly`, () => {
    beforeAll(async () => {
      app = await createApp();
      response = await request(app).get(`/offers`);
    });

    test(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Returns a list of 2 offers`, () => {
      expect(response.body.offers.length).toBe(2);
    });

    test(`First Offer id equals 1`, () => {
      expect(response.body.offers[0].id).toBe(1);
    });
  });
});

describe(`READ: API offer`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApp();
  });

  describe(`Correctly: with given id`, () => {
    beforeAll(async () => {
      response = await request(app).get(`/offers/1`);
    });

    test(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Offer's title equals "Куплю вязаные носки."`, () => {
      expect(response.body.title).toBe(`Куплю вязаные носки.`);
    });
  });

  describe(`Incorrectly: with given incorrectly id = NOEXST`, () => {
    beforeAll(async () => {
      response = await request(app).get(`/offers/NOEXST`);
    });

    test(`Status code 400`, () => {
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`Response text to equal "\"id\" must be a number"`, () => {
      expect(response.text).toBe(`\"id\" must be a number`);
    });
  });

  describe(`Incorrectly: with given correctly id = 10`, () => {
    beforeAll(async () => {
      response = await request(app).get(`/offers/10`);
    });

    test(`Status code 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`Response text to equal "Offer with 10 not found"`, () => {
      expect(response.text).toBe(`Offer with 10 not found`);
    });
  });
});

describe(`CREATE: API offer`, () => {
  let app;
  let response;
  let newOffer;

  beforeAll(async () => {
    app = await createApp();
    newOffer = {
      "title": `Продам гараж`,
      "picture": `item02.jpg`,
      "description": `Никаких нареканий или недостатков. Мой дед не мог её сломать. Любые проверки на месте`,
      "type": `offer`,
      "sum": 1000,
      "categories": [`1`]
    };
  });

  describe(`Correctly`, () => {
    beforeAll(async () => {
      response = await request(app)
        .post(`/offers`)
        .send(newOffer);
    });

    test(`Status code 201`, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    test(`Offers count is changed`, async () => {
      const offersRes = await request(app).get(`/offers`);
      expect(offersRes.body.offers.length).toBe(3);
    });
  });

  describe(`Incorrectly`, () => {
    const badOffer = {...newOffer};

    test(`Status code 400`, async () => {
      for (const key of Object.keys(newOffer)) {
        delete badOffer[key];

        const badResponse = await request(app)
          .post(`/offers`)
          .send(badOffer);

        expect(badResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
      }
    });
  });
});

describe(`UPDATE: API offer`, () => {
  let app;
  let response;
  let updateOffer;

  beforeAll(async () => {
    app = await createApp();
    updateOffer = {
      "title": `Продам НОВЫЙ гараж`,
      "picture": `item02.jpg`,
      "description": `Без дверей, Мой дед не мог её сломать. Любые проверки на месте`,
      "type": `sale`,
      "sum": 101,
      "categories": [`1`]
    };
  });

  describe(`Correctly`, () => {
    beforeAll(async () => {
      response = await request(app)
        .put(`/offers/1`)
        .send(updateOffer);
    });

    test(`Status code 204`, () => {
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT);
    });
  });

  describe(`Incorrectly`, () => {
    test(`API returns status code 400 when trying to change offer id = NOEXST`, async () => {
      const notFoundResponse = await request(app)
        .put(`/offers/NOEXST`)
        .send(updateOffer);

      expect(notFoundResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`API returns status code 404 when trying to change offer id = 10`, async () => {
      const notFoundResponse = await request(app)
        .put(`/offers/10`)
        .send(updateOffer);

      expect(notFoundResponse.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`API returns status code 400 when trying to change an offer with invalid data`, async () => {
      const invalidOffer = {...updateOffer};
      delete invalidOffer.sum;

      const badResponse = await request(app)
        .put(`/offers/1`)
        .send(invalidOffer);

      expect(badResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });
});

describe(`DELETE: API offer`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApp();
  });

  describe(`Correctly`, () => {
    beforeAll(async () => {
      const offerId = `1`;
      response = await request(app).delete(`/offers/${offerId}`);
    });

    test(`Status code 204`, () => {
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT);
    });

    test(`Offers count is changed`, async () => {
      const offersRes = await request(app).get(`/offers`);
      expect(offersRes.body.offers.length).toBe(1);
    });
  });

  describe(`Incorrectly`, () => {
    test(`API returns status code 400 when trying to delete non-existent offer`, async () => {
      const notFoundResponse = await request(app).delete(`/offers/NOEXST`);
      expect(notFoundResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`API returns status code 404 when trying to change offer id = 10`, async () => {
      const notFoundResponse = await request(app).delete(`/offers/10`);
      expect(notFoundResponse.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

describe(`READ: API comments`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApp();
  });

  describe(`Correctly`, () => {
    beforeAll(async () => {
      const offerId = `1`;
      response = await request(app).get(`/offers/${offerId}/comments`);
    });

    test(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Offer has four comments`, () => {
      expect(response.body.length).toBe(4);
    });
  });

  describe(`Incorrectly offerId = NOEXST`, () => {
    beforeAll(async () => {
      response = await request(app).get(`/offers/NOEXST/comments`);
    });

    test(`Status code 400`, () => {
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`Response text to equal "\"id\" must be a number"`, () => {
      expect(response.text).toBe(`\"id\" must be a number`);
    });
  });

  describe(`Correctly offerId = 10`, () => {
    beforeAll(async () => {
      response = await request(app).get(`/offers/10/comments`);
    });

    test(`Status code 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`Response text to equal "Offer with 10 not found"`, () => {
      expect(response.text).toBe(`Offer with 10 not found`);
    });
  });
});

describe(`CREATE: API comments`, () => {
  let app;
  let offerId;
  let newComment;
  let response;

  beforeAll(async () => {
    app = await createApp();
    newComment = {
      text: `Оплата наличными или перевод на карту?`
    };
    offerId = `1`;
  });

  describe(`Correctly`, () => {
    beforeAll(async () => {
      response = await request(app)
        .post(`/offers/${offerId}/comments`)
        .send(newComment);
    });

    test(`Status code 201`, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    test(`Return new comment`, () => {
      expect(response.body.data).toEqual(expect.objectContaining({
        text: `Оплата наличными или перевод на карту?`
      }));
    });

    test(`Offer has five comments, count is changed`, async () => {
      const commentsRes = await request(app).get(`/offers/${offerId}/comments`);
      expect(commentsRes.body.length).toBe(5);
    });
  });

  describe(`Incorrectly`, () => {
    const badComment = {};

    test(`Status code 400 with non-existent offer`, async () => {
      const notfoundResponse = await request(app)
        .post(`/offers/NOEXST/comments`)
        .send(badComment);

      expect(notfoundResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`Status code 400, invalid comment`, async () => {
      const badResponse = await request(app)
        .post(`/offers/${offerId}/comments`)
        .send(badComment);

      expect(badResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`Status code 404 with not found offer`, async () => {
      const notfoundResponse = await request(app)
        .post(`/offers/10/comments`)
        .send(badComment);

      expect(notfoundResponse.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

describe(`DELETE: API comments`, () => {
  let app;
  let offerId;
  let commentId;
  let response;

  beforeAll(async () => {
    app = await createApp();
    commentId = `1`;
    offerId = `1`;
  });

  describe(`Correctly`, () => {
    beforeAll(async () => {
      response = await request(app).delete(`/offers/${offerId}/comments/${commentId}`);
    });

    test(`Status code 204`, () => {
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT);
    });

    test(`Comments count is changed`, async () => {
      const commentsRes = await request(app).get(`/offers/${offerId}/comments`);
      expect(commentsRes.body.length).toBe(3);
    });
  });

  describe(`Incorrectly offerId & commentId`, () => {
    test(`Status code 400 with non-existent offer`, async () => {
      const notfoundResponse = await request(app).delete(`/offers/NOEXST/comments/${commentId}`);
      expect(notfoundResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`Status code 400 with non-existent comment`, async () => {
      const notfoundResponse = await request(app).delete(`/offers/${offerId}/comments/NOEXST`);
      expect(notfoundResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });

  describe(`Correctly Not found`, () => {
    test(`Status code 404 with non-existent offer`, async () => {
      const notfoundResponse = await request(app).delete(`/offers/10/comments/${commentId}`);
      expect(notfoundResponse.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`Status code 404 with non-existent comment`, async () => {
      const notfoundResponse = await request(app).delete(`/offers/${offerId}/comments/100`);
      expect(notfoundResponse.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});
