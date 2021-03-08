'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const checkNumParam = (value, defaultValue) => {
  const valueNum = Number.parseInt(value, 10);
  return valueNum && valueNum > 0 ? valueNum : defaultValue;
};

const getCategoryOffer = (categories) => {
  if (Array.isArray(categories)) {
    return categories;
  }

  if (typeof categories === `string`) {
    return [categories];
  }

  return [];
};

const getPictureFileName = (number) => {
  return number < 10 ? `item0${number}.jpg` : `item${number}.jpg`;
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

const getErrorMessage = (messages = []) => {
  const errorMessage = {};

  messages.forEach((message) => {
    const regExp = new RegExp(/"(.*?)"/gi);
    const [, key] = regExp.exec(message);
    const text = message.replace(regExp, ``).trim();
    errorMessage[key] = text;
  });

  console.log(errorMessage);
  return errorMessage;
};

module.exports = {
  getRandomInt,
  shuffle,
  checkNumParam,
  getCategoryOffer,
  getPictureFileName,
  readContent,
  getErrorMessage
};
