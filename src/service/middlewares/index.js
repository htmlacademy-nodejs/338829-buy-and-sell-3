'use strict';

const joiValidator = require(`./joi-validator/joi-validator`);
const offerExist = require(`./offer-exist/offer-exist`);
const commentExist = require(`./comment-exist/comment-exist`);
const requestLogger = require(`./request-logger/request-logger`);
const userExits = require(`./user-exist/user-exist`);

const {
  offerSchema,
  commentSchema,
  offerIdSchema,
  commentIdSchema,
  userSchema
} = require(`../schemes`);

module.exports = {
  requestLogger,
  userExits,
  offerExist,
  commentExist,
  idOfferValidator: joiValidator(`params`, offerIdSchema),
  idCommentValidator: joiValidator(`params`, commentIdSchema),
  offerValidator: joiValidator(`body`, offerSchema),
  commentValidator: joiValidator(`body`, commentSchema),
  userValidator: joiValidator(`body`, userSchema)
};
