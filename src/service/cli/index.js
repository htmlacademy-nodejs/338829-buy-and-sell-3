'use strict';

const help = require(`./help`);
const version = require(`./version`);
const generate = require(`./generate`);
const fill = require(`./fill`);
const filldb = require(`./fill-db`);
const server = require(`./server`);

const Cli = {
  [version.name]: version,
  [help.name]: help,
  [generate.name]: generate,
  [fill.name]: fill,
  [filldb.name]: filldb,
  [server.name]: server
};

module.exports = {
  Cli
};
