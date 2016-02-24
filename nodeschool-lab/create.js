const fs = require('fs');
const path = require('path');
const pkg = process.argv[2];

if (!pkg) {
  console.log('Usage: "node create <pkg>"');
}

fs.mkdirSync(pkg);
fs.writeFileSync(`${pkg}/package.json`, `
  {
    "name": "lab-${pkg}",
    "dependencies": {
      "${pkg}": "*"
    }
  }
`);
fs.writeFileSync(`${pkg}/completed.json`, '[]');

fs.mkdirSync(`/home/ewnd9/.config/${pkg}`);
fs.writeFileSync(`${pkg}/completed.json`, '[]');
fs.writeFileSync(`${pkg}/.gitignore`, 'node_modules');

require('./link-progress');
