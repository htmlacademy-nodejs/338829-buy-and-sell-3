'use strict';

const {HttpCode} = require(`../../../constants`);

module.exports = (scheme) => async (req, res, next) => {
  const {commentId} = req.params;

  try {
    await scheme.validateAsync({id: commentId}, {abortEarly: false});
  } catch (error) {
    const {details = []} = error;
    const text = details.map((errorText) => errorText.message).join(`, `);
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(text);
  }

  return next();
};
