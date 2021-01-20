'use strict';

const USER_ARGV_INDEX = 2;
const DEFAULT_GENERATE_COUNT = 1;
const DEFAULT_PORT = 3000;
const DEFAULT_EXPRESS_PORT = 8080;
const EXPRESS_PUBLIC_DIR = `public`;
const EXPRESS_UPLOAD_DIR = `upload`;

const FILE_MOCK_PATH = `mocks.json`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const FILE_API_LOG_PATH = `./src/service/logs/api.log`;

const MAX_MOCK_ITEMS = 1000;
const MAX_ID_LENGTH = 6;
const MAX_COMMENTS = 5;

const API_PREFIX = `/api`;
const API_TIMEOUT = 1000;

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const SentencesRestrict = {
  MIN: 1,
  MAX: 5,
};

const CommentsRestrict = {
  MIN: 1,
  MAX: 3,
};

const CliCommand = {
  HELP: `--help`,
  VERSION: `--version`,
  GENERATE: `--generate`,
  SERVER: `--server`
};

const ExitCode = {
  FATAL_EXCEPTION: 1
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

const LogLevel = {
  INFO: `info`,
  ERROR: `error`,
  DEBUG: `debug`
};

const NodeEnv = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const DEFAULT_CLI_COMMAND = CliCommand.HELP;

module.exports = {
  USER_ARGV_INDEX,
  DEFAULT_CLI_COMMAND,
  DEFAULT_GENERATE_COUNT,
  DEFAULT_PORT,
  DEFAULT_EXPRESS_PORT,
  EXPRESS_PUBLIC_DIR,
  EXPRESS_UPLOAD_DIR,
  FILE_MOCK_PATH,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
  MAX_MOCK_ITEMS,
  MAX_ID_LENGTH,
  MAX_COMMENTS,
  API_PREFIX,
  API_TIMEOUT,
  FILE_API_LOG_PATH,
  OfferType,
  SumRestrict,
  PictureRestrict,
  SentencesRestrict,
  CommentsRestrict,
  CliCommand,
  ExitCode,
  HttpCode,
  LogLevel,
  NodeEnv
};
