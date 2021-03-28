'use strict';

const {HttpCode} = require(`../../../constants`);

module.exports = (offersService) => async (req, res, next) => {
  try {
    const {offerId} = req.params;
    const hasComments = Boolean(req.query.comments);
    const offer = await offersService.findOne(offerId, hasComments);

    if (!offer) {
      return res
          .status(HttpCode.NOT_FOUND)
          .send(`Offer with ${offerId} not found`);
    }

    res.locals.offer = offer;
    return next();
  } catch (error) {
    return next(error);
  }
};
