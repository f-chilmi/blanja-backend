const route = require('express').Router()
const userController = require('../controllers/user')
const upload = require('../helpers/uploads')

route.get('/', userController.show)
route.patch('/', userController.update)
route.patch('/update-picture', upload, userController.updateImage)
// route.get('/:id', productController.detail)
// route.post('/', cartController.add)
// route.delete('/:id', cartController.delete)
route.get('/address', userController.address)
route.post('/address', userController.addAddress)

module.exports = route