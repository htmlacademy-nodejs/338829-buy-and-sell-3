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
    getOfferComments: (id, accessToken) => fetch(`/offers/${id}/comments`, {headers: getAuthHeaders(accessToken)}),
    getCategories: ({count = false} = {}) => fetch(`/categories`, {params: {count}}),
    searchOffers: (query) => fetch(`/search`, {params: {query}}),
    createOffer: (offer, accessToken) => {
      return fetch(`/offers`, {method: `POST`, data: offer, headers: getAuthHeaders(accessToken)});
    },
    updateOffer: (id, offer, accessToken) => {
      return fetch(`/offers/${id}`, {method: `PUT`, data: offer, headers: getAuthHeaders(accessToken)});
    },
    createComment: (id, comment, accessToken) => {
      return fetch(`/offers/${id}/comments`, {method: `POST`, data: comment, headers: getAuthHeaders(accessToken)});
    },
    deleteComment: (id, commentId, accessToken) => {
      return fetch(`/offers/${id}/comments/${commentId}`, {method: `DELETE`, headers: getAuthHeaders(accessToken)});
    },
    createUser: (user) => fetch(`/user`, {method: `POST`, data: user}),
    login: (auth) => fetch(`/user/login`, {method: `POST`, data: auth}),
    logout: (accessToken, refreshToken) => {
      return fetch(`/user/logout`, {method: `DELETE`, data: {token: refreshToken}, headers: getAuthHeaders(accessToken)});
    },
    refresh: (refreshToken) => {
      return fetch(`/user/refresh`, {method: `POST`, data: {token: refreshToken}});
    }
  };
};

const axiosApi = createApi();

module.exports = {
  createApi,
  axiosApi
};
