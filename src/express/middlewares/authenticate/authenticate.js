'use strict';

module.exports = (req, res, next) => {
  const {_ac: accessToken, _rf: refreshToken} = req.cookies;
  const isAuth = Boolean(accessToken) && Boolean(refreshToken);
  res.locals.auth = {isAuth, accessToken, refreshToken};
  return next();
};
