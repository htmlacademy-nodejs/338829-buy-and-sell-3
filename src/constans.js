'use strict';

const USER_ARGV_INDEX = 2;
const DEFAULT_GENERATE_COUNT = 1;
const MOCK_FILE_NAME = `mocks.json`;
const MAX_MOCK_ITEMS = 1000;

const MOCK_TITLES = [
  `Продам книги Стивена Кинга.`,
  `Продам новую приставку Sony Playstation 5.`,
  `Продам отличную подборку фильмов на VHS.`,
  `Куплю антиквариат.`,
  `Куплю породистого кота.`,
  `Продам коллекцию журналов «Огонёк».`,
  `Отдам в хорошие руки подшивку «Мурзилка».`,
  `Продам советскую посуду. Почти не разбита.`,
  `Куплю детские санки.`
];

const MOCK_SENTENCES = [
  `Товар в отличном состоянии.`,
  `Пользовались бережно и только по большим праздникам.,`,
  `Продаю с болью в сердце...`,
  `Бонусом отдам все аксессуары.`,
  `Даю недельную гарантию.`,
  `Если товар не понравится — верну всё до последней копейки.`,
  `Это настоящая находка для коллекционера!`,
  `Если найдёте дешевле — сброшу цену.`,
  `Таких предложений больше нет!`,
  `Две страницы заляпаны свежим кофе.`,
  `При покупке с меня бесплатная доставка в черте города.`,
  `Кажется, что это хрупкая вещь.`,
  `Мой дед не мог её сломать.`,
  `Кому нужен этот новый телефон, если тут такое...`,
  `Не пытайтесь торговаться. Цену вещам я знаю.`
];

const MOCK_CATEGORIES = [
  `Книги`,
  `Разное`,
  `Посуда`,
  `Игры`,
  `Животные`,
  `Журналы`,
];

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

const CliCommand = {
  HELP: `--help`,
  VERSION: `--version`,
  GENERATE: `--generate`
};

const ExitCode = {
  FATAL_EXCEPTION: 1
};

const DEFAULT_CLI_COMMAND = CliCommand.HELP;

module.exports = {
  USER_ARGV_INDEX,
  DEFAULT_CLI_COMMAND,
  DEFAULT_GENERATE_COUNT,
  MOCK_FILE_NAME,
  MOCK_TITLES,
  MOCK_SENTENCES,
  MOCK_CATEGORIES,
  MAX_MOCK_ITEMS,
  OfferType,
  SumRestrict,
  PictureRestrict,
  SentencesRestrict,
  CliCommand,
  ExitCode
};
