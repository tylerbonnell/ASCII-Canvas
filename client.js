var canvas;

window.onload = function() {
  canvas = new AsciiCanvas(50, 20, function() {
    document.getElementById("box").innerHTML = this.toString();
  });
  canvas.start(300);
}