'use strict';

const jwt = require(`jsonwebtoken`);
const {HttpCode, JWT_ACCESS_SECRET} = require(`../../../constants`);

module.exports = (req, res, next) => {
  const authorization = req.headers[`authorization`];
  if (!authorization) {
    return res
      .status(HttpCode.UNAUTHORIZED)
      .send(``);
  }

  const [, token] = authorization.split(` `);
  if (!token) {
    return res
      .status(HttpCode.UNAUTHORIZED)
      .send(``);
  }

  return jwt.verify(token, JWT_ACCESS_SECRET, (err, userData) => {
    if (err) {
      return res
        .status(HttpCode.FORBIDDEN)
        .send(``);
    }

    res.locals.user = userData;
    return next();
  });
};
