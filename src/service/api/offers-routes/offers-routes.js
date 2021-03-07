'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../../constants`);
const {
  offerValidator,
  commentValidator,
  commentExist,
  offerExist
} = require(`../../middlewares`);

module.exports = (app, offersService, commentsService) => {
  const route = new Router();
  app.use(`/offers`, route);

  route.get(`/`, async (req, res) => {
    const {comments, limit, offset, catId} = req.query;
    const hasComments = Boolean(comments);

    let result;
    if (catId > 0) {
      result = await offersService.findInCategory(limit, offset, catId);
      return res
        .status(HttpCode.OK)
        .json(result);
    }

    console.log(req.query);
    if (limit || offset) {
      result = await offersService.findPage(limit, offset, hasComments);
    } else {
      result = await offersService.findAll(hasComments);
    }

    return res
      .status(HttpCode.OK)
      .json(result);
  });

  route.post(`/`, offerValidator, async (req, res) => {
    const offer = await offersService.create(req.body);
    return res
      .status(HttpCode.CREATED)
      .json({
        message: `A new offer created`,
        data: offer
      });
  });

  route.get(`/:offerId`, offerExist(offersService), (req, res) => {
    const {offer} = res.locals;
    return res
      .status(HttpCode.OK)
      .json(offer);
  });

  route.put(`/:offerId`, [offerExist(offersService), offerValidator], async (req, res) => {
    const {offerId} = req.params;
    const updated = await offersService.update(offerId, req.body);
    return res
      .status(HttpCode.NO_CONTENT)
      .json({
        message: `Offer ${offerId} is updated`,
        data: updated
      });
  });

  route.delete(`/:offerId`, offerExist(offersService), async (req, res) => {
    const {offerId} = req.params;
    const deleted = await offersService.delete(offerId);
    return res
      .status(HttpCode.NO_CONTENT)
      .send(deleted);
  });

  route.post(`/:offerId/comments`, [offerExist(offersService), commentValidator], async (req, res) => {
    const {offerId} = req.params;
    const comment = await commentsService.create(offerId, req.body);

    return res
      .status(HttpCode.CREATED)
      .json({
        message: `A new comment created`,
        data: comment
      });
  });

  route.get(`/:offerId/comments`, offerExist(offersService), async (req, res) => {
    const {offerId} = req.params;
    const comments = await commentsService.findAll(offerId);
    return res
      .status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:offerId/comments/:commentId`, [offerExist(offersService), commentExist(commentsService)], async (req, res) => {
    const {commentId} = req.params;
    await commentsService.delete(commentId);
    return res
      .status(HttpCode.NO_CONTENT)
      .send(``);
  });
};
