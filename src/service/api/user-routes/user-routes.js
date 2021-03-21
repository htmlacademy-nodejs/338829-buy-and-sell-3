'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../../constants`);

const {userValidator, userExits} = require(`../../middlewares`);

module.exports = (app, usersService) => {
  const route = new Router();
  app.use(`/user`, route);

  route.post(`/`, [userValidator, userExits(usersService)], async (req, res) => {
    const user = await usersService.create(req.body);

    return res
      .status(HttpCode.CREATED)
      .json({
        message: `A new user created`,
        data: user
      });
  });
};
