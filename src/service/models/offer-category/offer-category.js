'use strict';

const {Model} = require(`sequelize`);
const Aliase = require(`../aliase`);

class OfferCategory extends Model { }

module.exports = (sequelize) => {
  return OfferCategory.init({}, {
    sequelize,
    tableName: Aliase.OFFER_CATEGORIES
  });
};
