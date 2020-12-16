'use strict';

const {Router} = require(`express`);
const rootRouter = new Router();

rootRouter.get(`/`, (req, res) => res.send(req.originalUrl));
rootRouter.get(`/register`, (req, res) => res.send(req.originalUrl));
rootRouter.get(`/login`, (req, res) => res.send(req.originalUrl));
rootRouter.get(`/search`, (req, res) => res.send(req.originalUrl));

module.exports = rootRouter;
