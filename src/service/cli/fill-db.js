'use strict';

const chalk = require(`chalk`);
const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);

const {
  CliCommand,
  DEFAULT_GENERATE_COUNT,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
  MAX_MOCK_ITEMS,
  MAX_CATEGORIES,
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
  checkNumParam,
  getPictureFileName,
  readContent
} = require(`../../utils`);


const generateComments = ({count, comments, offerId}) => {
  return Array(count).fill({}).map(() => ({
    offerId,
    text: shuffle(comments).slice(0, getRandomInt(CommentsRestrict.MIN, CommentsRestrict.MAX)).join(` `),
  }));
};

const generateOffers = ({count, titles, categories, sentences, comments}) => {
  return Array(count).fill({}).map((_, index) => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    description: shuffle(sentences).slice(SentencesRestrict.MIN, SentencesRestrict.MAX).join(` `),
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    categories: shuffle(categories).slice(0, getRandomInt(1, MAX_CATEGORIES)),
    comments: generateComments({
      count: getRandomInt(1, MAX_COMMENTS),
      comments,
      offerId: index + 1,
    })
  }));
};

module.exports = {
  name: CliCommand.FILL_DB,
  async run(args = []) {
    const logger = getLogger({name: `db`});
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(ExitCode.FATAL_EXCEPTION);
    }

    logger.info(`Connection to database established`);

    const [userCount] = args;
    const countOffer = checkNumParam(userCount, DEFAULT_GENERATE_COUNT);

    if (countOffer > MAX_MOCK_ITEMS) {
      console.info(chalk.red(`Не больше ${MAX_MOCK_ITEMS} объявлений`));
      return;
    }

    const {Category, Offer} = defineModels(sequelize);
    await sequelize.sync({force: true});

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

    await Category.bulkCreate(categories.map((item) => ({name: item})));

    const offerPromises = offers.map(async (offer) => {
      const offerModel = await Offer.create(offer, {include: [Aliase.COMMENTS]});
      const categoryIds = offer.categories.map((_it, i) => i + 1);
      await offerModel.addCategories(categoryIds);
    });

    await Promise.all(offerPromises);
  }
};
