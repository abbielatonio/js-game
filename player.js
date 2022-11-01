import {
  Sitting,
  Running,
  Jumping,
  Falling,
  Dashing,
  Hit,
} from "./playerStates.js";
import { CollisionAnimation } from "./collisionAnimation.js";

export class Player {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.vy = 0;
    this.weight = 1;
    this.image = document.getElementById("player");
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame;
    this.fps = 23;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.speed = 0;
    this.maxSpeed = 20;
    this.states = [
      new Sitting(this.game),
      new Running(this.game),
      new Jumping(this.game),
      new Falling(this.game),
      new Dashing(this.game),
      new Hit(this.game),
    ];
  }
  update(input, deltaTime) {
    this.checkCollision();
    this.currentState.handleInput(input);

    this.x += this.speed;
    if (input.includes("ArrowRight") && this.currentState !== this.states[6])
      this.speed = this.maxSpeed;
    else if (input.includes("ArrowLeft")) this.speed = -this.maxSpeed;
    else this.speed = 0;

    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.width)
      this.x = this.game.width - this.width;

    this.y += this.vy;
    if (!this.onGround()) this.vy += this.weight;
    else this.vy = 0;

    if (this.y > this.game.height - this.height - this.game.groundMMargin)
      this.y = this.game.height - this.height - this.game.groundMargin;

    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTimer += deltaTime;
    }
  }

  draw(context) {
    if (this.game.debug)
      context.strokeRect(this.x, this.y, this.width, this.height);

    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  onGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }
  setState(state, speed) {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }
  checkCollision() {
    this.game.points.forEach((point) => {
      if (
        point.x < this.x + this.width &&
        point.x + point.width > this.x &&
        point.y < this.y + this.height &&
        point.y + point.height > this.y
      ) {
        point.markedForDeletion = true;
        this.game.collisions.push(
          new CollisionAnimation(
            this.game,
            point.x + point.width * 0.5,
            point.y + point.height * 0.5
          )
        );
        if (
          this.currentState === this.states[2] ||
          this.currentState === this.states[4]
        ) {
          this.game.score++;
        } else {
          this.setState(5, 0);
          this.game.lives--;
          if (this.game.lives <= 0) this.game.gameOver = true;
        }
      }
    });
  }
}
