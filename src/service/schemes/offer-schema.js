'use strict';

const Joi = require(`joi`);
const {OfferType} = require(`../../constants`);

module.exports = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  picture: Joi.string().min(1).max(16).required(),
  sum: Joi.number().min(1000).max(100000).required(),
  type: Joi.valid(OfferType.SALE, OfferType.OFFER).required(),
  description: Joi.string().min(1).max(255).required(),
  categories: Joi.array().items(Joi.string()).min(1).required()
});
