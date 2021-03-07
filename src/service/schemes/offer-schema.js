'use strict';

const Joi = require(`joi`);
const {OfferType} = require(`../../constants`);

module.exports = Joi.object({
  title: Joi.string().min(10).max(100).required(),
  picture: Joi.string().min(1).max(16).required(),
  sum: Joi.number().min(100).required(),
  type: Joi.valid(OfferType.SALE, OfferType.OFFER).required(),
  description: Joi.string().min(50).max(1000).required(),
  categories: Joi.array().items(Joi.string()).min(1).required()
});
