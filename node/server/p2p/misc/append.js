const scuttleup = require('scuttleup');
const level = require('level');

const log = scuttleup(level('logs.db'));

log.append('hello world');
