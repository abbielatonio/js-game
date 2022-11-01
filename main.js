import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingPoint, GroundPoint } from "./points.js";
import { UI } from "./UI.js";

class AudioController {
  constructor() {
    this.bgMusic = new Audio("assets/music.mp3");
    this.collideSound = new Audio("assets/collide.wav");
    this.alienSound = new Audio("assets/alien.wav");
    this.bgMusic.volume = 0.5;
    this.collideSound.volume = 0.3;
    this.bgMusic.loop = true;
  }
  startMusic() {
    this.bgMusic.play();
  }
  collide() {
    this.collideSound.play();
  }
  alien() {
    this.alienSound.play();
  }
}

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 900;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.audioController = new AudioController();
      this.width = width;
      this.height = height;
      this.groundMargin = 40;
      this.speed = 0;
      this.maxSpeed = 7;
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.UI = new UI(this);
      this.points = [];
      this.collisions = [];
      this.pointTimer = 0;
      this.pointInterval = 800;
      this.debug = false;
      this.score = 0;
      this.winningScore = 70;
      this.fontColor = "black";
      this.time = 0;
      this.maxTime = 80000;
      this.gameOver = false;
      this.lives = 3;
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
    }
    update(deltaTime) {
      this.time += deltaTime;
      if (this.time > this.maxTime) this.gameOver = true;
      this.background.update();
      this.audioController.startMusic();
      this.player.update(this.input.keys, deltaTime);

      if (this.pointTimer > this.pointInterval) {
        this.addPoint();
        this.pointTimer = 0;
      } else {
        this.pointTimer += deltaTime;
      }
      this.points.forEach((point) => {
        point.update(deltaTime);
        if (point.markedForDeletion)
          this.points.splice(this.points.indexOf(point), 1);
      });

      this.collisions.forEach((collision, index) => {
        collision.update(deltaTime);
        this.audioController.collide();
        if (collision.markedForDeletion) this.collisions.splice(index, 1);
      });
    }
    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      this.points.forEach((point) => {
        point.draw(context);
      });
      this.collisions.forEach((collision) => {
        collision.draw(context);
      });
      this.UI.draw(context);
    }
    addPoint() {
      if (this.speed > 0 && Math.random() < 0.5)
        this.points.push(new GroundPoint(this));

      this.points.push(new FlyingPoint(this));
    }
  }

  const game = new Game(canvas.width, canvas.height);

  let lastTime = 0;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    if (!game.gameOver) requestAnimationFrame(animate);
    else
      setTimeout(function () {
        window.location.reload();
      }, 3000);
    clearInterval(interval);
  }
  animate(0);
});
