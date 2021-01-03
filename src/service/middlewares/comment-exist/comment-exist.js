'use strict';

const {HttpCode} = require(`../../../constants`);

module.exports = (commentsService) => (req, res, next) => {
  const {commentId} = req.params;
  const {offer} = res.locals;
  const comment = commentsService.findOne(offer, commentId);

  if (!comment) {
    return res
        .status(HttpCode.NOT_FOUND)
        .send(`Comment with ${commentId} not found `);
  }

  res.locals.comment = comment;
  return next();
};
