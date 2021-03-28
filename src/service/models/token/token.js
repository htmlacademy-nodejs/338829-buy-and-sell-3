'use strict';

const {DataTypes, Model} = require(`sequelize`);
const Aliase = require(`../aliase`);

class Token extends Model { }

module.exports = (sequelize) => {
  return Token.init({
    refresh: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
  }, {
    sequelize,
    modelName: `Token`,
    tableName: Aliase.TOKENS
  });
};
