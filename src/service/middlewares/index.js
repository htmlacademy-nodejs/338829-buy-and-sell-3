'use strict';

const joiValidator = require(`./joi-validator/joi-validator`);
const idOfferValidator = require(`./id-offer-validator/id-offer-validator`);
const idCommentValidator = require(`./id-comment-validator/id-comment-validator`);

const offerExist = require(`./offer-exist/offer-exist`);
const commentExist = require(`./comment-exist/comment-exist`);
const requestLogger = require(`./request-logger/request-logger`);
const userExits = require(`./user-exist/user-exist`);


const {
  offerSchema,
  commentSchema,
  idSchema,
  userSchema
} = require(`../schemes`);

module.exports = {
  requestLogger,
  userExits,
  offerExist,
  commentExist,
  idOfferValidator: idOfferValidator(idSchema),
  idCommentValidator: idCommentValidator(idSchema),
  offerValidator: joiValidator(offerSchema),
  commentValidator: joiValidator(commentSchema),
  userValidator: joiValidator(userSchema)
};
