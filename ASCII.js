// Constructor for ASCII Canvas object
function AsciiCanvas(width, height, fun) {
  this.width = width;
  this.height = height;
  this.elements = [];
  this.gameLoopFn = fun;

  this.add = function(str, x, y) {
    x |= 0;
    y |= 0;
    var el = new Element(str);
    this.elements.push(el);
    return el;
  }

  this.remove = function(el) {
    this.elements.remove(el);
  }

  this.update = function() {
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].nextFrame();
    }
  }

  this.start = function(interval) {
    this.gameLoopFn();
    interval = interval || 0;
    if (!this.gameLoopTimer) {
      var canv = this;
      if (interval > 0) {
        gameLoopTimer = setInterval(function() {
          canv.update();
          canv.gameLoopFn();
        }, interval);
      }
    }
  }

  this.stop = function() {
    if (gameLoop) {
      clearInterval(gameLoopTimer);
      gameLoopTimer = null;
    }
  }

  this.toString = function() {
    var str = "";
    for (var i = 0; i < this.height; i++) {
      for (var j = 0; j < this.width; j++) {
        str += "x";
      }
      if (i != this.height - 1)
        str += "</br>";
    }
    return str;
  }

  this.cameraX = 0;
  this.cameraY = 0;
  this.translateCamera = function(dx, dy) {
    this.cameraX += dx;
    this.cameraY += dy;
  }
  this.setCameraPos = function(x, y) {
    this.cameraX = x;
    this.cameraY = y;
  }
}

function Element(el) {
  this.str = el.s;
  this.width = el.w;
  this.height = el.h;
  this.frameCount = el.s.length / (el.w * el.h);
  this.currentFrame = 0;
  this.stopped = false;

  // Go to the next frame
  this.nextFrame = function() {
    this.currentFrame = (this.currentFrame + 1) % this.frameCount;
  }

  // Go to the prev frame
  this.prevFrame = function() {
    this.currentFrame--;
    if (this.currentFrame < 0)
      this.currentFrame = this.frameCount - 1;
  }

  // Goes to the given frame, if it's in the range.
  // If it's outside the range, nothing happens
  this.gotoFrame = function(frame) {
    if (frame >= 0 && frame < this.frameCount)
      this.frameCount = frame;
  }

  // The element will no longer advance
  this.stop = function() { this.stopped = true; }
  this.play = function() { this.stopped = false; }
}