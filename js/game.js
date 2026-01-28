const TILE_WIDTH = 100;
const TILE_HEIGHT = 50;
const BOT_WIDTH = 60;
const BOT_HEIGHT = 80;
const GRID_SIZE = 5;
const MAX_TILE_HEIGHT = 80;
const MOVE_DURATION = 500;
const TOTAL_FRAMES = 4;

const FRAME_WIDTH = 63.75;
const FRAME_HEIGHT = 105.5;

let currentFrame = 0;
let directionX = 'left';
let isAnimating = false;

let comandQuery = [];

let bot = {
  x: 0,
  y: 0,
  direction: 0,
  z: 0
};

let grid = [
  [14, 23, 23, 23, 23, 23, 23, 23, 23, 13],
  [21, 32, 33, 33, 28, 33, 28, 33, 31, 20],
  [21, 34, 0, 0, 25, 33, 30, 1, 34, 20],
  [21, 34, 0, 0, 34, 1, 1, 10, 34, 20],
  [21, 25, 33, 33, 24, 33, 33, 33, 27, 20],
  [21, 34, 4, 7, 34, 18, 17, 10, 34, 20],
  [21, 34, 4, 7, 34, 16, 19, 10, 34, 20],
  [21, 34, 6, 8, 34, 10, 10, 10, 34, 20],
  [21, 29, 33, 33, 26, 33, 33, 33, 30, 20],
  [11, 22, 22, 22, 22, 22, 22, 22, 22, 12]
];

let grid1 = [
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 5, 1, 1],
  [1, 1, 5, 1, 1],
  [1, 1, 10, 1, 1],
];


let tile_images = [];
let botSprite;
let x_start;
let y_start;

function draw_tile(img, x, y) {
  let x_screen = x_start + (x - y) * TILE_WIDTH / 2;
  let y_screen = y_start + (x + y) * TILE_HEIGHT / 2;
  let z_offset = MAX_TILE_HEIGHT - img.height;

  image(img, x_screen, y_screen + z_offset);
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  x_start = width / 2 - TILE_WIDTH / 2;
  y_start = 50;
  botSprite = loadImage("botty_sheet-removebg-preview-cropped.png");
  for (let i = 0; i <= 34; i++) {
    tile_images.push(loadImage("./tiles/tile-" + i + ".png"));
  }
}

function draw_grid() {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      draw_tile(tile_images[grid1[j][i]], i, j);
    }
  }
}
function draw_bot() {
  let x_screen = x_start + (bot.x - bot.y) * TILE_WIDTH / 2;
  let y_screen = y_start + (bot.x + bot.y) * TILE_HEIGHT / 2;

  y_screen -= BOT_HEIGHT - TILE_HEIGHT;
  y_screen -= bot.z * 10;

  const srcX = currentFrame * FRAME_WIDTH;
  const srcY = directionX === 'right' ? 0 : FRAME_HEIGHT;

  image(
    botSprite,
    x_screen - BOT_WIDTH / 2 + TILE_WIDTH / 2,
    y_screen,
    BOT_WIDTH,
    BOT_HEIGHT,
    srcX,
    srcY,
    FRAME_WIDTH,
    FRAME_HEIGHT
  );
}


function draw() {
  background("black");
  draw_grid();
  draw_bot()
}

const buttons = document.querySelectorAll('.image-button');
const mainMethod = document.getElementById('main-method');

buttons.forEach(button => {
  button.addEventListener('click', handleButtonClick);
});


function handleButtonClick(event) {
  console.log(event.target);
  const buttonValue = event.currentTarget.value;
  comandQuery.push(buttonValue);
  updateMainMethod();
}

function updateMainMethod() {
  mainMethod.innerHTML = '';
  comandQuery.forEach((comand, index) => {

    const comandoElement = document.createElement('div');
    comandoElement.className = 'image-button';
    const imgElement = document.createElement('img');

    switch (comand) {
      case 'frente':
        imgElement.src = './assets/comandos/arrow_up.png';
        imgElement.alt = 'avançar';
        break;
      case 'direita':
        imgElement.src = './assets/comandos/arrow_right.png';
        imgElement.alt = 'virar direita';
        break;
      case 'esquerda':
        imgElement.src = './assets/comandos/arrow_left.png';
        imgElement.alt = 'virar esquerda';
        break;
      case 'pulo':
        imgElement.src = './assets/comandos/jump.png';
        imgElement.alt = 'pular';
        break;
      case 'acender':
        imgElement.src = './assets/comandos/lightbulb.png';
        imgElement.alt = 'acender luz';
        break;
    }
    comandoElement.appendChild(imgElement);
    mainMethod.appendChild(comandoElement);
  });
}

