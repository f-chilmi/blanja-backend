const route = require('express').Router()
const authController = require('../controllers/auth')

route.post('/register', authController.register)
route.post('/login', authController.login)
// route.post('/refreshToken', authController.refreshToken)

module.exports = route