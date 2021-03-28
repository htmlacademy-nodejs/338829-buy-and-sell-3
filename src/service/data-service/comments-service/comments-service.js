'use strict';

class CommentsService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
  }

  async create(offerId, comment) {
    const newComment = await this._Comment.create({
      offerId,
      ...comment
    });
    return newComment.get();
  }

  async delete(commentId) {
    const deletedRows = await this._Comment.destroy({
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
    return this._Comment.findByPk(commentId);
  }
}

module.exports = CommentsService;
