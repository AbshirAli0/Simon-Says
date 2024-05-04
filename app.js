class Player{
    constructor(name){
        this.name = name
        this.isAlive = true
        this.timer = 0
    }
}

let yourPlayer

const startGame = () => {
    const playerName = document.getElementById("name").value
    yourPlayer = new Player(playerName)
    document.getElementById("landingPage-container").style.display = "none";
    document.getElementById("game-container").style.display="block";

}