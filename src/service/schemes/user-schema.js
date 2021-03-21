/* eslint-disable camelcase */
'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  email: Joi
    .string()
    .email({tlds: false})
    .required(),
  name: Joi
    .string()
    .required(),
  password: Joi
    .string()
    .min(6)
    .pattern(new RegExp(`^[a-zA-Z0-9]{3,30}$`))
    .required(),
  confirm_password: Joi
    .string()
    .valid(Joi.ref(`password`))
    .required(),
  avatar: Joi
    .string()
});
