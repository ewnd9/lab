## Install

```
$ npm install
```

## Usage

```
$ npm start
```

## Note

### Possible issues

- Component name from a container equals component name from the `common` container
  - throws `Multiple directives [<name>, <name>] asking for new/isolated scope`
- Component name from a container equals component name from another container
  - silently fails, component which loaded first will be displayed everywhere
  - can be solved with `test` as `component` name should be equal to component's directory name, checked before `commit`/`push` 
