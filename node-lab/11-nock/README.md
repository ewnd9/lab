## Overview

- wild: all requests go out to the internet, don't replay anything, doesn't record anything
- dryrun: The default, use recorded nocks, allow http calls, doesn't record anything, useful for writing new tests
- record: use recorded nocks, record new nocks
- lockdown: use recorded nocks, disables all http calls even when not nocked, doesn't record

## Versions

### `got` version

code with enabled `nock` throws exception due to some problems with gzip processing
 https://github.com/pgte/nock/issues/486

```
ReadError: incorrect header check
     at node_modules/got/index.js:98:26
```   

### `superagent` version

ok

## References

- https://github.com/Flet/tape-nock
