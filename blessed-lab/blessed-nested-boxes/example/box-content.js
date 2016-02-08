var blessed = require('blessed');

var screen = blessed.screen({
  smartCSR: true,
  autoPadding: true,
  warnings: true,
  ignoreLocked: ['C-q']
});

var box = blessed.box({
  name: 'test',
  parent: screen,
  left: 'center',
  top: 'center',
  width: '100%',
  height: '100%',
  border: 'line',
  input: true,
  scrollable: true,
  keys: true,
  alwaysScroll: true,
  scrollbar: {
    ch: ' ',
    inverse: true
  },
  style: {
    selected: {
      fg: '#787878'
    }
  }
});

var nested = require('./../index')(box);

var i = 0;

var addBox = function() {
  var content = i % 2 == 0 ? 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' + i++ : 'x' + i++;

  var box1 = blessed.box({
    parent: screen, // important
    border: 'line',
    height: 3,
    content: content
  });

  nested.append(box1);
};

addBox();
addBox();
addBox();
addBox();
addBox();

setTimeout(function() {
  addBox();
  addBox();
  addBox();
  addBox();
  addBox();
  addBox();
}, 1000);

screen.render();
screen.key('C-q', function(ch, key) {
  return screen.destroy();
});
