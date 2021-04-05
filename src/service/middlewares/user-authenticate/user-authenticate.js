'use strict';

const {HttpCode, LoginMessage} = require(`../../../constants`);

module.exports = (usersService) => async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const existUser = await usersService.findByEmail(email);
    if (!existUser) {
      return res
        .status(HttpCode.FORBIDDEN)
        .json({message: [`"email" ${LoginMessage.USER_NOT_EXISTS}`]});
    }

    const checkUserPw = await usersService.checkUser(existUser, password);
    if (!checkUserPw) {
      return res
        .status(HttpCode.FORBIDDEN)
        .json({message: [`"password" ${LoginMessage.WRONG_PASSWORD}`]});
    }

    res.locals.user = existUser.dataValues;
    return next();
  } catch (error) {
    return next(error);
  }
};
