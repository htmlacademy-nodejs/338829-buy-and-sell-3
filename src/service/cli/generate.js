'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);

const {
  CliCommand,
  DEFAULT_GENERATE_COUNT,
  FILE_MOCK_PATH,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
  MAX_MOCK_ITEMS,
  MAX_ID_LENGTH,
  MAX_COMMENTS,
  OfferType,
  SumRestrict,
  PictureRestrict,
  SentencesRestrict,
  CommentsRestrict,
  ExitCode
} = require(`../../constants`);

const {
  getRandomInt,
  shuffle,
  checkNumParam
} = require(`../../utils`);

const getPictureFileName = (number) => {
  return number < 10 ? `item0${number}.jpg` : `item${number}.jpg`;
};

const generateComments = (count, comments) => {
  return Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments).slice(0, getRandomInt(CommentsRestrict.MIN, CommentsRestrict.MAX)).join(` `),
  }));
};

const generateOffers = ({count, titles, categories, sentences, comments}) => {
  return Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomInt(0, titles.length - 1)],
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    description: shuffle(sentences).slice(SentencesRestrict.MIN, SentencesRestrict.MAX).join(` `),
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    category: shuffle(categories).slice(getRandomInt(0, categories.length - 1)),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
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
    return content.trim().split(`\n`);
  } catch (error) {
    console.info(chalk.red(error));
    return [];
  }
};

module.exports = {
  name: CliCommand.GENERATE,
  async run(args = []) {
    const [userCount] = args;
    const countOffer = checkNumParam(userCount, DEFAULT_GENERATE_COUNT);

    if (countOffer > MAX_MOCK_ITEMS) {
      console.info(chalk.red(`Не больше ${MAX_MOCK_ITEMS} объявлений`));
      return;
    }

    const [categories, sentences, titles, comments] = await Promise.all([
      readContent(FILE_CATEGORIES_PATH),
      readContent(FILE_SENTENCES_PATH),
      readContent(FILE_TITLES_PATH),
      readContent(FILE_COMMENTS_PATH)
    ]);

    const offers = generateOffers({
      count: countOffer,
      categories,
      sentences,
      titles,
      comments
    });

    writeOffers(offers);
  }
};
