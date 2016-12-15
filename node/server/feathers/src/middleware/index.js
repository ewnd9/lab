'use strict';

const signup = require('./signup');

const handler = require('feathers-errors/handler');
const notFound = require('./not-found-handler');
const logger = require('./logger');

module.exports = function() {
  const app = this;

  app.post('/signup', signup(app));
  
  app.use(notFound());
  app.use(logger(app));
  app.use(handler());
};
