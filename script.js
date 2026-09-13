/* =========================================================
   NEON SNAKE X
   Ultimate Arcade Edition
   No Login / No Server / No Database
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const overlayStart = document.getElementById("overlayStart");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const restartBtn = document.getElementById("restartBtn");

const startOverlay = document.getElementById("startOverlay");
const pauseOverlay = document.getElementById("pauseOverlay");
const gameOverOverlay = document.getElementById("gameOverOverlay");

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const levelEl = document.getElementById("level");
const comboEl = document.getElementById("combo");
const timerEl = document.getElementById("timer");

const modeNameEl = document.getElementById("modeName");

const coinDisplay = document.getElementById("coinDisplay");
const coinsEl = document.getElementById("coins");
const bestComboEl = document.getElementById("bestCombo");
const missionCountEl = document.getElementById("missionCount");

const finalScoreEl = document.getElementById("finalScore");
const finalCoinsEl = document.getElementById("finalCoins");
const finalLevelEl = document.getElementById("finalLevel");

const skinShop = document.getElementById("skinShop");
const missionsEl = document.getElementById("missions");

const soundBtn = document.getElementById("soundBtn");
const themeBtn = document.getElementById("themeBtn");


/* =========================================================
   GAME SETTINGS
========================================================= */

const GRID = 30;
const CELL = canvas.width / GRID;

const MODES = {

    classic: {
        name: "CLASSIC",
        speed: 115,
        walls: 0,
        time: Infinity
    },

    speed: {
        name: "SPEED RUSH",
        speed: 65,
        walls: 0,
        time: Infinity
    },

    time: {
        name: "TIME ATTACK",
        speed: 105,
        walls: 3,
        time: 60
    },

    walls: {
        name: "WALL MASTER",
        speed: 105,
        walls: 18,
        time: Infinity
    },

    portal: {
        name: "PORTAL",
        speed: 100,
        walls: 10,
        time: Infinity
    },

    survival: {
        name: "SURVIVAL",
        speed: 95,
        walls: 8,
        time: Infinity
    },

    maze: {
        name: "MAZE",
        speed: 105,
        walls: 35,
        time: Infinity
    }

};


/* =========================================================
   SKINS
========================================================= */

const SKINS = [

    {
        id: "green",
        name: "Neon",
        color: "#00ffd5",
        price: 0
    },

    {
        id: "blue",
        name: "Cyber",
        color: "#4d7cff",
        price: 50
    },

    {
        id: "purple",
        name: "Void",
        color: "#a855f7",
        price: 100
    },

    {
        id: "pink",
        name: "Plasma",
        color: "#ff3cac",
        price: 150
    },

    {
        id: "yellow",
        name: "Gold",
        color: "#ffd84d",
        price: 250
    },

    {
        id: "red",
        name: "Inferno",
        color: "#ff4567",
        price: 400
    }

];


/* =========================================================
   MISSIONS
========================================================= */

const MISSION_DATA = [

    {
        id: "score100",
        title: "Score 100 points",
        target: 100,
        type: "score",
        reward: 50
    },

    {
        id: "eat10",
        title: "Eat 10 food",
        target: 10,
        type: "food",
        reward: 40
    },

    {
        id: "combo5",
        title: "Reach x5 combo",
        target: 5,
        type: "combo",
        reward: 60
    },

    {
        id: "level5",
        title: "Reach level 5",
        target: 5,
        type: "level",
        reward: 100
    },

    {
        id: "score500",
        title: "Score 500 points",
        target: 500,
        type: "score",
        reward: 200
    }

];


/* =========================================================
   SAVED DATA
========================================================= */

let savedCoins =
    Number(localStorage.getItem("neonSnakeCoins")) || 0;

let highScore =
    Number(localStorage.getItem("neonSnakeHighScore")) || 0;

let bestCombo =
    Number(localStorage.getItem("neonSnakeBestCombo")) || 0;

let selectedSkin =
    localStorage.getItem("neonSnakeSkin") || "green";

let unlockedSkins =
    JSON.parse(
        localStorage.getItem("neonSnakeUnlockedSkins") ||
        '["green"]'
    );

