let canvas = document.querySelector('canvas');
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let fire = document.querySelector('#fire')

let keyIsPressed = {};

let ballPosX = canvas.width/2;
let ballPosY = canvas.height/2;
let ballRegularSpeed = 10;
let ballSpeedX = 0;
let ballSpeedY = 0;
let ballRadius = 10;
let ballColor = "#fff";
let invisible = false;
let ballIsStationary = true;

let barWidth = 20;
let barSpeed = 1;
let barHeight = 100;
let barMovement = 15;

let barLeftPosX = 50;
let barLeftPosY = (canvas.height - barHeight) / 2;
let barLeftSpeed = 0;
let barLeftColor = "#0f7";

let barRightPosX = canvas.width - 50;
let barRightPosY = (canvas.height - barHeight) / 2;
let barRightSpeed = 0;
let barRightColor = "#0f7";

let frictionSpeed = 0.1;

// Bar stuff

function drawBar(x, y, color, width, height){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function barColision() {
    if (barLeftPosY > canvas.height - barHeight) {
        barLeftPosY = canvas.height - barHeight;
    } else if (barLeftPosY < 0) {
        barLeftPosY = 0;
        barLeftSpeed = 0;
    }
    if (barRightPosY > canvas.height - barHeight) {
        barRightPosY = canvas.height - barHeight;
    } else if (barRightPosY < 0) {
        barRightPosY = 0;
        barRightSpeed = 0;
    }
}

// Controler stuff

function keydownHandler(e){
    keyIsPressed[e.code] = true;
    console.log(e.code);
}

function keyupHandler(e){
    keyIsPressed[e.code] = false;
}

window.addEventListener("keydown", keydownHandler);
window.addEventListener("keyup", keyupHandler);

function translateKeys(){
    if (keyIsPressed.KeyW) {
        barLeftPosY -= barMovement;
        barLeftSpeed -= barSpeed;
    } else if (keyIsPressed.KeyS) {
        barLeftPosY += barMovement;
        barLeftSpeed += barSpeed;
    } else {
        barLeftSpeed = 0;
    }
    if (keyIsPressed.ArrowUp) {
        barRightPosY -= barMovement;
        barRightSpeed -= barSpeed;
    } else if (keyIsPressed.ArrowDown) {
        barRightPosY += barMovement;
        barRightSpeed += barSpeed;
    } else {
        barRightSpeed = 0;
    }
    if (ballIsStationary){
        if (keyIsPressed.ArrowRight && keyIsPressed.KeyA) {
            ballPosX = canvas.width/2;
            ballPosY = canvas.height/2;
            ballSpeedY = 0;
            ballSpeedX = 0;
            invisible = false;
            if(Math.random() > 0.5){
                ballSpeedX = ballRegularSpeed;
            } else {
                ballSpeedX = -ballRegularSpeed;
            }
            ballIsStationary = false;
        }
        if (keyIsPressed.KeyA) {
            barLeftPosY = (canvas.height - barHeight) / 2;
            barLeftColor = "#0f7";
        } else {
            barLeftColor = "#fff";
        }
        if (keyIsPressed.ArrowRight) {
            barRightPosY = (canvas.height - barHeight) / 2;
            barRightColor = "#0f7";
        } else {
            barRightColor = "#fff";
        }
    } else {
        barLeftColor = "#fff";
        barRightColor = "#fff";
    }
}

// ball stuff

function drawBall(x, y, color, radius){
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function ballSpeedCalculator(){
    return (ballSpeedX**2 + ballSpeedY**2)**0.5;
}

function addFriction(){
    let speed = ballSpeedCalculator();
    if (speed >= frictionSpeed){
        ballSpeedX -= (ballSpeedX / speed)*frictionSpeed;
        ballSpeedY -= (ballSpeedY / speed)*frictionSpeed;
    } else {
        ballSpeedX = 0;
        ballSpeedY = 0;
    }
}

function ballPhysics(){
    ballPosX += ballSpeedX;
    ballPosY += ballSpeedY;
    if (ballIsStationary) {
        ballSpeedY = 0;
        ballSpeedX = 0;
    }
    console.log(ballSpeedY);
    if (ballSpeedY > 22 || ballSpeedY < -22) {
        fire.play();
    }
}

function ballCollision(){
    let ballCollisionDepthUp = ballPosY - ballRadius;
    let ballCollisionDepthDown = ballPosY + ballRadius - canvas.height;
    let ballCollisionDepthLeftWall = ballPosX - ballRadius;
    let ballCollisionDepthRightWall = ballPosX + ballRadius - canvas.width;
    let ballCollisionDepthLeftBar = ballPosX - ballRadius - barWidth - barLeftPosX;
    let ballCollisionDepthRightBar = barRightPosX - (ballPosX + ballRadius);
    if (ballCollisionDepthUp < 0) {
        ballPosY -= ballCollisionDepthUp*2;
        ballSpeedY *= -1;
    }
    if (ballCollisionDepthDown > 0) {
        ballPosY -= ballCollisionDepthDown*2;
        ballSpeedY *= -1;
    }
    if (ballCollisionDepthLeftWall < 0) {
        ballIsStationary = true;
    }
    if (ballCollisionDepthRightWall > 0) {
        ballIsStationary = true;
    }
    if (!invisible) {
        if (ballCollisionDepthLeftBar < 0 && 
            ballPosY-ballRadius < barLeftPosY + barHeight &&
            ballPosY+ballRadius > barLeftPosY
            ) {
            ballPosX -= ballCollisionDepthLeftBar*2;
            ballSpeedX *= -1;
            ballSpeedY += (barLeftSpeed)* Math.random();
        } else if (ballCollisionDepthRightBar < 0 && 
            ballPosY-ballRadius < barRightPosY + barHeight &&
            ballPosY+ballRadius > barRightPosY
            ) {
            ballPosX += ballCollisionDepthRightBar*2;
            ballSpeedX *= -1;
            ballSpeedY += (barRightSpeed)* Math.random();
        } else if (ballPosX - ballRadius < barLeftPosX + barWidth ||
            ballPosX + ballRadius > barRightPosX) {
            invisible = true;
        }
    }
}

// rendering

function clearCanvas(){
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function render(){
    clearCanvas();
    drawBall(ballPosX, ballPosY, ballColor, ballRadius);
    drawBar(barLeftPosX, barLeftPosY, barLeftColor, barWidth, barHeight);
    drawBar(barRightPosX, barRightPosY, barRightColor, barWidth, barHeight);
}

function frame(){
    translateKeys();
    barColision();
    ballPhysics();
    ballCollision();
    render();
    requestAnimationFrame(frame);
}
frame();