(function(){
  var Game = function(canvasID) {
    var canvas = document.getElementById(canvasID);
    var screen = canvas.getContext('2d');
    var gameSize = {x: canvas.width, y: canvas.height } ;

    this.bodies = [new Player(this, gameSize), new Asteroid(gameSize), new Asteroid(gameSize), new Asteroid(gameSize), new Asteroid(gameSize)];

    var self = this;
    var tick = function () {
      self.update();
      self.draw(screen, gameSize);
      requestAnimationFrame(tick);
    };

    tick();

  };

  Game.prototype = {
    update: function() {
      var bodies = this.bodies
      var notCollidingWithAnything = function(b1) {
        return bodies.filter(function (b2) { return colliding(b1, b2) }).length === 0

      }

      this.bodies = this.bodies.filter(notCollidingWithAnything)
      for (var i = 0; i < this.bodies.length; i++) {
        this.bodies[i].update()
      }
    },
    draw: function(screen, gameSize) {
      screen.clearRect(0, 0, gameSize.x, gameSize.y);

      for (var i = 0; i < this.bodies.length; i++) {
        this.bodies[i].draw(screen);
      }
    },
    addBody: function(body) {
      this.bodies.push(body);
    }
  };


  var Player = function(game, gameSize) {
    this.game = game;
    this.size = { x: 15, y: 15};
    this.center = { x: gameSize.x / 2, y: gameSize.y / 2 };
    this.angle = 0;
    this.keyboarder = new Keyboarder();
    this.velocity = { x: 0, y: 0};
  };

  Player.prototype = {
    update: function() {
      if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
        this.angle -= 2;
      } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
        this.angle += 2;
      }

      if (this.keyboarder.isDown(this.keyboarder.KEYS.UP)) {
       var angle = ((this.angle - 90) * Math.PI) / 180
       this.velocity.x += Math.cos(angle) * 0.2;
       this.velocity.y += Math.sin(angle) * 0.2;
     }

     if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE) && this.overHeated === 0) {
        var bullet = new Bullet({ x: this.center.x, y: this.center.y - this.size.x / 2 }, { x: 0, y: -6})
        this.game.addBody(bullet)
        this.overHeated = 20
      }


     this.center.x += this.velocity.x;
     this.center.y += this.velocity.y;

    },

    draw: function(screen) {
      screen.save()
      screen.fillStyle = 'white';
      screen.translate(this.center.x, this.center.y);
      screen.rotate(this.angle * Math.PI / 180);
      screen.translate(-this.center.x, -this.center.y);
      screen.fillRect(this.center.x - this.size.x / 2,
                      this.center.y - this.size.y / 2,
                      this.size.x,
                      this.size.y
                    );
      screen.restore()

    },

  };

  var Asteroid = function(gameSize) {
    this.size = { x: 50, y: 50};
    // this.proximityGeneratorX = new proximityGeneratorX(gameSize);
    this.spawnX = randomRangeNotIncluding(0, gameSize.x, ((gameSize.x / 2) - 100), ((gameSize.x / 2) + 100));
    this.spawnY = randomRangeNotIncluding(0, gameSize.y, ((gameSize.y / 2) - 100), ((gameSize.y / 2) + 100));
    this.center = { x: this.spawnX, y: this.spawnY};
    this.angle = 0;
    this.velocity = { x: randomRange(), y: randomRange() };
  };

  Asteroid.prototype = {
    update: function() {
      this.center.x += this.velocity.x;
      this.center.y += this.velocity.y;
      this.angle += 1;
    },


    draw: function(screen) {
      screen.save()
      screen.fillStyle = 'white';
      screen.translate(this.center.x, this.center.y);
      screen.rotate(this.angle * Math.PI / 180);
      screen.translate(-this.center.x, -this.center.y);
      screen.fillRect(this.center.x - this.size.x / 2,
                      this.center.y - this.size.y / 2,
                      this.size.x,
                      this.size.y
                    );
      screen.restore()

    },
  };

  var Bullet = function(center, velocity) {
    this.size = { x: 3, y: 3}
    this.center = center
    this.velocity = velocity
  }

  Bullet.prototype = {
    update: function () {
      this.center.x += this.velocity.x
      this.center.y += this.velocity.y

    },

    draw: function(screen) {
      screen.fillRect(this.center.x - this.size.x / 2,
                      this.center.y - this.size.y / 2,
                      this.size.x,
                      this.size.y)
    }
  }


  var randomRangeNotIncluding = function(min, max, minEx, maxEx) {

  	var diff = maxEx - minEx

  	var num = Math.floor(Math.random() *  (max - diff));
  	if (num >= minEx) {
  		num += diff;
  	} else if ( num < min) {
  		num += min
  	}

  	return num
  }

  var randomRange = function() {
    var num = Math.random();
    num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
    return num;
  }


  var Keyboarder = function () {
    var keyState = {}

    window.onkeydown = function(e) {
      keyState[e.keyCode] = true
    }

    window.onkeyup = function(e) {
      keyState[e.keyCode] = false
    }

    this.isDown = function(keyCode) {
      return keyState[keyCode] === true
    }

    this.KEYS = { LEFT: 37, RIGHT: 39, SPACE: 32, UP: 38 }
  }

  var colliding = function(b1, b2) {
  return !(b1 === b2 ||
           (b1 instanceof Asteroid  && b2 instanceof Asteroid) ||
           b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
           b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
           b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
           b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2)
  }

  window.onload = function() {
    new Game("gameCanvas");
  };


})();
