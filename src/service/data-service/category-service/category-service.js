'use strict';

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
  }

  findAll() {
    console.log(this._Category);
    return this._Category.findAll({raw: true});
  }
}

module.exports = CategoryService;
