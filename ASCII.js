var gameLoopFn;
var gameLoopTimer;

// Constructor for ASCII Canvas object
function AsciiCanvas(width, height, fun) {
  this.width = width;
  this.height = height;
  str = "";
  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      str += "x";
    }
    str += "\n";
  }
  this.gameLoopFn = fun;
}

function Start(interval) {
  interval = interval || 0;
  if (gameLoopTimer == null) {
    gameLoopFn();
    if (interval > 0)
      gameLoopTimer = setInterval(gameLoopFn, interval);
  }
}

function Stop() {
  if (gameLoop) {
    clearInterval(gameLoopTimer);
    gameLoopTimer = null;
  }
}