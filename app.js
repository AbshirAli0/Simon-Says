class GameLogic{
    constructor(name){
        this.name = name
        this.isAlive = true
        this.timer = 0
        this.timerInterval = null
        this.timerDisplay = null
        this.level = 0
    }
    levelChange(){
        const level = document.getElementById("level")
        this.level++
        level.textContent = this.level

    }
    startTimer(){
      this.timerDisplay = document.getElementById("timer")
      this.updateTimerDisplay()
      this.timerInterval = setInterval(() => {
        this.timer++;
        this.updateTimerDisplay()
        if (this.timer % 20 === 0){
            this.levelChange()
        }
      }, 100);
    }
    updateTimerDisplay(){
        const minutes = Math.floor(this.timer / 60)
        const seconds = this.timer % 60
        this.timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    stopTimer(){
        clearInterval(this.timerInterval)
    }
}

let gameLogicInstance

const startGame = () => {
    const playerName = document.getElementById("name").value
    gameLogicInstance = new GameLogic(playerName)
    document.getElementById("landingPage-container").style.display = "none";
    document.getElementById("game-container").style.display="flex";

}

const beginGame = () => {
   if(gameLogicInstance){
    gameLogicInstance.startTimer()
    gameLogicInstance.levelChange()
   } 
}

//create