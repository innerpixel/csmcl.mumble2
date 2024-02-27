// STEP 1: setting up the environment
// creating the starting objects and variables before starting the main loop
// for example: 
// const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth ;
canvas.height = window.innerHeight * 0.99 ;

const ctx = canvas.getContext('2d');
canvas.focus();

putWallsAround(0, 0, canvas.clientWidth, canvas.clientHeight);
    // crete 6 players
    let player = new Ball(100, 100, 30, 5);
    player.setColor("red");
    player.maxSpeed = 6;

let particles = []; 
for (let i = 0; i < 1; i++){
let ball = new Ball(Math.random()*canvas.clientWidth, Math.random()*canvas.clientHeight, 50, 5)
    ball.setColor('hsl(' + Math.random()*360 + ', 100%, 50%)');
    particles.push();
}

player.setColor("red");
player.maxSpeed = 5;

// STEP 2: defining the game logic
function gameLogic(){
    // this gets called periodically as part of the main loop
    // define the rules here
}

// handling the user input and the game loop
userInput(player);
requestAnimationFrame(mainLoop);
