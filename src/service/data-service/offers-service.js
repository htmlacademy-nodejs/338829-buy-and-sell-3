'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class OffersService {
  constructor(offers) {
    this._offers = offers;
  }

  create(offer) {
    const newOffer = {
      ...offer,
      id: nanoid(MAX_ID_LENGTH),
      comments: []
    };

    this._offers.push(newOffer);
    return newOffer;
  }

  delete(id) {
    const offer = this.findOne(id);
    if (!offer) {
      return null;
    }

    this._offers = this._offers.filter((item) => item.id !== id);
    return offer;
  }

  update(id, offer) {
    const oldOffer = this.findOne(id);

    const updateOffer = {
      ...oldOffer,
      ...offer
    };

    this._offers = this._offers.map((item) => {
      if (item.id === id) {
        return updateOffer;
      }

      return item;
    });

    return updateOffer;
  }

  findAll() {
    return this._offers;
  }

  findOne(id) {
    return this._offers.find((offer) => offer.id === id);
  }
}

module.exports = OffersService;
