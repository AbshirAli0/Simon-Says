class GameLogic {
  constructor(name) {
    this.turn = "cpu";
    this.name = name;
    this.timer = 0;
    this.timerInterval = null;
    this.timerDisplay = null;
    this.level = 0;
    this.patternMemory = [];
    this.userFeedback = [];
    this.colors = ["blue", "yellow", "red", "green"];
    this.playerPrompt = document.getElementById("playerPrompt");
    this.updatePlayerPrompt = (turn) => {
      this.playerPrompt.style.color="black"
      if (turn === "cpu") {
        this.playerPrompt.textContent = "CPU's Turn";
        this.playerPrompt.style.fontStyle = "italic";
      } else if (turn === "player") {
        this.playerPrompt.textContent = `${this.name}'s turn`;
        this.playerPrompt.style.fontStyle = "italic";
      } else if (turn !== "cpu" && turn !== "player") {
        this.playerPrompt.textContent = "GAME OVER: click on BEGIN GAME to start again";
        this.playerPrompt.style.fontStyle = "normal";
      }
    };
  }
  playSound(sound) {
    let beepSound = document.getElementById(sound);
    beepSound.play();
  }
  levelChange() {
    this.level++;
    const levelElement = document.getElementById("level");
    levelElement.textContent = this.level;
  }
  startTimer() {
    this.timerDisplay = document.getElementById("timer");
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      this.timer++;
      this.updateTimerDisplay();
    }, 1000);
  }
  updateTimerDisplay() {
    const minutes = Math.floor(this.timer / 60);
    const seconds = this.timer % 60;
    this.timerDisplay.textContent = `${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  }
  stopTimer() {
    clearInterval(this.timerInterval);
  }
  colorPicker() {
    return Math.floor(Math.random() * this.colors.length);
  }
  restartGame() {
    this.stopTimer();
    const levelElement = document.getElementById("level");
    levelElement.textContent = 0;
    this.level = 0;
    this.timer = 0;
    this.patternMemory = [];
    this.userFeedback = [];
    this.timerDisplay.textContent = "0:00";
    this.updatePlayerPrompt()
    this.turn = "cpu";
  }
  endGame() {
    this.turn = null;
    this.updatePlayerPrompt();
    this.resetGame();
  }
  resetGame() {
    this.stopTimer();
    this.patternMemory = [];
    this.userFeedback = [];
    this.level = 0;
  }
  clearSquareStyles() {
    const squares = document.querySelectorAll(".squares div");
    squares.forEach((square) => {
      square.style.opacity = 1;
    });
  }
  addHoverEffect() {
    const squares = document.querySelectorAll(".squares div");
    squares.forEach((square) => {
      square.classList.add("squares-hover");
    });
  }
  removeHoverEffect() {
    const squares = document.querySelectorAll(".squares div");
    squares.forEach((square) => {
      square.classList.remove("squares-hover");
    });
  }
  async cpuTurn() {
    this.updatePlayerPrompt("cpu");
    this.removeHoverEffect();
    this.clearSquareStyles();
    for (let idx = 0; idx < this.patternMemory.length; idx++) {
      const colorInMemory = this.patternMemory[idx];
      await new Promise((resolve) => {
        setTimeout(() => {
          const gameSquareElement = document.querySelector(
            `[data-color="${colorInMemory}"]`
          );
          gameSquareElement.style.opacity = 0.2;
          setTimeout(() => {
            gameSquareElement.style.opacity = 1;
            resolve();
          }, 800);
          //beep sound play here
          this.playSound(`${colorInMemory}-sound`);
        }, 500);
      });
    }
    await this.cpuAddNewItems().then(() => {
      this.turn = "player";
      this.updatePlayerPrompt("player");
      this.clearSquareStyles();
      this.addHoverEffect();
    });
  }
  async cpuAddNewItems() {
    const randomColorIndex = this.colorPicker();
    const randomColor = this.colors[randomColorIndex];
    this.patternMemory.push(randomColor);
    let gameSquareElement = document.querySelector(
      `[data-color="${randomColor}"]`
    );
    await new Promise((resolve) => {
      setTimeout(() => {
        gameSquareElement.style.opacity = 0.2;
        this.playSound(`${randomColor}-sound`);
        setTimeout(() => {
          gameSquareElement.removeAttribute("style");
          resolve();
        }, 800);
      }, 500);
    });
  }
  playerTurn(square) {
    if (this.turn === "player") {
      const color = square.getAttribute("data-color");
      this.userFeedback.push(color);
      this.playSound(`${color}-sound`);
      const currentMoveIndex = this.userFeedback.length - 1;
      if (this.userFeedback[currentMoveIndex] !==this.patternMemory[currentMoveIndex]) {
        this.endGame();
        return;
      } 
      if (this.patternMemory.length === this.userFeedback.length) {
        this.levelChange(); 
        this.turn = "cpu";
        this.userFeedback = [];
        this.cpuTurn();
      }
    }
  }
}
let gameLogicInstance;
const startGame = () => {
  const playerName = document.getElementById("name").value;
  gameLogicInstance = new GameLogic(playerName);
  document.getElementById("landingPage-container").style.display = "none";
  document.getElementById("game-container").style.display = "flex";
  document.getElementById("timer").style.display = "none";
  document.getElementById("level").style.display = "none";
};
document.addEventListener("DOMContentLoaded", () => {
  const squares = document.querySelectorAll(".squares div");
  squares.forEach((square) => {
    square.addEventListener("click", () => {
      gameLogicInstance.playerTurn(square); // Pass the square element
    });
  });
});
const beginGame = () => {
  if (gameLogicInstance && gameLogicInstance.level === 0) {
    gameLogicInstance.timer = 0;
    gameLogicInstance.level = 0;
    const levelElement = document.getElementById("level");
    levelElement.textContent = 0;
    gameLogicInstance.startTimer();
    gameLogicInstance.turn = "cpu";
    document.getElementById("timer").style.display = "inline";
    document.getElementById("level").style.display = "inline";
    gameLogicInstance.cpuTurn();
  }
};
