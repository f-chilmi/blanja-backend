const route = require('express').Router()
const productController = require('../controllers/product')

route.get('/', productController.show)
route.get('/:id', productController.detail)
// route.post('/refreshToken', authController.refreshToken)

module.exports = route