'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product_rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Product_rating.belongsTo(models.Product, { foreignKey: 'id_receiver',  as: 'receiver' })
      // Product_rating.belongsTo(models.Product, { foreignKey: 'id_sender', as: 'sender' })
    }
  };
  Product_rating.init({
    id_product: DataTypes.INTEGER,
    rating: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product_rating',
  });
  return Product_rating;
};