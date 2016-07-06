'use strict';

var express = require('express');
var serveStatic = require('serve-static');
var app = express();
var port = process.env.PORT || 7777;
var imgDir = __dirname + '/public';

app.use(serveStatic(imgDir));
app.get('/cats', cats);
app.listen(port, listening);

var images = require('fs').readdirSync(imgDir).filter(function(file) {
  return file !== '.keep';
});

function listening () {
  console.log('Listening on port', port);
}

function cats (req, res) {
  var img = Array(+req.query.amount)
    .fill(0)
    .map(function(_, i) {
      return `<img src="/${images[i % images.length]}" />`;
    })
    .join('\n');

  var html = `
    <html>
    <head>
    </head>
    <body>
      ${img}
    </body>
    </html>
  `;

  res.set('Content-Type', 'text/html; charset=UTF-8');
  res.end(html);
}

/* // reference solution
var gm = require('gm');
var url = require('url');
var path = require('path');
var request = require('request');

app.get('/lynx', lynx);

function lynx (req, res) {
  var src = req.query.source;
  var base = path.basename(src);
  var local = 'http://localhost:' + port;
  var qualified = url.resolve(local, src);
  gm(request(qualified), base)
    .autoOrient()
    .noProfile() // remove exif data
    .resize(600, 600) // set maximum image size
    .stream('jpg') // convert to jpg and avoid bloated gifs
    .pipe(res);
}

function cats (req, res) {
  var url = 'https://api.imgur.com/3/gallery/r/kittens';
  var options = {
    headers: { Authorization: 'Client-ID ' + IMGUR_CLIENT_ID },
    qs: { q_size_px: 'small' },
    url: url,
    json: true
  };
  request(options, got);
  function got (err, response) {
    var title = '<title>Optimizing Images!</title>';
    var cats = _.pluck(response.body.data, 'link').slice(0, req.query.amount);
    var html = title + cats.map(toImageTag).join('\n');
    res.contentType('text/html');
    res.end(html);
  }
  function toImageTag (cat) {
    return util.format('<img src="/lynx?source=%s" />', cat);
  }
}

*/
