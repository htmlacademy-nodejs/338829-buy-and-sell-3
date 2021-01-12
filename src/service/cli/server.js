'use strict';

const express = require(`express`);
const routes = require(`../api`);
const {getLogger} = require(`../lib/logger`);
const {requestLogger} = require(`../middlewares`);

const {
  DEFAULT_PORT,
  API_PREFIX,
  CliCommand,
  HttpCode,
  ExitCode
} = require(`../../constants`);

const {checkNumParam} = require(`../../utils`);

const logger = getLogger({name: `api`});

const startHttpServer = (port) => {
  try {
    const app = express();
    app.use(express.json());
    app.use(requestLogger(logger));
    app.use(API_PREFIX, routes);

    app.use((req, res) => {
      logger.error(`Route not found: ${req.url}`);
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    });

    app.use((err, _req, res, _next) => {
      logger.error(`An error occurred on processing request: ${err.message}`);
      return res
        .status(HttpCode.INTERNAL_SERVER_ERROR)
        .send(`Server error`);
    });

    app.listen(port, (err) => {
      if (err) {
        return logger.error(`An error occurred on server creation: ${err.message}`);
      }

      return logger.info(`Listening to connections on ${port}`);
    });
  } catch (err) {
    logger.error(`An error occured: ${err.message}`);
    process.exit(ExitCode.FATAL_EXCEPTION);
  }
};

module.exports = {
  name: CliCommand.SERVER,
  run(args = []) {
    const [userPort] = args;
    const port = checkNumParam(userPort, DEFAULT_PORT);
    startHttpServer(port);
  }
};
