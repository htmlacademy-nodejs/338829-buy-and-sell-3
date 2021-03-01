'use strict';

const {axiosApi} = require(`../axios-api/axios-api`);
const {Router} = require(`express`);
const {OFFERS_PER_PAGE} = require(`../../constants`);

const rootRouter = new Router();

rootRouter.get(`/`, async (req, res) => {
  const {page = 1} = req.query;

  const limit = OFFERS_PER_PAGE;
  const offset = (Number(page) - 1) * limit;

  const [{count, offers}, categories] = await Promise.all([
    axiosApi.getOffers({limit, offset}),
    axiosApi.getCategories({count: true})
  ]);

  if (offers.length > 0) {
    const total = Math.ceil(count / OFFERS_PER_PAGE);

    res.render(`pages/main`, {
      tickets: offers,
      categories,
      page,
      totalPages: total
    });
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
