'use strict';

const crypto = require('crypto');
const gravatarUrl = 'https://s.gravatar.com/avatar';
const query = `s=60`;

const gravatarImage = email => {
  const hash = crypto.createHash('md5').update(email).digest('hex');
  return `${gravatarUrl}/${hash}?${query}`;
};

module.exports = function() {
  return function(hook) {
    hook.data = Object.assign({}, hook.data, {
      avatar: gravatarImage(hook.data.email)
    });
  };
};
