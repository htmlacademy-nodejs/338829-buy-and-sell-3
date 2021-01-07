'use strict';

class SearchService {
  constructor(offers) {
    this._offers = offers;
  }

  filter(queryValue) {
    const pattern = new RegExp(queryValue, `gi`);
    return this._offers.filter((offer) => offer.title.match(pattern));
  }
}

module.exports = SearchService;
