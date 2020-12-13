'use strict';

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

module.exports = {
  getRandomInt,
  shuffle,
  checkNumParam
};
