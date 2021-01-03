'use strict';

class CategoryService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll() {
    const categories = new Set();
    this._offers.forEach((offer) => {
      categories.add(...offer.category);
    });
    return [...categories];
  }
}

module.exports = CategoryService;
