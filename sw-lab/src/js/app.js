require('./../scss/style.scss');

import { UpUp } from 'upup/src/upup';

UpUp.start({
  'content-url': 'offline.html',
  'assets': ['/upup.sw.min.js', '/app.sw.js']
});
