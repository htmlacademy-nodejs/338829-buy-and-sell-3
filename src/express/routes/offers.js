'use strict';

const {Router} = require(`express`);
const {pictureUpload} = require(`../middlewares`);
const {axiosApi} = require(`../axios-api/axios-api`);
const {HttpCode} = require(`../../constants`);
const {getCategoryOffer} = require(`../../utils`);

const offersRouter = new Router();

offersRouter.get(`/category/:id`, (req, res) => res.render(`pages/category`));

offersRouter.get(`/add`, async (req, res) => {
  const categories = await axiosApi.getCategories();
  res.render(`pages/new-ticket`, {
    categories,
    newOffer: {
      category: [],
      picture: ``
    }
  });
});

offersRouter.post(`/add`, pictureUpload.single(`avatar`), async (req, res) => {
  const {body, file} = req;

  const newOffer = {
    picture: file && file.filename,
    sum: body.price,
    type: body.action,
    description: body.comment,
    title: body[`ticket-name`],
    category: getCategoryOffer(body)
  };

  try {
    await axiosApi.createOffer(newOffer);
    res.redirect(`/my`);
  } catch (e) {
    const categories = await axiosApi.getCategories();
    res.render(`pages/new-ticket`, {categories, newOffer});
  }
});

offersRouter.get(`/edit/:id`, async (req, res) => {
  try {
    const {id} = req.params;
    const [categories, offer] = await Promise.all([
      axiosApi.getCategories(),
      axiosApi.getOffer(id)
    ]);

    res
      .render(`pages/ticket-edit`, {ticket: offer, categories});
  } catch (error) {
    res
      .status(HttpCode.NOT_FOUND)
      .render(`errors/404`);
  }
});

offersRouter.get(`/:id`, (req, res) => res.render(`pages/ticket`));

module.exports = offersRouter;
