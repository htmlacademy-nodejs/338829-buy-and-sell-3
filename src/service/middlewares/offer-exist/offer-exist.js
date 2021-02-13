'use strict';

const {HttpCode} = require(`../../../constants`);

module.exports = (offerService) => async (req, res, next) => {
  const {offerId} = req.params;
  const hasComments = Boolean(req.query.comments);
  const offer = await offerService.findOne(offerId, hasComments);

  if (!offer) {
    return res
        .status(HttpCode.NOT_FOUND)
        .send(`Offer with ${offerId} not found`);
  }

  res.locals.offer = offer;
  return next();
};
