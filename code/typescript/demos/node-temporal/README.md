# `example-project`

- https://learn.temporal.io/getting_started/typescript/dev_environment/

## Install

```sh
$ yarn install
$ brew install temporal
```

## Usage

```sh
# Service localhost:7233.
# Web UI http://localhost:8233.
$ temporal server start-dev --db-filename temporal.db &
$ yarn start:client &
$ yarn start:worker
```

