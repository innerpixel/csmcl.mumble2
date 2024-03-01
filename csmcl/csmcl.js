//STEP 1: setting up the environment
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.style.backgroundColor = "black";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const   mouse = {
    x: 0,
    y: 0,
    down: false
};

// 2 march 2024 00:00:00


putWallsAround(0, 0, canvas.clientWidth, canvas.clientHeight);

/////////////////////////////////////////////////////////////
// The game logic starts here


// 
window.addEventListener("mousemove", function(event){
    let rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
});
window.addEventListener("click", function(event){
    mouse.down = true;
});

function print (text, x, y, color){
    ctx.save();
    ctx.font = "30px Arial";
    ctx.shadowColor = "lightgreen";
    ctx.shadowBlur = 15;

    ctx.fillStyle = color;
    ctx.fillText(text, x, y);

    let lengthText =  ctx.measureText(text).width;
    ctx.strokeStyle = (reds > blues) ? "red" : "blue";
    ctx.lineWidth = 3;
    ctx.shadowColor = "yellow";
    // draw rectangle with a padding of 20 px around the text
    ctx.strokeRect(x - 20, y - 30, lengthText + 40, 50);
    ctx.stroke();
    ctx.restore();
}

function printHeader(text, x, y, color){
    ctx.beginPath();
    ctx.save();
    ctx.shadowColor = "lightgreen";
    ctx.shadowBlur = 15;
    
    ctx.font = "60px Arial";
    ctx.fillStyle = color;
    ctx.fillText(text, x, y + 65);
    
    let lengthText =  ctx.measureText(text).width;
    ctx.strokeStyle = (reds > blues) ? "red" : "blue";
    ctx.lineWidth = 3;
    ctx.shadowColor = "yellow";
    // draw rectangle with a padding of 20 px around the text
    ctx.strokeRect(x - 20, y - 10, lengthText + 40, 100);
    ctx.stroke();
    ctx.restore();
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "white";
}

function drawInterface(){
    printHeader("CSMCL.SPACE", canvas.clientWidth/2 - 150, canvas.clientHeight/2 - 100, "cyan");
    print("Red: " + reds, canvas.clientWidth / 4 , canvas.clientHeight - 40, "red");
    print("Blue: " + blues, canvas.clientWidth / 4 * 3, canvas.clientHeight - 40, "cyan");
    // draw line between the text boxes
    ctx.beginPath();
    ctx.moveTo(canvas.clientWidth / 4 + 150, canvas.clientHeight - 40); 
    ctx.lineTo(canvas.clientWidth / 4 * 3 - 50, canvas.clientHeight - 40);
    ctx.stroke();
    ctx.closePath();
}

function userInteraction(){
    // handle mouse input; if moving the mouse, move the player towards the mouse
    
   
    BODIES.forEach((b) => {
        if(b.player){
            b.keyControl();
            if(mouse.down){
                b.vel.set((mouse.x - b.pos.x)/50, (mouse.y - b.pos.y)/50);
            }
        }
    })
}


function physicsLoop(timestamp) {
    COLLISIONS.length = 0;
    
    BODIES.forEach((b) => {
        b.reposition();
    });

    BODIES.forEach((b, index) => {
        // check for collision
        for(let bodyPair = index+1; bodyPair < BODIES.length; bodyPair++){
           if((BODIES[index].layer === BODIES[bodyPair].layer ||
               BODIES[index].layer === 0 || BODIES[bodyPair].layer === 0) && 
               collide(BODIES[index], BODIES[bodyPair])){
                    let bestSat = collide(BODIES[index], BODIES[bodyPair]);
                    COLLISIONS.push(new CollData(BODIES[index], BODIES[bodyPair], bestSat.axis, bestSat.pen, bestSat.vertex));
           }
        }
    });

    COLLISIONS.forEach((c) => {
        c.penRes(); //penetration resolution
        c.collRes(); //collision resolution
    });
}

function renderLoop(){
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    
    // render the bodies
    BODIES.forEach((b) => {
        b.render();
        BODIES.forEach((b2) => {
            let distance = Math.sqrt((b.pos.x - b2.pos.x)**2 + (b.pos.y - b2.pos.y)**2);
            if (distance <= canvas.clientWidth * 0.10 && b.color === "red" && b2.color === "red" && b !== b2){
                ctx.strokeStyle = "red";
                ctx.beginPath();
                ctx.moveTo(b.pos.x, b.pos.y);
                ctx.lineTo(b2.pos.x, b2.pos.y);
                ctx.stroke();
            }
            if (distance <=200 && b.color === "blue" && b2.color === "blue" && b !== b2){
                ctx.strokeStyle = "blue";
                ctx.beginPath();
                ctx.moveTo(b.pos.x, b.pos.y);
                ctx.lineTo(b2.pos.x, b2.pos.y);
                ctx.stroke();
            }
        })
    })
    reds = randomObjects.filter((b) => b.color === "red").length;
    blues = randomObjects.filter((b) => b.color === "blue").length;    
    drawInterface();
}


function mainLoop(){
    userInteraction();
    gameLogic();
    physicsLoop();
    renderLoop();
    requestAnimationFrame(mainLoop);
}

function renderOnly(){
    renderLoop();
    requestAnimationFrame(renderOnly);
}



let randomObjects = [];


//Creating balls object with random arguments
for(let addBody = 0; addBody < 49; addBody++){
    let x = randInt(0, canvas.clientWidth);
    let y = randInt(0, canvas.clientHeight);
    let r = 25;
    let m = 5;

    let ballObj = new Ball(x, y, r, m);
       //  ballObj.setPosition(100, 100);
        //random blue or red  
        ballObj.color =     Math.random() > 0.5 ? 'red' : 'blue';
        ballObj.layer = 1;
        randomObjects.push(ballObj);
}
   


//setting the initial velocities
for (let i in randomObjects){
    if(randomObjects[i].m !== 0){
        randomObjects[i].vel.set(Math.random()*4-2, Math.random()*4-2);
    }
}

//creating the player
let playerBall = new Ball(320, 240, 10, 5);
playerBall.player = true;
playerBall.maxSpeed = 3;
playerBall.color = 'yellow' ; // "#5B2C6F";

let reds = 0;
let blues = 0;

//STEP 2: defining the game logic
function gameLogic(){
    for (let i in randomObjects){
        if(collide(randomObjects[i], playerBall)){
            randomObjects[i].setColor(randomObjects[i].color === "blue" ? "red" : "blue" );    
        }
        for (let j in randomObjects){
            if(i !== j){
                if(collide(randomObjects[i], randomObjects[j])){
                    randomObjects[i].setColor(randomObjects[i].color === "blue" ? "red" : "blue" );
                }        
            }
        }
        
    }
}

//STEP 3: handling the user input and the game loop
userInput(playerBall);
requestAnimationFrame(mainLoop);