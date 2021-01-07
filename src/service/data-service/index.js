'use strict';

const CategoryService = require(`./category-service/category-service`);
const OffersService = require(`./offers-service/offers-service`);
const CommentsService = require(`./comments-service/comments-service`);
const SearchService = require(`./search-service/search-service`);

module.exports = {
  CategoryService,
  OffersService,
  CommentsService,
  SearchService
};
