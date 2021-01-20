'use strict';

const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {
  MAX_ID_LENGTH,
  EXPRESS_UPLOAD_DIR
} = require(`../../../constants`);

const uploadDirAbsolute = path.resolve(__dirname, `../../${EXPRESS_UPLOAD_DIR}/img/`);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(MAX_ID_LENGTH);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

module.exports = multer({storage});