let completedMissions =
    JSON.parse(
        localStorage.getItem("neonSnakeMissions") ||
        "[]"
    );

let soundEnabled =
    localStorage.getItem("neonSnakeSound") !== "false";


/* =========================================================
   GAME STATE
========================================================= */

let currentMode = "classic";

let snake = [];
let food = null;

let obstacles = [];
let portals = [];

let powerUp = null;

let direction = {
    x: 1,
    y: 0
};

let nextDirection = {
    x: 1,
    y: 0
};

let score = 0;
let level = 1;

let combo = 1;
let comboTimer = 0;

let lives = 3;

let foodEaten = 0;

let gameRunning = false;
let gamePaused = false;

let gameTimer = null;
let loopTimer = null;

let timeRemaining = Infinity;

let shieldActive = false;
let magnetActive = false;
let doubleScoreActive = false;
let slowActive = false;

let lastFoodTime = 0;

let audioContext = null;


/* =========================================================
   INITIAL UI
========================================================= */

function updateTopUI() {

    highScoreEl.textContent = highScore;

    coinsEl.textContent = savedCoins;
    coinDisplay.textContent = savedCoins;

    bestComboEl.textContent = bestCombo;

    const completed =
        completedMissions.length;

    missionCountEl.textContent =
        `${completed}/${MISSION_DATA.length}`;

}


updateTopUI();


/* =========================================================
   SOUND SYSTEM
========================================================= */

function initAudio() {

    if (!soundEnabled) return;

    if (!audioContext) {

        audioContext =
            new (window.AudioContext ||
                window.webkitAudioContext)();

    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

}


function beep(
    frequency = 440,
    duration = 0.08,
    type = "square",
    volume = 0.04
) {

    if (!soundEnabled) return;

    try {

        initAudio();

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();

        oscillator.type = type;

        oscillator.frequency.value =
            frequency;

        gain.gain.value = volume;

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start();

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + duration
        );

        oscillator.stop(
            audioContext.currentTime + duration
        );

    } catch (error) {

        console.log("Audio unavailable");

    }

}


function foodSound() {

    beep(650, .07);
    setTimeout(() => beep(900, .07), 60);

}


function crashSound() {

    beep(130, .2, "sawtooth", .06);

}


function powerSound() {

    beep(700, .08);
    setTimeout(() => beep(1100, .12), 80);

}


/* =========================================================
   DRAWING
========================================================= */

function clearCanvas() {

    ctx.fillStyle = "#03060b";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}


function drawGrid() {

    ctx.strokeStyle =
        "rgba(0,255,213,.055)";

    ctx.lineWidth = 1;

    for (let i = 0; i <= GRID; i++) {

        const p = i * CELL;

        ctx.beginPath();

        ctx.moveTo(p, 0);
        ctx.lineTo(p, canvas.height);

        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(0, p);
        ctx.lineTo(canvas.width, p);

        ctx.stroke();

    }

}


function roundedRect(
    x,
    y,
    width,
    height,
    radius
) {

    const r =
        Math.min(radius, width / 2, height / 2);

    ctx.beginPath();

    ctx.moveTo(x + r, y);

    ctx.arcTo(
        x + width,
        y,
        x + width,
        y + height,
        r
    );

    ctx.arcTo(
        x + width,
        y + height,
        x,
        y + height,
        r
    );

    ctx.arcTo(
        x,
        y + height,
        x,
        y,
        r
    );

    ctx.arcTo(
        x,
        y,
        x + width,
        y,
        r
    );

    ctx.closePath();

}


