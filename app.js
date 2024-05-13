class GameLogic{
    constructor(name){
        this.turn = null
        this.name = name
        this.isAlive = true
        this.timer = 0
        this.timerInterval = null
        this.timerDisplay = null
        this.level = 0
        this.cpuPickedPerTurn = 1
        this.patterMemory = []
        this.userFeedback  = []
        this.colors = ["blue", "yellow", "red", "green"]
    }

    
    levelChange(){
        this.level++
        const levelElement = document.getElementById("level")
        levelElement.textContent = this.level
        if(this.level % 3 === 0){
            this.cpuPickedPerTurn += 2
        }

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
    colorPicker(){
        Math.floor(Math.random() * this.colors.length)
    }
    arraysMatch(patterMemory,userFeedback){
        for (let i = 0; i < patterMemory.length; i++) {

            if (patterMemory[i] !== userFeedback[i]) {
    
                return false;
    
            }
    
    }
    return true
}
    restartGame(){
        this.stopTimer()
        const levelElement = document.getElementById("level")
        levelElement.textContent = 0 
        this.level = 0    
        this.timer = 0 
        this.timerDisplay.textContent = "0:00";
    }
    cpuTurn(){
         //if arraysMatch(patterMemory,userFeedback) === false, end game

    for (let idx = 0; idx < this.patterMemory.length; idx++) {
        const colorInMemory = this.patterMemory[idx];
  
        setTimeout(() => {
          const gameSquareElement = document.querySelector(
            `[data-color="${colorInMemory}"]`
          );
  
          gameSquareElement.style.opacity = 0.5;
  
          //beep sound play here
  
          //add opacity to sqare that is lit up
        }, idx * 5000);
      }
  
      // // cpu picks new item based on this.cpuPickedPerTurn
      // cpuAddNewItems(){
          /* 
          const newPatternItems = Array.from(Array(this.cpuPickedPerTurn).keys())
          
  
          for loop for this newPatternItems {
              const randomColorIndex = colorPicker()
              const randomColor = colors[randomColorIndex]
  
              patternMemory.push(randomColor)
  
          }
          */
      // }
      GameLogic.cpuCounter();
      this.turn = "player";
      // prompt user to select square
      /// create a function: playerPrompt(), which will provide a text that explains whos turn it is. default is cpu turn.
    }
    playerTurn(element){
        if(this.turn === "player"){

            const colorPicked = element.getAttribute("data-color");
        
            this.userFeedback.push(colorPicked);
    
            if(this.patterMemory.length === this.userFeedback.length ) {
    
                
                this.turn = "cpu";
                
                this.cpuTurn()
            }
        }
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
        gameLogicInstance.startTimer()
        gameLogicInstance.turn = "cpu"

        document.getElementById("timer").style.display="inline"
        document.getElementById("level").style.display="inline"
        gameLogicInstance.cpuTurn()

    } 
}