'use strict';

const {HttpCode} = require(`../../../constants`);

module.exports = (scheme) => (offerService) => async (req, res, next) => {
  const {offerId} = req.params;

  try {
    await scheme.validateAsync({id: offerId}, {abortEarly: false});

    const hasComments = Boolean(req.query.comments);
    const offer = await offerService.findOne(offerId, hasComments);

    if (!offer) {
      return res
          .status(HttpCode.NOT_FOUND)
          .send(`Offer with ${offerId} not found`);
    }

    res.locals.offer = offer;
  } catch (error) {
    const {details = []} = error;
    const text = details.map((errorText) => errorText.message).join(`, `);
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(text);
  }

  return next();
};
