'use strict';

module.exports = (req, res, next) => {
  if (res.locals.auth.isAuth) {
    return next();
  }

  return res.redirect(`/login`);
};
