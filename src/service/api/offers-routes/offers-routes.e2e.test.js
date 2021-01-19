'use strict';

const express = require(`express`);
const request = require(`supertest`);

const offersRoutes = require(`./offers-routes`);
const {OffersService, CommentsService} = require(`../../data-service`);

const mockData = [
  {
    "id": `_o8u33`,
    "title": `Куплю вязаные носки.`,
    "picture": `item11.jpg`,
    "description": `Готов скинуть в пределах разумного. Мой дед не мог её сломать. Любые проверки на месте. Все оригинал.`,
    "type": `OFFER`,
    "sum": 60513,
    "category": [`Животные`, `Компьютерная техника`, `Посуда`, `Бизнес и оборудование`, `Строительство и ремонт`, `Игры`, `Разное`, `Детские товары`, `Книги`, `Спорт и отдых`],
    "comments": [
      {"id": `6roIro`, "text": `Неплохо, но дорого. Оплата наличными или перевод на карту?`},
      {"id": `pi_JRT`, "text": `С чем связана продажа? Почему так дешёво? Неплохо, но дорого. А где блок питания?`},
      {"id": `16iAxL`, "text": `Совсем немного... Вы что?! В магазине дешевле.`}
    ]
  },
  {
    "id": `ffie6-`,
    "title": `Отдам в хорошие руки подшивку «Мурзилка».`,
    "picture": `item02.jpg`,
    "description": `Кажется что это хрупкая вещь. При покупке с меня бесплатная доставка в черте города. Никаких нареканий или недостатков. Кому нужен этот новый телефон если тут такое...`,
    "type": `OFFER`,
    "sum": 62577,
    "category": [`Разное`, `Посуда`, `Детские товары`, `Досуг и развлечения`, `Одежда`, `Электроника`],
    "comments": [
      {"id": `rfwVHd`, "text": `А сколько игр в комплекте?`},
      {"id": `skjdm0`, "text": `Оплата наличными или перевод на карту? Вы что?! В магазине дешевле.`},
      {"id": `lrESx0`, "text": `С чем связана продажа? Почему так дешёво? А где блок питания? Неплохо, но дорого.`},
      {"id": `2-4QEU`, "text": `Совсем немного... Вы что?! В магазине дешевле. С чем связана продажа? Почему так дешёво?`}
    ]
  }
];

const {HttpCode} = require(`../../../constants`);

const createApp = () => {
  const app = express();
  app.use(express.json());
  offersRoutes(
      app,
      new OffersService(JSON.parse(JSON.stringify(mockData))),
      new CommentsService()
  );

  return app;
};

