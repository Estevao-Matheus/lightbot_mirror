const robot = document.getElementById('robot');
const arena = document.getElementById('arena');
const commandList = document.getElementById('command-list');

const STEP_SIZE = 50;
const MOVE_DURATION = 500;
const TOTAL_FRAMES = 4;

const FRAME_WIDTH = 31.875;
const FRAME_HEIGHT = 52.75;

const START_COL = 5;
const START_ROW = 3;

let positionX = (START_COL * STEP_SIZE) + (STEP_SIZE - FRAME_WIDTH) / 2;
let positionY = (START_ROW * STEP_SIZE) + (STEP_SIZE - FRAME_HEIGHT) / 2;

let currentFrame = 0;
let directionX = 'right';
let isAnimating = false;

let commandQueue = [];

robot.style.left = `${positionX}px`;
robot.style.top = `${positionY}px`;
updateSprite();

function updateSprite() {
    const bgX = -(currentFrame * FRAME_WIDTH);
    const bgY = directionX === 'right' ? 0 : -FRAME_HEIGHT;
    robot.style.backgroundPosition = `${bgX}px ${bgY}px`;
}

document.querySelectorAll('.arrow-btn[data-dir]').forEach(btn => {
    btn.addEventListener('click', () => {
        const dir = btn.dataset.dir;
        addToQueue(dir);

        btn.classList.add('active');
        setTimeout(() => btn.classList.remove('active'), 200);
    });
});

document.getElementById('play-btn').addEventListener('click', () => {
    executeQueue();
});

function addToQueue(direction) {
    if (isAnimating) return;

    commandQueue.push(direction);
    renderQueue();
}

function renderQueue() {
    commandList.innerHTML = commandQueue.map((cmd, i) =>
        `<div class="queue-item ${cmd}"></div>`
    ).join('');
    commandList.scrollLeft = commandList.scrollWidth;
}

async function executeQueue() {
    if (isAnimating || commandQueue.length === 0) return;

    isAnimating = true;

    while (commandQueue.length > 0) {
        const cmd = commandQueue.shift();
        renderQueue();

        const btn = document.querySelector(`.arrow-btn[data-dir="${cmd}"]`);
        if (btn) {
            btn.classList.add('active');
            setTimeout(() => btn.classList.remove('active'), 200);
        }

        await moveOneStep(cmd);
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    isAnimating = false;
    currentFrame = 0;
    updateSprite();
}

function moveOneStep(direction) {
    return new Promise(resolve => {
        const startX = positionX;
        const startY = positionY;
        let targetX = positionX;
        let targetY = positionY;

        if (direction === 'left') {
            targetX -= STEP_SIZE;
            directionX = 'left';
        } else if (direction === 'right') {
            targetX += STEP_SIZE;
            directionX = 'right';
        } else if (direction === 'up') {
            targetY -= STEP_SIZE;
        } else if (direction === 'down') {
            targetY += STEP_SIZE;
        }

        const offsetX = (STEP_SIZE - FRAME_WIDTH) / 2;
        const offsetY = (STEP_SIZE - FRAME_HEIGHT) / 2;

        const minX = offsetX;
        const minY = offsetY;

        const maxCols = Math.floor(arena.clientWidth / STEP_SIZE) - 1;
        const maxRows = Math.floor(arena.clientHeight / STEP_SIZE) - 1;

        const maxX = (maxCols * STEP_SIZE) + offsetX;
        const maxY = (maxRows * STEP_SIZE) + offsetY;

        targetX = Math.max(minX, Math.min(targetX, maxX));
        targetY = Math.max(minY, Math.min(targetY, maxY));

        let startTime = null;

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / MOVE_DURATION, 1);

            positionX = startX + (targetX - startX) * progress;
            positionY = startY + (targetY - startY) * progress;

            robot.style.left = `${positionX}px`;
            robot.style.top = `${positionY}px`;

            const frameIndex = Math.floor(progress * TOTAL_FRAMES * 2) % TOTAL_FRAMES;
            currentFrame = frameIndex;
            updateSprite();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                resolve();
            }
        }

        requestAnimationFrame(animate);
    });
}
