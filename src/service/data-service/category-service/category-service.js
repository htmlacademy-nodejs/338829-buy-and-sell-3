'use strict';

class CategoryService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll() {
    const categories = new Set();
    this._offers.forEach((offer) => {
      offer.category.forEach((category) => {
        categories.add(category);
      });
    });
    return [...categories];
  }
}

module.exports = CategoryService;