function animate(duration = MOVE_DURATION) {
  return new Promise(resolve => {
    let startTime = null;

    function animateFrame(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      const frameIndex = Math.floor(progress * TOTAL_FRAMES * 2) % TOTAL_FRAMES;
      currentFrame = frameIndex;

      if (progress < 1) {
        requestAnimationFrame(animateFrame);
      } else {
        currentFrame = 0;
        resolve();
      }
    }

    requestAnimationFrame(animateFrame);
  });
}

async function moveFoward() {
  let startX = bot.x;
  let startY = bot.y;
  let newX = bot.x;
  let newY = bot.y + 1;

  if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
    let startTime = null;

    await new Promise(resolve => {
      function animateMove(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / MOVE_DURATION, 1);

        // Interpolar posição
        bot.x = startX + (newX - startX) * progress;
        bot.y = startY + (newY - startY) * progress;

        // Atualizar frame do sprite
        const frameIndex = Math.floor(progress * TOTAL_FRAMES * 2) % TOTAL_FRAMES;
        currentFrame = frameIndex;

        if (progress < 1) {
          requestAnimationFrame(animateMove);
        } else {
          bot.x = newX;
          bot.y = newY;
          currentFrame = 0;
          resolve();
        }
      }
      requestAnimationFrame(animateMove);
    });
  } else {
    console.log("Movimento inválido: fora dos limites do grid");
  }
}

async function moveRight() {
  directionX = 'right';
  let startX = bot.x;
  let startY = bot.y;
  let newX = bot.x - 1;
  let newY = bot.y;

  if (newX >= 0) {
    let startTime = null;

    await new Promise(resolve => {
      function animateMove(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / MOVE_DURATION, 1);

        bot.x = startX + (newX - startX) * progress;
        bot.y = startY + (newY - startY) * progress;

        const frameIndex = Math.floor(progress * TOTAL_FRAMES * 2) % TOTAL_FRAMES;
        currentFrame = frameIndex;

        if (progress < 1) {
          requestAnimationFrame(animateMove);
        } else {
          bot.x = newX;
          bot.y = newY;
          currentFrame = 0;
          resolve();
        }
      }
      requestAnimationFrame(animateMove);
    });
  } else {
    console.log("Não pode mover para direita: limite do grid alcançado");
  }
}

async function moverLeft() {
  directionX = 'left';
  let startX = bot.x;
  let startY = bot.y;
  let newX = bot.x + 1;
  let newY = bot.y;

  if (newX < GRID_SIZE) {
    let startTime = null;

    await new Promise(resolve => {
      function animateMove(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / MOVE_DURATION, 1);

        bot.x = startX + (newX - startX) * progress;
        bot.y = startY + (newY - startY) * progress;

        const frameIndex = Math.floor(progress * TOTAL_FRAMES * 2) % TOTAL_FRAMES;
        currentFrame = frameIndex;

        if (progress < 1) {
          requestAnimationFrame(animateMove);
        } else {
          bot.x = newX;
          bot.y = newY;
          currentFrame = 0;
          resolve();
        }
      }
      requestAnimationFrame(animateMove);
    });
  } else {
    console.log("Não pode mover para esquerda: limite do grid alcançado");
  }
}

function jump() {
  console.log("Pulando...");
}

async function playMovements() {
  const comandsExecution = [...comandQuery];
  const delayBetweenMovements = 500;

  for (let i = 0; i < comandsExecution.length; i++) {
    const comand = comandsExecution[i];

    switch (comand) {
      case 'frente':
        await moveFoward();
        break;
      case 'direita':
        await moveRight();
        break;
      case 'esquerda':
        await moverLeft();
        break;
      case 'pulo':
        jump();
        await animate();
        break;
      case 'acender':
        switchLight();
        await animate();
        break;
      default:
        console.log(`Comando desconhecido: ${comando}`);
    }
    if (i < comandsExecution.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenMovements));
    }
  }
}
function switchLight() {
  console.log(bot.x, bot.y)
  let currentTile = grid1[bot.y][bot.x]
  console.log(currentTile);
  if (currentTile === 10) {
    grid1[bot.y][bot.x] = 15
  }
}

function stopGame() {
  bot.x = 0;
  bot.y = 0;
  comandQuery = [];
}
