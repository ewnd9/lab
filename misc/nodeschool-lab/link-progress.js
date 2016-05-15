const fs = require('fs');
const path = require('path');
const pkg = process.argv[2];

const progressFolder = `/home/ewnd9/.config/${pkg}`;
const dest = `${progressFolder}/completed.json`;

if (!fs.existsSync(progressFolder)) {
  fs.mkdirSync(progressFolder);
}

const localPath = `${__dirname}/${pkg}/completed.json`

if (fs.existsSync(dest)) {
  if (!fs.lstatSync(dest).isSymbolicLink()) {
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
      console.log(`unlink ${localPath}`);
    }

    fs.renameSync(dest, localPath);
    console.log(`rename ${dest} -> ${localPath}`)
    fs.symlinkSync(localPath, dest);
    console.log(`symlink ${localPath} -> ${dest}`);
  } else {
    console.log(`link already exists ${dest}`)
  }
} else {
  fs.symlinkSync(localPath, dest);
  console.log(`symlink ${localPath} -> ${dest}`);
}
