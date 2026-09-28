import {
  GestureRecognizer,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/+esm";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const webcam = document.getElementById("webcam");
const gestureStatus = document.getElementById("gestureStatus");

const groundY = 350;

const cactus = {
  x: 100,
  y: groundY - 60,
  width: 35,
  height: 60,
  velocityY: 0,
  gravity: 1800,
  jumpStrength: -650,
  isJumping: false,
};

const dinosaurs = [];

let gameOver = false;
let animationId = null;
let previousGameTime = null;

let spawnTimer = 0;
let spawnDelay = randomSpawnDelay();

let score = 0;
let highScore =
  Number(localStorage.getItem("highScore")) || 0;

function randomSpawnDelay() {
  return 1100 + Math.random() * 900;
}

function drawBackground() {
  ctx.fillStyle = "#87ceeb";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#8d6e63";
  ctx.fillRect(0, groundY, canvas.width, 50);
}

function drawCactus() {
  ctx.fillStyle = "#2e9d48";

  ctx.fillRect(cactus.x + 13, cactus.y, 10, cactus.height);

  ctx.fillRect(cactus.x, cactus.y + 25, 17, 8);
  ctx.fillRect(cactus.x, cactus.y + 15, 8, 18);

  ctx.fillRect(cactus.x + 20, cactus.y + 35, 15, 8);
  ctx.fillRect(cactus.x + 27, cactus.y + 25, 8, 18);
}

function drawDinosaur(dinosaur) {
  ctx.save();

  ctx.translate(dinosaur.x + dinosaur.width, 0);
  ctx.scale(-1, 1);

  const x = 0;
  const y = dinosaur.y;

  ctx.fillStyle = "#2563eb";

  ctx.fillRect(x + 8, y + 25, 40, 28);
  ctx.fillRect(x + 35, y + 4, 35, 35);

  ctx.beginPath();
  ctx.moveTo(x + 10, y + 28);
  ctx.lineTo(x - 18, y + 14);
  ctx.lineTo(x + 10, y + 43);
  ctx.fill();

  ctx.fillRect(x + 15, y + 50, 9, 10);
  ctx.fillRect(x + 38, y + 50, 9, 10);
  ctx.fillRect(x + 40, y + 38, 16, 5);

  ctx.fillStyle = "#111827";
  ctx.fillRect(x + 48, y + 24, 22, 12);

  ctx.fillStyle = "#ffffff";

  for (let i = 0; i < 3; i++) {
    const toothX = x + 50 + i * 7;

    ctx.beginPath();
    ctx.moveTo(toothX, y + 24);
    ctx.lineTo(toothX + 5, y + 24);
    ctx.lineTo(toothX + 2.5, y + 31);
    ctx.fill();
  }

  ctx.fillRect(x + 55, y + 10, 8, 8);

  ctx.fillStyle = "#111827";
  ctx.fillRect(x + 59, y + 13, 3, 3);

  ctx.restore();
}

function spawnDinosaur() {
  const difficultySpeed =
    Math.floor(score / 100) * 12;

  dinosaurs.push({
    x: canvas.width + 20,
    y: groundY - 60,
    width: 55,
    height: 60,
    speed:
      360 +
      Math.random() * 100 +
      difficultySpeed,
  });
}

function updateDinosaurs(deltaTime) {
  spawnTimer += deltaTime * 1000;

  if (spawnTimer >= spawnDelay) {
    spawnDinosaur();
    spawnTimer = 0;
    spawnDelay = randomSpawnDelay();
  }

  for (let i = dinosaurs.length - 1; i >= 0; i--) {
    dinosaurs[i].x -= dinosaurs[i].speed * deltaTime;

    if (dinosaurs[i].x + dinosaurs[i].width < 0) {
      dinosaurs.splice(i, 1);
    }
  }
}

function jump() {
  if (!cactus.isJumping && !gameOver) {
    cactus.velocityY = cactus.jumpStrength;
    cactus.isJumping = true;
  }
}

function updateCactus(deltaTime) {
  cactus.velocityY += cactus.gravity * deltaTime;
  cactus.y += cactus.velocityY * deltaTime;

  const floorPosition = groundY - cactus.height;

  if (cactus.y >= floorPosition) {
    cactus.y = floorPosition;
    cactus.velocityY = 0;
    cactus.isJumping = false;
  }
}

function drawScore() {
  ctx.fillStyle = "#111827";
  ctx.font = "24px Arial";
  ctx.textAlign = "left";

  ctx.fillText(`Score: ${Math.floor(score)}`, 20, 35);
  ctx.fillText(`Best: ${highScore}`, 20, 65);
}

function drawGame() {
  drawBackground();
  drawCactus();
  drawScore();

  for (const dinosaur of dinosaurs) {
    drawDinosaur(dinosaur);
  }
}

function checkCollision() {
  const padding = 7;

  for (const dinosaur of dinosaurs) {
    if (
      cactus.x + padding <
        dinosaur.x + dinosaur.width - padding &&
      cactus.x + cactus.width - padding >
        dinosaur.x + padding &&
      cactus.y + padding <
        dinosaur.y + dinosaur.height - padding &&
      cactus.y + cactus.height - padding >
        dinosaur.y + padding
    ) {
      gameOver = true;

      const finalScore = Math.floor(score);

      if (finalScore > highScore) {
        highScore = finalScore;
        localStorage.setItem("highScore", highScore);
      }

      return;
    }
  }
}

function drawGameOver() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";

  ctx.font = "40px Arial";
  ctx.fillText("Game Over", canvas.width / 2, 160);

  ctx.font = "24px Arial";
  ctx.fillText(
    `Final Score: ${Math.floor(score)}`,
    canvas.width / 2,
    200
  );

  ctx.font = "18px Arial";
  ctx.fillText(
    "Press R or tap to restart",
    canvas.width / 2,
    240
  );
}