describe(`READ: API offers`, () => {
  let app;
  let response;

  describe(`correctly`, () => {
    beforeAll(async () => {
      app = createApp();
      response = await request(app).get(`/offers`);
    });

    test(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Returns a list of 2 offers`, () => {
      expect(response.body.length).toBe(2);
    });

    test(`First Offer id equals _o8u33`, () => {
      expect(response.body[0].id).toBe(`_o8u33`);
    });
  });
});

describe(`READ: API offer`, () => {
  let app;
  let response;

  beforeAll(() => {
    app = createApp();
  });

  describe(`Correctly: with given id`, () => {
    beforeAll(async () => {
      response = await request(app).get(`/offers/ffie6-`);
    });

    test(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Offer's id equals ffie6-`, () => {
      expect(response.body.id).toBe(`ffie6-`);
    });

    test(`Offer's title equals "Отдам в хорошие руки подшивку «Мурзилка»."`, () => {
      expect(response.body.title).toBe(`Отдам в хорошие руки подшивку «Мурзилка».`);
    });
  });

  describe(`Incorrectly: with given id`, () => {
    beforeAll(async () => {
      response = await request(app).get(`/offers/NOEXST`);
    });

    test(`Status code 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`Response text to equal "Offer with NOEXST not found"`, () => {
      expect(response.text).toBe(`Offer with NOEXST not found`);
    });
  });
});

describe(`CREATE: API offer`, () => {
  let app;
  let response;
  let newOffer;

  beforeAll(() => {
    app = createApp();
    newOffer = {
      "title": `Продам гараж`,
      "picture": `item02.jpg`,
      "description": `Никаких нареканий или недостатков.`,
      "type": `OFFER`,
      "sum": 100,
      "category": [`Разное`]
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

    test(`Return new offer`, () => {
      expect(response.body).toEqual(expect.objectContaining(newOffer));
    });

    test(`Offers count is changed`, async () => {
      const offersRes = await request(app).get(`/offers`);
      expect(offersRes.body.length).toBe(3);
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

  beforeAll(() => {
    app = createApp();
    updateOffer = {
      "title": `Продам НОВЫЙ гараж`,
      "picture": `item02.jpg`,
      "description": `Без дверей`,
      "type": `OFFER`,
      "sum": 101,
      "category": [`Гараж`]
    };
  });

  describe(`Correctly`, () => {
    beforeAll(async () => {
      response = await request(app)
        .put(`/offers/_o8u33`)
        .send(updateOffer);
    });

    test(`Status code 204`, () => {
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT);
    });

    test(`Offer is changed`, async () => {
      const offerResponse = await request(app).get(`/offers/_o8u33`);
      expect(offerResponse.body).toEqual(expect.objectContaining(updateOffer));
    });
  });

  describe(`Incorrectly`, () => {
    test(`API returns status code 404 when trying to change non-existent offer`, async () => {
      const notFoundResponse = await request(app)
        .put(`/offers/NOEXST`)
        .send(updateOffer);

      expect(notFoundResponse.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`API returns status code 400 when trying to change an offer with invalid data`, async () => {
      const invalidOffer = {...updateOffer};
      delete invalidOffer.sum;

      const badResponse = await request(app)
        .put(`/offers/_o8u33`)
        .send(invalidOffer);

      expect(badResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });
});

describe(`DELETE: API offer`, () => {
  let app;
  let response;

  beforeAll(() => {
    app = createApp();
  });

  describe(`Correctly`, () => {
    beforeAll(async () => {
      const offerId = `_o8u33`;
      response = await request(app).delete(`/offers/${offerId}`);
    });

    test(`Status code 204`, () => {
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT);
    });

    test(`Offers count is changed`, async () => {
      const offersRes = await request(app).get(`/offers`);
      expect(offersRes.body.length).toBe(1);
    });
  });

  describe(`Incorrectly`, () => {
    test(`API returns status code 404 when trying to delete non-existent offer`, async () => {
      const notFoundResponse = await request(app).put(`/offers/NOEXST`);
      expect(notFoundResponse.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

describe(`READ: API comments`, () => {
  let app;
  let response;

  beforeAll(() => {
    app = createApp();
  });

  describe(`Correctly`, () => {
    beforeAll(async () => {
      const offerId = `_o8u33`;
      response = await request(app).get(`/offers/${offerId}/comments`);
    });

    test(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Offer has three comments`, () => {
      expect(response.body.length).toBe(3);
    });
  });

  describe(`Incorrectly`, () => {
    beforeAll(async () => {
      response = await request(app).get(`/offers/NOEXST/comments`);
    });

    test(`Status code 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`Response text to equal "Offer with NOEXST not found"`, () => {
      expect(response.text).toBe(`Offer with NOEXST not found`);
    });
  });
});

describe(`CREATE: API comments`, () => {
  let app;
  let offerId;
  let newComment;
  let response;

  beforeAll(() => {
    app = createApp();
    newComment = {
      text: `Оплата наличными или перевод на карту?`
    };
    offerId = `_o8u33`;
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

    test(`Return new offer`, () => {
      expect(response.body).toEqual(expect.objectContaining(newComment));
    });

    test(`Offer has four comments, count is changed`, async () => {
      const commentsRes = await request(app).get(`/offers/${offerId}/comments`);
      expect(commentsRes.body.length).toBe(4);
    });
  });

  describe(`Incorrectly`, () => {
    const badComment = {};

    test(`Status code 404 with non-existent offer`, async () => {
      const notfoundResponse = await request(app)
        .post(`/offers/NOEXST/comments`)
        .send(badComment);

      expect(notfoundResponse.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`Status code 400, invalid comment`, async () => {
      const badResponse = await request(app)
        .post(`/offers/${offerId}/comments`)
        .send(badComment);

      expect(badResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });
});

describe(`DELETE: API comments`, () => {
  let app;
  let offerId;
  let commentId;
  let response;

  beforeAll(() => {
    app = createApp();
    commentId = `6roIro`;
    offerId = `_o8u33`;
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
      expect(commentsRes.body.length).toBe(2);
    });
  });

  describe(`Incorrectly`, () => {
    test(`Status code 404 with non-existent offer`, async () => {
      const notfoundResponse = await request(app).delete(`/offers/NOEXST/comments/${commentId}`);
      expect(notfoundResponse.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`Status code 404 with non-existent comment`, async () => {
      const notfoundResponse = await request(app).delete(`/offers/${offerId}/comments/NOEXST`);
      expect(notfoundResponse.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});
