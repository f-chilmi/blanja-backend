const { User, User_balance, Product, Product_rating, Cart, User_address, Transaction, Transaction_detail, Order } = require('../models')
const response = require('../helpers/response')
const {pagination} = require('../helpers/pagination')
const { Op } = require("sequelize")
const {APP_URL} = process.env
const {updateUser, addAddress, editAddress, addOrderValidate} = require('../helpers/validation')

module.exports = {
  show: async (req, res) => {
    try {
      const { id } = req.user

      const PrimaryAddress = await User_address.findAll({
        where: [{ id_user: id }, { isPrimary: true }]
      })
      
      const cartList = await Cart.findAll({
        where: { id_user: id }
      })
      console.log(PrimaryAddress, cartList)
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
        const shippingCost = 10000
        const totalAll = totalPrice + shippingCost

        response(res, 'Checkout page', { 
          data : {
            PrimaryAddress,
            data,
          },
          'shipping cost': shippingCost,
          'total price': totalPrice,
          total: totalAll  
        }, 200, true)
      }
      
    } catch (e) {
      if (e.errors) {
        return response(res, e.errors[0].message, {}, 500, false)
      }
      return response(res, e.message, {}, 500, false)
    }
  },
  addTransactionOrder: async (req, res) => {
    try {
      const id_user = req.user.id
      const { value, error } = addOrderValidate.validate({...req.body, id_user})
      if (error) {
        return response(res, error.message, {}, 400, false)
      }
      const transaction = {
        id_seller: value.id_seller,
        id_user: value.id_user
      }

      const addOrder = await Transaction.create(transaction)

      console.log(addOrder)

      const transactionDetail = {
        id_transaction: addOrder.dataValues.id,
        id_product: value.id_product,
        name: value.name,
        quantity: value.quantity,
        price: value.price,
        total: value.total,
        picture: value.picture
      }

      const addDetailOrder = await Transaction_detail.create(transactionDetail)

      response(res, 'Order added', {addDetailOrder}, 200, true)
      
    } catch (e) {
      if (e.errors) {
        return response(res, e.errors[0].message, {}, 500, false)
      }
      return response(res, e.message, {}, 500, false)
    }
  },
  showTransactionOrder: async (req, res) => {
    try {
      const { id } = req.user
      const order = await Transaction.findAll({
        include: {model: Transaction_detail, as: 'Transaction_detail', attributes: { exclude: ['createdAt', 'updatedAt'] }},
        where: { id_user: id }
      })

      if (order.length > 0) {
        response(res, 'Order list', {order}, 200, true)
      } else {
        response(res, 'No order', {}, 200, true)
      }

    } catch (e) {
      if (e.errors) {
        return response(res, e.errors[0].message, {}, 500, false)
      }
      return response(res, e.message, {}, 500, false)
    }
  },
  addOrder: async (req, res) => {
    try {
      const id_user = req.user.id
      const transaction = {
        id_seller: req.body.id_seller,
        id_user: id_user,
        quantity: req.body.quantity,
        total: req.body.total,
        status: req.body.status,
      }

      const addOrder = await Order.create(transaction)
      const deleteCart = await Cart.destroy({
        where: { id_user: id_user }
      })

      response(res, 'Order added', {addOrder, deleteCart}, 200, true)
      
    } catch (e) {
      if (e.errors) {
        return response(res, e.errors[0].message, {}, 500, false)
      }
      return response(res, e.message, {}, 500, false)
    }
  },
  showOrder: async (req, res) => {
    try {
      const { id } = req.user
      const order = await Order.findAll({
        where: { id_user: id }
      })

      if (order.length > 0) {
        response(res, 'Order list', {order}, 200, true)
      } else {
        response(res, 'No order found', {}, 200, true)
      }

    } catch (e) {
      if (e.errors) {
        return response(res, e.errors[0].message, {}, 500, false)
      }
      return response(res, e.message, {}, 500, false)
    }
  },
  balance: async (req, res) => {
    try {
      const { id } = req.user
      const showBalance = await User_balance.findAll({
        where: { id_user: id }
      })

      const showCart = await Cart.findAll({
        include: {model: Product, as: 'Product', attributes: { exclude: ['createdAt', 'updatedAt'] }},
        where: { id_user: id }
      })

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
      const shippingCost = 10000
      const totalAll = totalPrice + shippingCost

      console.log(showBalance[0].dataValues.balance)
      if (showBalance[0].dataValues.balance >= totalAll) {
        return response(res, 'Pay with BlanjaCash', {...showBalance[0].dataValues, totalAll}, 200, true)
      } else {
        return response(res, 'BlanjaCash is not enough', {...showBalance[0].dataValues, totalAll}, 200, true)
      }
      
    } catch (e) {
      if (e.errors) {
        return response(res, e.errors[0].message, {}, 500, false)
      }
      return response(res, e.message, {}, 500, false)
    }
  }
}