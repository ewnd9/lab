var x11 = require('x11');

var Exposure = x11.eventMask.Exposure;
var PointerMotion = x11.eventMask.PointerMotion;

export default () => {
  x11.createClient(function(err, display) {
    if (!err) {
      var X = display.client;
      var root = display.screen[0].root;
      var wid = X.AllocID();

      X.CreateWindow(
        wid, root,        // new window id, parent
        0, 0, 200, 200,   // x, y, w, h
        0, 0, 0, 0,       // border, depth, class, visual
        { eventMask: Exposure|PointerMotion } // other parameters
      );

      X.MapWindow(wid);
      var gc = X.AllocID();

      X.CreateGC(gc, wid);
      X.on('event', function(ev) {
        if (ev.type == 12)
        {
            X.PolyText8(wid, gc, 50, 50, ['Hello, Node.JS!']);
        }
      });
      X.on('error', function(e) {
        console.log(e);
      });
    } else {
        console.log(err);
    }
  });
}
