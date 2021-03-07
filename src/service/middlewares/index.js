'use strict';

const joiValidator = require(`./joi-validator/joi-validator`);
const offerExist = require(`./offer-exist/offer-exist`);
const commentExist = require(`./comment-exist/comment-exist`);
const requestLogger = require(`./request-logger/request-logger`);

const {
  offerSchema,
  commentSchema,
  idSchema
} = require(`../schemes`);

module.exports = {
  requestLogger,
  offerExist: offerExist(idSchema),
  commentExist: commentExist(idSchema),
  offerValidator: joiValidator(offerSchema),
  commentValidator: joiValidator(commentSchema),
};
