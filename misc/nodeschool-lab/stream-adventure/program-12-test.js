'use strict';

const input = `{"type":"genre","name":"cyberpunk"}
{"type":"book","name":"Neuromancer"}
{"type":"book","name":"Snow Crash"}
{"type":"genre","name":"space opera"}
{"type":"book","name":"A Deepness in the Sky"}
{"type":"book","name":"Void"}`;

const obj = require('./program-12')();

obj.write(input);
