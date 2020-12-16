'use strict';

const {Router} = require(`express`);
const offersRouter = new Router();

offersRouter.get(`/category/:id`, (req, res) => res.send(req.originalUrl));
offersRouter.get(`/add`, (req, res) => res.send(req.originalUrl));
offersRouter.get(`/edit/:id`, (req, res) => res.send(req.originalUrl));
offersRouter.get(`/:id`, (req, res) => res.send(req.originalUrl));

module.exports = offersRouter;