function drawSnake() {

    if (!snake.length) return;

    const skin =
        SKINS.find(s => s.id === selectedSkin) ||
        SKINS[0];

    snake.forEach((part, index) => {

        const x = part.x * CELL;
        const y = part.y * CELL;

        const padding = index === 0 ? 1 : 2;

        ctx.save();

        ctx.shadowBlur =
            index === 0 ? 18 : 10;

        ctx.shadowColor =
            skin.color;

        ctx.fillStyle =
            skin.color;

        roundedRect(
            x + padding,
            y + padding,
            CELL - padding * 2,
            CELL - padding * 2,
            6
        );

        ctx.fill();

        if (index === 0) {

            ctx.fillStyle = "#ffffff";

            const eyeSize = 3;

            let eye1X;
            let eye1Y;
            let eye2X;
            let eye2Y;

            if (direction.x === 1) {

                eye1X = x + CELL - 8;
                eye2X = x + CELL - 8;

                eye1Y = y + 7;
                eye2Y = y + CELL - 7;

            } else if (direction.x === -1) {

                eye1X = x + 8;
                eye2X = x + 8;

                eye1Y = y + 7;
                eye2Y = y + CELL - 7;

            } else if (direction.y === -1) {

                eye1X = x + 7;
                eye2X = x + CELL - 7;

                eye1Y = y + 8;
                eye2Y = y + 8;

            } else {

                eye1X = x + 7;
                eye2X = x + CELL - 7;

                eye1Y = y + CELL - 8;
                eye2Y = y + CELL - 8;

            }

            ctx.fillRect(
                eye1X - eyeSize / 2,
                eye1Y - eyeSize / 2,
                eyeSize,
                eyeSize
            );

            ctx.fillRect(
                eye2X - eyeSize / 2,
                eye2Y - eyeSize / 2,
                eyeSize,
                eyeSize
            );

        }

        ctx.restore();

    });

}


function drawFood() {

    if (!food) return;

    const x =
        food.x * CELL + CELL / 2;

    const y =
        food.y * CELL + CELL / 2;

    const pulse =
        Math.sin(Date.now() / 130) * 2;

    ctx.save();

    ctx.shadowBlur = 25;
    ctx.shadowColor = "#ff3cac";

    ctx.fillStyle = "#ff3cac";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        CELL * .30 + pulse * .15,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle = "#ffffff";

    ctx.beginPath();

    ctx.arc(
        x - 3,
        y - 3,
        2,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();

}


function drawObstacles() {

    obstacles.forEach(wall => {

        const x = wall.x * CELL;
        const y = wall.y * CELL;

        ctx.save();

        ctx.fillStyle =
            "rgba(255,69,103,.7)";

        ctx.shadowBlur = 12;
        ctx.shadowColor = "#ff4567";

        roundedRect(
            x + 2,
            y + 2,
            CELL - 4,
            CELL - 4,
            5
        );

        ctx.fill();

        ctx.restore();

    });

}


function drawPortals() {

    portals.forEach((portal, index) => {

        const x =
            portal.x * CELL + CELL / 2;

        const y =
            portal.y * CELL + CELL / 2;

        ctx.save();

        ctx.strokeStyle =
            index === 0
                ? "#4d7cff"
                : "#a855f7";

        ctx.lineWidth = 3;

        ctx.shadowBlur = 18;

        ctx.shadowColor =
            ctx.strokeStyle;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            CELL * .34,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        ctx.restore();

    });

}


function drawPowerUp() {

    if (!powerUp) return;

    const x =
        powerUp.x * CELL + CELL / 2;

    const y =
        powerUp.y * CELL + CELL / 2;

    const icons = {
        shield: "🛡️",
        magnet: "🧲",
        double: "⭐",
        slow: "🐌"
    };

    ctx.save();

    ctx.font =
        `${CELL * .75}px Arial`;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ffd84d";

    ctx.fillText(
        icons[powerUp.type],
        x,
        y
    );

    ctx.restore();

}


function drawLives() {

    ctx.save();

    ctx.font = "16px Arial";

    ctx.fillText(
        `❤️ ${lives}`,
        12,
        22
    );

    ctx.restore();

}


function draw() {

    clearCanvas();

    drawGrid();

    drawObstacles();

    drawPortals();

    drawFood();

    drawPowerUp();

    drawSnake();

    drawLives();

}


/* =========================================================
   RANDOM POSITION
========================================================= */

function randomPosition() {

    let position;

    let attempts = 0;

    do {

        position = {

            x: Math.floor(Math.random() * GRID),

            y: Math.floor(Math.random() * GRID)

        };

        attempts++;

    } while (

        (

            snake.some(
                p =>
                    p.x === position.x &&
                    p.y === position.y
            )

            ||

            obstacles.some(
                p =>
                    p.x === position.x &&
                    p.y === position.y
            )

            ||

            portals.some(
                p =>
                    p.x === position.x &&
                    p.y === position.y
            )

        )

        && attempts < 1000

    );

    return position;

}


/* =========================================================
   FOOD
========================================================= */

function createFood() {

    food = randomPosition();

}


function createPowerUp() {

    if (Math.random() > .35) return;

    const types = [
        "shield",
        "magnet",
        "double",
        "slow"
    ];

    powerUp = {

        ...randomPosition(),

        type:
            types[
                Math.floor(
                    Math.random() * types.length
                )
            ]

    };

}


/* =========================================================
   OBSTACLES
========================================================= */

function createObstacles() {

    obstacles = [];

    const count =
        MODES[currentMode].walls;

    let attempts = 0;

    while (
        obstacles.length < count &&
        attempts < 2000
    ) {

        const position = {

            x: Math.floor(
                Math.random() * GRID
            ),

            y: Math.floor(
                Math.random() * GRID
            )

        };

        const nearStart =
            position.x < 7 &&
            position.y < 7;

        const occupied =
            obstacles.some(
                wall =>
                    wall.x === position.x &&
                    wall.y === position.y
            );

        if (
            !occupied &&
            !nearStart
        ) {

            obstacles.push(position);

        }

        attempts++;

    }

}


/* =========================================================
   PORTALS
========================================================= */

function createPortals() {

    portals = [];

    if (currentMode !== "portal") {
        return;
    }

    portals.push(randomPosition());
    portals.push(randomPosition());

}


/* =========================================================
   GAME START
========================================================= */

function startGame() {

    initAudio();

    clearTimers();

    snake = [

        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }

    ];

    direction = {
        x: 1,
        y: 0
    };

    nextDirection = {
        x: 1,
        y: 0
    };

    score = 0;
    level = 1;

    combo = 1;

    lives = 3;

    foodEaten = 0;

    shieldActive = false;
    magnetActive = false;
    doubleScoreActive = false;
    slowActive = false;

    powerUp = null;

    gameRunning = true;
    gamePaused = false;

    timeRemaining =
        MODES[currentMode].time;

    createObstacles();
    createPortals();
    createFood();

    updateUI();

    startOverlay.classList.add("hidden");
    pauseOverlay.classList.add("hidden");
    gameOverOverlay.classList.add("hidden");

    pauseBtn.textContent = "⏸ PAUSE";

    beginLoop();

    startTimer();

    draw();

}


