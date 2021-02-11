'use strict';

const Sequelize = require(`sequelize`);
const {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT} = process.env;

const hasIncorrectSettings = [DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT]
  .some((item) => typeof item === `undefined`);

if (hasIncorrectSettings) {
  throw new Error(`Проверь настройки DB!`);
}

module.exports = new Sequelize(
    DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: DB_PORT,
      // указываем, с какой СУБД предстоит работать
      dialect: `postgres`,
      // настройки пула соединений
      pool: {
        max: 5,
        min: 0,
        acquire: 10000,
        idle: 10000
      }
    }
);
