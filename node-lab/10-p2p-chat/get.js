const level = require('level');
const db = level('test.db');

db.get('hello', (err, value) => {
  console.log(err, value);
});
