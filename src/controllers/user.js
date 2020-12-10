const { User, User_balance, Product, Product_rating, Cart, User_address } = require('../models')
const response = require('../helpers/response')
const {pagination} = require('../helpers/pagination')
const { Op } = require("sequelize")
const {APP_URL} = process.env
const {updateUser, addAddress} = require('../helpers/validation')

module.exports = {
  show: async (req, res) => {
    try {
      const { id } = req.user
      const detail = await User.findAll({
        attributes: { exclude: 'password' },
        where: { id: id }
      })
      return response(res, 'User detail', {detail}, 200, true)
    } catch (e) {
      if (e.errors) {
        return response(res, e.errors[0].message, {}, 500, false)
      }
      return response(res, e.message, {}, 500, false)
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.user
      const { value, error } = updateUser.validate(req.body)
      if (error) {
        return response(res, error.message, {}, 400, false)
      }
      const data = {
        name: value.name,
        phone: value.phone,
        gender: value.gender,
        birth: value.birth
      }
      const find = await User.findByPk(id)
      await find.update(data)
      
      return response(res, 'User info updated', {}, 200, true)
    } catch (e) {
      if (e.errors) {
        return response(res, e.errors[0].message, {}, 500, false)
      }
      return response(res, e.message, {}, 500, false)
    }
  },
  updateImage: async (req, res) => {
    try {
      const {id} = req.user
      
      const picture = `uploads/${req.files[0].filename}`
      const updatePic = await User.update({ picture: picture }, {
        where: { id: id }
      })
      console.log(req.files[0].filename)
      response(res, 'User updated', {updatePic}, 200, true)
    } catch (e) {
      if (e.errors) {
        return response(res, e.error[0].message, {}, 500, false)
      } 
      return response(res, e.message, {}, 500, false)
    }
  },
  address: async (req, res) => {
    try {
      const {id} = req.user
      
      const find = await User_address.findAll({
        where: { id_user: id }
      })
      if (find) {
        response(res, 'Address user', {find}, 200, true)
      } else {
        response(res, 'No address found', {}, 200, true)
      }
      
    } catch (e) {
      if (e.errors) {
        return response(res, e.error[0].message, {}, 500, false)
      } 
      return response(res, e.message, {}, 500, false)
    }
  },
  addAddress: async (req, res) => {
    try {
      const id_user = req.user.id
      const { value, error } = addAddress.validate({...req.body, id_user})
      if (error) {
        return response(res, error.message, {}, 400, false)
      }
      const newAddress = await User_address.create(value)
      if (newAddress) {
        return response(res, 'New address added', {newAddress}, 200, true)
      } else {
        return response(res, 'Failed add new address', {}, 400, false)
      }
    } catch (e) {
      if (e.errors) {
        return response(res, e.error[0].message, {}, 500, false)
      } 
      return response(res, e.message, {}, 500, false)
    }
  }
}