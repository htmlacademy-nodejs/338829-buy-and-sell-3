'use strict';

const {axiosApi} = require(`../axios-api/axios-api`);
const {Router} = require(`express`);
const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const offers = await axiosApi.getOffers();
  res.render(`pages/my-tickets`, {tickets: offers});
});

myRouter.get(`/comments`, async (req, res) => {
  const allOffers = await axiosApi.getOffers({comments: true});
  const offers = allOffers.slice(0, 3);

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
