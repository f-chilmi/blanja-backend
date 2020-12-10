const jwt = require('jsonwebtoken')
const response = require('../helpers/response')

const { USER_KEY, SELLER_KEY } = process.env

module.exports = {
  authUser: (req, res, next) => {
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.slice(7, authorization.length)
      try {
        const verify = jwt.verify(token, USER_KEY)
        if (verify) {
          req.user = verify
          next()
        } else {
          return response(res, 'Unauthoraized', {}, 401, false)
        }
      } catch (err) {
        return response(res, err.message, {}, 500, false)
      }
    } else {
      return response(res, 'Forbidden Access', {}, 403, false)
    }
  },
  authSeller: (req, res, next) => {
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.slice(7, authorization.length)
      try {
        const verify = jwt.verify(token, SELLER_KEY)
        if (verify) {
          req.user = verify
          next()
        } else {
          return response(res, 'Unauthoraized', {}, 401, false)
        }
      } catch (err) {
        return response(res, err.message, {}, 500, false)
      }
    } else {
      return response(res, 'Forbidden Access', {}, 403, false)
    }
  },
  signAcessToken: (userId, role) => {
    return new Promise((resolve, reject) => {
      const payload = {
        userId,
        role
      }
      const secret = process.env.USER_KEY
      const options = {
      }
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err)
          reject(err)
        }
        resolve(token)
      })
    })
  },
  signRefreshToken: (userId, role) => {
    return new Promise((resolve, reject) => {
      const payload = {
        id: userId,
        role
      }
      const secret = process.env.REFRESH_TOKEN_SECRET
      const options = {
      }
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          reject(err)
        }
        resolve(token)
      })
    })
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
        if (err) return reject(err)
        const userId = payload.id
        const role = payload.role
        const data = {
          userId,
          role
        }
        resolve(data)
      })
    })
  }
}