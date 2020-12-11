'use strict';
const {
  Model, Transaction
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Product.belongsTo(models.Category, { foreignKey: 'id_category',  as: 'Category' })
      // Transaction_detail.belongsTo(models.Transaction, { foreignKey: 'id_transaction', as: 'Transaction' })
    }
  };
  Transaction_detail.init({
    id_transaction: DataTypes.INTEGER,
    id_product: DataTypes.INTEGER,
    name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    picture: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction_detail',
  });
  return Transaction_detail;
};