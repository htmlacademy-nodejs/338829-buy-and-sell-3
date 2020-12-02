'use strict';

const help = require(`./help`);
const version = require(`./version`);
const generate = require(`./generate`);

const Cli = {
  [version.name]: version,
  [help.name]: help,
  [generate.name]: generate
};

module.exports = {
  Cli
};
