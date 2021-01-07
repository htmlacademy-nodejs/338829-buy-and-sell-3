'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../../constants`);

const route = new Router();

module.exports = (app, searchService) => {
  app.use(`/search`, route);

  route.get(`/`, (req, res) => {
    const {query: queryValue} = req.query;
    const offers = searchService.filter(queryValue);
    return res
      .status(HttpCode.OK)
      .json(offers);
  });
};
