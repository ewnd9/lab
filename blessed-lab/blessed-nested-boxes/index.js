var blessed = require('blessed');

module.exports = function(box) {

  var height = 2; // borders
  var yOffset = 0;

  var append = function(content, options) {
    options = options || {};

    var currWidth = box.width - 3; // borders + scroll
    var currHeight = null;

    if (typeof content === 'string') {
      var currHeight = options.height || (height + (content.length / currWidth | 0) + 1);
      var box1 = blessed.box({
        border: 'line',
        top: yOffset,
        width: currWidth,
        height: currHeight,
        content: content
      });

      box.append(box1);
    } else {
      var currHeight = options.height || (height + (content.getContent().length / currWidth | 0) + 1);

      content.top = yOffset;
      content.height = currHeight;
      content.width = currWidth;

      box.append(content);
    }

    yOffset += currHeight;
  };

  return {
    box: box,
    append: append
  };

};
