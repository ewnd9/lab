const express = require('express');
const crypto = require('crypto');

const app = express();

const users = {
  'matt': {
    salt: 'test-user',
    hash: 'test-user'
  }
};

function syncHandler(req, res) {
  var username = req.query.username || '';
  var password = req.query.password || '';

  username = username.replace(/[!@#$%^&*]/g, '');

  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }

  var hash = crypto.pbkdf2Sync(password, users[username].salt, 10000, 512);

  if (users[username].hash.toString() === hash.toString()) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
};

function asyncHandler(req, res) {
  var username = req.query.username || '';
  var password = req.query.password || '';

  username = username.replace(/[!@#$%^&*]/g, '');

  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }

  crypto.pbkdf2(password, users[username].salt, 10000, 512, function(err, hash) {
    if (users[username].hash.toString() === hash.toString()) {
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  });
};

app.get('/auth', process.argv[2] === 'async' ? asyncHandler : syncHandler);
app.listen(3000);
