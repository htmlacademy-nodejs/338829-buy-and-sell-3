'use strict';

const Aliase = require(`../../models/aliase`);

class OffersService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._OfferCategory = sequelize.models.OfferCategory;
  }

  async create(newOffer) {
    const offer = await this._Offer.create(newOffer);
    await offer.addCategories(newOffer.categories);
    return offer.get();
  }

  async delete(id) {
    const deletedRows = await this._Offer.destroy({
      where: {id}
    });
    return Boolean(deletedRows);
  }

  async update(id, offer) {
    const [updatedRows] = await this._Offer.update(offer, {
      where: {id}
    });
    return Boolean(updatedRows);
  }

  async findAll(hasComments) {
    const offers = await this._Offer.findAll({
      include: hasComments ? [Aliase.CATEGORIES, Aliase.COMMENTS] : [Aliase.CATEGORIES]
    });

    return {
      count: offers.length,
      offers: offers.map((item) => item.get())
    };
  }

  async findPage(limit, offset, hasComments) {
    const {count, rows} = await this._Offer.findAndCountAll({
      limit,
      offset,
      include: hasComments ? [Aliase.CATEGORIES, Aliase.COMMENTS] : [Aliase.CATEGORIES],
      distinct: true
    });

    return {
      count,
      offers: rows
    };
  }

  async findInCategory(limit, offset, catId) {
    const include = [{
      model: this._Category,
      as: Aliase.CATEGORIES,
      where: {
        id: catId
      }
    }];

    if (limit || offset) {
      const {count, rows} = await this._Offer.findAndCountAll({
        limit,
        offset,
        include,
        distinct: true
      });

      return {
        count,
        offers: rows
      };
    }

    const result = await this._Offer.findAll({include});
    const offers = result.map((it) => it.get());

    return {
      count: offers.length,
      offers
    };
  }

  findOne(id, hasComments) {
    return this._Offer.findByPk(id, {include: hasComments ? [Aliase.CATEGORIES, Aliase.COMMENTS] : [Aliase.CATEGORIES]});
  }
}

module.exports = OffersService;
