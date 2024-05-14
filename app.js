class GameLogic {
  constructor(name) {
    this.turn = "cpu";
    this.name = name;
    this.isAlive = true;
    this.timer = 0;
    this.timerInterval = null;
    this.timerDisplay = null;
    this.level = 0;
    this.cpuPickedPerTurn = 1;
    this.patternMemory = [];
    this.userFeedback = [];
    this.colors = ["blue", "yellow", "red", "green"];
  }

  levelChange() {
    this.level++;
    const levelElement = document.getElementById("level");
    levelElement.textContent = this.level;
      console.log("Level Has Been Updated");
  }
  startTimer() {
    this.timerDisplay = document.getElementById("timer");
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      this.timer++;
      this.updateTimerDisplay();
    }, 100);
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
  arraysMatch(patternMemory, userFeedback) {
    for (let i = 0; i < patternMemory.length; i++) {
      if (patternMemory[i] !== userFeedback[i]) {
        return false;
      }
    }
    return true;
  }
  restartGame() {
    this.stopTimer();
    const levelElement = document.getElementById("level");
    levelElement.textContent = 0;
    this.level = 0;
    this.timer = 0;
    this.timerDisplay.textContent = "0:00";
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
      console.log("I Worked too")
    });
  }
  removeHoverEffect() {
    const squares = document.querySelectorAll(".squares div");
    squares.forEach((square) => {
      square.classList.remove("squares-hover");
      console.log("I Worked ")
    });
  }
  async cpuTurn() {
    //if arraysMatch(patternMemory,userFeedback) === false, end game
    //CREATE ENDGAME LOGIC^
    this.removeHoverEffect();
    this.clearSquareStyles()

    for (let idx = 0; idx < this.patternMemory.length; idx++) {
      const colorInMemory = this.patternMemory[idx];

      await new Promise((resolve) => {
        setTimeout(() => {
          const gameSquareElement = document.querySelector(`[data-color="${colorInMemory}"]`);
          gameSquareElement.style.opacity = 0.2
          setTimeout(() => {
            gameSquareElement.style.opacity = 1
            resolve()
        }, 800)
          //beep sound play here
        }, 800);
        
      })
    }
    await this.cpuAddNewItems().then(() => {
      this.turn = "player";
      this.levelChange();
      this.clearSquareStyles()
      // (DONE) CLEAR ALL OPACITY ON SQUARES, THIS SHOULD HAPPEN WHEN WE SWITCH TO PLAYER TURN SO THAT ALL SQUARES LOOK SAME AS ORIGINAL
      this.addHoverEffect();
      console.log(
        "CPU turn finished",
        this.patternMemory,
        this.userFeedback,
        this.level
      );

      // prompt user to select square
      /// create a function: playerPrompt(), which will provide a text that explains whos turn it is. default is cpu turn.
    });
  }
  async cpuAddNewItems() {

    const randomColorIndex = this.colorPicker();
    const randomColor = this.colors[randomColorIndex];
    this.patternMemory.push(randomColor);

    let gameSquareElement = document.querySelector(`[data-color="${randomColor}"]`);

      await new Promise((resolve) => {
        setTimeout(() => {
          gameSquareElement.style.opacity = 0.3;
          //beep sound play here
          //add opacity to square that is lit up
          //
          setTimeout(() => {
            gameSquareElement.removeAttribute("style");
            resolve(); //EXITS PROMISE
          }, 800);
        }, 800);
      });
  }
// HERE, CREATE A FUNCTION TO MAKE A BEEP SOUND, AND THEN CALL THAT IN AWAIT PROMISE FUNCTION
  playerTurn(square) {
    if (this.turn === "player") {
      const color = square.getAttribute("data-color");
      this.userFeedback.push(color);
      console.log(
        "PLAYER clicked =>",
        this.patternMemory,
        this.userFeedback,
        this.level
      );

      if (this.patternMemory.length === this.userFeedback.length) {
        this.turn = "cpu";
        console.log(
          "END OF PLAYER TURN",
          this.patternMemory,
          this.userFeedback,
          this.level
        );
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
    gameLogicInstance.startTimer();
    gameLogicInstance.turn = "cpu";

    document.getElementById("timer").style.display = "inline";
    document.getElementById("level").style.display = "inline";
    gameLogicInstance.cpuTurn();
  }
};

// have an event listener that listens for an onClick
