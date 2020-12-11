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
  }),
  addCart: joi.object({
    id_user: joi.number().required(),
    id_product: joi.number().required(),
    quantity: joi.number().required(),
  }),
  updateUser: joi.object({
    name: joi.string(),
    phone: joi.string(),
    gender: joi.string(),
    birth: joi.string(),
    picture: joi.string(),
  }),
  addAddress: joi.object({
    id_user: joi.number().required(),
    nameAddress: joi.string().required(),
    recipientsName: joi.string().required(),
    recipientsPhone: joi.string().required(),
    address: joi.string().required(),
    postalCode: joi.string().required(),
    city: joi.string().required(),
    isPrimary: joi.bool().required(),
  }),
  editAddress: joi.object({
    id_user: joi.number(),
    nameAddress: joi.string(),
    recipientsName: joi.string(),
    recipientsPhone: joi.string(),
    address: joi.string(),
    postalCode: joi.string(),
    city: joi.string(),
    isPrimary: joi.bool(),
  }),
  addOrderValidate: joi.object({
    id_seller: joi.number().required(),
    id_user: joi.number().required(),
    id_product: joi.number().required(),
    name: joi.string().required(),
    quantity: joi.number().required(),
    price: joi.number().required(),
    total: joi.number().required(),
    picture: joi.string().required(),
  })
}