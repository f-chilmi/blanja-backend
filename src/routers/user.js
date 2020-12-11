const route = require('express').Router()
const userController = require('../controllers/user')
const upload = require('../helpers/uploads')

route.get('/', userController.show)
route.patch('/', userController.update)
route.patch('/update-picture', upload, userController.updateImage)

route.get('/address', userController.address)
route.post('/address', userController.addAddress)
route.patch('/address/edit/:id', userController.editAddress)
route.delete('/address/delete/:id', userController.delete)

module.exports = route