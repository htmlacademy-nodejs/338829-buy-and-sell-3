'use strict';

class CommentsService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
  }

  create(offerId, comment) {
    return this._Comment.create({
      offerId,
      ...comment
    });
  }

  delete(commentId) {
    const deletedRows = this._Comment.destroy({
      where: {id: commentId}
    });
    return Boolean(deletedRows);
  }

  findAll(offerId) {
    return this._Comment.findAll({
      where: {offerId},
      raw: true
    });
  }

  findOne(commentId) {
    return this._Offer.findByPk(commentId);
  }
}

module.exports = CommentsService;
