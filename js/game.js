// ============================================================
// BRIKER - STEAM TOWER | Core Game Engine
// ============================================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// ---- CONSTANTS ----
const GRAVITY = 0.6;
const FRICTION = 0.82;
const PLAYER_SPEED = 4.5;
const JUMP_FORCE = -12;
const WALL_JUMP_FORCE_X = 7;
const WALL_JUMP_FORCE_Y = -10;
const WALL_SLIDE_SPEED = 1.5;
const WORLD_WIDTH = 800;
const WORLD_HEIGHT = 6000;
const GOAL_Y = 200;

// ---- COLORS (Steampunk Palette) ----
const COLORS = {
    bg1: '#0d0d1a',
    bg2: '#1a1a2e',
    bg3: '#16213e',
    brass: '#b8860b',
    gold: '#daa520',
    copper: '#b87333',
    steel: '#708090',
    darkSteel: '#4a5568',
    rust: '#8b4513',
    teal: '#1a8a7a',
    darkTeal: '#0d5c52',
    red: '#cc3333',
    orange: '#e8772e',
    steam: '#c8c8d0',
    pipeGreen: '#2d5a3d',
    dark: '#0a0a12',
    rivet: '#9a8a6a',
};

// ---- GAME STATE ----
const GameState = { MENU: 0, PLAYING: 1, DEAD: 2, WIN: 3 };
let state = GameState.MENU;
let startTime = 0;
let camera = { x: 0, y: 0 };
let particles = [];
let screenShake = 0;

// ---- INPUT ----
const keys = {};
window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (['Space', 'ArrowUp', 'ArrowDown'].includes(e.code)) e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

