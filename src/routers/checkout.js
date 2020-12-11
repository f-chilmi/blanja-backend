const route = require('express').Router()
const checkoutRoutes = require('../controllers/checkout')

route.get('/', checkoutRoutes.show)

route.post('/order', checkoutRoutes.addOrder)
route.get('/order', checkoutRoutes.showOrder)
route.get('/balance', checkoutRoutes.balance)

module.exports = route