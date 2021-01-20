'use strict';

const {axiosApi} = require(`../axios-api/axios-api`);
const {Router} = require(`express`);
const rootRouter = new Router();

rootRouter.get(`/`, async (req, res) => {
  const offers = await axiosApi.getOffers();

  if (offers.length > 0) {
    res.render(`pages/main`, {tickets: offers});
  } else {
    res.render(`pages/main-empty`);
  }
});

rootRouter.get(`/register`, (req, res) => res.render(`pages/sign-up`));
rootRouter.get(`/login`, (req, res) => res.render(`pages/login`));

rootRouter.get(`/search`, async (req, res) => {
  try {
    const {search} = req.query;
    const tickets = await axiosApi.searchOffers(search);

    res.render(`pages/search-result`, {tickets});
  } catch (error) {
    res.render(`pages/search-result`, {tickets: []});
  }
});

module.exports = rootRouter;
