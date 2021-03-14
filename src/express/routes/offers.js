'use strict';

const express = require(`express`);
const {pictureUpload} = require(`../middlewares`);
const {axiosApi} = require(`../axios-api/axios-api`);
const {HttpCode} = require(`../../constants`);
const {getCategoryOffer, getErrorMessage} = require(`../../utils`);
const {OFFERS_PER_PAGE} = require(`../../constants`);

const offersRouter = new express.Router();
offersRouter.use(express.urlencoded());

offersRouter.get(`/category/:id`, async (req, res) => {
  const {id} = req.params;
  const {page = 1} = req.query;

  const limit = OFFERS_PER_PAGE;
  const offset = (Number(page) - 1) * limit;

  const [{count, offers}, categories] = await Promise.all([
    axiosApi.getOffers({limit, offset, catId: id}),
    axiosApi.getCategories({count: true})
  ]);

  const total = Math.ceil(count / OFFERS_PER_PAGE);

  res.render(`pages/category`, {
    tickets: offers,
    categories,
    id,
    page: Number(page),
    totalPages: total
  });
});

offersRouter.get(`/add`, async (req, res) => {
  const categories = await axiosApi.getCategories();
  res.render(`pages/new-ticket`, {
    categories,
    newOffer: {
      categories: [],
      picture: `blank.png`
    },
    message: {}
  });
});

offersRouter.post(`/add`, pictureUpload.single(`picture`), async (req, res) => {
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
  } catch (err) {
    const categories = await axiosApi.getCategories();
    res.render(`pages/new-ticket`, {
      categories,
      newOffer,
      message: getErrorMessage(err.response.data.message)
    });
  }
});

offersRouter.get(`/edit/:id`, async (req, res) => {
  try {
    const {id} = req.params;
    const [categories, offer] = await Promise.all([
      axiosApi.getCategories(),
      axiosApi.getOffer({id})
    ]);

    const editOffer = {
      ...offer,
      categories: offer.categories.map((cat) => String(cat.id))
    };

    res.render(`pages/ticket-edit`, {
      offerId: id,
      ticket: editOffer,
      categories,
      message: {}
    });
  } catch (error) {
    res
      .status(HttpCode.NOT_FOUND)
      .render(`errors/404`);
  }
});

offersRouter.post(`/edit/:id`, pictureUpload.single(`picture`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;

  const editOffer = {
    title: body.title,
    description: body.description,
    picture: file && file.filename || `blank.png`,
    sum: body.sum,
    type: body.type,
    categories: getCategoryOffer(body.categories)
  };

  try {
    await axiosApi.updateOffer(Number(id), editOffer);
    res.redirect(`/my`);
  } catch (err) {
    const categories = await axiosApi.getCategories();
    res.render(`pages/ticket-edit`, {
      offerId: id,
      ticket: editOffer,
      categories,
      message: getErrorMessage(err.response.data.message)
    });
  }
});

offersRouter.get(`/:id`, async (req, res) => {
  try {
    const {id} = req.params;
    const offer = await axiosApi.getOffer({id, comments: true});

    res.render(`pages/ticket`, {
      ticket: offer,
      message: {}
    });
  } catch (error) {
    res
      .status(HttpCode.NOT_FOUND)
      .render(`errors/404`);
  }
});

offersRouter.post(`/:id`, async (req, res) => {
  const {id} = req.params;
  const {text} = req.body;

  let message;

  try {
    await axiosApi.createComment(id, {text});
    message = {};
  } catch (err) {
    message = getErrorMessage(err.response.data.message);
  }

  const offer = await axiosApi.getOffer({id, comments: true});
  res.render(`pages/ticket`, {
    ticket: offer,
    message
  });
});

module.exports = offersRouter;
