// ============================================================
// BRIKER - Main & Initialization
// ============================================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// ---- INPUT ----
const keys = {};
window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (['Space', 'ArrowUp', 'ArrowDown'].includes(e.code)) e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

// ---- MOBILE TOUCH CONTROLS ----
function bindMobileBtn(id, keyCode) {
    const btn = document.getElementById(id);
    btn.addEventListener('touchstart', e => { e.preventDefault(); keys[keyCode] = true; btn.classList.add('pressed'); });
    btn.addEventListener('touchend', e => { e.preventDefault(); keys[keyCode] = false; btn.classList.remove('pressed'); });
    btn.addEventListener('touchcancel', e => { keys[keyCode] = false; btn.classList.remove('pressed'); });
}
bindMobileBtn('btn-left', 'ArrowLeft');
bindMobileBtn('btn-right', 'ArrowRight');
bindMobileBtn('btn-jump', 'Space');

// ---- SCREEN MANAGEMENT ----
function showScreen(id) {
    ['start-screen', 'win-screen', 'death-screen'].forEach(s => {
        document.getElementById(s).classList.toggle('hidden', s !== id);
    });
}

function hideAllScreens() {
    ['start-screen', 'win-screen', 'death-screen'].forEach(s => {
        document.getElementById(s).classList.add('hidden');
    });
}

// ---- GAME INIT ----
function startGame() {
    state = GameState.PLAYING;
    hideAllScreens();
    player.reset();
    particles = [];
    screenShake = 0;
    generateLevel();
    generateEnemies();

    if (currentStage === 'icecave') {
        generateCaveRocks();
        generateSnowflakes();
    } else {
        generateBgGears();
    }

    startTime = Date.now();
    camera.y = player.y - canvas.height * 0.6;
}

// ---- STAGE SELECTION ----
function selectStage(stage) {
    currentStage = stage;
    document.querySelectorAll('.stage-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('stage-' + stage);
    if (activeBtn) activeBtn.classList.add('active');
}

// ---- EVENT WIRING ----
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-win-btn').addEventListener('click', startGame);
document.getElementById('restart-death-btn').addEventListener('click', startGame);
document.getElementById('stage-steampunk').addEventListener('click', () => selectStage('steampunk'));
document.getElementById('stage-icecave').addEventListener('click', () => selectStage('icecave'));

// ---- STARTUP ----
generateBgGears();
generateLevel();
camera.y = WORLD_HEIGHT - canvas.height;
gameLoop();
