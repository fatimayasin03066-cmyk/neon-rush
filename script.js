const player = document.getElementById("player");

const enemies = document.querySelectorAll(".enemy");
const coinsElements = document.querySelectorAll(".coin");

const scoreDisplay = document.getElementById("score");
const coinsDisplay = document.getElementById("coins");
const livesDisplay = document.getElementById("lives");
const speedDisplay = document.getElementById("speed");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

const gameOverScreen = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const finalCoins = document.getElementById("finalCoins");

const restartBtn = document.getElementById("restartBtn");

let playerPosition = 50;

let score = 0;
let coins = 0;
let lives = 3;

let gameRunning = true;
let canCrash = true;


/* --------------------
   MOVE PLAYER
-------------------- */

function moveLeft() {

    if (!gameRunning) return;

    playerPosition -= 8;

    if (playerPosition < 8) {
        playerPosition = 8;
    }

    player.style.left = playerPosition + "%";
}


function moveRight() {

    if (!gameRunning) return;

    playerPosition += 8;

    if (playerPosition > 92) {
        playerPosition = 92;
    }

    player.style.left = playerPosition + "%";
}


/* BUTTONS */

leftBtn.addEventListener("click", moveLeft);
rightBtn.addEventListener("click", moveRight);


/* KEYBOARD */

document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowLeft") {
        moveLeft();
    }

    if (event.key === "ArrowRight") {
        moveRight();
    }

});


/* --------------------
   SCORE
-------------------- */

setInterval(function() {

    if (!gameRunning) return;

    score++;

    scoreDisplay.textContent = score;

}, 100);


/* --------------------
   SPEED
-------------------- */

function getSpeed() {

    const speed = 2.5 + score / 500;

    const speedLevel = Math.min(
        5,
        Math.floor(score / 100) + 1
    );

    speedDisplay.textContent = speedLevel;

    return speed;
}


/* --------------------
   ENEMY CARS
-------------------- */

function moveEnemy(enemy) {

    let position = -100;

    const lanes = [15, 48, 72];

    let lane = Math.floor(Math.random() * lanes.length);

    enemy.style.left = lanes[lane] + "%";

    function animate() {

        if (!gameRunning) return;

        position += getSpeed();

        enemy.style.top = position + "px";

        checkCollision(enemy);

        if (position > 650) {

            position = -100;

            lane = Math.floor(Math.random() * lanes.length);

            enemy.style.left = lanes[lane] + "%";
        }

        requestAnimationFrame(animate);
    }

    animate();
}


/* --------------------
   BETTER COLLISION
-------------------- */

function checkCollision(enemy) {

    if (!canCrash) return;

    const playerRect = player.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    const playerX =
        playerRect.left + playerRect.width / 2;

    const playerY =
        playerRect.top + playerRect.height / 2;

    const enemyX =
        enemyRect.left + enemyRect.width / 2;

    const enemyY =
        enemyRect.top + enemyRect.height / 2;

    const distanceX = Math.abs(playerX - enemyX);
    const distanceY = Math.abs(playerY - enemyY);

    /*
       Cars only count as crashed when
       they are actually close to each other.
    */

    if (distanceX < 45 && distanceY < 50) {

        loseLife();

        enemy.style.top = "-150px";
    }
}


/* --------------------
   COINS
-------------------- */

function moveCoin(coin) {

    let position = -100;

    const lanes = [15, 48, 72];

    let lane = Math.floor(Math.random() * lanes.length);

    coin.style.left = lanes[lane] + "%";

    function animate() {

        if (!gameRunning) return;

        position += getSpeed();

        coin.style.top = position + "px";

        checkCoinCollision(coin);

        if (position > 650) {

            position = -100;

            lane = Math.floor(Math.random() * lanes.length);

            coin.style.left = lanes[lane] + "%";
        }

        requestAnimationFrame(animate);
    }

    animate();
}


/* --------------------
   COIN COLLISION
-------------------- */

function checkCoinCollision(coin) {

    const playerRect = player.getBoundingClientRect();
    const coinRect = coin.getBoundingClientRect();

    const playerX =
        playerRect.left + playerRect.width / 2;

    const playerY =
        playerRect.top + playerRect.height / 2;

    const coinX =
        coinRect.left + coinRect.width / 2;

    const coinY =
        coinRect.top + coinRect.height / 2;

    const distanceX = Math.abs(playerX - coinX);
    const distanceY = Math.abs(playerY - coinY);

    if (distanceX < 40 && distanceY < 45) {

        coins++;

        score += 25;

        coinsDisplay.textContent = coins;
        scoreDisplay.textContent = score;

        coin.style.top = "-150px";
    }
}


/* --------------------
   LOSE LIFE
-------------------- */

function loseLife() {

    if (!gameRunning || !canCrash) return;

    lives--;

    livesDisplay.textContent = lives;

    /*
       Temporary protection after crash.
       This prevents one crash from
       removing multiple lives.
    */

    canCrash = false;

    player.style.transform =
        "translateX(-50%) scale(1.2)";

    setTimeout(function() {

        player.style.transform =
            "translateX(-50%) scale(1)";

        canCrash = true;

    }, 1000);


    if (lives <= 0) {

        endGame();
    }
}


/* --------------------
   GAME OVER
-------------------- */

function endGame() {

    gameRunning = false;

    finalScore.textContent = score;
    finalCoins.textContent = coins;

    gameOverScreen.style.display = "flex";
}


/* --------------------
   START ENEMIES
-------------------- */

enemies.forEach(function(enemy) {

    moveEnemy(enemy);

});


/* --------------------
   START COINS
-------------------- */

coinsElements.forEach(function(coin) {

    moveCoin(coin);

});


/* --------------------
   RESTART
-------------------- */

restartBtn.addEventListener("click", function() {

    location.reload();

});