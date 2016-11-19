'use strict';

const auth = require('feathers-authentication').hooks;
const hooks = require('feathers-hooks');

const globalHooks = require('../../../hooks');

const populateSender = hooks.populate('sentBy', {
  service: 'users',
  field: 'userId'
});

const restictToSender = require('./restict-to-sender');
const process = require('./process');

exports.before = {
  all: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated()
  ],
  find: [],
  get: [],
  create: [process()],
  update: [hooks.remove('sentBy'), restictToSender()],
  patch: [hooks.remove('sentBy'), restictToSender()],
  remove: [restictToSender()]
};

exports.after = {
  all: [],
  find: [populateSender],
  get: [populateSender],
  create: [populateSender],
  update: [],
  patch: [],
  remove: []
};
