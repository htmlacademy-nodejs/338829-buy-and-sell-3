'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../../constants`);

module.exports = (app, searchService) => {
  const route = new Router();
  app.use(`/search`, route);

  route.get(`/`, (req, res) => {
    const {query: queryValue} = req.query;

    if (!queryValue) {
      return res
        .status(HttpCode.BAD_REQUEST)
        .send(`Bad request`);
    }

    const offers = searchService.filter(queryValue);

    if (offers.length === 0) {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res
      .status(HttpCode.OK)
      .json(offers);
  });
};
