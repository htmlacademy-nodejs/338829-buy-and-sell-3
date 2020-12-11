'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;

const {
  CliCommand,
  DEFAULT_GENERATE_COUNT,
  FILE_MOCK_PATH,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  MAX_MOCK_ITEMS,
  OfferType,
  SumRestrict,
  PictureRestrict,
  SentencesRestrict,
  ExitCode
} = require(`../../constans`);

const {
  getRandomInt,
  shuffle
} = require(`../../utils`);

const getPictureFileName = (number) => {
  return number < 10 ? `item0${number}.jpg` : `item${number}.jpg`;
};

const generateOffers = ({count, titles, categories, sentences}) => {
  return Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    description: shuffle(sentences).slice(SentencesRestrict.MIN, SentencesRestrict.MAX).join(` `),
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    category: shuffle(categories).slice(getRandomInt(0, categories.length - 1)),
  }));
};

const writeOffers = async (offers) => {
  try {
    await fs.writeFile(FILE_MOCK_PATH, JSON.stringify(offers));
    console.info(chalk.green(`Данные в количестве [${offers.length}] успешно сформированы в файл ${FILE_MOCK_PATH}`));
  } catch (error) {
    console.info(chalk.red(`Ошибка при создании данных`));
    process.exit(ExitCode.FATAL_EXCEPTION);
  }
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf-8`);
    return content.split(`\n`);
  } catch (error) {
    console.info(chalk.red(error));
    return [];
  }
};

module.exports = {
  name: CliCommand.GENERATE,
  async run(args = []) {
    const [userCount] = args;
    const count = Number.parseInt(userCount, 10);
    const countOffer = count && count > 0 ? count : DEFAULT_GENERATE_COUNT;

    if (countOffer > MAX_MOCK_ITEMS) {
      console.info(chalk.red(`Не больше ${MAX_MOCK_ITEMS} объявлений`));
      return;
    }

    const [categories, sentences, titles] = await Promise.all([
      await readContent(FILE_CATEGORIES_PATH),
      await readContent(FILE_SENTENCES_PATH),
      await readContent(FILE_TITLES_PATH),
    ]);

    const offers = generateOffers({
      count: countOffer,
      categories,
      sentences,
      titles
    });

    writeOffers(offers);
  }
};
