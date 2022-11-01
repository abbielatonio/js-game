const states = {
  SITTING: 0,
  RUNNING: 1,
  JUMPING: 2,
  FALLING: 3,
  DASHING: 4,
  HIT: 5,
};

class State {
  constructor(state, game) {
    this.state = state;
    this.game = game;
  }
}

export class Sitting extends State {
  constructor(game) {
    super("SITTING", game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 2;
    this.game.player.frameY = 5;
  }
  handleInput(input) {
    if (input.includes("ArrowLeft") || input.includes("ArrowRight")) {
      this.game.player.setState(states.RUNNING, 1.4);
    } else if (input.includes(" ")) {
      this.game.player.setState(states.DASHING, 4);
    }
  }
}

export class Running extends State {
  constructor(game) {
    super("RUNNING", game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 5;
    this.game.player.frameY = 3;
  }
  handleInput(input) {
    if (input.includes("ArrowDown")) {
      this.game.player.setState(states.SITTING, 0);
    } else if (input.includes("ArrowUp")) {
      this.game.player.setState(states.JUMPING, 1);
    } else if (input.includes(" ")) {
      this.game.player.setState(states.DASHING, 2);
    }
  }
}

export class Jumping extends State {
  constructor(game) {
    super("JUMPING", game);
  }
  enter() {
    if (this.game.player.onGround()) this.game.player.vy -= 27;
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 6;
    this.game.player.frameY = 1;
  }
  handleInput(input) {
    if (this.game.player.onGround) {
      this.game.player.setState(states.DASHING, 2);
    }
  }
}

export class Falling extends State {
  constructor(game) {
    super("FALLING", game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 6;
    this.game.player.frameY = 2;
  }
  handleInput(input) {
    if (this.game.player.onGround) {
      this.game.player.setState(states.RUNNING, 1.4);
    }
  }
}

export class Dashing extends State {
  constructor(game) {
    super("DASHING", game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 12;
    this.game.player.frameY = 8;
  }
  handleInput(input) {
    if (!input.includes(" ") && this.game.player.onGround()) {
      this.game.player.setState(states.RUNNING, 1.4);
    } else if (
      input.includes(" ") &&
      input.includes("ArrowUp") &&
      this.game.player.onGround()
    ) {
      this.game.player.vy -= 27;
    }
  }
}

export class Hit extends State {
  constructor(game) {
    super("HIT", game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 10;
    this.game.player.frameY = 4;
    this.game.audioController.alien();
  }
  handleInput(input) {
    if (this.game.player.frameX >= 10 && this.game.player.onGround()) {
      this.game.player.setState(states.RUNNING, 1.4);
    }
  }
}
