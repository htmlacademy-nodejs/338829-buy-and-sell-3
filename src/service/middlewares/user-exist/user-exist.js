'use strict';

const {RegisterMessage, HttpCode} = require(`../../../constants`);

module.exports = (usersService) => async (req, res, next) => {
  const {body} = req;
  try {
    const userExist = await usersService.findByEmail(body.email);
    if (userExist) {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json({
          message: [`\"exist\" ${RegisterMessage.USER_ALREADY_REGISTER}`],
          data: {}
        });
    }
  } catch (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .json({
        message: [`Что-то пошло не так`],
        data: {}
      });
  }

  return next();
};
