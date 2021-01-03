'use strict';

const chalk = require(`chalk`);
const express = require(`express`);
const routes = require(`../api`);

const {
  DEFAULT_PORT,
  API_PREFIX,
  CliCommand,
  HttpCode
} = require(`../../constants`);

const {checkNumParam} = require(`../../utils`);

const startHttpServer = (port) => {
  const app = express();
  app.use(express.json());
  app.use(API_PREFIX, routes);

  app.use((req, res) => {
    res.status(HttpCode.NOT_FOUND).send(`Not found`);
  });

  app.use((err, req, res, _next) => {
    console.error(err);
    res.status(HttpCode.INTERNAL_SERVER_ERROR).send(`Server error`);
  });

  app.listen(port, () => {
    console.info(chalk.green(`[Api]: Ожидаю соединений на ${port}`));
  });
};

module.exports = {
  name: CliCommand.SERVER,
  run(args = []) {
    const [userPort] = args;
    const port = checkNumParam(userPort, DEFAULT_PORT);
    startHttpServer(port);
  }
};
