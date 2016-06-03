var el = {s:"axaxaxaxaxaxaxaxax",w:3,h:3};

var canvas;
var a;
var b;
window.onload = function() {
  canvas = new AsciiCanvas(50, 20, function() {
    document.getElementById("box").innerHTML = this;

    if (a) {
      var dx = 0;
      var dy = 0;
      if (canvas.keyDown(65) || canvas.keyDown(37)) dx--;
      if (canvas.keyDown(68) || canvas.keyDown(39)) dx++;
      if (canvas.keyDown(87) || canvas.keyDown(38)) dy--;
      if (canvas.keyDown(83) || canvas.keyDown(40)) dy++;
      a.translate(dx, dy);
      if (a.hitTest(b))
        a.translate(-dx, -dy);
    }
  });
  a = canvas.add(el);
  b = canvas.add(el, 5, 5);
  canvas.start(1000/30);
}
