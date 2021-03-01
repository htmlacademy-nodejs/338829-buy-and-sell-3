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
    getOffers: ({offset, limit, comments = false} = {}) => fetch(`/offers`, {params: {offset, limit, comments}}),
    getOffer: ({id, comments = false} = {}) => fetch(`/offers/${id}`, {params: {comments}}),
    getOfferComments: (id) => fetch(`/offers/${id}/comments`),
    getCategories: ({count = false} = {}) => fetch(`/categories`, {params: {count}}),
    searchOffers: (query) => fetch(`/search`, {params: {query}}),
    createOffer: (data) => fetch(`/offers`, {method: `POST`, data})
  };
};

const axiosApi = createApi();

module.exports = {
  createApi,
  axiosApi
};
