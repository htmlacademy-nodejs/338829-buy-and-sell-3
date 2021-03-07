'use strict';

const joiValidator = require(`./joi-validator/joi-validator`);
const offerExist = require(`./offer-exist/offer-exist`);
const commentExist = require(`./comment-exist/comment-exist`);
const requestLogger = require(`./request-logger/request-logger`);

const {offerSchema, commentSchema} = require(`../schemes`);

module.exports = {
  offerExist,
  commentExist,
  requestLogger,
  offerValidator: joiValidator(offerSchema),
  commentValidator: joiValidator(commentSchema),
};
