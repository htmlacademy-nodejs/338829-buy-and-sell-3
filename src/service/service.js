'use strict';

const {
  DEFAULT_CLI_COMMAND,
  USER_ARGV_INDEX
} = require(`../constants`);

const {Cli} = require(`./cli`);

const userArgs = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArgs;

if (userArgs.length === 0 || !Cli[userCommand]) {
  Cli[DEFAULT_CLI_COMMAND].run();
  return;
}

const commandArgs = userArgs.slice(1);
Cli[userCommand].run(commandArgs);
