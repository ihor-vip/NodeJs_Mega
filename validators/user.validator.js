const Joi = require('joi')

const { constants } = require('../constants');

const newUserJoiSchema = Joi.object({
  name: Joi.string().alphanum().min(2).max(50).trim(),
  email: Joi.string().regex(constants.EMAIL_REGEXP).required().trim().lowercase(),
  phone: Joi.string().regex(constants.PHONE_REGEXP).required().trim(),
  age: Joi.number().integer().min(6),
  password: Joi.string().regex(constants.PASSWORD_REGEXP).required()
});

module.exports = {
  newUserJoiSchema
}
