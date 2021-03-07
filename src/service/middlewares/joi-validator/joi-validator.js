'use strict';

const {HttpCode} = require(`../../../constants`);

module.exports = (scheme) => async (req, res, next) => {
  const {body} = req;

  try {
    await scheme.validateAsync(body, {abortEarly: false});
  } catch (error) {
    const {details = []} = error;

    return res
      .status(HttpCode.BAD_REQUEST)
      .json({
        message: details.map((errorText) => errorText.message),
        data: body
      });
  }

  return next();
};
