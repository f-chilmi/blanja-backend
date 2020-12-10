const joi = require('joi')

module.exports = {
  registerUser: joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required().min(8),
    // confirmPassword: joi.string().required().min(8).equal(joi.ref('password'))
  }),
  loginUser: joi.object({
    email: joi.string().required(),
    password: joi.string().required().min(8),
  })
}