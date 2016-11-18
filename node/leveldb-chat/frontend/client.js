'use strict';

const multilevel = require('multilevel');
const shoe = require('shoe');

const db = multilevel.client();

const dbSocket = shoe('/wsdb');
const changesSocket = shoe('/wschanges');

dbSocket.pipe(db.createRpcStream()).pipe(dbSocket);
changesSocket.on('data', function(updateData) {
  var updateData = JSON.parse(updateData);

  if (updateData.type === 'del' && updateData.key === 'messages') {
    document.getElementById('messages').innerHTML = '';
    return;
  }

  if (updateData.key.indexOf('message:') >= 0) {
    appendMessage(updateData.value);
  }
});

function appendMessage(msg) {
  const p = document.createElement('p');
  const text = document.createTextNode(`${msg.name}: ${msg.message}`);

  p.appendChild(text);
  document.getElementById('messages').appendChild(p);
}

window.onload = function() {
  const nameEl = document.getElementById('name');

  const id = Math.random().toString().substr(2,3);
  nameEl.value += id;

  // get initial chat state
  db.get('messages', function(err, messages) {
    if (messages === null) {
      return;
    }

    const ids = Object.keys(messages).slice(-15); //take last 15

    ids.forEach(function(id) {
      db.get(`message:${id}`, function(err, data) {
        appendMessage(data);
      });
    });
  });
};

window.send = function() {
  const nameEl = document.getElementById('name');
  const msgEl = document.getElementById('message');

  const obj = {
    name: nameEl.value,
    message: msgEl.value
  };

  msgEl.value = '';
  db.put(`message:${Date.now()}`, obj);
};

window.clearMessages = function() {
  db.del('messages', function(err) {
    if (err) {
      alert(err.message);
    }
  });
};
