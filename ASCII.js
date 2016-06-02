// Constructor for ASCII Canvas object
function AsciiCanvas(width, height, fun) {
  this.width = width;
  this.height = height;
  this.elements = [];
  this.gameLoopFn = fun;

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

  this.add = function(str, x, y) {
    x |= 0;
    y |= 0;
    var el = new Element(str, x, y);
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
    interval |= 0;
    if (!this.gameLoopTimer) {
      var canv = this;
      if (interval > 0) {
        canv.gameLoopTimer = setInterval(function() {
          canv.update();
          canv.gameLoopFn();
        }, interval);
      }
    }
  }

  this.stop = function() {
    if (this.gameLoopTimer) {
      clearInterval(this.gameLoopTimer);
      this.gameLoopTimer = null;
    }
  }

  this.toString = function() {
    var arr = new Array(this.width);
    for (var i = 0; i < arr.length; i++) {
      arr[i] = new Array(this.height);
    }
    for (var i = 0; i < this.elements.length; i++) {
      var el = this.elements[i];
      console.log(el);
      // get the frame from el, put it in the array
      for (var x = 0; x < el.width; x++) {
        if (el.x + x < this.cameraX || el.x + x >= this.width + this.cameraX)
          continue;
        for (var y = 0; y < el.height; y++) {
          if (el.y + y < this.cameraY || el.y + y >= this.height + this.cameraY)
            continue;
          arr[x + el.x - this.cameraX][y + el.y - this.cameraY] = el.charAtPos(x, y);
        }
      }
    }
    var str = "";
    for (var i = 0; i < this.height; i++) {
      for (var j = 0; j < this.width; j++) {
        str += arr[j][i] == undefined ? " " : arr[j][i];
      }
      if (i != this.height - 1)
        str += "</br>";
    }
    console.log(arr);
    return str;
  }
}

function Element(el, x, y) {
  this.str = el.s;
  this.x = x;
  this.y = y;
  this.width = el.w;
  this.height = el.h;
  this.frameCount = el.s.length / (el.w * el.h);
  this.currentFrame = 0;
  this.stopped = false;

  this.charAtPos = function(x, y) {
    return this.str.charAt(this.currentFrame * this.x * this.y + y * this.width + x);
  }

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