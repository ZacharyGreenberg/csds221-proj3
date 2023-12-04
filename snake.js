//board
var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;

//snake head
var snakeX = blockSize*5;
var snakeY = blockSize*5;
var velocityX = 0;
var velocityY = 0;
let direction = 'left';
let headImageLoaded = false;
const headImages = {
    'up': 'headUp.png',
    'down': 'headDown.png',
    'left': 'headLeft.png',
    'right': 'headRight.png',
  };
const headImage = new Image();
headImage.onload = () => {
    headImageLoaded = true;
    update();
  };
  headImage.src = headImages[direction];

const imageScale = headImage.width/blockSize;
//snake body
var snakeBody = [];
const bodyImage = new Image();
bodyImage.onload = () => {
    
    requestAnimationFrame(update); 
  };
bodyImage.src = "body.png";


//food
var foodX;
var foodY;
let score = 0;
let highestScore = localStorage.getItem('snakeHighScore') || 0;
const fruitImage = new Image();
fruitImage.src = 'apple.png';

var gameOver = false;

window.onload=function(){
    board = document.getElementById("board");
    board.height = rows*blockSize;
    board.width = cols*blockSize;
    context = board.getContext("2d");
    placeFood();
    document.addEventListener("keyup", changeDirection);
    //update();
    setInterval(update, 100);
}

function update(){
    if(!context ||gameOver){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);
    for(let i = 0; i<cols; i++){
        for(let j = 0; j<rows; j++){
            context.fillStyle = (i + j) % 2 === 0 ? '#7CFC00' : '#228B22'; // Green and light green squares
            context.fillRect(i * blockSize, j * blockSize, blockSize, blockSize);
        }
    }
    
    const scoreContainer = document.getElementById('score-container');
    scoreContainer.innerHTML = 'Score: ' + score;
    context.drawImage(fruitImage, foodX, foodY, blockSize, blockSize);

    if(snakeX == foodX && snakeY == foodY){
        score++;
        snakeBody.push([foodX,foodY]);
        placeFood();
    }
    for(let i = snakeBody.length-1; i>0; i--){
        snakeBody[i] = snakeBody[i-1];
    }
    if(snakeBody.length){
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle = "blue";
    snakeX += velocityX*blockSize;
    snakeY += velocityY*blockSize;
    drawRotatedImage(headImage, snakeX, snakeY, blockSize, blockSize, direction);
    for(let i = 0; i < snakeBody.length; i++){
        context.drawImage(bodyImage, snakeBody[i][0],snakeBody[i][1], blockSize, blockSize);
    }

    function updateHeadImage() {
        headImage.src = headImages[direction];
      }
    //game over
    if(snakeX<0 || snakeX>(cols-1)*blockSize || snakeY<0 || snakeY>(rows-1)*blockSize){
        gameOver = true;
        showGameOverPopup();
        return;
    }
    for(let i=0; i<snakeBody.length; i++){
        if(snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]){
            gameOver = true;
            showGameOverPopup();
        return;
        }
    }
    
}

function changeDirection(e){
    if(e.code == "ArrowUp" && velocityY != 1){
        direction = 'up';
        velocityX = 0;
        velocityY = -1;
    }
    else if(e.code == "ArrowDown" && velocityY != -1){
        direction = 'down';
        velocityX = 0;
        velocityY = 1;
    }
    else if(e.code == "ArrowLeft" && velocityX != 1){
        direction = 'left';
        velocityX = -1;
        velocityY = 0;
    }
    else if(e.code == "ArrowRight" && velocityX != -1){
        direction = 'right';
        velocityX = 1;
        velocityY = 0;
    }
    headImage.src = headImages[direction];
    //requestAnimationFrame(update);
}

function drawRotatedImage(image, x, y, width, height, angle) {
    context.save();
    context.translate(x + width / 2, y + height / 2);
    context.rotate(angleToRadians(angle));
    context.drawImage(image, -width / 2, -height / 2, width, height);
    context.restore();
  }
  

function angleToRadians(angle) {
    return (angle * Math.PI) / 180;
  }


//place food randomly
function placeFood(){
    foodX = Math.floor(Math.random()*(cols-1))*blockSize;
    foodY = Math.floor(Math.random()*(rows-1))*blockSize;
}
function reset(){
    window.location.reload();
}

function showGameOverPopup() {
    // Create a container element for the popup
    const popupContainer = document.createElement('div');
    popupContainer.style.position = 'fixed';
    popupContainer.style.top = '50%';
    popupContainer.style.left = '50%';
    popupContainer.style.transform = 'translate(-50%, -50%)';
    popupContainer.style.background = 'white';
    popupContainer.style.padding = '20px';
    popupContainer.style.border = '2px solid black';
    popupContainer.style.textAlign = 'center';
  
    // Display current score
    const currentScoreText = document.createElement('p');
    currentScoreText.textContent = 'Current Score: ' + score;
    popupContainer.appendChild(currentScoreText);
  
    // Update highest score if necessary
    if (score > highestScore) {
        highestScore = score;
        localStorage.setItem('snakeHighScore', highestScore);
      }
  
    // Display highest recorded score
    const highestScoreText = document.createElement('p');
    highestScoreText.textContent = 'Highest Score: ' + highestScore;
    popupContainer.appendChild(highestScoreText);
  
    // Display reset button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', reset);
    popupContainer.appendChild(resetButton);
  
    // Append the popup container to the document body
    document.body.appendChild(popupContainer);
  }