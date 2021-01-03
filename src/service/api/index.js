'use strict';

const {Router} = require(`express`);
const getMockData = require(`../lib/get-mock-data`);

const categoryRoute = require(`./category`);
const offersRoute = require(`./offers`);

const {
  CategoryService,
  OffersService
} = require(`../data-service`);

const routes = new Router();

(async () => {
  const mockData = await getMockData();
  categoryRoute(routes, new CategoryService(mockData));
  offersRoute(routes, new OffersService(mockData));
})();

module.exports = routes;
