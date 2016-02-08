import fs from 'fs';

var example = process.argv.slice(2).join(' ');
require('./examples/' + example)();
