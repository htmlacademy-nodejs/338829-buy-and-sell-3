'use strict';

const {DataTypes, Model} = require(`sequelize`);

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
    tableName: `comments`
  });
};
