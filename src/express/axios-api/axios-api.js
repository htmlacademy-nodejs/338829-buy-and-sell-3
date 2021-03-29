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

  const getAuthHeaders = (accessToken) => {
    return {'authorization': `Bearer ${accessToken}`};
  };

  return {
    api,
    getOffers: ({offset, limit, comments = false, catId = -1} = {}) => fetch(`/offers`, {params: {offset, limit, comments, catId}}),
    getOffer: ({id, comments = false} = {}) => fetch(`/offers/${id}`, {params: {comments}}),
    getOfferComments: (id) => fetch(`/offers/${id}/comments`),
    getCategories: ({count = false} = {}) => fetch(`/categories`, {params: {count}}),
    searchOffers: (query) => fetch(`/search`, {params: {query}}),
    createOffer: (offer) => fetch(`/offers`, {method: `POST`, data: offer}),
    updateOffer: (id, offer) => fetch(`/offers/${id}`, {method: `PUT`, data: offer}),
    createComment: (id, comment) => fetch(`/offers/${id}/comments`, {method: `POST`, data: comment}),
    deleteComment: (id, commentId) => fetch(`/offers/${id}/comments/${commentId}`, {method: `DELETE`}),
    createUser: (user) => fetch(`/user`, {method: `POST`, data: user}),
    loginUser: (auth) => fetch(`/user/login`, {method: `POST`, data: auth}),
    logoutUser: (accessToken, refreshToken) => {
      return fetch(`/user/logout`, {method: `DELETE`, data: {token: refreshToken}, headers: getAuthHeaders(accessToken)});
    },
    refreshUser: (refreshToken) => {
      return fetch(`/user/refresh`, {method: `POST`, data: {token: refreshToken}});
    }
  };
};

const axiosApi = createApi();

module.exports = {
  createApi,
  axiosApi
};
