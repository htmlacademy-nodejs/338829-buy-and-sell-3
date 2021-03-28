'use strict';

const bcrypt = require(`bcrypt`);
const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);
const {BCRYPT_SALT_ROUNDS} = require(`../../constants`);

module.exports = async (sequelize, {categories, offers, users = []}) => {
  // eslint-disable-next-line no-unused-vars
  const {Category, Offer, User} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(categories.map((item) => ({name: item})));

  const categoryIdByName = categoryModels.reduce((acc, next) => ({
    [next.name]: next.id,
    ...acc
  }), {});

  const offerPromises = offers.map(async (offer) => {
    const offerModel = await Offer.create(offer, {include: [Aliase.COMMENTS]});
    await offerModel.addCategories(
        offer.categories.map(
            (name) => categoryIdByName[name]
        )
    );
  });

  if (users.length) {
    const promises = users.map(async (user) => {
      const pwHash = await bcrypt.hash(user.password, BCRYPT_SALT_ROUNDS);
      return {...user, password: pwHash};
    });

    const usersBcrypt = await Promise.all(promises);
    await User.bulkCreate(usersBcrypt);
  }

  await Promise.all(offerPromises);
};
