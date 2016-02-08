# pouchdb-lab

[![Build Status](https://travis-ci.org/ewnd9/pouchdb-lab.svg?branch=master)](https://travis-ci.org/ewnd9/pouchdb-lab)

## Install

```
$ npm install
```

## Usage

```
$ npm test

  ✔ fetch all items by 1 request + 1 design doc
  ✔ fetch all items by 1 request
  ✔ fetch all items (asc) by 5 request (336ms)
  ✔ fetch 0 items (desc) by 5 request due to incorrect initial values (237ms)
  ✔ fetch all items (desc) by 5 request (282ms)
  ✔ fetch all items from 1 category by in-memory query
  ✔ fetch all items from 1 category by stored view

  7 tests passed

$ npm run benchmark

  dynamic x 3.23 ops/sec ±3.02% (20 runs sampled)
  stored x 196 ops/sec ±4.01% (67 runs sampled)
  Fastest is stored

  dynamic stats: { doc_count: 500,
    update_seq: 500,
    backend_adapter: 'LevelDOWN',
    db_name: '/tmp/pouch-test-0.12836578208953142/pouch',
    auto_compaction: false,
    adapter: 'leveldb' }

  dynamic size: 359.2 kB


  stored stats: { doc_count: 501,
    update_seq: 501,
    backend_adapter: 'LevelDOWN',
    db_name: '/tmp/pouch-test-0.7556132767349482/pouch',
    auto_compaction: false,
    adapter: 'leveldb' }

  stored size: 874.55 kB
```

## License

MIT © [ewnd9](http://ewnd9.com)
