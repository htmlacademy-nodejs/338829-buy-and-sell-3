'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  id: Joi.number().integer().positive().required()
});

