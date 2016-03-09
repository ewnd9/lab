'use strict';

const jsonStream = require('duplex-json-stream');
const topology = require('fully-connected-topology');

const streamSet = require('stream-set');
const activeSockets = streamSet();

let seq = 0;
const id = Math.random();
const username = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
console.log(`your username is ${username}`);

const me = process.argv[2]; // first argument is gonna be your own address
const peers = process.argv.slice(3); // the rest should be the peers you want to connect to

const swarm = topology(me, peers);
const messages = {};

function transmit(data) {
  activeSockets.forEach(socket => {
    socket.write(data);
  });
};

swarm.on('connection', function(connection, peer) {
  console.log('t1 is connected to', peer);

  const socket = jsonStream(connection);
  activeSockets.add(socket);

  socket.on('data', data => {
    const currId = messages[data.id] || 0;

    if (data.messageId > currId) {
      process.stdout.write(`${data.username} > ${data.message}`);

      messages[data.id] = data.messageId;
      transmit(data);
    }
  });
});

process.stdin.on('data', input => {
  const data = { username, message: input.toString(), id: id, messageId: ++seq };
  messages[data.id] = data.messageId;

  transmit(data);
});
