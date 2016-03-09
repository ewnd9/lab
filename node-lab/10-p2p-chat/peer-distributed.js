'use strict';

require('lookup-multicast-dns/global');

const jsonStream = require('duplex-json-stream');
const topology = require('fully-connected-topology');

const hashToPort = require('hash-to-port');
const streamSet = require('stream-set');
const activeSockets = streamSet();

const register = require('register-multicast-dns');

const scuttleup = require('scuttleup');
const level = require('level');

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
const logs = scuttleup(level(`chat-logs.db/${username}.db`));

swarm.on('connection', function(socket, peer) {
  console.log('t1 is connected to', peer);
  activeSockets.add(socket);

  socket.pipe(logs.createReplicationStream({ live: true })).pipe(socket);
});

process.stdin.on('data', input => {
  logs.append(JSON.stringify({ username, message: input.toString() }));
});

logs.createReadStream({ live: true, valueEncoding: 'utf-8' })
  .on('data', function (data) {
    const value = JSON.parse(data.entry);
    process.stdout.write(`${value.username} > ${value.message}`);
  });