/* =========================================================
   LOOP
========================================================= */

function beginLoop() {

    clearInterval(loopTimer);

    const speed =
        getCurrentSpeed();

    loopTimer =
        setInterval(
            gameTick,
            speed
        );

}


function getCurrentSpeed() {

    let speed =
        MODES[currentMode].speed;

    if (
        currentMode === "classic"
    ) {

        speed -=
            Math.min(
                50,
                (level - 1) * 5
            );

    }

    if (
        currentMode === "survival"
    ) {

        speed -=
            Math.min(
                55,
                (level - 1) * 6
            );

    }

    if (slowActive) {

        speed *= 1.6;

    }

    return Math.max(45, speed);

}


function gameTick() {

    if (
        !gameRunning ||
        gamePaused
    ) {
        return;
    }

    direction = {
        ...nextDirection
    };

    let head = {

        x:
            snake[0].x +
            direction.x,

        y:
            snake[0].y +
            direction.y

    };


    /* PORTAL MODE */

    if (
        currentMode === "portal"
    ) {

        portals.forEach(
            (portal, index) => {

                if (
                    head.x === portal.x &&
                    head.y === portal.y
                ) {

                    const other =
                        portals[index === 0 ? 1 : 0];

                    head = {

                        x: other.x +
                            direction.x,

                        y: other.y +
                            direction.y

                    };

                    beep(850, .12);

                }

            }
        );

    }


    /* WALL WRAP FOR PORTAL */

    if (
        currentMode === "portal"
    ) {

        if (head.x < 0)
            head.x = GRID - 1;

        if (head.x >= GRID)
            head.x = 0;

        if (head.y < 0)
            head.y = GRID - 1;

        if (head.y >= GRID)
            head.y = 0;

    }


    /* NORMAL BORDER */

    else {

        if (
            head.x < 0 ||
            head.x >= GRID ||
            head.y < 0 ||
            head.y >= GRID
        ) {

            handleCollision(
                "border"
            );

            return;

        }

    }


    /* WALL COLLISION */

    const hitWall =
        obstacles.some(
            wall =>
                wall.x === head.x &&
                wall.y === head.y
        );

    if (hitWall) {

        handleCollision("wall");

        return;

    }


    /* SELF COLLISION */

    const hitSelf =
        snake.some(
            part =>
                part.x === head.x &&
                part.y === head.y
        );

    if (hitSelf) {

        handleCollision("self");

        return;

    }


    snake.unshift(head);


    /* POWER-UP COLLECTION */

    if (
        powerUp &&
        head.x === powerUp.x &&
        head.y === powerUp.y
    ) {

        activatePowerUp(
            powerUp.type
        );

        powerUp = null;

    }


    /* FOOD */

    if (
        food &&
        head.x === food.x &&
        head.y === food.y
    ) {

        eatFood();

    }

    else {

        snake.pop();

    }


    draw();

}


