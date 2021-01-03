/* eslint-disable no-unused-vars */
'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const offerValidator = require(`../middlewares/offer-validator`);
const offerExist = require(`../middlewares/offer-exist`);

const route = new Router();

module.exports = (app, offersService) => {
  app.use(`/offers`, route);

  route.get(`/`, (req, res) => {
    const offers = offersService.findAll();
    res.status(HttpCode.OK).json(offers);
  });

  route.post(`/`, offerValidator, (req, res) => {
    const offer = offersService.create(req.body);
    return res
      .status(HttpCode.CREATED)
      .json(offer);
  });

  route.get(`/:offerId`, offerExist(offersService), (req, res) => {
    const {offer} = res.locals;
    return res.status(HttpCode.OK).json(offer);
  });

  route.put(`/:offerId`, offerExist(offersService), (req, res) => {
    const {offerId} = req.params;
    offersService.update(offerId, req.body);
    return res
      .status(HttpCode.NO_CONTENT)
      .send(``);
  });

  route.delete(`/:offerId`, offerExist(offersService), (req, res) => {
    const {offerId} = req.params;
    offersService.delete(offerId);
    return res
      .status(HttpCode.NO_CONTENT)
      .send(``);
  });

  route.post(`/:offerId/comments`, offerExist(offersService), (req, res) => {
    // create comment
  });

  route.get(`/:offerId/comments`, offerExist(offersService), (req, res) => {
    // read comments
  });

  route.put(`/:offerId/comments/:commentId`, offerExist(offersService), (req, res) => {
    // update comment
  });

  route.delete(`/:offerId/comments/:commentId`, offerExist(offersService), (req, res) => {
    // delete comment
  });
};
