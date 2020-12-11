const { User, User_balance, Product, Product_rating, Cart, User_address, Transaction, Transaction_detail } = require('../models')
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
      console.log(cartList.length)
      if (cartList.length) {
        // const total = cartList.map(item => item.price * item.quantity)
        // cartList = cartList.map(item => {
        //   return {
        //     ...item,
        //     total: item.price * item.quantity
        //   }
        // })
        // const add = (accumulator, currentValue) => accumulator + currentValue
        // const shippingCost = 10000
        // const totalPrice = total.reduce(add)
        // const totalAll = shippingCost + totalPrice

        response(res, 'Checkout page', { 
          data : {
            PrimaryAddress,
            cartList,
          },
          // 'shipping cost': shippingCost,
          // 'total price': totalPrice,
          // total: totalAll  
        }, 200, true)
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
  showOrder: async (req, res) => {
    try {
      const { id } = req.user
      const order = await Transaction.findAll({
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
  balance: async (req, res) => {
    try {
      const { id } = req.user
      const showBalance = await User_balance.findAll({
        where: { id_user: id }
      })

      response(res, 'Info', {showBalance}, 200, true)
    //   const { id } = req.user
    // showAddressPrimaryModel(id, address => {
    //   showCartListModel(id, product => {
    //     const total = product.map(item => item.price * item.quantity)
    //     product = product.map(item => {
    //       return {
    //         ...item,
    //         total: item.price * item.quantity
    //       }
    //     })
    //     const add = (accumulator, currentValue) => accumulator + currentValue
    //     const shippingCost = 10000
    //     const totalPrice = total.reduce(add)
    //     const totalAll = shippingCost + totalPrice
    //     showSaldoUserModel(id, result => {
    //       // console.log(result[0].saldo)
    //       if (result[0].saldo > totalAll) {
    //         res.send({
    //           success: true,
    //           message: 'pay with blanjaCash',
    //           saldo: result[0].saldo,
    //           total: totalAll
    //         })
    //       } else {
    //         res.status(200).send({
    //           success: true,
    //           message: 'blanjaCash balance is not enough. top up now',
    //           saldo: result[0].saldo,
    //           total: totalAll
    //         })
    //       }
    //     })
    //   })
    // })
    // }
    } catch (e) {
      if (e.errors) {
        return response(res, e.errors[0].message, {}, 500, false)
      }
      return response(res, e.message, {}, 500, false)
    }
  }
}