/* =========================================================
   FOOD COLLECTION
========================================================= */

function eatFood() {

    const now = Date.now();

    if (
        now - lastFoodTime < 3500
    ) {

        combo++;

    } else {

        combo = 1;

    }

    lastFoodTime = now;

    comboTimer = 3500;

    combo =
        Math.min(combo, 10);

    if (combo > bestCombo) {

        bestCombo = combo;

        localStorage.setItem(
            "neonSnakeBestCombo",
            bestCombo
        );

    }

    let points = 10 * combo;

    if (doubleScoreActive) {
        points *= 2;
    }

    score += points;

    foodEaten++;

    /* COINS */

    const coinReward =
        Math.max(
            1,
            Math.floor(combo / 2)
        );

    savedCoins += coinReward;

    localStorage.setItem(
        "neonSnakeCoins",
        savedCoins
    );

    /* LEVEL */

    const newLevel =
        Math.floor(
            score / 100
        ) + 1;

    if (newLevel > level) {

        level = newLevel;

        beep(1000, .15);

        if (
            currentMode === "classic" ||
            currentMode === "survival"
        ) {

            beginLoop();

        }

    }

    createFood();

    createPowerUp();

    foodSound();

    checkMissions();

    updateUI();

}


/* =========================================================
   POWER-UPS
========================================================= */

function activatePowerUp(type) {

    powerSound();

    if (type === "shield") {

        shieldActive = true;

        setTimeout(() => {

            shieldActive = false;

        }, 15000);

    }


    if (type === "magnet") {

        magnetActive = true;

        setTimeout(() => {

            magnetActive = false;

        }, 12000);

    }


    if (type === "double") {

        doubleScoreActive = true;

        setTimeout(() => {

            doubleScoreActive = false;

        }, 10000);

    }


    if (type === "slow") {

        slowActive = true;

        beginLoop();

        setTimeout(() => {

            slowActive = false;

            beginLoop();

        }, 9000);

    }

}


/* =========================================================
   COLLISION
========================================================= */

function handleCollision(type) {

    if (shieldActive) {

        shieldActive = false;

        beep(500, .18);

        snake.shift();

        return;

    }

    lives--;

    crashSound();

    if (lives <= 0) {

        endGame(type);

        return;

    }

    /* Respawn */

    snake = [

        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }

    ];

    direction = {
        x: 1,
        y: 0
    };

    nextDirection = {
        x: 1,
        y: 0
    };

    draw();

}


/* =========================================================
   GAME OVER
========================================================= */

function endGame(reason) {

    gameRunning = false;

    gamePaused = false;

    clearTimers();

    if (score > highScore) {

        highScore = score;

        localStorage.setItem(
            "neonSnakeHighScore",
            highScore
        );

    }

    updateUI();

    finalScoreEl.textContent =
        score;

    finalCoinsEl.textContent =
        savedCoins;

    finalLevelEl.textContent =
        level;

    gameOverOverlay.classList.remove(
        "hidden"
    );

    const title =
        document.getElementById(
            "gameOverTitle"
        );

    const message =
        document.getElementById(
            "gameOverMessage"
        );

    if (
        score >= highScore &&
        score > 0
    ) {

        title.textContent =
            "🏆 NEW HIGH SCORE!";

        message.textContent =
            "You dominated the neon arena.";

    }

    else {

        title.textContent =
            "GAME OVER";

        message.textContent =
            getGameOverMessage(reason);

    }

}


