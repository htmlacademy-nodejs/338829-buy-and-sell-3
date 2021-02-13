'use strict';

const validator = require(`./validator/validator`);
const offerExist = require(`./offer-exist/offer-exist`);
const commentExist = require(`./comment-exist/comment-exist`);
const requestLogger = require(`./request-logger/request-logger`);

module.exports = {
  offerValidator: validator([`picture`, `title`, `description`, `categories`, `sum`, `type`]),
  commentValidator: validator([`text`]),
  offerExist,
  commentExist,
  requestLogger
};
