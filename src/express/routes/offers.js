'use strict';

const express = require(`express`);
const {pictureUpload, privateRoute} = require(`../middlewares`);
const {axiosApi} = require(`../axios-api/axios-api`);
const {HttpCode} = require(`../../constants`);
const {getCategoryOffer, getErrorMessage} = require(`../../utils`);
const {OFFERS_PER_PAGE} = require(`../../constants`);

const offersRouter = new express.Router();
offersRouter.use(express.urlencoded({extended: true}));

offersRouter.get(`/category/:id`, async (req, res, next) => {
  try {
    const {id} = req.params;
    const {page = 1} = req.query;

    const limit = OFFERS_PER_PAGE;
    const offset = (Number(page) - 1) * limit;

    const [{count, offers}, categories] = await Promise.all([
      axiosApi.getOffers({limit, offset, catId: id}),
      axiosApi.getCategories({count: true})
    ]);

    const total = Math.ceil(count / OFFERS_PER_PAGE);
    const {isAuth} = res.locals.auth;

    return res.render(`pages/category`, {
      isAuth,
      tickets: offers,
      categories,
      id,
      page: Number(page),
      totalPages: total
    });
  } catch (error) {
    return next(error);
  }
});

offersRouter.get(`/add`, privateRoute, async (req, res, next) => {
  try {
    const categories = await axiosApi.getCategories();
    return res.render(`pages/new-ticket`, {
      isAuth: true,
      categories,
      newOffer: {
        categories: [],
        picture: `blank.png`
      },
      message: {}
    });
  } catch (error) {
    return next(error);
  }
});

offersRouter.post(`/add`, [privateRoute, pictureUpload.single(`picture`)], async (req, res) => {
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
    const {accessToken} = res.locals.auth;
    await axiosApi.createOffer(newOffer, accessToken);
    return res.redirect(`/my`);
  } catch (err) {
    const categories = await axiosApi.getCategories();
    return res.render(`pages/new-ticket`, {
      isAuth: true,
      categories,
      newOffer,
      message: getErrorMessage(err.response.data.message)
    });
  }
});

offersRouter.get(`/edit/:id`, privateRoute, async (req, res) => {
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

    return res.render(`pages/ticket-edit`, {
      isAuth: true,
      offerId: id,
      ticket: editOffer,
      categories,
      message: {}
    });
  } catch (error) {
    return res
      .status(HttpCode.NOT_FOUND)
      .render(`errors/404`);
  }
});

offersRouter.post(`/edit/:id`, [privateRoute, pictureUpload.single(`picture`)], async (req, res) => {
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
    const {accessToken} = res.locals.auth;
    await axiosApi.updateOffer(Number(id), editOffer, accessToken);
    return res.redirect(`/my`);
  } catch (err) {
    const categories = await axiosApi.getCategories();
    return res.render(`pages/ticket-edit`, {
      isAuth: true,
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
    const {isAuth} = res.locals.auth;

    return res.render(`pages/ticket`, {
      isAuth,
      ticket: offer,
      message: {}
    });
  } catch (error) {
    return res
      .status(HttpCode.NOT_FOUND)
      .render(`errors/404`);
  }
});

offersRouter.post(`/:id`, privateRoute, async (req, res) => {
  const {id} = req.params;
  try {
    const {text} = req.body;
    const {accessToken} = res.locals.auth;
    await axiosApi.createComment(id, {text}, accessToken);

    return res.redirect(`/offers/${id}`);
  } catch (err) {
    const message = getErrorMessage(err.response.data.message);
    const offer = await axiosApi.getOffer({id, comments: true});

    return res.render(`pages/ticket`, {
      isAuth: true,
      ticket: offer,
      message
    });
  }
});

module.exports = offersRouter;
