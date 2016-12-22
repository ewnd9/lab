'use strict';

module.exports.currentTime = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `current time: ${new Date().toTimeString()}`,
      input: event,
    }),
  };

  callback(null, response);
};
