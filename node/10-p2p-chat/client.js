const net = require('net');
const jsonStream = require('duplex-json-stream');

require('lookup-multicast-dns/global');

const rawSocket = net.connect(10000, 'this-is-a-test.local');
const socket = jsonStream(rawSocket);
const username = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

const printMessage = (username, message) => process.stdout.write(`${username}: ${message}`);

process.stdin.on('data', function(data) {
  socket.write({ username, message: data.toString() });
  printMessage(username, data.toString());
});

socket.on('data', function(data) {
  printMessage(data.username, data.message);
});
