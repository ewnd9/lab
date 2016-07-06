'use strict';

var cheerio = require('cheerio');
var fs = require('fs');
var path = require('path');

var html = fs.readFileSync('./index.html', 'utf-8');
var $ = cheerio.load(html);

$('img').each(function(i, elem) {
  var src = elem.attribs.src;
  var name = path.basename(src).split('.')[0];
  var className = `ic-${name}`;
  var span = $(`<span class="${className}">`);
  $(elem).replaceWith(span);
});

$('body').append('<link rel="stylesheet" href="icons.css">');
$('style').text($('style').text() + `
span {
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0px 0px 25px #fff;
  border: 2px solid #fff;
  border-radius: 200px;
  display: inline-block;
}
span:before {
  display: block;
  content: '';
}
`);

fs.writeFileSync('./dist/index.html', $.html(), 'utf-8');
