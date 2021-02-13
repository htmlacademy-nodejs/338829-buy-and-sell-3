'use strict';

const {DataTypes, Model} = require(`sequelize`);
const Aliase = require(`../aliase`);

class Category extends Model { }

module.exports = (sequelize) => {
  return Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: `Category`,
    tableName: Aliase.CATEGORIES
  });
};
