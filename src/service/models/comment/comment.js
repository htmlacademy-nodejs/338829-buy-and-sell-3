'use strict';

const {DataTypes, Model} = require(`sequelize`);
const Aliase = require(`../aliase`);

class Comment extends Model { }

module.exports = (sequelize) => {
  return Comment.init({
    text: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: `Comment`,
    tableName: Aliase.COMMENTS
  });
};
