var keysDown = [];

// Constructor for ASCII Canvas object
function AsciiCanvas(width, height, fun) {
  document.querySelector("body").onkeydown = function(event) {
    if (!keysDown.includes(event.keyCode))
      keysDown.push(event.keyCode);
  };

  document.querySelector("body").onkeyup = function(event) {
    var pos = keysDown.indexOf(event.keyCode);
    if (pos > -1)
      keysDown.splice(pos, 1);
  };

  this.width = width;
  this.height = height;
  this.elements = [];
  this.gameLoopFn = fun;

  this.cameraX = 0;
  this.cameraY = 0;
  this.translateCamera = function(dx, dy) {
    this.cameraX += dx;
    this.cameraY += dy;
  };
  this.setCameraPos = function(x, y) {
    this.cameraX = x;
    this.cameraY = y;
  };

  // Adds the given "el" (assumed to be in the correct format)
  // to the canvas and returns the newly constructed element
  // Adds the el to the world at coordinates (x, y). Both x and
  // y default to 0 if not provided.
  this.add = function(el, x, y) {
    x |= 0;
    y |= 0;
    var element = new Element(el, x, y);
    this.elements.push(element);
    return element;
  };

  // Removes the given element from the canvas
  this.remove = function(el) {
    this.elements.remove(el);
  };

  // Advances all currently playing elements to the next frame
  this.update = function() {
    for (var i = 0; i < this.elements.length; i++) {
      if (!this.elements[i].stopped)
        this.elements[i].nextFrame();
    }
  };

  // Starts the canvas. You should call this after adding all
  // your initial elements. Calls the given gameLoopFn once,
  // and if interval is > 0, creates a loop for executing the
  // gameLoopFn at the given interval. Every interval, also
  // advances all currently playing elements to the next frame.
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
  };

  // Stops the current loop, if there is one
  this.stop = function() {
    if (this.gameLoopTimer) {
      clearInterval(this.gameLoopTimer);
      this.gameLoopTimer = null;
    }
  };

  // Returns a grid representation based on what the camera
  // is viewing, with each line separated by </br> tags
  this.toString = function() {
    var arr = new Array(this.width);
    for (var i = 0; i < arr.length; i++) {
      arr[i] = new Array(this.height);
    }
    for (var i = 0; i < this.elements.length; i++) {
      var el = this.elements[i];
      // get the frame from el, put it in the array
      for (var x = 0; x < el.width; x++) {
        if (el.x + x < this.cameraX || el.x + x >= this.width + this.cameraX)
          continue;
        for (var y = 0; y < el.height; y++) {
          if (el.y + y < this.cameraY || el.y + y >= this.height + this.cameraY)
            continue;
          var ch = el.charAtPos(x, y);
          if (ch != ' ')
            arr[x + el.x - this.cameraX][y + el.y - this.cameraY] = ch;
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
    return str;
  };

  // Returns whether or not the current key is held down.
  // The canvas puts key listeners on the page's body, so
  // you should use this instead of making your own listener.
  this.keyDown = function(key) {
    return keysDown.includes(key);
  }
}

// Constructor for an Element object, which represents
// any object that is currently on the canvas.
function Element(el, x, y) {
  this.str = el.s;
  this.x = x;
  this.y = y;
  this.width = el.w;
  this.height = el.h;
  this.frameCount = el.s.length / (el.w * el.h);
  this.currentFrame = 0;
  this.stopped = false;

  // gets the character at the local position for this object
  // e.g. el.charAtPos(0, 0) returns the top left corner
  this.charAtPos = function(x, y) {
    return this.str.charAt(this.currentFrame * this.width * this.height + y * this.width + x);
  };

  // gets the character at the global coordinates, returns
  // null if the element doesn't occupy that space or the
  // character stored is the space character
  this.charAtGlobalPos = function(x, y) {
    if (x < this.x || x >= this.x + this.width ||
        y < this.y || y >= this.y + this.height)
      return null;
    var ch = this.charAtPos(x - this.x, y - this.y);
    return ch == ' ' ? null : ch;
  }

  // Go to the next frame
  this.nextFrame = function() {
    this.currentFrame = (this.currentFrame + 1) % this.frameCount;
  };

  // Go to the prev frame
  this.prevFrame = function() {
    this.currentFrame--;
    if (this.currentFrame < 0)
      this.currentFrame = this.frameCount - 1;
  };

  // Goes to the given frame, if it's in the range.
  // If it's outside the range, nothing happens
  this.gotoFrame = function(frame) {
    if (frame >= 0 && frame < this.frameCount)
      this.frameCount = frame;
  };

  // Moves the element to the given world coordinates
  this.moveTo = function(x, y) {
    this.x = x;
    this.y = y;
  };
  this.translate = function(dx, dy) { this.moveTo(this.x + dx, this.y + dy); };

  // Returns whether the bounding boxes of this and the given
  // other element overlap at all
  this.hitTest = function(other) {
    if (!other) return;
    return !(this.x + this.width <= other.x || this.x >= other.x + other.width ||
             this.y + this.height <= other.y || this.y >= other.y + other.height);
  };

  // Tests if this element is intersecting with another element
  // in a more precise manner than hitTest. If the two elements
  // have overlapping non-whitespace characters, returns true
  this.hitTestExact = function(other) {
    if (!this.hitTest(other)) return;
    for (var x = this.x; x < this.x + this.width; x++) {
      for (var y = this.y; y < this.y + this.height; y++) {
        var thisPt = this.charAtGlobalPos(x, y);
        var otherPt = other.charAtGlobalPos(x, y);
        if (thisPt != null && thisPt != ' ' && otherPt != null && otherPt != ' ')
          return true;
      }
    }
    return false;
  };

  this.collideBottom = function(other) {
    return this.x > other.x - this.width && this.x < other.x + other.width &&
           this.y == other.y - this.height;
  };

  this.collideBottomExact = function(other) {
    for (var x = 0; x < this.width; x++) {  // x coord on this
      if (this.x + x < other.x - 1 || this.x + x >= other.x + other.width)
        continue;
      for (var y = this.height - 1; y >= 0; y--) {  // y coord on this
        if (this.y + y < other.y - 1 || this.y + y >= other.y + other.height)
          continue;
        // this object has a character that is 1 pixel above a character on other
        if (this.charAtGlobalPos(this.x + x, this.y + y) != null &&
            other.charAtGlobalPos(this.x + x, this.y + y + 1) != null)
          return true;
      }
    }
    return false;
  }

  this.collideTop = function(other) { return other.collideBottom(this); };

  this.collideTopExact = function(other) { return other.collideBottomExact(this); }

  this.collideRight = function(other) {
    return this.x + this.width == other.x;
  };

  this.collideRightExact = function(other) {
    for (var x = 0; x < this.width; x++) {  // x coord on this
      if (this.x + x < other.x - 1 || this.x + x >= other.x + other.width)
        continue;
      for (var y = this.height - 1; y >= 0; y--) {  // y coord on this
        if (this.y + y < other.y - 1 || this.y + y >= other.y + other.height)
          continue;
        // this object has a character that is 1 pixel to the right of a character on other
        if (this.charAtGlobalPos(this.x + x, this.y + y) != null &&
            other.charAtGlobalPos(this.x + x + 1, this.y + y) != null)
          return true;
      }
    }
    return false;
  }

  this.collideLeft = function(other) { return other.collideRight(this); };

  this.collideLeftExact = function(other) { return other.collideRightExact(this); }

  // The element will no longer advance its frame on update
  this.stop = function() { this.stopped = true; };
  // The element will advance its frame on update
  this.play = function() { this.stopped = false; };
}