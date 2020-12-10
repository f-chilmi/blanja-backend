const { User, User_balance } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { USER_KEY, TOKEN_EXP } = process.env
const response = require('../helpers/response')
const {
  registerUser,
  loginUser
} = require('../helpers/validation')
const { verifyRefreshToken, signRefreshToken, signAcessToken } = require('../middleware/auth')

module.exports = {
  register: async (req, res) => {
    try {
      const { value, error } = registerUser.validate(req.body)
      if (error) {
        return response(res, error.message, {}, 400, false)
      }
      let { name, email, password } = value
      password = await bcrypt.hash(password, await bcrypt.genSalt())

      const findEmail = await User.findAll({ where: { email } })
      if (findEmail.length>0) {
        
        response(res, 'Email has been registered', {}, 400, false)

      } else {
        const users = { email, password }

        const createUser = await User.create(users)
        if (createUser) {
          const balance = { id_user: createUser.id, balance: 100000 }

          const addBalance = await User_balance.create(balance)
          if (addBalance) {
            return response(
              res,
              'User created!',
              { data: { id: createUser.id, email, name } },
              201
            )
          } else {
            return response(res, 'Failed to create user', {}, 400, false)
          }
        }
      }

      
    } catch (e) {
      if (e.errors) {
        return response(res, e.errors[0].message, {}, 500, false)
      }
      return response(res, e.message, {}, 500, false)
    }
  },
  login: async (req, res) => {
    try {
      const { value, error } = loginUser.validate(req.body)
      if (error) {
        return response(res, error.message, {}, 400, false)
      }
      const { email, password } = value

      const find = await User.findOne({ where: { email } })
      if (find) {
        const compared = await bcrypt.compare(password, find.password)
        if (compared) {
          jwt.sign(
            { id: find.id },
            USER_KEY ,
            { expiresIn: TOKEN_EXP },
            (err, token) => {
              if (err) {
                return response(res, err.message, 500, false)
              } else {
                return response(res, 'Login successfully', {
                  token
                })
              }
            }
          )
        } else {
          return response(res, 'Wrong email or password', {}, 400, false)
        }
      } else {
        return response(res, 'Wrong email or password', {}, 400, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  resetPassword: async (req, res) => {},
  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body
      if (refreshToken === undefined) {
        return response(res, 'Unauthorize', {}, 401, false)
      }
      const data = await verifyRefreshToken(refreshToken)
      console.log(data)
      const accessToken = await signAcessToken(data.id, data.role)
      const refresToken = await signRefreshToken(data.id, data.role)
      return response(res, 'Succesfully', { accessToken, refresToken })
    } catch (error) {
      console.log(error)
    }
  }
}