function restartGame() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
  }

  gameOver = false;
  score = 0;

  spawnTimer = 0;
  spawnDelay = randomSpawnDelay();

  cactus.y = groundY - cactus.height;
  cactus.velocityY = 0;
  cactus.isJumping = false;

  dinosaurs.length = 0;
  spawnDinosaur();

  previousGameTime = null;
  animationId = requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", function (event) {
  if (event.code === "Space" && !gameOver) {
    event.preventDefault();
    jump();
  }

  if (event.code === "KeyR" && gameOver) {
    restartGame();
  }
});

canvas.addEventListener("pointerdown", function () {
  if (gameOver) {
    restartGame();
  } else {
    jump();
  }
});

let gestureRecognizer;
let lastVideoTime = -1;
let lastDetectionTime = 0;

let jumpReady = true;
let previousGesture = null;
let stableGesture = null;
let stableFrames = 0;

async function startGestureControl() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
  );

  gestureRecognizer =
    await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/latest/gesture_recognizer.task",
      },
      runningMode: "VIDEO",
      numHands: 1,
    });

  const stream =
    await navigator.mediaDevices.getUserMedia({
      video: {
        width: 320,
        height: 240,
        frameRate: 30,
      },
    });

  webcam.srcObject = stream;
  webcam.addEventListener("loadeddata", detectGesture);
}

function handleGesture(gesture) {
  if (gesture === "Open_Palm" && jumpReady) {
    jumpReady = false;

    if (gameOver) {
      restartGame();
      gestureStatus.textContent = "✋ Game restarted";
    } else {
      jump();
      gestureStatus.textContent = "✋ Jump!";
    }
  }

  if (gesture === "Closed_Fist") {
    jumpReady = true;

    gestureStatus.textContent =
      "✊ Ready. Open your palm to jump";
  }
}

function detectGesture() {
  const now = performance.now();

  if (
    gestureRecognizer &&
    webcam.readyState >= 2 &&
    webcam.currentTime !== lastVideoTime &&
    now - lastDetectionTime >= 50
  ) {
    lastDetectionTime = now;
    lastVideoTime = webcam.currentTime;

    const results =
      gestureRecognizer.recognizeForVideo(
        webcam,
        now
      );

    const detectedGesture =
      results.gestures?.[0]?.[0];

    const gesture =
      detectedGesture?.categoryName;

    const confidence =
      detectedGesture?.score || 0;

    if (
      confidence >= 0.5 &&
      (gesture === "Open_Palm" ||
        gesture === "Closed_Fist")
    ) {
      if (gesture === previousGesture) {
        stableFrames++;
      } else {
        previousGesture = gesture;
        stableFrames = 1;
      }

      if (
        stableFrames >= 1 &&
        stableGesture !== gesture
      ) {
        stableGesture = gesture;
        handleGesture(gesture);
      }
    } else {
      previousGesture = null;
      stableGesture = null;
      stableFrames = 0;

      gestureStatus.textContent = jumpReady
        ? "📷 Show your open palm to jump"
        : "✊ Close your fist to get ready";
    }
  }

  requestAnimationFrame(detectGesture);
}

startGestureControl().catch((error) => {
  console.error(error);

  gestureStatus.textContent =
    "❌ Camera or gesture control failed";
});

function gameLoop(currentTime) {
  if (previousGameTime === null) {
    previousGameTime = currentTime;
  }

  const deltaTime = Math.min(
    (currentTime - previousGameTime) / 1000,
    0.033
  );

  previousGameTime = currentTime;

  if (!gameOver) {
    updateCactus(deltaTime);
    updateDinosaurs(deltaTime);
    checkCollision();

    score += deltaTime * 10;
  }

  drawGame();

  if (gameOver) {
    drawGameOver();
    animationId = null;
    return;
  }

  animationId = requestAnimationFrame(gameLoop);
}

spawnDinosaur();
animationId = requestAnimationFrame(gameLoop);