const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const groundY = 350;

const cactus = {
  x: 100,
  y: groundY - 60,
  width: 35,
  height: 60,

  velocityY: 0,
  gravity: 1,
  jumpStrength: -18,
  isJumping: false,
};

//Stores dinosaur obstacel GG - Piyushraj
const dinosaurs = [
  {
    x: 700,
    y: groundY - 60,
    width: 55,
    height: 60,
    speed: 6,
  },
];

//dino spwaning
let spawnTimer = 0;
let spawnDelay = 120;

function drawBackground() {
  ctx.fillStyle = "#87ceeb";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#8d6e63";
  ctx.fillRect(0, groundY, canvas.width, 50);
}

function drawCactus() {
  ctx.fillStyle = "#2e9d48";

  //Main body

  ctx.fillRect(cactus.x + 13, cactus.y, 10, cactus.height);

  //Left arm

  ctx.fillRect(cactus.x, cactus.y + 25, 17, 8);
  ctx.fillRect(cactus.x, cactus.y + 15, 8, 18);

  //Right arm
  ctx.fillRect(cactus.x + 20, cactus.y + 35, 15, 8);
  ctx.fillRect(cactus.x + 27, cactus.y + 25, 8, 18);
}

//Function that draws the dinosaur
function drawDinosaur(dinosaur) {
  ctx.save();

  // Flip dinosaur horizontally
  ctx.translate(dinosaur.x + dinosaur.width, 0);
  ctx.scale(-1, 1);

  const x = 0;
  const y = dinosaur.y;

  ctx.fillStyle = "#2563eb";

  // Body and head
  ctx.fillRect(x + 8, y + 25, 40, 28);
  ctx.fillRect(x + 35, y + 4, 35, 35);

  // Tail
  ctx.beginPath();
  ctx.moveTo(x + 10, y + 28);
  ctx.lineTo(x - 18, y + 14);
  ctx.lineTo(x + 10, y + 43);
  ctx.fill();

  // Legs
  ctx.fillRect(x + 15, y + 50, 9, 10);
  ctx.fillRect(x + 38, y + 50, 9, 10);

  // Small arm
  ctx.fillRect(x + 40, y + 38, 16, 5);

  // Mouth
  ctx.fillStyle = "#111827";
  ctx.fillRect(x + 48, y + 24, 22, 12);

  // Teeth
  ctx.fillStyle = "#ffffff";

  for (let i = 0; i < 3; i++) {
    const toothX = x + 50 + i * 7;

    ctx.beginPath();
    ctx.moveTo(toothX, y + 24);
    ctx.lineTo(toothX + 5, y + 24);
    ctx.lineTo(toothX + 2.5, y + 31);
    ctx.fill();
  }

  // Eye
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x + 55, y + 10, 8, 8);

  ctx.fillStyle = "#111827";
  ctx.fillRect(x + 59, y + 13, 3, 3);

  ctx.restore();
}




//Creates dinosaur
function spawnDinosaur() {
  dinosaurs.push({
    x: canvas.width,
    y: groundY - 60,
    width: 55,
    height: 60,
    speed: 6 + Math.floor(score /100),
  });
}

function updateDinosaurs() {
  spawnTimer++;

  if (spawnTimer >= spawnDelay) {
    spawnDinosaur();
    spawnTimer = 0;
  }

  for (let i = dinosaurs.length - 1; i >= 0; i--) {
    dinosaurs[i].x -= dinosaurs[i].speed;

    if (dinosaurs[i].x + dinosaurs[i].width < 0) {
      dinosaurs.splice(i, 1);
    }
  }
}

function jump() {
  if (cactus.isJumping === false) {
    cactus.velocityY = cactus.jumpStrength;
    cactus.isJumping = true;
  }
}

function updateCactus() {
  cactus.y += cactus.velocityY;
  cactus.velocityY += cactus.gravity;

  const floorPosition = groundY - cactus.height;

  if (cactus.y >= floorPosition) {
    cactus.y = floorPosition;
    cactus.velocityY = 0;
    cactus.isJumping = false;
  }
}

//Spacebar control
document.addEventListener("keydown", function (event) {
  if (event.code === "Space" && !gameOver) {
    event.preventDefault();
    jump();
  }

  if (event.code === "KeyR" && gameOver) {
    restartGame();
  }
});

//Mobile touch control
canvas.addEventListener("pointerdown", function() {
  if(gameOver) {
    restartGame();
  } else {
    jump();
  }
})

function drawGame() {
  drawBackground();
  drawCactus();
  drawScore();

  for (const dinosaur of dinosaurs) {
    drawDinosaur(dinosaur);
  }
}


let gameOver = false;

let score = 0;
let highScore = Number(localStorage.getItem("highScore")) || 0;

function drawScore() {
  ctx.fillStyle = "#111827";
  ctx.font = "24px Arial";
  ctx.textAlign = "left";

  ctx.fillText(`Score: ${Math.floor(score)}`, 20, 35);
  ctx.fillText(`Best: ${highScore}`, 20, 65);
}

function restartGame() {
  gameOver = false;
  score = 0;
  spawnTimer = 0;

  cactus.y = groundY - cactus.height;
  cactus.velocityY = 0;
  cactus.isJumping = false;

  dinosaurs.length = 0;

  spawnDelay = 120;
  spawnDinosaur();

  gameLoop();
}

function checkCollision() {
  for (const dinosaur of dinosaurs) {
    if(
      cactus.x < dinosaur.x + dinosaur.width &&
      cactus.x + cactus.width > dinosaur.x &&
      cactus.y < dinosaur.y + dinosaur.height && 
      cactus.y + cactus.height > dinosaur.y
    ) {
      gameOver = true;

      const finalScore = Math.floor(score);

      if(finalScore > highScore) {
        highScore = finalScore;
        localStorage.setItem("highScore", highScore);
      }
    }
  }
}

function drawGameOver() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  
  ctx.font = "40px Arial";
  ctx.fillText("Game Over", canvas.width /2, 160);


  ctx.font = "24px Arial";
  ctx.fillText(
    `Final Score: ${Math.floor(score)}`,
    canvas.width /2,
    200
  );

  ctx.font = "18px Arial";
ctx.fillText("Press R or tap to restart", canvas.width / 2, 240);
}

//Continous update the game
function gameLoop() {
  spawnDelay = Math.max(60, 120 - Math.floor(score/ 10));

  if (!gameOver) {
    updateCactus();
    updateDinosaurs();
    checkCollision();
    score += 0.1;
  }

  drawGame();

  if (gameOver) {
    drawGameOver();
    return;
  }
  
  requestAnimationFrame(gameLoop);
}
gameLoop();
