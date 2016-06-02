var el = {s:" x x x x x x x x x",w:3,h:3};

var canvas;
var elt;
window.onload = function() {
  canvas = new AsciiCanvas(50, 20, function() {
    document.getElementById("box").innerHTML = this;
  });
  elt = canvas.add(el);
  canvas.start(300);
}