const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")


const groundY = 350;

const cactus = {
    x: 100,
    y: groundY - 60,
    width: 35,
    height: 60,

    velocityY: 0,
    gravity: 1,
    jumpStrength: -18,
    isJumping: false

}

function drawBackground() {
    ctx.fillStyle = "#87ceeb"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "#8d6e63"
    ctx.fillRect(0, groundY, canvas.width, 50)
}

function drawCactus() {
    ctx.fillStyle = "#2e9d48"

    //Main body 

    ctx.fillRect(
        cactus.x +13,
        cactus.y,
        10,
        cactus.height
    )

    //Left arm

    ctx.fillRect(cactus.x, cactus.y + 25, 17, 8)
    ctx.fillRect(cactus.x, cactus.y + 15, 8, 18)
    
    //Right arm
    ctx.fillRect(cactus.x + 20, cactus.y +35, 15, 8)
    ctx.fillRect(cactus.x +27, cactus.y +25, 8, 18)

}

function jump() {
    if(cactus.isJumping === false) {
        cactus.velocityY = cactus.jumpStrength
        cactus.isJumping = true
    }
}

function updateCactus() {
    cactus.y += cactus.velocityY
    cactus.velocityY += cactus.gravity

    const floorPosition = groundY - cactus.height

    if( cactus.y >= floorPosition) {
        cactus.y = floorPosition
        cactus.velocityY = 0
        cactus.isJumping = false
    }
}

//Spacebar control
document.addEventListener("keydown", function(event){
    if (event.code === "Space") {
        event.preventDefault()
        jump()
    }
})


function drawGame() {
    drawBackground()
    drawCactus()
}

//Continous update the game

function gameLoop() {
    updateCactus()
    drawGame()

    requestAnimationFrame(gameLoop)
}

gameLoop()