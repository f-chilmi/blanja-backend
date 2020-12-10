const route = require('express').Router()
const cartController = require('../controllers/cart')

route.get('/', cartController.show)
// route.get('/:id', productController.detail)
route.post('/', cartController.add)
route.delete('/:id', cartController.delete)

module.exports = route