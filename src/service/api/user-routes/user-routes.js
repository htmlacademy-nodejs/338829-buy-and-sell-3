'use strict';

const jwt = require(`jsonwebtoken`);
const {Router} = require(`express`);
const {HttpCode, JWT_REFRESH_SECRET} = require(`../../../constants`);

const {
  userValidator,
  userExits,
  userAuthenticate,
  loginValidator,
  authenticateJwt
} = require(`../../middlewares`);

const jwtHelper = require(`../../lib/jwt-helper`);

module.exports = (app, usersService, tokenService) => {
  const route = new Router();
  app.use(`/user`, route);

  route.post(`/`, [userValidator, userExits(usersService)], async (req, res, next) => {
    try {
      const user = await usersService.create(req.body);

      return res
        .status(HttpCode.CREATED)
        .json({
          message: `A new user created`,
          data: user
        });
    } catch (error) {
      return next(error);
    }
  });

  route.post(`/login`, [loginValidator, userAuthenticate(usersService)], async (req, res, next) => {
    try {
      const {id, avatar} = res.locals.user;
      const {accessToken, refreshToken} = jwtHelper({id, avatar});

      await tokenService.add(refreshToken);
      return res
        .status(HttpCode.OK)
        .json({accessToken, refreshToken});
    } catch (error) {
      return next(error);
    }
  });

  route.post(`/refresh`, async (req, res, next) => {
    try {
      const {token} = req.body;
      if (!token) {
        return res
          .status(HttpCode.BAD_REQUEST)
          .send(``);
      }

      const existToken = await tokenService.find(token);
      if (!existToken) {
        return res
          .status(HttpCode.NOT_FOUND)
          .send(``);
      }

      return jwt.verify(token, JWT_REFRESH_SECRET, async (err, userData) => {
        if (err) {
          return res
            .status(HttpCode.FORBIDDEN)
            .send(``);
        }

        const {id, avatar} = userData;
        const {accessToken, refreshToken} = jwtHelper({id, avatar});

        await tokenService.delete(token);
        await tokenService.add(refreshToken);

        return res
          .status(HttpCode.OK)
          .json({accessToken, refreshToken});
      });
    } catch (error) {
      return next(error);
    }
  });

  route.delete(`/logout`, authenticateJwt, async (req, res, next) => {
    try {
      const {token} = req.body;
      if (!token) {
        return res
          .status(HttpCode.BAD_REQUEST)
          .send(``);
      }

      const existToken = await tokenService.find(token);
      if (!existToken) {
        return res
          .status(HttpCode.NOT_FOUND)
          .send(``);
      }

      await tokenService.delete(token);
      return res
        .status(HttpCode.NO_CONTENT)
        .send(``);
    } catch (error) {
      return next(error);
    }
  });
};
