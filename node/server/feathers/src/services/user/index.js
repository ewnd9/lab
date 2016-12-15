'use strict';

const path = require('path');
const NeDB = require('nedb');
const service = require('feathers-nedb');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const db = new NeDB({
    filename: path.join(app.get('nedb'), 'users.db'),
    autoload: true
  });

  const options = {
    Model: db,
    paginate: {
      default: 5,
      max: 25
    }
  };

  app.use('/users', service(options));

  const userService = app.service('/users');
  
  userService.before(hooks.before);
  userService.after(hooks.after);
};
