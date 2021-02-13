'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../../constants`);

module.exports = (app, service) => {
  const route = new Router();
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const hasCount = Boolean(req.query.count);
    const categories = await service.findAll(hasCount);

    return res
      .status(HttpCode.OK)
      .json(categories);
  });
};
