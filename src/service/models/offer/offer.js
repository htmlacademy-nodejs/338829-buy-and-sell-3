'use strict';

const {DataTypes, Model} = require(`sequelize`);

class Offer extends Model { }

module.exports = (sequelize) => {
  return Offer.init({
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    picture: DataTypes.STRING,
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sum: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: `Offer`,
    tableName: `offers`
  });
};
