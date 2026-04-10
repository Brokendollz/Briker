// ============================================================
// BRIKER - Game Engine & Physics
// ============================================================

const GRAVITY = 0.6;
const FRICTION = 0.82;
const PLAYER_SPEED = 4.5;
const JUMP_FORCE = -12;
const WALL_JUMP_FORCE_X = 7;
const WALL_JUMP_FORCE_Y = -10;
const WALL_SLIDE_SPEED = 1.5;
let WORLD_WIDTH = 800;
let WORLD_HEIGHT = 6000;
let GOAL_Y = 200;

const GameState = { MENU: 0, PLAYING: 1, DEAD: 2, WIN: 3 };
let state = GameState.MENU;
let startTime = 0;
let camera = { x: 0, y: 0 };
let particles = [];
let screenShake = 0;
let currentStage = 'steampunk';
let icicles = [];
let snowflakes = [];

// ---- PLAYER ----
const player = {
    x: 380, y: WORLD_HEIGHT - 100,
    w: 32, h: 44,
    vx: 0, vy: 0,
    hp: 3, maxHp: 3,
    onGround: false,
    wallDir: 0,
    wallSliding: false,
    jumpTimer: 0,
    invincible: 0,
    facing: 1,
    animFrame: 0,
    animTimer: 0,

    reset() {
        if (currentStage === 'darkforest' || currentStage === 'steampunk') {
            this.x = 60; this.y = WORLD_HEIGHT - 100;
        } else {
            this.x = 380; this.y = WORLD_HEIGHT - 100;
        }
        this.vx = 0; this.vy = 0;
        this.hp = this.maxHp;
        this.onGround = false;
        this.wallDir = 0;
        this.wallSliding = false;
        this.invincible = 0;
        this.facing = 1;
    },

    update(platforms) {
        const moveLeft = keys['ArrowLeft'] || keys['KeyA'];
        const moveRight = keys['ArrowRight'] || keys['KeyD'];
        const jumpPress = keys['Space'] || keys['ArrowUp'] || keys['KeyW'];

        if (moveLeft) { this.vx -= PLAYER_SPEED * 0.3; this.facing = -1; }
        if (moveRight) { this.vx += PLAYER_SPEED * 0.3; this.facing = 1; }
        this.vx *= FRICTION;
        if (Math.abs(this.vx) < 0.1) this.vx = 0;

        this.wallDir = 0;
        this.wallSliding = false;
        if (!this.onGround) {
            for (const p of platforms) {
                if (this.x <= p.x + p.w && this.x + this.w > p.x + p.w &&
                    this.y + this.h > p.y + 4 && this.y < p.y + p.h - 4) {
                    if (moveLeft) { this.wallDir = -1; break; }
                }
                if (this.x + this.w >= p.x && this.x < p.x &&
                    this.y + this.h > p.y + 4 && this.y < p.y + p.h - 4) {
                    if (moveRight) { this.wallDir = 1; break; }
                }
            }
            if (this.wallDir !== 0 && this.vy > 0) {
                this.wallSliding = true;
                this.vy = Math.min(this.vy, WALL_SLIDE_SPEED);
            }
        }

        if (this.jumpTimer > 0) this.jumpTimer--;
        if (jumpPress && this.jumpTimer === 0) {
            if (this.onGround) {
                this.vy = JUMP_FORCE;
                this.jumpTimer = 15;
                const pColor = currentStage === 'icecave' ? ICE_COLORS.snowBright : currentStage === 'darkforest' ? FOREST_COLORS.mossBright : COLORS.steam;
                spawnParticles(this.x + this.w / 2, this.y + this.h, 5, pColor, 'jump');
            } else if (this.wallSliding) {
                this.vy = WALL_JUMP_FORCE_Y;
                this.vx = -this.wallDir * WALL_JUMP_FORCE_X;
                this.jumpTimer = 15;
                this.facing = -this.wallDir;
                const pColor = currentStage === 'icecave' ? ICE_COLORS.snowBright : currentStage === 'darkforest' ? FOREST_COLORS.mossBright : COLORS.steam;
                spawnParticles(this.x + (this.wallDir === -1 ? 0 : this.w), this.y + this.h / 2, 5, pColor, 'walljump');
            }
        }

        this.vy += GRAVITY;
        if (this.vy > 15) this.vy = 15;

        this.x += this.vx;
        if (this.x < 0) { this.x = 0; this.vx = 0; }
        if (this.x + this.w > WORLD_WIDTH) { this.x = WORLD_WIDTH - this.w; this.vx = 0; }
        for (const p of platforms) {
            if (this.collides(p)) {
                if (this.vx > 0) this.x = p.x - this.w;
                else if (this.vx < 0) this.x = p.x + p.w;
                this.vx = 0;
            }
        }

        this.y += this.vy;
        this.onGround = false;
        for (const p of platforms) {
            if (this.collides(p)) {
                if (this.vy > 0) {
                    this.y = p.y - this.h;
                    this.onGround = true;
                } else if (this.vy < 0) {
                    this.y = p.y + p.h;
                }
                this.vy = 0;
            }
        }

        if (this.y > WORLD_HEIGHT + 100) this.takeDamage(this.hp);
        if (this.invincible > 0) this.invincible--;

        this.animTimer++;
        if (this.animTimer > 8) { this.animTimer = 0; this.animFrame = (this.animFrame + 1) % 4; }
    },

    collides(rect) {
        return this.x < rect.x + rect.w &&
               this.x + this.w > rect.x &&
               this.y < rect.y + rect.h &&
               this.y + this.h > rect.y;
    },

    takeDamage(amount) {
        if (this.invincible > 0) return;
        this.hp -= amount;
        this.invincible = 60;
        screenShake = 8;
        spawnParticles(this.x + this.w / 2, this.y + this.h / 2, 12, COLORS.red, 'burst');
        if (this.hp <= 0) {
            state = GameState.DEAD;
            showScreen('death-screen');
        }
    },
};

