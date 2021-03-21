'use strict';

const {DataTypes, Model} = require(`sequelize`);
const Aliase = require(`../aliase`);

class User extends Model { }

module.exports = (sequelize) => {
  return User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar: DataTypes.STRING
  }, {
    sequelize,
    modelName: `User`,
    tableName: Aliase.USERS
  });
};