function getGameOverMessage(reason) {

    const messages = {

        border:
            "You crashed into the arena border.",

        wall:
            "You crashed into a deadly wall.",

        self:
            "You crashed into yourself."

    };

    return (
        messages[reason] ||
        "The snake has been defeated."
    );

}


/* =========================================================
   PAUSE
========================================================= */

function togglePause() {

    if (!gameRunning) {
        return;
    }

    gamePaused =
        !gamePaused;

    if (gamePaused) {

        pauseOverlay.classList.remove(
            "hidden"
        );

        pauseBtn.textContent =
            "▶ RESUME";

    }

    else {

        pauseOverlay.classList.add(
            "hidden"
        );

        pauseBtn.textContent =
            "⏸ PAUSE";

    }

}


/* =========================================================
   TIMER
========================================================= */

function startTimer() {

    clearInterval(gameTimer);

    if (
        MODES[currentMode].time ===
        Infinity
    ) {

        timerEl.textContent = "∞";

        return;

    }

    gameTimer =
        setInterval(() => {

            if (
                !gameRunning ||
                gamePaused
            ) {
                return;
            }

            timeRemaining--;

            timerEl.textContent =
                timeRemaining;

            if (
                timeRemaining <= 10
            ) {

                timerEl.style.color =
                    "#ff4567";

                beep(400, .05);

            }

            if (
                timeRemaining <= 0
            ) {

                endGame("time");

            }

        }, 1000);

}


/* =========================================================
   CLEAR TIMERS
========================================================= */

function clearTimers() {

    clearInterval(loopTimer);
    clearInterval(gameTimer);

    loopTimer = null;
    gameTimer = null;

}


/* =========================================================
   UI UPDATE
========================================================= */

function updateUI() {

    scoreEl.textContent =
        score;

    levelEl.textContent =
        level;

    comboEl.textContent =
        `x${combo}`;

    modeNameEl.textContent =
        MODES[currentMode].name;

    highScoreEl.textContent =
        highScore;

    coinsEl.textContent =
        savedCoins;

    coinDisplay.textContent =
        savedCoins;

    bestComboEl.textContent =
        bestCombo;

    if (
        MODES[currentMode].time ===
        Infinity
    ) {

        timerEl.textContent =
            "∞";

        timerEl.style.color =
            "var(--cyan)";

    }

}


/* =========================================================
   MODE SELECTION
========================================================= */

document.querySelectorAll(
    ".mode-btn"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const mode =
                button.dataset.mode;

            currentMode = mode;

            document
                .querySelectorAll(".mode-btn")
                .forEach(btn =>
                    btn.classList.remove(
                        "active"
                    )
                );

            button.classList.add(
                "active"
            );

            modeNameEl.textContent =
                MODES[mode].name;

            if (gameRunning) {

                startGame();

            }

        }
    );

});


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();


        if (
            key === " " ||
            key === "spacebar"
        ) {

            event.preventDefault();

            togglePause();

            return;

        }


        if (key === "r") {

            if (gameRunning) {
                startGame();
            }

            return;

        }


        if (
            key === "arrowup" ||
            key === "w"
        ) {

            changeDirection(0, -1);

        }


        else if (
            key === "arrowdown" ||
            key === "s"
        ) {

            changeDirection(0, 1);

        }


        else if (
            key === "arrowleft" ||
            key === "a"
        ) {

            changeDirection(-1, 0);

        }


        else if (
            key === "arrowright" ||
            key === "d"
        ) {

            changeDirection(1, 0);

        }

    }
);


/* =========================================================
   DIRECTION
========================================================= */

function changeDirection(x, y) {

    if (!gameRunning) {
        return;
    }

    if (
        direction.x === -x &&
        direction.y === -y
    ) {

        return;

    }

    nextDirection = {
        x,
        y
    };

}


