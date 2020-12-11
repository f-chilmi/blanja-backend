const { User, User_balance, Product, Product_rating, Category } = require('../models')
const response = require('../helpers/response')
const {pagination} = require('../helpers/pagination')
const { Op } = require("sequelize")
const {APP_URL} = process.env

module.exports = {
  show: async (req, res) => {
    try {
      const categories = await Category.findAll()
      response(res, 'Category list', {categories}, 200, true)
    } catch (e) {
      if (e.errors) {
        return response(res, e.errors[0].message, {}, 500, false)
      }
      return response(res, e.message, {}, 500, false)
    }
  }
}