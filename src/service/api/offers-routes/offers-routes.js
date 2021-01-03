'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../../constants`);
const {
  offerValidator,
  commentValidator,
  commentExist,
  offerExist
} = require(`../../middlewares`);

const route = new Router();

module.exports = (app, offersService, commentsService) => {
  app.use(`/offers`, route);

  route.get(`/`, (req, res) => {
    const offers = offersService.findAll();
    return res
      .status(HttpCode.OK)
      .json(offers);
  });

  route.post(`/`, offerValidator, (req, res) => {
    const offer = offersService.create(req.body);
    return res
      .status(HttpCode.CREATED)
      .json(offer);
  });

  route.get(`/:offerId`, offerExist(offersService), (req, res) => {
    const {offer} = res.locals;
    return res
      .status(HttpCode.OK)
      .json(offer);
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

  route.post(`/:offerId/comments`, [offerExist(offersService), commentValidator], (req, res) => {
    const {offer} = res.locals;
    const comment = commentsService.create(offer, req.body);

    return res
      .status(HttpCode.CREATED)
      .json(comment);
  });

  route.get(`/:offerId/comments`, offerExist(offersService), (req, res) => {
    const {offer} = res.locals;
    const comments = commentsService.findAll(offer);
    return res
      .status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:offerId/comments/:commentId`, [offerExist(offersService), commentExist(commentsService)], (req, res) => {
    const {offerId, commentId} = req.params;
    const {offer} = res.locals;

    commentsService.delete(offer, commentId);
    offersService.update(offerId, offer);

    console.log(offer);
    return res
      .status(HttpCode.NO_CONTENT)
      .send(``);
  });
};
