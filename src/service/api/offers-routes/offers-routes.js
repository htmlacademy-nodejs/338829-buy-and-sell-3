'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../../constants`);
const {
  idOfferValidator,
  idCommentValidator,
  offerValidator,
  commentValidator,
  commentExist,
  offerExist
} = require(`../../middlewares`);

module.exports = (app, offersService, commentsService) => {
  const route = new Router();
  app.use(`/offers`, route);

  route.get(`/`, async (req, res, next) => {
    try {
      const {comments, limit, offset, catId} = req.query;
      const hasComments = Boolean(comments);

      let result;
      if (catId > 0) {
        result = await offersService.findInCategory(limit, offset, catId);
        return res
          .status(HttpCode.OK)
          .json(result);
      }

      if (limit || offset) {
        result = await offersService.findPage(limit, offset, hasComments);
      } else {
        result = await offersService.findAll(hasComments);
      }

      return res
        .status(HttpCode.OK)
        .json(result);
    } catch (error) {
      return next(error);
    }
  });

  route.post(`/`, offerValidator, async (req, res, next) => {
    try {
      const offer = await offersService.create(req.body);
      return res
        .status(HttpCode.CREATED)
        .json({
          message: `A new offer created`,
          data: offer
        });
    } catch (error) {
      return next(error);
    }
  });

  route.get(`/:offerId`, [idOfferValidator, offerExist(offersService)], (req, res) => {
    const {offer} = res.locals;
    return res
      .status(HttpCode.OK)
      .json(offer);
  });

  route.put(`/:offerId`, [idOfferValidator, offerExist(offersService), offerValidator], async (req, res, next) => {
    try {
      const {offerId} = req.params;
      const updated = await offersService.update(offerId, req.body);
      return res
        .status(HttpCode.NO_CONTENT)
        .json({
          message: `Offer ${offerId} is updated`,
          data: updated
        });
    } catch (error) {
      return next(error);
    }
  });

  route.delete(`/:offerId`, [idOfferValidator, offerExist(offersService)], async (req, res, next) => {
    try {
      const {offerId} = req.params;
      const deleted = await offersService.delete(offerId);
      return res
        .status(HttpCode.NO_CONTENT)
        .send(deleted);
    } catch (error) {
      return next(error);
    }
  });

  route.post(`/:offerId/comments`, [idOfferValidator, offerExist(offersService), commentValidator], async (req, res, next) => {
    try {
      const {offerId} = req.params;
      const comment = await commentsService.create(offerId, req.body);
      return res
        .status(HttpCode.CREATED)
        .json({
          message: `A new comment created`,
          data: comment
        });
    } catch (error) {
      return next(error);
    }
  });

  route.get(`/:offerId/comments`, [idOfferValidator, offerExist(offersService)], async (req, res, next) => {
    try {
      const {offerId} = req.params;
      const comments = await commentsService.findAll(offerId);
      return res
        .status(HttpCode.OK)
        .json(comments);
    } catch (error) {
      return next(error);
    }
  });

  route.delete(`/:offerId/comments/:commentId`,
      [idOfferValidator, offerExist(offersService), idCommentValidator, commentExist(commentsService)],
      async (req, res, next) => {
        try {
          const {commentId} = req.params;
          await commentsService.delete(commentId);
          return res
            .status(HttpCode.NO_CONTENT)
            .send(``);
        } catch (error) {
          return next(error);
        }
      });
};
