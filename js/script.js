const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let score = 0;
let snake = [];
let food;
let d = "right";
let playGame;

function resetGame() {
  snake = [{
    x: Math.floor(Math.random() * rows) * scale,
    y: Math.floor(Math.random() * columns) * scale,
  }];
  food = {
    x: Math.floor(Math.random() * rows) * scale,
    y: Math.floor(Math.random() * columns) * scale,
  };
  d = "right";
  if (playGame) clearInterval(playGame);
  playGame = setInterval(draw, 100);
}

document.getElementById("playBtn").addEventListener("click", resetGame);

// Desktop keyboard input
document.onkeydown = direction;
function direction(event) {
  let key = event.keyCode;
  if (key == 37 && d != "right") d = "left";
  else if (key == 38 && d != "down") d = "up";
  else if (key == 39 && d != "left") d = "right";
  else if (key == 40 && d != "up") d = "down";
}

// Mobile buttons input
document.getElementById("btnUp").onclick = () => { if (d != "down") d = "up"; };
document.getElementById("btnDown").onclick = () => { if (d != "up") d = "down"; };
document.getElementById("btnLeft").onclick = () => { if (d != "right") d = "left"; };
document.getElementById("btnRight").onclick = () => { if (d != "left") d = "right"; };

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "red";
    ctx.fillRect(snake[i].x, snake[i].y, scale, scale);
    ctx.strokeRect(snake[i].x, snake[i].y, scale, scale);
  }

  ctx.fillStyle = "#ff0";
  ctx.strokeStyle = "green";
  ctx.fillRect(food.x, food.y, scale, scale);
  ctx.strokeRect(food.x, food.y, scale, scale);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d == "left") snakeX -= scale;
  if (d == "up") snakeY -= scale;
  if (d == "right") snakeX += scale;
  if (d == "down") snakeY += scale;

  if (snakeX >= canvas.width) snakeX = 0;
  if (snakeY >= canvas.height) snakeY = 0;
  if (snakeX < 0) snakeX = canvas.width - scale;
  if (snakeY < 0) snakeY = canvas.height - scale;

  let newHead = { x: snakeX, y: snakeY };

  if (snakeX === food.x && snakeY === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * rows) * scale,
      y: Math.floor(Math.random() * columns) * scale,
    };
  } else {
    snake.pop();
  }

  if (eatSelf(newHead, snake)) {
    clearInterval(playGame);
    alert("Game Over! Your score: " + score);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  snake.unshift(newHead);
}

function eatSelf(head, array) {
  for (let i = 1; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) return true;
  }
  return false;
}