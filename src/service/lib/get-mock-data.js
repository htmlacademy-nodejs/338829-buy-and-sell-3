'use strict';

const fs = require(`fs/promises`);
const {FILE_MOCK_PATH} = require(`../../constants`);

let mockData = null;

const getMockData = async () => {
  if (mockData) {
    return mockData;
  }

  try {
    const fileContent = await fs.readFile(FILE_MOCK_PATH, `utf-8`);
    mockData = JSON.parse(fileContent);
  } catch (err) {
<<<<<<< HEAD
=======
    // console.error(err);
>>>>>>> c3f0ce2148f41958d54d3719927e75004dd310e7
    mockData = [];
  }

  return mockData;
};

module.exports = getMockData;
