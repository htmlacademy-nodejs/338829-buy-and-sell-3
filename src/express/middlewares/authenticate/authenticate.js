'use strict';
const jwt = require(`jsonwebtoken`);
const {axiosApi} = require(`../../axios-api/axios-api`);
const {JWT_ACCESS_SECRET} = require(`../../../constants`);

module.exports = (req, res, next) => {
  let {_ac: accessToken, _rf: refreshToken} = req.cookies;

  if (accessToken && refreshToken) {
    return jwt.verify(accessToken, JWT_ACCESS_SECRET, async (err, userData) => {
      if (err) {
        try {
          const {accessToken: acToken, refreshToken: refToken} = await axiosApi.refresh(refreshToken);
          res.cookie(`_ac`, acToken);
          res.cookie(`_rf`, refToken);

          res.locals.auth = {
            isAuth: true,
            userData,
            accessToken: acToken,
            refreshToken: refToken
          };
          return next();
        } catch (error) {
          res.clearCookie(`_ac`);
          res.clearCookie(`_rf`);
          res.locals.auth = {isAuth: false, userData: {}, accessToken, refreshToken};
          return next();
        }
      }

      res.locals.auth = {isAuth: true, userData, accessToken, refreshToken};
      return next();
    });
  }

  res.locals.auth = {isAuth: false, userData: {}, accessToken, refreshToken};
  return next();
};
