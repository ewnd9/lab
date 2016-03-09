const scuttleup = require('scuttleup');
const level = require('level');

const log = scuttleup(level('logs.db'));

const changes = log.createReadStream({
  // live: true,
  valueEncoding: 'utf-8'
});

changes.on('data', function(data) {
  console.log(data) // print out the log - data.entry will be 'hello world'
});
