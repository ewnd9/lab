'use strict';

require('lookup-multicast-dns/global');

const jsonStream = require('duplex-json-stream');
const topology = require('fully-connected-topology');

const hashToPort = require('hash-to-port');
const streamSet = require('stream-set');
const activeSockets = streamSet();

const register = require('register-multicast-dns');

let seq = 0;
const id = Math.random();

function toAddress(username) {
  return username + '.local:' + hashToPort(username);
};

const username = process.argv[2];
const dest = process.argv[3];

const myAddress = toAddress(username);
register(username + '.local');

console.log(`myAddress: ${myAddress}`);
console.log(`dest: ${toAddress(dest)}`);

const swarm = topology(myAddress, [toAddress(dest)]);
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
