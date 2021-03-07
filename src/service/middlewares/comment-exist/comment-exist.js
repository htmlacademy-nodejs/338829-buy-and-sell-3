'use strict';

const {HttpCode} = require(`../../../constants`);

module.exports = (scheme) => (commentsService) => async (req, res, next) => {
  const {commentId} = req.params;
  try {
    await scheme.validateAsync({id: commentId}, {abortEarly: false});
    const comment = await commentsService.findOne(commentId);

    if (!comment) {
      return res
          .status(HttpCode.NOT_FOUND)
          .send(`Comment with ${commentId} not found `);
    }

    res.locals.comment = comment;
  } catch (error) {
    const {details = []} = error;
    const text = details.map((errorText) => errorText.message).join(`, `);
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(text);
  }

  return next();
};
