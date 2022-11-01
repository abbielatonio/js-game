export class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 40;
    this.fontFamily = "Luckiest Guy";
    this.fontColor = "white";
    this.livesImages = document.getElementById("lives");
  }
  draw(context) {
    context.save();
    context.gradient = context.createLinearGradient(6, 38, 6, 70);
    context.gradient.addColorStop(0, "#ffb703");
    context.gradient.addColorStop(1, "#fcf18e");
    context.lineWidth = 2.5;
    context.strokeStyle = "black";
    context.font = this.fontSize + "px " + this.fontFamily + this.fontColor;
    context.textAlign = "left";
    context.fillStyle = context.gradient;

    context.font = this.fontSize * 1.5 + "px " + this.fontFamily;
    context.fillText("RUN SPACE BEBI", 250, 70);
    context.strokeText("RUN SPACE BEBI", 250, 70);

    context.font = this.fontSize + "px " + this.fontFamily;
    context.fillText("Score: " + this.game.score, 20, 80);
    context.strokeText("Score: " + this.game.score, 20, 80);

    context.font = this.fontSize * 0.8 + "px " + this.fontFamily;
    context.fillText("Time: " + (this.game.time * 0.001).toFixed(1), 740, 80);
    context.strokeText("Time: " + (this.game.time * 0.001).toFixed(1), 740, 80);

    for (let i = 0; i < this.game.lives; i++) {
      context.drawImage(this.livesImages, 35 * i + 20, 90, 30, 30);
    }

    if (this.game.gameOver) {
      context.textAlign = "center";
      if (this.game.score >= this.game.winningScore) {
        context.font = this.fontSize * 1.3 + "px " + this.fontFamily;
        context.fillText(
          "You got " + this.game.score + " points in 80 seconds!",
          this.game.width * 0.5,
          this.game.height * 0.5 - 20
        );
        context.strokeText(
          "You got " + this.game.score + " points in 80 seconds!",
          this.game.width * 0.5,
          this.game.height * 0.5 - 20
        );
        context.font = this.fontSize * 0.9 + "px " + this.fontFamily;
        context.fillText(
          "Good job bebi!",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
        context.strokeText(
          "Good job bebi!",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
      } else {
        context.font = this.fontSize * 2 + "px " + this.fontFamily;
        context.fillText(
          "Game over!",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
        context.strokeText(
          "Game over!",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
      }
    }
    context.restore();
  }
}
