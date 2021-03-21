/* eslint-disable camelcase */
'use strict';

const express = require(`express`);
const {axiosApi} = require(`../axios-api/axios-api`);
const {pictureUpload} = require(`../middlewares`);
const {getErrorMessage} = require(`../../utils`);
const {OFFERS_PER_PAGE} = require(`../../constants`);

const rootRouter = new express.Router();
rootRouter.use(express.urlencoded({extended: true}));

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
      page: Number(page),
      totalPages: total
    });
  } else {
    res.render(`pages/main-empty`);
  }
});

rootRouter.get(`/register`, (req, res) => {
  res.render(`pages/sign-up`, {
    newUser: {
      email: ``,
      name: ``,
      password: ``,
      confirm_password: ``,
      avatar: ``
    },
    message: {}
  });
});

rootRouter.post(`/register`, pictureUpload.single(`avatar`), async (req, res) => {
  const {body, file} = req;

  const newUser = {
    ...body,
    avatar: file && file.filename || ``
  };

  try {
    await axiosApi.createUser(newUser);
    res.render(`pages/login`);
  } catch (err) {
    res.render(`pages/sign-up`, {
      newUser: {
        ...newUser,
        avatar: newUser.avatar || body.avatar,
        password: ``,
        confirm_password: ``
      },
      message: getErrorMessage(err.response.data.message)
    });
  }
});

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
