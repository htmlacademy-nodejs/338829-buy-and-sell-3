'use strict';

const {HttpCode} = require(`../../../constants`);

module.exports = (key, scheme) => async (req, res, next) => {
  try {
    await scheme.validateAsync(req[key], {abortEarly: false});
  } catch (error) {
    const {details = []} = error;

    return res
      .status(HttpCode.BAD_REQUEST)
      .json({
        message: details.map((errorText) => errorText.message),
        data: req[key]
      });
  }

  return next();
};
