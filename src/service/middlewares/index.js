'use strict';

const validator = require(`./validator/validator`);
const offerExist = require(`./offer-exist/offer-exist`);
const commentExist = require(`./comment-exist/comment-exist`);

module.exports = {
  offerValidator: validator([`picture`, `title`, `description`, `category`, `sum`, `type`]),
  commentValidator: validator([`text`]),
  offerExist,
  commentExist
};
