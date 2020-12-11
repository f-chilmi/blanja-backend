const { User, User_balance, Product, Product_rating, Category } = require('../models')
const response = require('../helpers/response')
const {pagination} = require('../helpers/pagination')
const { Op } = require("sequelize")
const sequelize = require('sequelize')
const {APP_URL} = process.env

module.exports = {
  show: async (req, res) => {
    try {
      let { page, limit, search, sort } = req.query
      let searchValue = ''
      let sortKey = ''
      let sortValue = ''
      if (typeof search === 'object') {
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
        include: {model: Category, as: 'Category', attributes: { exclude: ['createdAt', 'updatedAt'] }},
        attributes: {
          include: [
            [
                sequelize.literal(`(
                    SELECT AVG(rating)
                    FROM Product_ratings AS Product_rating
                    WHERE
                        id_product = Product.id
                )`),
                'rating'
            ]
          ] },
        where: {
          name: { [Op.substring]: searchValue },
        },
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [[sortKey, sortValue]]
      })

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
  },
  detail: async (req, res) => {
    try {
      const { id } = req.params
      const findDetail = await Product.findAll({
        include: {model: Category, as: 'Category', attributes: { exclude: ['createdAt', 'updatedAt'] }},
        attributes: {
          include: [
            [
                sequelize.literal(`(
                    SELECT AVG(rating)
                    FROM Product_ratings AS Product_rating
                    WHERE
                        id_product = Product.id
                )`),
                'rating'
            ]
          ] },
        where: { id: id }
      })
      console.log(findDetail)
      if (findDetail) {
        return response(res, 'Detail product', {findDetail}, 200, true)
      } else {
        return response(res, 'No product found', {}, 400, false)
      }
    } catch (e) {
      if (e.errors) {
        return response(res, e.errors[0].message, {}, 500, false)
      }
      return response(res, e.message, {}, 500, false)
    }
  }
}