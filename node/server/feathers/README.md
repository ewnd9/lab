# feathers-playground

https://docs.feathersjs.com/

https://docs.feathersjs.com/getting-started/scaffolding.html
https://docs.feathersjs.com/getting-started/user-management.html
https://docs.feathersjs.com/getting-started/formatting-and-hooks.html
https://docs.feathersjs.com/getting-started/frontend.html

## Generators

```sh
$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers generate model                 # Generate a new Model
$ feathers help                           # Show all commands
```

## API

```sh
$ curl 'http://localhost:3030/messages/' -H 'Content-Type: application/json' --data-binary '{ "text": "Hello Feathers!" }'
```

## Auth
https://github.com/feathersjs/feathers-client/blob/eb5c2cd74a2763ec1b18ee1810273c029783720d/src/client.js
https://github.com/feathersjs/feathers-authentication-client/blob/2720e99bf2bd27704742b92a878f338904719599/src/passport.js

`/login.html` redirects to `/chat.html` with temporary cookie
`/chat.html` request a proper token via websocket

## DB
sequelize https://docs.feathersjs.com/databases/sequelize.html
mongoose https://docs.feathersjs.com/databases/mongoose.html
pouchdb https://github.com/feathersjs/feathers/issues/264 https://github.com/feathersjs/feathers/issues/436
graphql wip https://github.com/feathersjs/feathers-graphql
https://docs.feathersjs.com/databases/pagination.html
https://docs.feathersjs.com/databases/querying.html

## tcomb
https://github.com/ahdinosaur/feathers-tcomb
https://github.com/ahdinosaur/feathers-action (redux actions generator)