/* =========================================================
   MOBILE CONTROLS
========================================================= */

document.getElementById("up")
    .addEventListener(
        "click",
        () => changeDirection(0, -1)
    );

document.getElementById("down")
    .addEventListener(
        "click",
        () => changeDirection(0, 1)
    );

document.getElementById("left")
    .addEventListener(
        "click",
        () => changeDirection(-1, 0)
    );

document.getElementById("right")
    .addEventListener(
        "click",
        () => changeDirection(1, 0)
    );


/* =========================================================
   BUTTONS
========================================================= */

startBtn.addEventListener(
    "click",
    startGame
);

overlayStart.addEventListener(
    "click",
    startGame
);

pauseBtn.addEventListener(
    "click",
    togglePause
);

resumeBtn.addEventListener(
    "click",
    togglePause
);

restartBtn.addEventListener(
    "click",
    startGame
);


/* =========================================================
   SKIN SHOP
========================================================= */

function renderSkins() {

    skinShop.innerHTML = "";

    SKINS.forEach(skin => {

        const unlocked =
            unlockedSkins.includes(
                skin.id
            );

        const selected =
            selectedSkin === skin.id;

        const button =
            document.createElement("button");

        button.className =
            "skin" +
            (selected ? " selected" : "") +
            (!unlocked ? " locked" : "");

        button.innerHTML = `

            <div
                class="skin-preview"
                style="color:${skin.color}"
            ></div>

            <div class="skin-name">
                ${skin.name}
            </div>

            <div class="skin-price">
                ${
                    unlocked
                        ? selected
                            ? "✓ SELECTED"
                            : "USE"
                        : `🪙 ${skin.price}`
                }
            </div>

        `;


        button.addEventListener(
            "click",
            () => {

                if (unlocked) {

                    selectedSkin =
                        skin.id;

                    localStorage.setItem(
                        "neonSnakeSkin",
                        selectedSkin
                    );

                    renderSkins();

                    draw();

                    return;

                }


                if (
                    savedCoins >= skin.price
                ) {

                    savedCoins -=
                        skin.price;

                    unlockedSkins.push(
                        skin.id
                    );

                    localStorage.setItem(
                        "neonSnakeCoins",
                        savedCoins
                    );

                    localStorage.setItem(
                        "neonSnakeUnlockedSkins",
                        JSON.stringify(
                            unlockedSkins
                        )
                    );

                    selectedSkin =
                        skin.id;

                    localStorage.setItem(
                        "neonSnakeSkin",
                        selectedSkin
                    );

                    renderSkins();

                    updateUI();

                    beep(1200, .15);

                }

                else {

                    alert(
                        `You need ${skin.price - savedCoins} more coins.`
                    );

                }

            }
        );


        skinShop.appendChild(button);

    });

}


renderSkins();


/* =========================================================
   MISSIONS
========================================================= */

function getMissionProgress(
    mission
) {

    if (mission.type === "score") {

        return score;

    }

    if (mission.type === "food") {

        return foodEaten;

    }

    if (mission.type === "combo") {

        return bestCombo;

    }

    if (mission.type === "level") {

        return level;

    }

    return 0;

}


function renderMissions() {

    missionsEl.innerHTML = "";

    MISSION_DATA.forEach(
        mission => {

            const completed =
                completedMissions.includes(
                    mission.id
                );

            const progress =
                Math.min(
                    mission.target,
                    getMissionProgress(
                        mission
                    )
                );

            const percent =
                (
                    progress /
                    mission.target
                ) * 100;


            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "mission";

            div.innerHTML = `

                <div class="mission-title">

                    <strong>
                        ${completed ? "✅" : "🎯"}
                        ${mission.title}
                    </strong>

                    <span>
                        +${mission.reward} 🪙
                    </span>

                </div>

                <div class="progress">

                    <div
                        class="progress-bar"
                        style="width:${percent}%"
                    ></div>

                </div>

                <small style="
                    display:block;
                    margin-top:5px;
                    color:var(--muted);
                    font-size:9px;
                ">
                    ${progress}/${mission.target}
                </small>

            `;

            missionsEl.appendChild(div);

        }
    );

}


