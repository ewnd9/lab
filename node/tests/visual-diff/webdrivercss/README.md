## Install

```sh
$ sudo apt-get install imagemagick -y
$ npm install
$ node_modules/.bin/selenium-standalone install
```

## Usage

Each test starting a selenium server by `child_process` (see `setup.js`)

```sh
$ node test-1.js # using `chromedriver`
$ SELENIUM node test-1.js # using `selenium-standalone`
$ node test-2.js
$ node test-3.js
$ node test-4.js
$ node test-5.js
```

## References

- https://learn.visualregressiontesting.com/
- https://github.com/klamping/vrt-email-course
- https://github.com/klamping/hands-on-visual-regression-testing
- https://gist.github.com/sean-hill/3ceea3f22c074c77a7be2dbb41b36f93

## About webdrivercss

- http://blog.kevinlamping.com/whats-up-with-webdrivercss/
- https://github.com/webdriverio/webdrivercss/pull/164
- https://github.com/zinserjan/wdio-screenshot/issues/5
