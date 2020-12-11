const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const response = require('./helpers/response')

const app = express()
const { APP_PORT } = process.env

app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())

// provide static file for storing image
app.use('/uploads', express.static('assets/uploads'))

const { authUser, authSeller } = require('./middleware/auth')

const authRoutes = require('./routers/auth')
const productRoutes = require('./routers/product')
const cartRoutes = require('./routers/cart')
const userRoutes = require('./routers/user')
const checkoutRoutes = require('./routers/checkout')

app.use('/auth', authRoutes)
app.use('/public', productRoutes)
app.use('/cart', authUser, cartRoutes)
app.use('/user', authUser, userRoutes)
app.use('/checkout', authUser, checkoutRoutes)
// app.use('/job-seeker', authSeeker, jobSeekerRoutes)
// app.use('/company', authCompany, companyRoutes)

app.get('*', (req, res) => {
  response(res, 'Error route not found', {}, 404, false)
})

app.listen(APP_PORT, () => {
  console.log(`App is running on port ${APP_PORT}`)
})
