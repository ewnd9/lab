var ytdl = require('ytdl-core');

ytdl.getInfo('https://www.youtube.com/watch?v=lrf6xuFq1Ms', {}, (err, info) => {
  info.formats
    .filter(_ => !!_.quality_label && _.container === 'mp4')
    .forEach(format => {
      console.log(format);
    });
})
