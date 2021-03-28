'use strict';

const offerSchema = require(`./offer-schema`);
const commentSchema = require(`./comment-schema`);
const userSchema = require(`./user-schema`);
const offerIdSchema = require(`./offer-id-scheme`);
const commentIdSchema = require(`./comment-id-scheme`);
const loginSchema = require(`./login-schema`);

module.exports = {
  offerSchema,
  commentSchema,
  offerIdSchema,
  commentIdSchema,
  userSchema,
  loginSchema
};

