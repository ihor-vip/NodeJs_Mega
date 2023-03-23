const Joi = require('joi')

const { constants } = require('../constants');

const userCarSubSchema = Joi.object({
  model: Joi.string()
})

const newUserJoiSchema = Joi.object({
  name: Joi.string().alphanum().min(2).max(50).trim(),
  email: Joi.string().regex(constants.EMAIL_REGEXP).required().trim().lowercase(),
  age: Joi.number().integer().min(6),
  password: Joi.string().regex(constants.PASSWORD_REGEXP).required(),
  cars: Joi.array().items(userCarSubSchema, Joi.string())
    .when('girl', { is: true, then: Joi.required() }),
  girl: Joi.boolean()
});

module.exports = {
  newUserJoiSchema
}
