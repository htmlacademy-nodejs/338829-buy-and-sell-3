'use strict';

const axios = require(`axios`);
const {
  DEFAULT_PORT,
  API_TIMEOUT,
  API_PREFIX
} = require(`../../constants`);

const createApi = (baseURL, timeout = API_TIMEOUT) => {
  const port = process.env.API_PORT || DEFAULT_PORT;
  const defaultURL = `http://localhost:${port}${API_PREFIX}/`;

  const api = axios.create({
    baseURL: baseURL || defaultURL,
    timeout
  });

  const fetch = async (url, options) => {
    const response = await api.request({url, ...options});
    return response.data;
  };

  return {
    api,
    getOffers: () => fetch(`/offers`),
    getOffer: (offerId) => fetch(`/offers/${offerId}`),
    getOfferComments: (offerId) => fetch(`/offers/${offerId}/comments`),
    getCategories: () => fetch(`/categories`),
    searchOffers: (query) => fetch(`/search`, {params: {query}}),
    createOffer: (data) => fetch(`/offers`, {method: `POST`, data})
  };
};

const axiosApi = createApi();

module.exports = {
  createApi,
  axiosApi
};
