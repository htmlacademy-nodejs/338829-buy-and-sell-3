'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  offerId: Joi.number().integer().positive().required(),
  commentId: Joi.number().integer().positive()
});

