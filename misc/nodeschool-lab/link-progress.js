const fs = require('fs');
const path = require('path');
const pkg = process.argv[2];

const progressFolder = `/home/ewnd9/.config/${pkg}`;

if (!fs.existsSync(progressFolder)) {
  fs.mkdirSync(progressFolder);
}

fs.symlinkSync(path.resolve(__dirname + `/${pkg}/completed.json`), `${progressFolder}/completed.json`);
