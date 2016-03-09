const net = require('net');
const jsonStream = require('duplex-json-stream');

const streamSet = require('stream-set');
const activeSockets = streamSet();

const register = require('register-multicast-dns');
register('this-is-a-test.local');

const server = net.createServer(function (rawSocket) {
  const socket = jsonStream(rawSocket);

  console.log('new connection');
  activeSockets.add(socket);

  console.log('set size is', activeSockets.size);
  socket.on('close', function () {
    console.log('set size is', activeSockets.size);
  });

  socket.on('data', function (data) {
    activeSockets.forEach(sock => {
      if (sock !== socket) {
        console.log(data);
        sock.write(data);
      }
    });
  });
});

server.listen(10000);
