'use strict';

const {Op} = require(`sequelize`);
const Aliase = require(`../../models/aliase`);

class SearchService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
  }

  async findOffers(queryValue) {
    const offers = await this._Offer.findAll({
      where: {
        title: {
          [Op.substring]: queryValue
        }
      },
      include: [Aliase.CATEGORIES],
    });

    console.log(offers);
    return offers.map((offer) => offer.get());
  }
}

module.exports = SearchService;
