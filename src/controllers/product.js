const { User, User_balance, Product } = require('../models')
const response = require('../helpers/response')
const {pagination} = require('../helpers/pagination')
const {APP_URL} = process.env

module.exports = {
  show: async (req, res) => {
    try {
      let { page, limit, search, sort } = req.query
      let searchKey = 'name'
      let searchValue = ''
      let sortKey = ''
      let sortValue = ''
      if (typeof search === 'object') {
        searchKey = Object.keys(search)[0]
        searchValue = Object.values(search)[0]
      } else {
        searchValue = search || ''
      }

      if (typeof sort === 'object') {
        sortKey = Object.keys(sort)[0]
        sortValue = Object.values(sort)[0]
      } else {
        sortKey = 'id'
        sortValue = sort || 'asc' || ''
      }

      const offset = (page - 1) * limit

      const findProduct = await Product.findAndCountAll({
        offset: parseInt(offset),
        limit: parseInt(limit),
      })
      console.log(findProduct)

      const pageInfo = pagination('/public', req.query, page, limit, findProduct.count)
      const info = { findProduct, pageInfo }
      if (findProduct) {
        response(res, 'List product', {info}, 200, true)
      }
    
    } catch (e) {
      if (e.errors) {
        return response(res, e.errors[0].message, {}, 500, false)
      }
      return response(res, e.message, {}, 500, false)
    }
  }
}