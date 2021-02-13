'use strict';

const Aliase = require(`./aliase`);
const defineCategory = require(`./category/category`);
const defineComment = require(`./comment/comment`);
const defineOffer = require(`./offer/offer`);
const defineOfferCategory = require(`./offer-category/offer-category`);

module.exports = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Offer = defineOffer(sequelize);
  const OfferCategory = defineOfferCategory(sequelize);

  // один ко многим
  // связка оффер -> коммент
  Offer.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `offerId`});
  Comment.belongsTo(Offer, {foreignKey: `offerId`});

  // многие ко многим
  // связка оффер -> категории
  Offer.belongsToMany(Category, {through: OfferCategory, as: Aliase.CATEGORIES});
  Category.belongsToMany(Offer, {through: OfferCategory, as: Aliase.OFFERS});
  Category.hasMany(OfferCategory, {as: Aliase.OFFER_CATEGORIES});

  return {
    Category,
    Comment,
    Offer,
    OfferCategory
  };
};
