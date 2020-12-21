'use strict';

const {Router} = require(`express`);
const myRouter = new Router();


myRouter.get(`/`, (req, res) => res.render(`pages/my-tickets`));
myRouter.get(`/comments`, (req, res) => res.render(`pages/comments`));

module.exports = myRouter;
