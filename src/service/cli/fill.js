'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;

const {
  CliCommand,
  DEFAULT_GENERATE_COUNT,
  FILE_SQL_PATH,
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
  getPictureFileName
} = require(`../../utils`);


const generateComments = ({count, comments, offerId, userCount}) => {
  return Array(count).fill({}).map(() => ({
    offerId,
    userId: getRandomInt(1, userCount),
    text: shuffle(comments).slice(0, getRandomInt(CommentsRestrict.MIN, CommentsRestrict.MAX)).join(` `),
  }));
};

const generateOffers = ({count, titles, categories, sentences, comments, userCount}) => {
  return Array(count).fill({}).map((_, index) => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    description: shuffle(sentences).slice(SentencesRestrict.MIN, SentencesRestrict.MAX).join(` `),
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    category: shuffle(categories).slice(0, getRandomInt(1, MAX_CATEGORIES)),
    comments: generateComments({
      count: getRandomInt(1, MAX_COMMENTS),
      comments,
      offerId: index + 1,
      userCount
    }),
    userId: getRandomInt(1, userCount)
  }));
};

const writeOffers = async ({offers, users, categories}) => {
  try {
    const comments = offers.flatMap((offer) => offer.comments);

    const offerCategories = [];
    offers.forEach((offer, index) => {
      const offerId = index + 1;
      offer.category.forEach((category) => {
        offerCategories.push({
          offerId,
          categoryId: categories.indexOf(category)
        });
      });
    });

    const userValues = users.map((user) => {
      const {email, passwordHash, firstName, lastName, avatar} = user;
      return `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`;
    });

    const categoryValues = categories.map((name) => `('${name}')`);

    const offerValues = offers.map((offer) => {
      const {title, description, type, sum, picture, userId} = offer;
      return `('${title}', '${description}', '${type}', ${sum}, '${picture}', ${userId})`;
    });

    const offerCategoryValues = offerCategories.map(({offerId, categoryId}) => {
      return `(${offerId}, ${categoryId})`;
    });

    const commentValues = comments.map((comment) => {
      const {text, userId, offerId} = comment;
      return `('${text}', ${userId}, ${offerId})`;
    });

    const insertValues = (values) => values.join(`,\n`);

    const content = (`
-- Add users
INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
${insertValues(userValues)};

-- Add categories
INSERT INTO categories(name) VALUES
${insertValues(categoryValues)};

-- Add offers
ALTER TABLE offers DISABLE TRIGGER ALL;

INSERT INTO offers(title, description, type, sum, picture, user_id) VALUES
${insertValues(offerValues)};

ALTER TABLE offers ENABLE TRIGGER ALL;

-- Add offer categories
ALTER TABLE offer_categories DISABLE TRIGGER ALL;

INSERT INTO offer_categories(offer_id, category_id) VALUES
${insertValues(offerCategoryValues)};

ALTER TABLE offer_categories ENABLE TRIGGER ALL;

-- Add comments
ALTER TABLE comments DISABLE TRIGGER ALL;

INSERT INTO COMMENTS(text, user_id, offer_id) VALUES
${insertValues(commentValues)};

ALTER TABLE comments ENABLE TRIGGER ALL;
-- end
    `).trim();

    await fs.writeFile(FILE_SQL_PATH, content);
    console.info(chalk.green(`Данные в количестве [${offers.length}] успешно сформированы в файл ${FILE_SQL_PATH}`));
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
  name: CliCommand.FILL,
  async run(args = []) {
    const [userCount] = args;
    const countOffer = checkNumParam(userCount, DEFAULT_GENERATE_COUNT);

    if (countOffer > MAX_MOCK_ITEMS) {
      console.info(chalk.red(`Не больше ${MAX_MOCK_ITEMS} объявлений`));
      return;
    }

    const users = [
      {
        email: `ivanov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Иван`,
        lastName: `Иванов`,
        avatar: `avatar1.jpg`
      },
      {
        email: `petrov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Пётр`,
        lastName: `Петров`,
        avatar: `avatar2.jpg`
      }
    ];

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
      comments,
      userCount: users.length
    });

    writeOffers({offers, users, categories});
  }
};
