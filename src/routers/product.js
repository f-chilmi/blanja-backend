const route = require('express').Router()
const productController = require('../controllers/product')
const categoriesController = require('../controllers/category')

route.get('/categories', categoriesController.show)
route.get('/', productController.show)
route.get('/:id', productController.detail)
// route.post('/refreshToken', authController.refreshToken)

module.exports = route