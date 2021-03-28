'use strict';

const {RegisterMessage, HttpCode} = require(`../../../constants`);

module.exports = (usersService) => async (req, res, next) => {
  try {
    const {body} = req;
    const userExist = await usersService.findByEmail(body.email);
    if (userExist) {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json({
          message: [`"exist" ${RegisterMessage.USER_ALREADY_REGISTER}`],
          data: {}
        });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
