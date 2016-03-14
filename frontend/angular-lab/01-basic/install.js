const fs = require('fs');
const path = require('path');

function check(deps) {
  fs.readdirSync(deps)
    .filter(folder => folder !== '.bin')
    .forEach(folder => {
      console.log(folder, require.resolve(folder));
      // try {
      //   fs.symlinkSync(path.resolve(deps + '/' + folder), __dirname + '/node_modules/' + folder);
      // } catch (e) {
      //   //
      // }
    });
}

function linkDeps(deps) {
  fs.readdirSync(deps)
    .filter(folder => folder !== '.bin')
    .forEach(folder => {
      try {
        fs.symlinkSync(path.resolve(deps + '/' + folder), __dirname + '/node_modules/' + folder);
      } catch (e) {
        //
      }
    });
}

function linkBins(deps) {
  fs.readdirSync(deps + '/.bin')
    .forEach(bin => {
      try {
        fs.symlinkSync(path.resolve(deps + '/.bin/' + bin), __dirname + '/node_modules/.bin/' + bin);
      } catch (e) {
        //
      }
    })
}

// try {
//   fs.mkdirSync('node_modules');
//   fs.mkdirSync('node_modules/.bin');
// } catch (e) {
//
// }
//
check(__dirname + '/../node_modules');
// linkDeps(__dirname + '/../node_modules');
// linkBins(__dirname + '/../node_modules');
//
// check(__dirname + '/../../node_modules');
// linkDeps(__dirname + '/../../node_modules');
// linkBins(__dirname + '/../../node_modules');
