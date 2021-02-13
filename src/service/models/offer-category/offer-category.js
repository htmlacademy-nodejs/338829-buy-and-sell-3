'use strict';

const {Model} = require(`sequelize`);

class OfferCategory extends Model { }

module.exports = (sequelize) => {
  return OfferCategory .init({}, {
    sequelize,
    tableName: `offer_categories`
  });
};
