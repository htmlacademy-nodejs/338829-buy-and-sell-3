'use strict';

const express = require(`express`);
const request = require(`supertest`);

const searchRoutes = require(`./search-routes`);
const {SearchService} = require(`../../data-service`);

const mockData = [
  {
    "id": `3DD_SH`,
    "title": `Продам советскую посуду. Почти не разбита.`,
    "picture": `item13.jpg`,
    "description": `Любые проверки на месте. Пользовались 2-3 раза, по состоянию видно. Кузов без намёка на ржавчину. Товар в отличном состоянии.`,
    "type": `OFFER`,
    "sum": 98169,
    "category": [`Одежда`, `Журналы`],
    "comments": [
      {"id": `k7dHQQ`, "text": `Оплата наличными или перевод на карту? Продаю в связи с переездом. Отрываю от сердца. Почему в таком ужасном состоянии?`},
      {"id": `dklv6M`, "text": `С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии? Вы что?! В магазине дешевле.`}
    ]
  },
  {
    "id": `A97rIR`,
    "title": `Собака в добрые руки.`,
    "picture": `item12.jpg`,
    "description": `Товар в отличном состоянии. Кузов без намёка на ржавчину. Пользовались бережно и только по большим праздникам. Старые или очень старые, бу или сильно бу...`,
    "type": `OFFER`,
    "sum": 90867,
    "category": [`Журналы`, `Разное`, `Бытовая техника`],
    "comments": [
      {"id": `c-2YEh`, "text": `Почему в таком ужасном состоянии? Неплохо, но дорого. С чем связана продажа? Почему так дешёво?`},
      {"id": `ErDTEN`, "text": `Вы что?! В магазине дешевле. Совсем немного... Почему в таком ужасном состоянии?`},
      {"id": `zciBrC`, "text": `Продаю в связи с переездом. Отрываю от сердца. Неплохо, но дорого.`},
      {"id": `cqkdCj`, "text": `Оплата наличными или перевод на карту? С чем связана продажа? Почему так дешёво?`}
    ]
  }
];

const {HttpCode} = require(`../../../constants`);

const app = express();
app.use(express.json());
searchRoutes(app, new SearchService(mockData));

describe(`API returns offer based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `собака`
      });
  });

  test(`Status code 200`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`1 offer found`, () => {
    expect(response.body.length).toBe(1);
  });

  test(`Offer has correct id`, () => {
    expect(response.body[0].id).toBe(`A97rIR`);
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
