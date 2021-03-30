'use strict';

const pictureUpload = require(`./picture-upload/picture-upload`);
const authenticate = require(`./authenticate/authenticate`);
const privateRoute = require(`./private-route/private-route`);

module.exports = {
  pictureUpload,
  authenticate,
  privateRoute
};
