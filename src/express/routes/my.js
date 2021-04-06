'use strict';

const {Router} = require(`express`);
const {axiosApi} = require(`../axios-api/axios-api`);
const {privateRoute} = require(`../middlewares`);

const myRouter = new Router();

myRouter.get(`/`, privateRoute, async (req, res, next) => {
  try {
    const response = await axiosApi.getOffers();
    return res
      .render(`pages/my-tickets`, {tickets: response.offers, isAuth: true});
  } catch (error) {
    return next(error);
  }
});

myRouter.get(`/comments`, privateRoute, async (req, res, next) => {
  try {
    const response = await axiosApi.getOffers({comments: true});
    const offers = response.offers.slice(0, 3);

    const {accessToken} = res.locals.auth;
    const comments = await Promise.all(offers.map((offer) => axiosApi.getOfferComments(offer.id, accessToken)));
    const data = offers.map((offer, index) => ({
      id: offer.id,
      title: offer.title,
      sum: offer.sum,
      type: offer.type,
      comments: comments[index]
    }));

    return res
      .render(`pages/comments`, {tickets: data, isAuth: true});
  } catch (error) {
    return next(error);
  }
});

module.exports = myRouter;
