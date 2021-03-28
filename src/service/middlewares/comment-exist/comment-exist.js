'use strict';

const {HttpCode} = require(`../../../constants`);

module.exports = (commentsService) => async (req, res, next) => {
  try {
    const {commentId} = req.params;
    const comment = await commentsService.findOne(commentId);

    if (!comment) {
      return res
          .status(HttpCode.NOT_FOUND)
          .send(`Comment with ${commentId} not found `);
    }

    res.locals.comment = comment;
    return next();
  } catch (error) {
    return next(error);
  }
};
