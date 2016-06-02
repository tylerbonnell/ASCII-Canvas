var el = {s:" x x x x x x x x x"};

var canvas;
window.onload = function() {
  canvas = new AsciiCanvas(50, 20, function() {
    document.getElementById("box").innerHTML = this.toString();
  });
  canvas.add(el);
  canvas.start(300);
}