var el = {s:" o ooo o o o o o o",w:3,h:3};

var canvas;
var a;
var b;
window.onload = function() {
  canvas = new AsciiCanvas(60, 40);

  a = canvas.add(el);
  b = canvas.add(el, 5, 5);

  var animLoop = setInterval(function() { canvas.update(); }, 1000/2);
  var gameLoop = setInterval(function() {
    var dx = 0;
    var dy = 0;
    if (canvas.keyDown(65) || canvas.keyDown(37)) dx--;
    if (canvas.keyDown(68) || canvas.keyDown(39)) dx++;
    if (canvas.keyDown(87) || canvas.keyDown(38)) dy--;
    if (canvas.keyDown(83) || canvas.keyDown(40)) dy++;
    a.translate(dx, dy);
    document.getElementById("box").innerHTML = canvas;
  }, 1000/20);
}