// ---- PLAYER ----
const player = {
    x: 380, y: WORLD_HEIGHT - 100,
    w: 24, h: 32,
    vx: 0, vy: 0,
    hp: 3, maxHp: 3,
    onGround: false,
    wallDir: 0,       // -1 left wall, 1 right wall, 0 none
    wallSliding: false,
    jumpTimer: 0,
    invincible: 0,
    facing: 1,
    animFrame: 0,
    animTimer: 0,

    reset() {
        this.x = 380; this.y = WORLD_HEIGHT - 100;
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

        // Horizontal movement
        if (moveLeft) { this.vx -= PLAYER_SPEED * 0.3; this.facing = -1; }
        if (moveRight) { this.vx += PLAYER_SPEED * 0.3; this.facing = 1; }
        this.vx *= FRICTION;
        if (Math.abs(this.vx) < 0.1) this.vx = 0;

        // Wall detection
        this.wallDir = 0;
        this.wallSliding = false;
        if (!this.onGround) {
            for (const p of platforms) {
                // Check left wall
                if (this.x <= p.x + p.w && this.x + this.w > p.x + p.w &&
                    this.y + this.h > p.y + 4 && this.y < p.y + p.h - 4) {
                    if (moveLeft) { this.wallDir = -1; break; }
                }
                // Check right wall
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

        // Jumping
        if (this.jumpTimer > 0) this.jumpTimer--;
        if (jumpPress && this.jumpTimer === 0) {
            if (this.onGround) {
                this.vy = JUMP_FORCE;
                this.jumpTimer = 15;
                spawnParticles(this.x + this.w / 2, this.y + this.h, 5, COLORS.steam, 'jump');
            } else if (this.wallSliding) {
                this.vy = WALL_JUMP_FORCE_Y;
                this.vx = -this.wallDir * WALL_JUMP_FORCE_X;
                this.jumpTimer = 15;
                this.facing = -this.wallDir;
                spawnParticles(this.x + (this.wallDir === -1 ? 0 : this.w), this.y + this.h / 2, 5, COLORS.steam, 'walljump');
            }
        }

        // Gravity
        this.vy += GRAVITY;
        if (this.vy > 15) this.vy = 15;

        // Move X
        this.x += this.vx;
        // World bounds
        if (this.x < 0) { this.x = 0; this.vx = 0; }
        if (this.x + this.w > WORLD_WIDTH) { this.x = WORLD_WIDTH - this.w; this.vx = 0; }
        // Collide X
        for (const p of platforms) {
            if (this.collides(p)) {
                if (this.vx > 0) this.x = p.x - this.w;
                else if (this.vx < 0) this.x = p.x + p.w;
                this.vx = 0;
            }
        }

        // Move Y
        this.y += this.vy;
        this.onGround = false;
        for (const p of platforms) {
            if (this.collides(p)) {
                // One-way platforms only collide when coming from below
                if (p.type === 'oneWay') {
                    if (this.vy > 0) {
                        this.y = p.y - this.h;
                        this.onGround = true;
                        this.vy = 0;
                    }
                    // Can pass through from above or sides
                } else {
                    // Normal collision
                    if (this.vy > 0) {
                        this.y = p.y - this.h;
                        this.onGround = true;
                    } else if (this.vy < 0) {
                        this.y = p.y + p.h;
                    }
                    this.vy = 0;
                }
            }
        }

        // Fall death
        if (this.y > WORLD_HEIGHT + 100) this.takeDamage(this.hp);

        // Invincibility timer
        if (this.invincible > 0) this.invincible--;

        // Animation
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

    draw() {
        if (this.invincible > 0 && Math.floor(this.invincible / 4) % 2 === 0) return;

        const sx = this.x - camera.x;
        const sy = this.y - camera.y;

        // Body (brass colored)
        ctx.fillStyle = COLORS.copper;
        ctx.fillRect(sx + 4, sy + 8, 16, 18);

        // Head
        ctx.fillStyle = COLORS.gold;
        ctx.fillRect(sx + 6, sy, 12, 10);

        // Goggles
        ctx.fillStyle = COLORS.teal;
        ctx.fillRect(sx + (this.facing === 1 ? 12 : 6), sy + 3, 6, 4);
        ctx.fillStyle = '#0ff';
        ctx.fillRect(sx + (this.facing === 1 ? 13 : 7), sy + 4, 4, 2);

        // Top hat
        ctx.fillStyle = COLORS.darkSteel;
        ctx.fillRect(sx + 5, sy - 6, 14, 7);
        ctx.fillRect(sx + 7, sy - 12, 10, 7);

        // Gear on hat
        ctx.fillStyle = COLORS.brass;
        ctx.fillRect(sx + 10, sy - 10, 4, 4);

        // Legs
        const legOffset = this.onGround && Math.abs(this.vx) > 0.5
            ? Math.sin(this.animFrame * Math.PI / 2) * 3 : 0;
        ctx.fillStyle = COLORS.rust;
        ctx.fillRect(sx + 5, sy + 26, 5, 6 + legOffset);
        ctx.fillRect(sx + 14, sy + 26, 5, 6 - legOffset);

        // Arm / wrench
        ctx.fillStyle = COLORS.steel;
        const armX = this.facing === 1 ? sx + 18 : sx - 2;
        ctx.fillRect(armX, sy + 12, 6, 4);
        ctx.fillStyle = COLORS.brass;
        ctx.fillRect(armX + (this.facing === 1 ? 4 : -2), sy + 10, 4, 8);
    }
};

// ---- PLATFORMS ----
let platforms = [];

function generateLevel() {
    platforms = [];

    // Floor
    platforms.push({ x: 0, y: WORLD_HEIGHT - 40, w: WORLD_WIDTH, h: 40, type: 'solid' });

    // Side walls (thick, climbable)
    for (let y = 0; y < WORLD_HEIGHT; y += 200) {
        platforms.push({ x: -40, y: y, w: 50, h: 200, type: 'wall' });
        platforms.push({ x: WORLD_WIDTH - 10, y: y, w: 50, h: 200, type: 'wall' });
    }

    // Generate platforms going upward
    let py = WORLD_HEIGHT - 160;
    const rng = seedRandom(42);

    while (py > GOAL_Y - 100) {
        const pw = 80 + Math.floor(rng() * 100);
        const px = 40 + Math.floor(rng() * (WORLD_WIDTH - pw - 80));
        const typeRoll = rng();
        const type = typeRoll > 0.75 ? 'pipe' : (typeRoll > 0.55 ? 'oneWay' : 'solid');

        platforms.push({ x: px, y: py, w: pw, h: 16, type });

        // Occasionally add a small stepping stone nearby
        if (rng() > 0.5) {
            const sx = px + (rng() > 0.5 ? -60 - rng() * 40 : pw + 20 + rng() * 40);
            if (sx > 20 && sx < WORLD_WIDTH - 60) {
                platforms.push({ x: sx, y: py - 40 - rng() * 30, w: 50, h: 12, type: 'solid' });
            }
        }

        py -= 70 + Math.floor(rng() * 60);
    }

    // Goal platform at top
    platforms.push({ x: WORLD_WIDTH / 2 - 60, y: GOAL_Y, w: 120, h: 16, type: 'goal' });
}

// Seeded random for consistent level
function seedRandom(seed) {
    return function () {
        seed = (seed * 16807 + 0) % 2147483647;
        return (seed - 1) / 2147483646;
    };
}

// ---- ENEMIES ----
let enemies = [];

function generateEnemies() {
    enemies = [];
    const rng = seedRandom(99);

    // Place enemies on some platforms
    for (const p of platforms) {
        if (p.type === 'wall' || p.type === 'goal' || p.w >= WORLD_WIDTH) continue;
        if (p.y < GOAL_Y + 100) continue;
        if (rng() > 0.35) continue;

        const etype = rng() > 0.5 ? 'walker' : 'drone';

        if (etype === 'walker') {
            enemies.push({
                type: 'walker',
                x: p.x + p.w / 2 - 10,
                y: p.y - 20,
                w: 20, h: 20,
                vx: (rng() > 0.5 ? 1 : -1) * 1.2,
                platform: p,
                alive: true,
                animFrame: 0,
                animTimer: 0,
            });
        } else {
            enemies.push({
                type: 'drone',
                x: p.x + p.w / 2 - 10,
                y: p.y - 50,
                w: 18, h: 18,
                baseY: p.y - 50,
                phase: rng() * Math.PI * 2,
                alive: true,
                animFrame: 0,
                animTimer: 0,
            });
        }
    }
}

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

        // Check collision with player
        if (player.x < e.x + e.w && player.x + player.w > e.x &&
            player.y < e.y + e.h && player.y + player.h > e.y) {
            // Stomp from above
            if (player.vy > 0 && player.y + player.h - e.y < 12) {
                e.alive = false;
                player.vy = JUMP_FORCE * 0.6;
                screenShake = 4;
                spawnParticles(e.x + e.w / 2, e.y + e.h / 2, 8, COLORS.orange, 'burst');
            } else {
                player.takeDamage(1);
                // Knockback
                player.vx = (player.x < e.x ? -5 : 5);
                player.vy = -6;
            }
        }
    }
}

function drawEnemies() {
    for (const e of enemies) {
        if (!e.alive) continue;
        const sx = e.x - camera.x;
        const sy = e.y - camera.y;

        if (sy < -40 || sy > canvas.height + 40) continue;

        if (e.type === 'walker') {
            // Clockwork walker - body
            ctx.fillStyle = COLORS.rust;
            ctx.fillRect(sx + 2, sy + 4, 16, 12);
            // Head
            ctx.fillStyle = COLORS.darkSteel;
            ctx.fillRect(sx + 4, sy, 12, 8);
            // Eye (red glow)
            ctx.fillStyle = '#ff2222';
            ctx.fillRect(sx + (e.vx > 0 ? 12 : 6), sy + 2, 3, 3);
            // Legs
            ctx.fillStyle = COLORS.steel;
            const lo = e.animFrame === 0 ? 2 : -2;
            ctx.fillRect(sx + 3, sy + 16, 4, 4 + lo);
            ctx.fillRect(sx + 13, sy + 16, 4, 4 - lo);
            // Gear on body
            ctx.fillStyle = COLORS.brass;
            ctx.fillRect(sx + 8, sy + 6, 4, 4);
        } else {
            // Drone - body
            ctx.fillStyle = COLORS.darkSteel;
            ctx.fillRect(sx + 3, sy + 4, 12, 10);
            // Dome
            ctx.fillStyle = COLORS.steel;
            ctx.fillRect(sx + 5, sy, 8, 6);
            // Eye
            ctx.fillStyle = '#ff4444';
            ctx.fillRect(sx + 7, sy + 6, 4, 3);
            // Propeller
            ctx.fillStyle = COLORS.brass;
            const pw = e.animFrame === 0 ? 16 : 4;
            ctx.fillRect(sx + 9 - pw / 2, sy - 2, pw, 2);
            // Steam puff
            if (e.animFrame === 0) {
                ctx.fillStyle = 'rgba(200,200,208,0.3)';
                ctx.fillRect(sx + 4, sy + 14, 10, 4);
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

function drawParticles() {
    for (const p of particles) {
        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - camera.x, p.y - camera.y, p.size, p.size);
    }
    ctx.globalAlpha = 1;
}

// ---- BACKGROUND RENDERING ----
const bgGears = [];
function generateBgGears() {
    bgGears.length = 0;
    const rng = seedRandom(77);
    for (let i = 0; i < 30; i++) {
        bgGears.push({
            x: rng() * WORLD_WIDTH,
            y: rng() * WORLD_HEIGHT,
            r: 15 + rng() * 40,
            speed: (rng() - 0.5) * 0.02,
            angle: rng() * Math.PI * 2,
            teeth: 6 + Math.floor(rng() * 6),
        });
    }
}

function drawBackground() {
    // Gradient sky
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, COLORS.bg3);
    grad.addColorStop(1, COLORS.bg1);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Parallax pipes in background
    ctx.fillStyle = COLORS.bg2;
    for (let i = 0; i < 8; i++) {
        const px = i * 120 - (camera.x * 0.1 % 120);
        const py0 = -camera.y * 0.15;
        ctx.fillRect(px, py0, 6, canvas.height);
        ctx.fillRect(px - 4, py0 + 50 + i * 80, 14, 8);
    }

    // Background gears
    ctx.strokeStyle = 'rgba(112, 128, 144, 0.12)';
    ctx.lineWidth = 2;
    for (const g of bgGears) {
        g.angle += g.speed;
        const gx = g.x - camera.x * 0.3;
        const gy = g.y - camera.y * 0.3;
        if (gy < -60 || gy > canvas.height + 60) continue;
        drawGear(gx, gy, g.r, g.teeth, g.angle, false);
    }
}

function drawGear(cx, cy, r, teeth, angle, filled) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    const step = (Math.PI * 2) / (teeth * 2);
    for (let i = 0; i < teeth * 2; i++) {
        const a = i * step;
        const rad = i % 2 === 0 ? r : r * 0.75;
        const x = Math.cos(a) * rad;
        const y = Math.sin(a) * rad;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    if (filled) ctx.fill();
    else ctx.stroke();
    ctx.restore();
}

// ---- PLATFORM DRAWING ----
function drawPlatforms() {
    for (const p of platforms) {
        const sx = p.x - camera.x;
        const sy = p.y - camera.y;

        if (sy > canvas.height + 20 || sy < -220 || sx > canvas.width + 20 || sx + p.w < -20) continue;

        if (p.type === 'wall') {
            // Dark steel walls with rivets
            ctx.fillStyle = '#141422';
            ctx.fillRect(sx, sy, p.w, p.h);
            ctx.fillStyle = COLORS.darkSteel;
            for (let ry = 0; ry < p.h; ry += 40) {
                ctx.fillRect(sx + (p.x < 0 ? p.w - 8 : 2), sy + ry + 10, 4, 4);
            }
        } else if (p.type === 'goal') {
            // Golden goal platform
            ctx.fillStyle = COLORS.gold;
            ctx.fillRect(sx, sy, p.w, p.h);
            ctx.fillStyle = COLORS.brass;
            ctx.fillRect(sx, sy, p.w, 3);
            // Beacon glow
            ctx.fillStyle = 'rgba(218, 165, 32, 0.15)';
            ctx.fillRect(sx - 10, sy - 40, p.w + 20, 40);
            // Arrow indicator
            const bobY = Math.sin(Date.now() * 0.005) * 5;
            ctx.fillStyle = COLORS.gold;
            ctx.fillRect(sx + p.w / 2 - 6, sy - 30 + bobY, 12, 12);
            ctx.fillRect(sx + p.w / 2 - 3, sy - 36 + bobY, 6, 6);
        } else if (p.type === 'oneWay') {
            // One-way platform (pass through from below)
            ctx.fillStyle = COLORS.copper;
            ctx.fillRect(sx, sy, p.w, p.h);
            // Top highlight
            ctx.fillStyle = COLORS.gold;
            ctx.fillRect(sx, sy, p.w, 3);
            // Directional arrows to indicate one-way nature
            ctx.fillStyle = COLORS.brass;
            const arrowSpacing = 20;
            for (let ax = sx + 10; ax < sx + p.w; ax += arrowSpacing) {
                // Arrow pointing up
                ctx.beginPath();
                ctx.moveTo(ax, sy + p.h - 2);
                ctx.lineTo(ax - 4, sy + p.h - 6);
                ctx.lineTo(ax + 4, sy + p.h - 6);
                ctx.closePath();
                ctx.fill();
            }
        } else {
            // Standard solid platform
            ctx.fillStyle = COLORS.darkSteel;
            ctx.fillRect(sx, sy, p.w, p.h);
            // Top edge highlight
            ctx.fillStyle = COLORS.steel;
            ctx.fillRect(sx, sy, p.w, 3);
            // Rivets
            ctx.fillStyle = COLORS.rivet;
            for (let rx = 8; rx < p.w - 4; rx += 24) {
                ctx.fillRect(sx + rx, sy + 6, 3, 3);
            }
        }
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

// ---- CAMERA ----
function updateCamera() {
    const targetY = player.y - canvas.height * 0.45;
    camera.y += (targetY - camera.y) * 0.1;
    camera.x = 0;

    // Screen shake
    if (screenShake > 0) {
        camera.x += (Math.random() - 0.5) * screenShake;
        camera.y += (Math.random() - 0.5) * screenShake;
        screenShake *= 0.8;
        if (screenShake < 0.5) screenShake = 0;
    }
}

// ---- HUD ----
function drawHUD() {
    const healthPct = player.hp / player.maxHp;
    document.getElementById('health-fill').style.width = (healthPct * 100) + '%';
    const heightM = Math.max(0, Math.floor((WORLD_HEIGHT - player.y - 60) / 10));
    document.getElementById('height-text').textContent = heightM + 'm';
}

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

// ---- MAIN GAME LOOP ----
function gameLoop() {
    if (state === GameState.PLAYING) {
        player.update(platforms);
        updateEnemies();
        updateParticles();
        updateCamera();
        checkGoal();
    }

    // Draw
    drawBackground();
    drawPlatforms();
    drawEnemies();
    player.draw();
    drawParticles();

    if (state === GameState.PLAYING) drawHUD();

    requestAnimationFrame(gameLoop);
}

// ---- INIT ----
function startGame() {
    state = GameState.PLAYING;
    hideAllScreens();
    player.reset();
    particles = [];
    screenShake = 0;
    generateLevel();
    generateEnemies();
    generateBgGears();
    startTime = Date.now();
    camera.y = player.y - canvas.height * 0.45;
}

// Button wiring
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-win-btn').addEventListener('click', startGame);
document.getElementById('restart-death-btn').addEventListener('click', startGame);

// Initial background render
generateBgGears();
generateLevel();
camera.y = WORLD_HEIGHT - canvas.height;
gameLoop();
