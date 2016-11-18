'use strict';

const levelup = require('levelup');
const levelLiveStream = require('level-live-stream');
const multilevel = require('multilevel');
const shoe = require('shoe');
const es = require('event-stream');

module.exports = function init(dbPath) {
  const db = levelup('./chat.db', { valueEncoding: 'json' });
  const liveDbStream = levelLiveStream(db);

  let messages = {};

  db.get('messages', function(err, data) {
    if (err) {
      return;
    }

    messages = data;
  });

  liveDbStream.on('data', function(data) {
    if (data.type === 'del' && data.key === 'messages') {
      //'clear' pressed, doesn't actually remove all of the keys, although you easily could
      messages = {};
    }

    if (data.key.indexOf('message:') >= 0) {
      const idx = data.key.split(':')[1];
      messages[idx] = '' //not sophisticated enough to handle messages generated at exact same time

      db.put('messages', messages);
    }
  });

  const dbSocket = shoe(function(stream) {
    stream.pipe(multilevel.server(db)).pipe(stream);
  });

  const changesSocket = shoe(function(stream) {
    es.pipeline(
      liveDbStream,
      es.map((data, next) => next(null, JSON.stringify(data))),
      stream
    );
  });

  return { db, dbSocket, changesSocket };
};