function checkMissions() {

    MISSION_DATA.forEach(
        mission => {

            if (
                completedMissions.includes(
                    mission.id
                )
            ) {

                return;

            }

            const progress =
                getMissionProgress(
                    mission
                );

            if (
                progress >=
                mission.target
            ) {

                completedMissions.push(
                    mission.id
                );

                savedCoins +=
                    mission.reward;

                localStorage.setItem(
                    "neonSnakeMissions",
                    JSON.stringify(
                        completedMissions
                    )
                );

                localStorage.setItem(
                    "neonSnakeCoins",
                    savedCoins
                );

                beep(1000, .12);

                setTimeout(
                    () => beep(1400, .15),
                    100
                );

            }

        }
    );

    renderMissions();
    updateTopUI();

}


renderMissions();


/* =========================================================
   SOUND TOGGLE
========================================================= */

soundBtn.addEventListener(
    "click",
    () => {

        soundEnabled =
            !soundEnabled;

        localStorage.setItem(
            "neonSnakeSound",
            soundEnabled
        );

        soundBtn.textContent =
            soundEnabled
                ? "🔊"
                : "🔇";

        if (soundEnabled) {
            initAudio();
            beep(800, .08);
        }

    }
);


soundBtn.textContent =
    soundEnabled
        ? "🔊"
        : "🔇";


/* =========================================================
   THEME
========================================================= */

let lightTheme =
    localStorage.getItem(
        "neonSnakeTheme"
    ) === "light";


if (lightTheme) {

    document.body.classList.add(
        "light"
    );

    themeBtn.textContent = "☀️";

}


themeBtn.addEventListener(
    "click",
    () => {

        lightTheme =
            !lightTheme;

        document.body.classList.toggle(
            "light",
            lightTheme
        );

        themeBtn.textContent =
            lightTheme
                ? "☀️"
                : "🌙";

        localStorage.setItem(
            "neonSnakeTheme",
            lightTheme
        );

    }
);


/* =========================================================
   COMBO TIMER
========================================================= */

setInterval(
    () => {

        if (
            comboTimer > 0 &&
            gameRunning &&
            !gamePaused
        ) {

            comboTimer -= 100;

            if (
                comboTimer <= 0
            ) {

                combo = 1;

                updateUI();

            }

        }

    },
    100
);


/* =========================================================
   ANIMATION LOOP
========================================================= */

function animationLoop() {

    if (
        gameRunning &&
        !gamePaused
    ) {

        draw();

    }

    requestAnimationFrame(
        animationLoop
    );

}

animationLoop();


/* =========================================================
   INITIAL DRAW
========================================================= */

snake = [

    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 }

];

createFood();

draw();


/* =========================================================
   EXTRA: TOUCH SWIPE
========================================================= */

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener(
    "touchstart",
    event => {

        const touch =
            event.changedTouches[0];

        touchStartX =
            touch.clientX;

        touchStartY =
            touch.clientY;

    },
    {
        passive: true
    }
);


canvas.addEventListener(
    "touchend",
    event => {

        const touch =
            event.changedTouches[0];

        const dx =
            touch.clientX -
            touchStartX;

        const dy =
            touch.clientY -
            touchStartY;

        const minSwipe = 25;

        if (
            Math.abs(dx) <
                minSwipe &&
            Math.abs(dy) <
                minSwipe
        ) {

            return;

        }

        if (
            Math.abs(dx) >
            Math.abs(dy)
        ) {

            changeDirection(
                dx > 0 ? 1 : -1,
                0
            );

        }

        else {

            changeDirection(
                0,
                dy > 0 ? 1 : -1
            );

        }

    },
    {
        passive: true
    }
);


/* =========================================================
   PREVENT SPACE SCROLL
========================================================= */

window.addEventListener(
    "keydown",
    event => {

        if (
            event.code === "Space"
        ) {

            event.preventDefault();

        }

    }
);


console.log(
    "🐍 NEON SNAKE X loaded successfully!"
);
console.log(
    "🚫 Login system: NONE"
);
console.log(
    "💾 Storage: Local browser only"
);