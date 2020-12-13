'use strict';

const chalk = require(`chalk`);
const http = require(`http`);
const fs = require(`fs`).promises;

const {
  FILE_MOCK_PATH,
  DEFAULT_PORT,
  CliCommand,
  HttpCode
} = require(`../../constans`);

const {checkNumParam} = require(`../../utils`);

const startHttpServer = (port) => {
  http.createServer(onClientConnect)
    .listen(port)
    .on(`listening`, (err) => {
      if (err) {
        return console.info(chalk.red(`[http]: Ошибка при создании сервера`, err));
      }

      return console.info(chalk.green(`[http]: Ожидаю соединений на ${port}`));
    });
};

const onClientConnect = async (req, res) => {
  const sendNotFound = () => {
    sendResponse(res, HttpCode.NOT_FOUND, `<h1>Not found</h1>`);
  };

  switch (req.url) {
    case `/`:
      try {
        const content = await fs.readFile(FILE_MOCK_PATH, `utf-8`);
        const mocks = JSON.parse(content);

        const template = mocks.map((post) => `<li>${post.title}</li>`).join(``);
        sendResponse(res, HttpCode.OK, `<ul>${template}</ul>`);
      } catch (error) {
        console.info(chalk.red(error));
        sendNotFound();
      }
      break;

    default:
      sendNotFound();
      break;
  }
};

const sendResponse = (res, statusCode, template) => {
  const html = (`
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>Node Http Server</title>
      </head>
      <body>${template}</body>
    </html>
  `).trim();

  res.statusCode = statusCode;
  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  res.end(html);
};

module.exports = {
  name: CliCommand.SERVER,
  run(args = []) {
    const [userPort] = args;
    const port = checkNumParam(userPort, DEFAULT_PORT);
    startHttpServer(port);
  }
};
