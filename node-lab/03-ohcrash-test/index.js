const OhCrash = require('ohcrash')(process.env.OHCRASH_KEY);

const err = new Error('I know this error');
OhCrash.report(err).then(function () {
  console.log('reported');
});
