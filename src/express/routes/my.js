'use strict';

const {Router} = require(`express`);
const {axiosApi} = require(`../axios-api/axios-api`);

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const response = await axiosApi.getOffers();
  res.render(`pages/my-tickets`, {tickets: response.offers});
});

myRouter.get(`/comments`, async (req, res) => {
  const response = await axiosApi.getOffers({comments: true});
  const offers = response.offers.slice(0, 3);

  const comments = await Promise.all(offers.map((offer) => axiosApi.getOfferComments(offer.id)));
  const data = offers.map((offer, index) => ({
    id: offer.id,
    title: offer.title,
    sum: offer.sum,
    type: offer.type,
    comments: comments[index]
  }));

  res.render(`pages/comments`, {tickets: data});
});

module.exports = myRouter;
