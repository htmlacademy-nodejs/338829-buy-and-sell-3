'use strict';

const joiValidator = require(`./joi-validator/joi-validator`);
const offerExist = require(`./offer-exist/offer-exist`);
const commentExist = require(`./comment-exist/comment-exist`);
const requestLogger = require(`./request-logger/request-logger`);
const userExits = require(`./user-exist/user-exist`);
const userAuthenticate = require(`./user-authenticate/user-authenticate`);
const authenticateJwt = require(`./authenticate-jwt/authenticate-jwt`);

const {
  offerSchema,
  commentSchema,
  offerIdSchema,
  commentIdSchema,
  userSchema,
  loginSchema
} = require(`../schemes`);

module.exports = {
  requestLogger,
  userExits,
  offerExist,
  commentExist,
  userAuthenticate,
  authenticateJwt,
  idOfferValidator: joiValidator(`params`, offerIdSchema),
  idCommentValidator: joiValidator(`params`, commentIdSchema),
  offerValidator: joiValidator(`body`, offerSchema),
  commentValidator: joiValidator(`body`, commentSchema),
  userValidator: joiValidator(`body`, userSchema),
  loginValidator: joiValidator(`body`, loginSchema)
};
