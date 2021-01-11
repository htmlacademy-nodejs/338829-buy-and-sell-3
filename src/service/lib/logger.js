'use strict';

const pino = require(`pino`);
const {
  LogLevel,
  NodeEnv,
  FILE_API_LOG_PATH
} = require(`../../constants`);

const isDevMode = process.env.NODE_ENV === NodeEnv.DEVELOPMENT;

const logger = pino(
    {
      name: `base-logger`,
      level: process.env.LOG_LEVEL || LogLevel.INFO,
      prettyPrint: isDevMode
    },
    isDevMode ? process.stdout : pino.destination(FILE_API_LOG_PATH)
);

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
