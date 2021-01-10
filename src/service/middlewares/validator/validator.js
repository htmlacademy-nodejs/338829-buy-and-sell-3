'use strict';

const {HttpCode} = require(`../../../constants`);

module.exports = (validKeys) => (req, res, next) => {
  const newItem = req.body;
  const keys = Object.keys(newItem);
  const keysExists = validKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    res
      .status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
  }

  next();
};
