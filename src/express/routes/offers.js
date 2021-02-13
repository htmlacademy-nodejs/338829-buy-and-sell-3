'use strict';

const {Router} = require(`express`);
const {pictureUpload} = require(`../middlewares`);
const {axiosApi} = require(`../axios-api/axios-api`);
const {HttpCode} = require(`../../constants`);
const {getCategoryOffer} = require(`../../utils`);

const offersRouter = new Router();

offersRouter.get(`/category/:id`, async (req, res) => {
  const hasCount = true;

  const [offers, categories] = await Promise.all([
    axiosApi.getOffers(),
    axiosApi.getCategories(hasCount)
  ]);

  res.render(`pages/category`, {tickets: offers, categories});
});

offersRouter.get(`/add`, async (req, res) => {
  const categories = await axiosApi.getCategories();
  res.render(`pages/new-ticket`, {
    categories,
    newOffer: {
      categories: [],
      picture: `blank.png`
    }
  });
});

offersRouter.post(`/add`, pictureUpload.single(`avatar`), async (req, res) => {
  const {body, file} = req;

  const newOffer = {
    title: body.title,
    description: body.description,
    picture: file && file.filename || `blank.png`,
    sum: body.sum,
    type: body.type,
    categories: getCategoryOffer(body.categories)
  };

  try {
    await axiosApi.createOffer(newOffer);
    res.redirect(`/my`);
  } catch (e) {
    const categories = await axiosApi.getCategories();
    res.render(`pages/new-ticket`, {
      categories,
      newOffer
    });
  }
});

offersRouter.get(`/edit/:id`, async (req, res) => {
  try {
    const {id} = req.params;
    const [categories, offer] = await Promise.all([
      axiosApi.getCategories(),
      axiosApi.getOffer(id)
    ]);

    res.render(`pages/ticket-edit`, {ticket: offer, categories});
  } catch (error) {
    console.log(error);
    res
      .status(HttpCode.NOT_FOUND)
      .render(`errors/404`);
  }
});

offersRouter.get(`/:id`, async (req, res) => {
  try {
    const {id} = req.params;
    const hasComments = true;
    const offer = await axiosApi.getOffer(id, hasComments);

    res.render(`pages/ticket`, {ticket: offer});
  } catch (error) {
    res
      .status(HttpCode.NOT_FOUND)
      .render(`errors/404`);
  }
});

module.exports = offersRouter;
