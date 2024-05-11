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
        this.level++
        const levelElement = document.getElementById("level")
        levelElement.textContent = this.level

    }
    startTimer(){
      this.timerDisplay = document.getElementById("timer")
      this.levelChange()
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
    restartGame(){
        this.stopTimer()
        const levelElement = document.getElementById("level")
        levelElement.textContent = 0 
        this.level = 0    
        this.timer = 0 
        this.timerDisplay.textContent = "0:00";
    }
}

let gameLogicInstance

const startGame = () => {
    const playerName = document.getElementById("name").value
    gameLogicInstance = new GameLogic(playerName)
    document.getElementById("landingPage-container").style.display = "none";
    document.getElementById("game-container").style.display="flex";
    document.getElementById("timer").style.display="none"
    document.getElementById("level").style.display="none"


}

const beginGame = () => {
    if(gameLogicInstance && gameLogicInstance.level === 0) {
        gameLogicInstance.startTimer();
        document.getElementById("timer").style.display="inline"
        document.getElementById("level").style.display="inline"
    } 
}