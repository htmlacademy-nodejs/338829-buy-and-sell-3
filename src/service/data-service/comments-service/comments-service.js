'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../../constants`);

class CommentsService {
  create(offer, comment) {
    const newComment = {
      ...comment,
      id: nanoid(MAX_ID_LENGTH)
    };

    offer.comments.push(newComment);
    return newComment;
  }

  delete(offer, commentId) {
    const comment = this.findOne(offer, commentId);
    if (!comment) {
      return null;
    }

    offer.comments = offer.comments.filter((item) => item.id !== commentId);
    return comment;
  }

  findAll(offer) {
    return offer.comments;
  }

  findOne(offer, commentId) {
    return offer.comments.find((comment) => comment.id === commentId);
  }
}

module.exports = CommentsService;