// ---- ENEMIES ----
let enemies = [];

function updateEnemies() {
    for (const e of enemies) {
        if (!e.alive) continue;

        e.animTimer++;
        if (e.animTimer > 10) { e.animTimer = 0; e.animFrame = (e.animFrame + 1) % 2; }

        if (e.type === 'walker') {
            e.x += e.vx;
            if (e.x <= e.platform.x || e.x + e.w >= e.platform.x + e.platform.w) {
                e.vx *= -1;
            }
        } else if (e.type === 'drone') {
            e.phase += 0.03;
            e.y = e.baseY + Math.sin(e.phase) * 20;
        }

        if (player.x < e.x + e.w && player.x + player.w > e.x &&
            player.y < e.y + e.h && player.y + player.h > e.y) {
            if (player.vy > 0 && player.y + player.h - e.y < 12) {
                e.alive = false;
                player.vy = JUMP_FORCE * 0.6;
                screenShake = 4;
                spawnParticles(e.x + e.w / 2, e.y + e.h / 2, 8, COLORS.orange, 'burst');
            } else {
                player.takeDamage(1);
                player.vx = (player.x < e.x ? -5 : 5);
                player.vy = -6;
            }
        }
    }
}

// ---- PARTICLES ----
function spawnParticles(x, y, count, color, type) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * (type === 'burst' ? 6 : 3),
            vy: type === 'steam' ? -Math.random() * 2 - 1 : (Math.random() - 0.5) * 6,
            life: 20 + Math.random() * 20,
            maxLife: 40,
            size: 2 + Math.random() * 3,
            color,
        });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.life--;
        if (p.life <= 0) particles.splice(i, 1);
    }
}

// ---- SNOWFLAKES ----
function generateSnowflakes() {
    snowflakes = [];
    for (let i = 0; i < 80; i++) {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: 0.4 + Math.random() * 1.2,
            size: 1 + Math.random() * 2.5,
            drift: (Math.random() - 0.5) * 0.4,
            phase: Math.random() * Math.PI * 2,
        });
    }
}

function updateSnowflakes() {
    for (const s of snowflakes) {
        s.y += s.speed;
        s.phase += 0.02;
        s.x += s.drift + Math.sin(s.phase) * 0.3;
        if (s.y > canvas.height + 5) {
            s.y = -5;
            s.x = Math.random() * canvas.width;
        }
        if (s.x > canvas.width + 5) s.x = -5;
        if (s.x < -5) s.x = canvas.width + 5;
    }
}

// ---- CAMERA ----
function updateCamera() {
    const targetY = player.y - canvas.height * 0.6;
    const targetX = player.x - canvas.width * 0.5;

    camera.y += (targetY - camera.y) * 0.1;
    camera.x += (targetX - camera.x) * 0.1;

    // Clamp camera to world bounds, but allow overscan if needed
    const maxCameraX = Math.max(0, WORLD_WIDTH - canvas.width);
    const maxCameraY = Math.max(0, WORLD_HEIGHT - canvas.height);

    camera.x = Math.max(0, Math.min(camera.x, maxCameraX));
    camera.y = Math.max(0, Math.min(camera.y, maxCameraY));

    if (screenShake > 0) {
        camera.x += (Math.random() - 0.5) * screenShake;
        camera.y += (Math.random() - 0.5) * screenShake;
        screenShake *= 0.8;
        if (screenShake < 0.5) screenShake = 0;
    }
}

// ---- GOAL CHECK ----
function checkGoal() {
    const goalPlatform = platforms.find(p => p.type === 'goal');
    if (!goalPlatform) return;
    if (player.y + player.h <= goalPlatform.y + 4 &&
        player.x + player.w > goalPlatform.x &&
        player.x < goalPlatform.x + goalPlatform.w &&
        player.onGround) {
        state = GameState.WIN;
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        const mins = Math.floor(elapsed / 60);
        const secs = (elapsed % 60).toFixed(1);
        document.getElementById('win-time').textContent = `Time: ${mins}:${secs.padStart(4, '0')}`;
        showScreen('win-screen');
    }
}

// ---- GAME LOOP ----
function gameLoop() {
    if (state === GameState.PLAYING) {
        player.update(platforms);
        updateEnemies();
        updateParticles();
        if (currentStage === 'icecave') updateSnowflakes();
        if (currentStage === 'darkforest') updateFireflies();
        updateCamera();
        checkGoal();
    }

    drawBackgroundScene();
    drawPlatformScene();
    drawEnemiesOnScreen();
    drawPlayer();
    drawParticleScene();
    if (currentStage === 'icecave') drawSnowScene();
    if (currentStage === 'darkforest') drawFireflyScene();

    if (state === GameState.PLAYING) drawHUDScene();

    requestAnimationFrame(gameLoop);
}
