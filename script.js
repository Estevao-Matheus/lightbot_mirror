const robot = document.getElementById('robot');

// Constantes baseadas na imagem 255px x 211px
// 4 frames horizontais, 2 frames verticais
const FRAME_WIDTH = 255 / 4; // ~63.75px
const FRAME_HEIGHT = 211 / 2; // ~105.5px
const TOTAL_FRAMES = 4;

let currentFrame = 0;
let positionX = window.innerWidth / 2 - (FRAME_WIDTH / 2); // Posição inicial centralizada
const moveSpeed = 5;
const animSpeed = 10; // Troca de frame a cada X ticks

let keys = {
    ArrowRight: false,
    ArrowLeft: false
};

let animCounter = 0;
let direction = 'right'; // 'right' ou 'left'

// Event Listeners para o teclado
document.addEventListener('keydown', (e) => {
    if (Object.prototype.hasOwnProperty.call(keys, e.key)) {
        keys[e.key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (Object.prototype.hasOwnProperty.call(keys, e.key)) {
        keys[e.key] = false;
        currentFrame = 0; // Reseta para o frame parado (ou primeiro frame) ao soltar
        updateSprite();
    }
});

function updateSprite() {
    // Calculando a posição do background
    // Eixo X: move negativamente baseado no frame atual
    const bgX = -(currentFrame * FRAME_WIDTH);
    
    // Eixo Y: 
    // Andar para direita (metade superior) -> 0
    // Andar para esquerda (metade inferior) -> -105.5px
    const bgY = direction === 'right' ? 0 : -FRAME_HEIGHT;

    robot.style.backgroundPosition = `${bgX}px ${bgY}px`;
}

function gameLoop() {
    let isMoving = false;

    if (keys.ArrowRight) {
        positionX += moveSpeed;
        direction = 'right';
        isMoving = true;
    }
    
    if (keys.ArrowLeft) {
        positionX -= moveSpeed;
        direction = 'left';
        isMoving = true;
    }

    // Atualiza posição do elemento na tela
    robot.style.left = `${positionX}px`;

    // Lógica de Animação
    if (isMoving) {
        animCounter++;
        if (animCounter >= animSpeed) {
            animCounter = 0;
            currentFrame = (currentFrame + 1) % TOTAL_FRAMES;
            updateSprite();
        }
    } else {
        // Se quiser que ele pare num frame específico quando parado, pode ajustar aqui.
        // No keyup já resetamos para 0, mas isso garante consistência visual se houver inércia ou algo assim no futuro.
    }
    
    // Assegura que o sprite esteja correto mesmo no primeiro frame do movimento
    if (isMoving && animCounter === 0) {
        updateSprite();
    }

    requestAnimationFrame(gameLoop);
}

// Inicializa
updateSprite();
gameLoop();
