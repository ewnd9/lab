#!/usr/bin/env node

'use strict';

const got = require('got');
const cheerio = require('cheerio');
const log = console.log.bind(console);
const url = process.argv[2].split('#')[0]

got(url)
  .then(res => {
    const $ = cheerio.load(res.body);
    const authorElements = $('a[href^="http://www.flaticon.com/authors/"]');

    if (authorElements.length === 2) {
      const authorHref = authorElements[0].attribs.href;
      const authorName = authorHref.split('/').slice(-1)[0];

      log(
        [`[Icon](${url})`,
         `made by [${authorName}](${authorHref})`,
         `from [www.flaticon.com](http://www.flaticon.com)`,
         `is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)`].join('\n')
      );
    } else {
      throw new Error(`Can't parse ${url}`);
    }
  })
  .catch(err => console.log(err.stack || err));
