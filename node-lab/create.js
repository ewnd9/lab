#!/usr/bin/env node

'use strict';

const fs = require('fs');
const dest = process.argv[2];

if (!dest) {
  console.log('usage "$ node create 00-test"');
  process.exit(1);
}

fs.mkdirSync(dest);
fs.writeFileSync(`${dest}/.gitignore`, 'node_modules', 'utf-8');
fs.writeFileSync(`${dest}/index.js`, 'console.log(\'hi\')', 'utf-8');
fs.writeFileSync(`${dest}/package.json`, JSON.stringify({
  "name": dest,
  "private": true,
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "license": "MIT"
}, null, 2), 'utf-8');
