'use strict';

const chalk = require(`chalk`);
const express = require(`express`);
const offersRouter = require(`../routes/offers`);

const {
  DEFAULT_PORT,
  CliCommand,
  HttpCode
} = require(`../../constans`);

const {checkNumParam} = require(`../../utils`);

const startHttpServer = (port) => {
  const app = express();
  app.use(express.json());
  app.use(`/offers`, offersRouter);

  app.use((req, res) => {
    res.status(HttpCode.NOT_FOUND).send(`Not found`);
  });

  app.use((err, req, res, _next) => {
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
