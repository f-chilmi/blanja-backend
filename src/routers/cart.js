const route = require('express').Router()
const cartController = require('../controllers/cart')

route.get('/', cartController.show)
route.patch('/', cartController.update)
route.post('/', cartController.add)
route.delete('/:id', cartController.delete)

module.exports = route