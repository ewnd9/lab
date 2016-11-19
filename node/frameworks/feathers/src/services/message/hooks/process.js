'use strict';

module.exports = function(options) {
  return function(hook) {
    const user = hook.params.user;
    const text = hook.data.text
      .substring(0, 400)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

    hook.data = {
      text,
      userId: user._id,
      createdAt: new Date().toISOString()
    };
  };
};
