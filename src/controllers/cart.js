const { User, User_balance, Product, Product_rating, Cart } = require('../models')
const response = require('../helpers/response')
const {pagination} = require('../helpers/pagination')
const { Op } = require("sequelize")
const {APP_URL} = process.env
const {addCart} = require('../helpers/validation')

module.exports = {
  add: async (req, res) => {
    try {
      const id_user = req.user.id
      const { value, error } = addCart.validate({...req.body, id_user})
      if (error) {
        return response(res, error.message, {}, 400, false)
      }
      const findId = await Cart.findAll({
        where: [{ id_product: value.id_product }, { id_user: id_user }]
      })

      if (findId.length > 0) {
        console.log(findId)
        const newQty = findId[0].dataValues.quantity + parseInt(value.quantity)
        const updateCart = await Cart.update({quantity: newQty}, {
          where: [{ id_product: value.id_product }, { id_user: id_user }]
        })
        return response(res, 'Cart updated', {}, 200, true)
      } else {
        const addToCart = await Cart.create(value)
        return response(res, 'Success added to cart', {addToCart}, 200, true)
      }
      
    } catch (e) {
      if (e.errors) {
        return response(res, e.errors[0].message, {}, 500, false)
      }
      return response(res, e.message, {}, 500, false)
    }
  },
  show: async (req, res) => {
    try {
      const {id} = req.user
      const showCart = await Cart.findAll({
        include: {model: Product, as: 'Product', attributes: { exclude: ['createdAt', 'updatedAt'] }},
        where: { id_user: id }
      })
      if (showCart.length > 0) {
        const total = showCart.map(item => item.dataValues.Product.dataValues.price * item.quantity)

        let result = showCart.map(item => {
          return {
            ...item.dataValues,
            total: item.dataValues.Product.dataValues.price * item.quantity
          }
        })

        const add = (accumulator, currentValue) => accumulator + currentValue
        const totalPrice = total.reduce(add)

        const data = {
          result,
          'total price': totalPrice
        }

        return response(res, 'Cart list', { data }, 200, true)
      } else {
        return response(res, 'Your cart is empty', {}, 200, true)
      }
      
    } catch (e) {
      if (e.errors) {
        return response(res, e.errors[0].message, {}, 500, false)
      }
      return response(res, e.message, {}, 500, false)
    }
  },
  delete: async (req, res) => {
    try {
      const {id} = req.params
      console.log(id)
      const deleteCart = await Cart.destroy({
        where: { id: id }
      })
      return response(res, 'Product deleted from cart', {}, 200, true)
    } catch (e) {
      if (e.errors) {
        return response(res, e.errors[0].message, {}, 500, false)
      }
      return response(res, e.message, {}, 500, false)
    }
  },
}