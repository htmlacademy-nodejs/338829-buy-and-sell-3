'use strict';
const express = require(`express`);
const chalk = require(`chalk`);
const {DEFAULT_EXPRESS_PORT} = require(`../constans`);

const rootRouter = require(`./routes/root`);
const offersRouter = require(`./routes/offers`);
const myRouter = require(`./routes/my`);

const app = express();

app.use(`/`, rootRouter);
app.use(`/offers`, offersRouter);
app.use(`/my`, myRouter);

app.listen(DEFAULT_EXPRESS_PORT, () => {
  console.info(chalk.green(`Сервер запущен на порту: ${DEFAULT_EXPRESS_PORT}`));
});
