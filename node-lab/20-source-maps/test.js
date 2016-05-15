const stackTrace = require('stack-trace');
const StackTraceParser = require('stacktrace-parser');

const SourceMapConsumer = require('source-map').SourceMapConsumer;
const fs = require('fs');

const rawSourceMap = fs.readFileSync('./dist/code.js.map', 'utf-8');
const smc = new SourceMapConsumer(rawSourceMap);

function errorHandler(useSourceMaps) {
  return function(err) {
    console.log(err.stack);
    console.log();
    console.log(`Error: ${err.message}`);

    // printStack(stackTrace.parse(err), 'fileName', obj => {
    //   console.log(`${obj.typeName}.${obj.functionName || '<anonymous>'} ${obj.fileName}:${obj.lineNumber}:${obj.columnNumber}`);
    // });

    printStack(StackTraceParser.parse(err.stack), 'file', obj => {
      console.log(`${obj.methodName} ${obj.file}:${obj.lineNumber}:${obj.column}`);

      if (!loadOriginal) {
        printSourceMap(obj.lineNumber, obj.column)
      }
    });
  }
}

function printStack(data, fileProperty, fn) {
  data.forEach(obj => {
    if (obj[fileProperty][0] === '/') { // our code
      fn(obj);
    }
  });
}

function printSourceMap(line, column) {
  const position = smc.originalPositionFor({
    line: line,
    column: column
  });

  console.log(position);
}

const loadOriginal = true;

if (loadOriginal) {
  process.on('uncaughtException', errorHandler(false));
  require('./fixtures/code');
} else {
  process.on('uncaughtException', errorHandler(true));
  require('./dist/code');
}

/*
loadOriginal = true

test /tmp/9a0b98/fixtures/code.js:4:9
Object.<anonymous> /tmp/9a0b98/fixtures/code.js:7:1
Object.<anonymous> /tmp/9a0b98/test.js:51:3

loadOriginal = false

test /tmp/9a0b98/dist/code.js:8:9
{ source: '../fixtures/code.js', line: 4, column: 8, name: null }
Object.<anonymous> /tmp/9a0b98/dist/code.js:11:1
{ source: '../fixtures/code.js', line: 7, column: 0, name: null }
Object.<anonymous> /tmp/9a0b98/test.js:51:3
{ source: null, line: null, column: null, name: null }
*/
