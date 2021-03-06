# 07-node-ssl

Could be useful in case of need to access localhost with ssl (e.g. service workers on intranet resources)

## Install

```sh
$ ./gen-cert.sh
$ yarn
```

## Usage

```sh
$ node index.js
```

## Test

```sh
$ ava --watch
```

## `java`/`android`

### Client

See /android/app/src/test/java/com/ewnd9/lab/SelfSignedHttpsUnitTest.java

### Server

See /android/app/src/test/java/com/ewnd9/lab/SelfSignedHttpsServerUnitTest.java

```sh
$ ava java-server-test.js
```

## Source

- [HTTPS Authorized Certs with Node.js](https://engineering.circle.com/https-authorized-certs-with-node-js-315e548354a2#.q1nk6wiwv)
