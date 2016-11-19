'use strict';

const errors = require('feathers-errors');

module.exports = function(options) {
  return function(hook) {
    const messageService = hook.app.service('messages');

    return messageService
      .get(hook.id, hook.params)
      .then(message => {
        if (message.sentBy._id !== hook.params.user._id) {
          throw new errors.NotAuthenticated('Access not allowed');
        }

        return hook;
      });
  };
};
