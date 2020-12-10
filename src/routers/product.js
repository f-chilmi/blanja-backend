const route = require('express').Router()
const productController = require('../controllers/product')

route.get('/', productController.show)
// route.post('/refreshToken', authController.refreshToken)

module.exports = route