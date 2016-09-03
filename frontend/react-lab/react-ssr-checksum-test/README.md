## Usage

### `react-ssr-14`

Every time different `data-reactid` and `data-react-checksum`.

```sh
$ node_modules/.bin/babel-node index.js
<div data-reactid=".m0hb0i3uo0" data-react-checksum="1096158839">hello</div>
$ node_modules/.bin/babel-node index.js
<div data-reactid=".vkui5luups" data-react-checksum="1367609181">hello</div>
$ node_modules/.bin/babel-node index.js
<div data-reactid=".2a4wdceoutc" data-react-checksum="1477381973">hello</div>
```

### `react-ssr-14` prerender

```sh
$ npm run prerender-static
```

Client side react doesn't generate `data-react-checksum` so markup can't be reused

```sh
$ npm run prerender-node
```

### `react-ssr-15`

Every time same `data-reactid` and `data-react-checksum`.

```sh
$ node_modules/.bin/babel-node index.js
<div data-reactroot="" data-reactid="1" data-react-checksum="-857140882">hello</div>
$ node_modules/.bin/babel-node index.js
<div data-reactroot="" data-reactid="1" data-react-checksum="-857140882">hello</div>
$ node_modules/.bin/babel-node index.js
<div data-reactroot="" data-reactid="1" data-react-checksum="-857140882">hello</div>
```

## "renderComponentToString() rendering a different data-reactid on each run #1666"
https://github.com/facebook/react/issues/1666

> To be clear: the root ID and checksum differ each time, but the same root ID is used on the
client when generating the markup, so the checksums generated on the client should match if
nothing else is wrong, even though the server produces a different checksum each time.
