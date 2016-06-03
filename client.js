var el = {s:"axaxaxaxaxaxaxaxax",w:3,h:3};

var canvas;
var a;
var b;
window.onload = function() {
  canvas = new AsciiCanvas(50, 20, function() {
    document.getElementById("box").innerHTML = this;
  });
  a = canvas.add(el);
  b = canvas.add(el, 5, 5);
  document.querySelector("body").onkeydown = function(event) {
    var dx = 0;
    var dy = 0;
    if (event.keyCode == 65 || event.keyCode == 37) dx--;
    if (event.keyCode == 68 || event.keyCode == 39) dx++;
    if (event.keyCode == 87 || event.keyCode == 38) dy--;
    if (event.keyCode == 83 || event.keyCode == 40) dy++;
    a.translate(dx, dy);
    if (event.keyCode == 70)
      console.log(a.hitTest(b));
  };
  canvas.start(300);
}
