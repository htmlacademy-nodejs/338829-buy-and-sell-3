'use strict';

const {Router} = require(`express`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const categoryRoute = require(`./category-routes/category-routes`);
const offersRoute = require(`./offers-routes/offers-routes`);
const searchRoute = require(`./search-routes/search-routes`);

const {
  CategoryService,
  OffersService,
  CommentsService,
  SearchService
} = require(`../data-service`);

const routes = new Router();

defineModels(sequelize);

(async () => {
  categoryRoute(routes, new CategoryService(sequelize));
  offersRoute(routes, new OffersService(sequelize), new CommentsService(sequelize));
  searchRoute(routes, new SearchService(sequelize));
})();

module.exports = routes;
