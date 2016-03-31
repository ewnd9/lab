'use strict';

import express from 'express';
const app = express();

import morgan from 'morgan';

app.use(morgan('request: :remote-addr :method :url :status'));

import renderReact from './server-render';
import fs from 'fs';

app.get('/bundle.js', (req, res) => {
  fs.createReadStream(__dirname + '/public/bundle.js').pipe(res);
});

app.get('/favicon.ico', (req, res) => {
  fs.createReadStream(__dirname + '/public/bundle.js').pipe(res);
});

app.get('*', (req, res) => {
  renderReact(req.path)
    .then(data => {
      const html = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </head>
          <body>
            <div id="root">${data.html}</div>
            <script>window.INITIAL_STATE = ${JSON.stringify(data.state)};</script>
            <script src="/bundle.js"></script>
          </body>
        </html>
     `;

      res.end(html);
    })
    .catch(err => console.log(err.stack));
});


const port = 3000;
app.listen(port, () => console.log(`localhost:${port}`));
