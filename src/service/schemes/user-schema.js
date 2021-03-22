/* eslint-disable camelcase */
'use strict';

const Joi = require(`joi`);
const {RegisterMessage} = require(`../../constants`);

module.exports = Joi.object({
  email: Joi
    .string()
    .email({tlds: false})
    .required()
    .messages({
      'string.email': `\"email\" ${RegisterMessage.WRONG_EMAIL}`,
      'any.required': `\"email\" ${RegisterMessage.REQUIRED_FIELD}`
    }),
  name: Joi
    .string()
    .required()
    .messages({
      'any.required': `\"name\" ${RegisterMessage.REQUIRED_FIELD}`
    }),
  password: Joi
    .string()
    .min(6)
    .pattern(new RegExp(`^[a-zA-Z0-9]{3,30}$`))
    .required()
    .messages({
      'string.min': `\"password\" ${RegisterMessage.MIN_PASSWORD_LENGTH}`,
      'any.required': `\"password\" ${RegisterMessage.REQUIRED_FIELD}`,
      'string.pattern': `\"password\" ${RegisterMessage.BAD_PASSWORD}`
    }),
  confirm_password: Joi
    .string()
    .required()
    .valid(Joi.ref(`password`))
    .messages({
      'any.only': `\"confirm_password\" ${RegisterMessage.PASSWORDS_NOT_EQUALS}`,
      'any.required': `\"confirm_password\" ${RegisterMessage.REQUIRED_FIELD}`
    }),
  avatar: Joi
    .string().allow(null, ``)
});
