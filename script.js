const robot = document.getElementById('robot');

// 4 frames horizontais, 2 frames verticais
const FRAME_WIDTH = 253 / 4;
const FRAME_HEIGHT = 211 / 2;
const TOTAL_FRAMES = 4;

let currentFrame = 0;
const arena = document.getElementById('arena');

let positionX = (arena.clientWidth - FRAME_WIDTH) / 2;
let positionY = (arena.clientHeight - FRAME_HEIGHT) / 2;

const moveSpeed = 5;
const animSpeed = 10;

let keys = {
    ArrowRight: false,
    ArrowLeft: false,
    ArrowUp: false,
    ArrowDown: false
};

let animCounter = 0;
let directionX = 'right';

document.addEventListener('keydown', (e) => {
    if (Object.prototype.hasOwnProperty.call(keys, e.key)) {
        keys[e.key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (Object.prototype.hasOwnProperty.call(keys, e.key)) {
        keys[e.key] = false;

        const isAnyKeyPressed = Object.values(keys).some(k => k);
        if (!isAnyKeyPressed) {
            currentFrame = 0;
            updateSprite();
        }
    }
});

function updateSprite() {
    const bgX = -(currentFrame * FRAME_WIDTH);
    const bgY = directionX === 'right' ? 0 : -FRAME_HEIGHT;
    robot.style.backgroundPosition = `${bgX}px ${bgY}px`;
}

function gameLoop() {
    let isMoving = false;
    let nextX = positionX;
    let nextY = positionY;

    if (keys.ArrowRight) {
        nextX += moveSpeed;
        directionX = 'right';
        isMoving = true;
    }
    if (keys.ArrowLeft) {
        nextX -= moveSpeed;
        directionX = 'left';
        isMoving = true;
    }
    if (nextX >= 0 && nextX <= arena.clientWidth - FRAME_WIDTH) {
        positionX = nextX;
    }

    if (keys.ArrowUp) {
        nextY -= moveSpeed;
        isMoving = true;
    }
    if (keys.ArrowDown) {
        nextY += moveSpeed;
        isMoving = true;
    }
    if (nextY >= 0 && nextY <= arena.clientHeight - FRAME_HEIGHT) {
        positionY = nextY;
    }

    robot.style.left = `${positionX}px`;
    robot.style.top = `${positionY}px`;

    if (isMoving) {
        animCounter++;
        if (animCounter >= animSpeed) {
            animCounter = 0;
            currentFrame = (currentFrame + 1) % TOTAL_FRAMES;
            updateSprite();
        }
    }

    if (isMoving && animCounter === 0 && currentFrame === 0) {
        updateSprite();
    }

    requestAnimationFrame(gameLoop);
}

updateSprite();
gameLoop();
