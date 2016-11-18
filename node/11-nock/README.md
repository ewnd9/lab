## Overview

- wild: all requests go out to the internet, don't replay anything, doesn't record anything
- dryrun: The default, use recorded nocks, allow http calls, doesn't record anything, useful for writing new tests
- record: use recorded nocks, record new nocks
- lockdown: use recorded nocks, disables all http calls even when not nocked, doesn't record

```
$ rm test/fixtures/spec.js.json && npm test

superagent: 1016.991ms
got: 1015.794ms

$ npm test

superagent: 25.259ms
got: 17.903ms
```

## References

- https://github.com/Flet/tape-nock
