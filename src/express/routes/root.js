/* eslint-disable camelcase */
'use strict';

const express = require(`express`);
const multer = require(`multer`);
const cookieParser = require(`cookie-parser`);

const {axiosApi} = require(`../axios-api/axios-api`);
const {pictureUpload} = require(`../middlewares`);
const {getErrorMessage} = require(`../../utils`);
const {OFFERS_PER_PAGE} = require(`../../constants`);

const upload = multer();
const rootRouter = new express.Router();

rootRouter.use(express.urlencoded({extended: true}));
rootRouter.use(cookieParser());

rootRouter.get(`/`, async (req, res, next) => {
  try {
    const {page = 1} = req.query;

    const limit = OFFERS_PER_PAGE;
    const offset = (Number(page) - 1) * limit;

    const [{count, offers}, categories] = await Promise.all([
      axiosApi.getOffers({limit, offset}),
      axiosApi.getCategories({count: true})
    ]);

    if (offers.length > 0) {
      const total = Math.ceil(count / OFFERS_PER_PAGE);

      return res.render(`pages/main`, {
        tickets: offers,
        categories,
        page: Number(page),
        totalPages: total
      });
    }

    return res.render(`pages/main-empty`);
  } catch (error) {
    return next(error);
  }
});

rootRouter.get(`/register`, (req, res) => {
  return res.render(`pages/sign-up`, {
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
    return res.redirect(`/login`);
  } catch (err) {
    return res.render(`pages/sign-up`, {
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

rootRouter.get(`/login`, (req, res) => {
  return res.render(`pages/login`, {
    login: {
      email: ``,
      password: ``
    },
    message: {}
  });
});

rootRouter.post(`/login`, upload.none(), async (req, res) => {
  const {email, password} = req.body;
  try {
    const {accessToken, refreshToken} = await axiosApi.loginUser({email, password});
    res.cookie(`_ac`, accessToken);
    res.cookie(`_rf`, refreshToken);

    return res.redirect(`/`);
  } catch (err) {
    return res.render(`pages/login`, {
      login: {
        email,
        password: ``
      },
      message: getErrorMessage(err.response.data.message),
    });
  }
});

rootRouter.get(`/search`, async (req, res) => {
  try {
    const {search} = req.query;
    const tickets = await axiosApi.searchOffers(search);

    return res.render(`pages/search-result`, {tickets});
  } catch (error) {
    return res.render(`pages/search-result`, {tickets: []});
  }
});

module.exports = rootRouter;
