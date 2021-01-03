'use strict';

const {Router} = require(`express`);
const getMockData = require(`../lib/get-mock-data`);

const categoryRoute = require(`./category-routes/category-routes`);
const offersRoute = require(`./offers-routes/offers-routes`);

const {
  CategoryService,
  OffersService,
  CommentsService
} = require(`../data-service`);

const routes = new Router();

(async () => {
  const mockData = await getMockData();
  categoryRoute(routes, new CategoryService(mockData));
  offersRoute(routes, new OffersService(mockData), new CommentsService());
})();

module.exports = routes;
