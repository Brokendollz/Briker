// ============================================================
// BRIKER - Design & Rendering
// ============================================================

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

// ---- COLORS (Ice Cave Palette) ----
const ICE_COLORS = {
    bg1: '#040412',
    bg2: '#081028',
    bg3: '#0e1840',
    ice: '#6aadcc',
    iceBright: '#90ccee',
    iceDark: '#2a5878',
    snow: '#d0e4ee',
    snowBright: '#e8f4fa',
    rock: '#283858',
    rockDark: '#182030',
    rockMid: '#384e68',
    rockLight: '#506a84',
    icicle: '#70b4d4',
    icicleTip: '#b8dcee',
    bridge: '#2858a8',
    bridgeTop: '#3870c0',
    bridgeRail: '#4488d8',
    frost: '#98c4dc',
    crystal: '#58a0c8',
    white: '#dceaf2',
    dark: '#06061a',
};

// Get active color palette
function getColors() {
    return currentStage === 'icecave' ? ICE_COLORS : COLORS;
}

// ---- PLAYER RENDERING (Rick Dangerous profile explorer with animation states) ----
function drawPlayer() {
    if (player.invincible > 0 && Math.floor(player.invincible / 4) % 2 === 0) return;
    const x = player.x - camera.x;
    const y = player.y - camera.y;
    const f = player.facing; // 1 = right, -1 = left

    // Rick colors
    const SKIN = '#e8b070';
    const SKIN_SH = '#c08848';
    const HAT = '#8b5a2b';
    const HAT_HI = '#a87040';
    const SHIRT = '#c8a868';
    const SHIRT_SH = '#a88848';
    const BELT = '#4a3018';
    const BUCKLE = '#c8a020';
    const PANTS = '#6a5040';
    const BOOT = '#3a2518';
    const BOOT_HI = '#5a3a28';
    const HAIR = '#4a2a10';
    const WHIP = '#5a3818';

    // Determine animation state
    const isJumping = !player.onGround;
    const isWalking = player.onGround && Math.abs(player.vx) > 0.5;

    // Mirroring helper for profile view
    const mx = (offset) => f === 1 ? x + offset : x + 32 - offset;

    ctx.save();
    if (f === -1) {
        ctx.translate(x + 16, 0);
        ctx.scale(-1, 1);
        ctx.translate(-16, 0);
    }

    // --- JUMPING POSE ---
    if (isJumping) {
        drawPlayerJumping(x, y, SKIN, SKIN_SH, HAT, HAT_HI, SHIRT, SHIRT_SH, BELT, BUCKLE, PANTS, BOOT, BOOT_HI, HAIR, WHIP);
    }
    // --- WALKING POSE ---
    else if (isWalking) {
        const walkFrame = player.animFrame;
        drawPlayerWalking(x, y, walkFrame, SKIN, SKIN_SH, HAT, HAT_HI, SHIRT, SHIRT_SH, BELT, BUCKLE, PANTS, BOOT, BOOT_HI, HAIR, WHIP);
    }
    // --- IDLE POSE ---
    else {
        drawPlayerIdle(x, y, SKIN, SKIN_SH, HAT, HAT_HI, SHIRT, SHIRT_SH, BELT, BUCKLE, PANTS, BOOT, BOOT_HI, HAIR, WHIP);
    }

    ctx.restore();
}

// Idle standing pose
function drawPlayerIdle(x, y, SKIN, SKIN_SH, HAT, HAT_HI, SHIRT, SHIRT_SH, BELT, BUCKLE, PANTS, BOOT, BOOT_HI, HAIR, WHIP) {
    // Head
    ctx.fillStyle = HAT;
    ctx.fillRect(x + 9, y + 2, 14, 3);     // hat crown
    ctx.fillRect(x + 7, y + 5, 18, 5);     // hat body
    ctx.fillStyle = HAT_HI;
    ctx.fillRect(x + 10, y + 3, 12, 2);    // hat highlight
    ctx.fillStyle = '#5a3018';
    ctx.fillRect(x + 7, y + 9, 18, 2);     // hat band

    ctx.fillStyle = SKIN;
    ctx.fillRect(x + 11, y + 11, 10, 8);   // face
    ctx.fillStyle = SKIN_SH;
    ctx.fillRect(x + 11, y + 11, 10, 1);   // shadow

    // Eye
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 17, y + 13, 3, 2);
    ctx.fillStyle = '#1a1a2a';
    ctx.fillRect(x + 18, y + 13, 2, 2);

    // Nose
    ctx.fillStyle = SKIN_SH;
    ctx.fillRect(x + 22, y + 14, 2, 2);

    // Mouth
    ctx.fillStyle = '#a06048';
    ctx.fillRect(x + 14, y + 18, 4, 1);

    // Body
    ctx.fillStyle = SHIRT;
    ctx.fillRect(x + 10, y + 19, 12, 8);
    ctx.fillStyle = SHIRT_SH;
    ctx.fillRect(x + 10, y + 19, 12, 1);
    ctx.fillRect(x + 18, y + 20, 2, 7);

    // Belt
    ctx.fillStyle = BELT;
    ctx.fillRect(x + 10, y + 27, 12, 2);
    ctx.fillStyle = BUCKLE;
    ctx.fillRect(x + 15, y + 27, 4, 2);

    // Legs - straight
    ctx.fillStyle = PANTS;
    ctx.fillRect(x + 10, y + 29, 4, 6);
    ctx.fillRect(x + 16, y + 29, 4, 6);
    ctx.fillRect(x + 10, y + 29, 4, 8);
    ctx.fillRect(x + 16, y + 29, 4, 8);

    // Boots
    ctx.fillStyle = BOOT;
    ctx.fillRect(x + 9, y + 37, 5, 3);
    ctx.fillRect(x + 15, y + 37, 5, 3);
    ctx.fillStyle = BOOT_HI;
    ctx.fillRect(x + 9, y + 37, 5, 1);
    ctx.fillRect(x + 15, y + 37, 5, 1);

    // Arms
    ctx.fillStyle = SHIRT;
    ctx.fillRect(x + 22, y + 20, 5, 3);    // back arm
    ctx.fillStyle = SKIN;
    ctx.fillRect(x + 23, y + 23, 3, 2);

    ctx.fillStyle = SHIRT;
    ctx.fillRect(x + 5, y + 20, 5, 3);     // front arm
    ctx.fillStyle = SKIN;
    ctx.fillRect(x + 4, y + 23, 3, 2);

    // Whip hanging
    ctx.fillStyle = WHIP;
    ctx.fillRect(x + 5, y + 25, 2, 5);
}

// Walking animation - 4 frames
function drawPlayerWalking(x, y, frame, SKIN, SKIN_SH, HAT, HAT_HI, SHIRT, SHIRT_SH, BELT, BUCKLE, PANTS, BOOT, BOOT_HI, HAIR, WHIP) {
    // Head (same for all frames)
    ctx.fillStyle = HAT;
    ctx.fillRect(x + 9, y + 2, 14, 3);
    ctx.fillRect(x + 7, y + 5, 18, 5);
    ctx.fillStyle = HAT_HI;
    ctx.fillRect(x + 10, y + 3, 12, 2);
    ctx.fillStyle = '#5a3018';
    ctx.fillRect(x + 7, y + 9, 18, 2);

    ctx.fillStyle = SKIN;
    ctx.fillRect(x + 11, y + 11, 10, 8);
    ctx.fillStyle = SKIN_SH;
    ctx.fillRect(x + 11, y + 11, 10, 1);

    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 17, y + 13, 3, 2);
    ctx.fillStyle = '#1a1a2a';
    ctx.fillRect(x + 18, y + 13, 2, 2);

    ctx.fillStyle = SKIN_SH;
    ctx.fillRect(x + 22, y + 14, 2, 2);

    ctx.fillStyle = '#a06048';
    ctx.fillRect(x + 14, y + 18, 4, 1);

    // Body (slight bounce)
    const bodyBounce = frame === 0 || frame === 2 ? 0 : -1;
    ctx.fillStyle = SHIRT;
    ctx.fillRect(x + 10, y + 19 + bodyBounce, 12, 8);
    ctx.fillStyle = SHIRT_SH;
    ctx.fillRect(x + 10, y + 19 + bodyBounce, 12, 1);
    ctx.fillRect(x + 18, y + 20 + bodyBounce, 2, 7);

    // Belt
    ctx.fillStyle = BELT;
    ctx.fillRect(x + 10, y + 27 + bodyBounce, 12, 2);
    ctx.fillStyle = BUCKLE;
    ctx.fillRect(x + 15, y + 27 + bodyBounce, 4, 2);

    // Legs - walk animation
    ctx.fillStyle = PANTS;
    const legOffsets = [
        { l: 0, r: 0 },   // frame 0: both neutral
        { l: -3, r: 3 },  // frame 1: left up, right back
        { l: 0, r: 0 },   // frame 2: both neutral
        { l: 3, r: -3 }   // frame 3: left back, right up
    ];
    const offset = legOffsets[frame];

    ctx.fillRect(x + 10, y + 29 + offset.l, 4, 8);
    ctx.fillRect(x + 16, y + 29 + offset.r, 4, 8);

    // Boots
    ctx.fillStyle = BOOT;
    ctx.fillRect(x + 9, y + 37 + offset.l, 5, 3);
    ctx.fillRect(x + 15, y + 37 + offset.r, 5, 3);
    ctx.fillStyle = BOOT_HI;
    ctx.fillRect(x + 9, y + 37 + offset.l, 5, 1);
    ctx.fillRect(x + 15, y + 37 + offset.r, 5, 1);

    // Back arm (swings opposite to front leg)
    ctx.fillStyle = SHIRT;
    const backArmX = x + 22 - offset.r * 0.5;
    ctx.fillRect(backArmX, y + 20, 5, 3);
    ctx.fillStyle = SKIN;
    ctx.fillRect(backArmX + 1, y + 23, 3, 2);

    // Front arm (swings with front leg)
    ctx.fillStyle = SHIRT;
    const frontArmX = x + 5 + offset.l * 0.5;
    ctx.fillRect(frontArmX, y + 20, 5, 3);
    ctx.fillStyle = SKIN;
    ctx.fillRect(frontArmX - 1, y + 23, 3, 2);

    // Whip swings
    ctx.fillStyle = WHIP;
    const whipOffset = offset.l * 0.8;
    ctx.fillRect(frontArmX - 1 + whipOffset, y + 25, 2, 5);
}

// Jumping pose
function drawPlayerJumping(x, y, SKIN, SKIN_SH, HAT, HAT_HI, SHIRT, SHIRT_SH, BELT, BUCKLE, PANTS, BOOT, BOOT_HI, HAIR, WHIP) {
    // Head (tilted back slightly)
    ctx.fillStyle = HAT;
    ctx.fillRect(x + 9, y, 14, 3);
    ctx.fillRect(x + 7, y + 3, 18, 5);
    ctx.fillStyle = HAT_HI;
    ctx.fillRect(x + 10, y + 1, 12, 2);
    ctx.fillStyle = '#5a3018';
    ctx.fillRect(x + 7, y + 7, 18, 2);

    ctx.fillStyle = SKIN;
    ctx.fillRect(x + 11, y + 9, 10, 8);
    ctx.fillStyle = SKIN_SH;
    ctx.fillRect(x + 11, y + 9, 10, 1);

    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 17, y + 11, 3, 2);
    ctx.fillStyle = '#1a1a2a';
    ctx.fillRect(x + 18, y + 11, 2, 2);

    ctx.fillStyle = SKIN_SH;
    ctx.fillRect(x + 22, y + 12, 2, 2);

    ctx.fillStyle = '#a06048';
    ctx.fillRect(x + 14, y + 16, 4, 1);

    // Body (arched)
    ctx.fillStyle = SHIRT;
    ctx.fillRect(x + 10, y + 17, 12, 9);
    ctx.fillStyle = SHIRT_SH;
    ctx.fillRect(x + 10, y + 17, 12, 1);
    ctx.fillRect(x + 18, y + 18, 2, 8);

    // Belt
    ctx.fillStyle = BELT;
    ctx.fillRect(x + 10, y + 26, 12, 2);
    ctx.fillStyle = BUCKLE;
    ctx.fillRect(x + 15, y + 26, 4, 2);

    // Legs - tucked during jump
    ctx.fillStyle = PANTS;
    ctx.fillRect(x + 10, y + 28, 4, 5);
    ctx.fillRect(x + 16, y + 28, 4, 5);

    // Boots (tucked)
    ctx.fillStyle = BOOT;
    ctx.fillRect(x + 9, y + 33, 5, 2);
    ctx.fillRect(x + 15, y + 33, 5, 2);
    ctx.fillStyle = BOOT_HI;
    ctx.fillRect(x + 9, y + 33, 5, 1);
    ctx.fillRect(x + 15, y + 33, 5, 1);

    // Arms raised
    ctx.fillStyle = SHIRT;
    ctx.fillRect(x + 22, y + 18, 5, 4);     // back arm up
    ctx.fillStyle = SKIN;
    ctx.fillRect(x + 23, y + 22, 3, 2);

    ctx.fillStyle = SHIRT;
    ctx.fillRect(x + 5, y + 18, 5, 4);      // front arm up
    ctx.fillStyle = SKIN;
    ctx.fillRect(x + 4, y + 22, 3, 2);

    // Whip swinging up
    ctx.fillStyle = WHIP;
    ctx.fillRect(x + 4, y + 18, 2, 8);
}

// ---- ENEMY RENDERING ----
function drawSteampunkEnemy(e, sx, sy) {
    if (e.type === 'walker') {
        ctx.fillStyle = COLORS.rust;
        ctx.fillRect(sx + 2, sy + 4, 16, 12);
        ctx.fillStyle = COLORS.darkSteel;
        ctx.fillRect(sx + 4, sy, 12, 8);
        ctx.fillStyle = '#ff2222';
        ctx.fillRect(sx + (e.vx > 0 ? 12 : 6), sy + 2, 3, 3);
        ctx.fillStyle = COLORS.steel;
        const lo = e.animFrame === 0 ? 2 : -2;
        ctx.fillRect(sx + 3, sy + 16, 4, 4 + lo);
        ctx.fillRect(sx + 13, sy + 16, 4, 4 - lo);
        ctx.fillStyle = COLORS.brass;
        ctx.fillRect(sx + 8, sy + 6, 4, 4);
    } else {
        ctx.fillStyle = COLORS.darkSteel;
        ctx.fillRect(sx + 3, sy + 4, 12, 10);
        ctx.fillStyle = COLORS.steel;
        ctx.fillRect(sx + 5, sy, 8, 6);
        ctx.fillStyle = '#ff4444';
        ctx.fillRect(sx + 7, sy + 6, 4, 3);
        ctx.fillStyle = COLORS.brass;
        const pw = e.animFrame === 0 ? 16 : 4;
        ctx.fillRect(sx + 9 - pw / 2, sy - 2, pw, 2);
        if (e.animFrame === 0) {
            ctx.fillStyle = 'rgba(200,200,208,0.3)';
            ctx.fillRect(sx + 4, sy + 14, 10, 4);
        }
    }
}

function drawIceCaveEnemy(e, sx, sy) {
    const C = ICE_COLORS;
    if (e.type === 'walker') {
        ctx.fillStyle = C.rockMid;
        ctx.fillRect(sx + 2, sy + 4, 16, 12);
        ctx.fillStyle = C.frost;
        ctx.fillRect(sx + 4, sy, 12, 8);
        ctx.fillStyle = '#44ddff';
        ctx.fillRect(sx + (e.vx > 0 ? 12 : 6), sy + 2, 3, 3);
        ctx.fillStyle = C.rockLight;
        const lo = e.animFrame === 0 ? 2 : -2;
        ctx.fillRect(sx + 3, sy + 16, 4, 4 + lo);
        ctx.fillRect(sx + 13, sy + 16, 4, 4 - lo);
        ctx.fillStyle = C.iceBright;
        ctx.fillRect(sx + 8, sy + 6, 4, 4);
    } else {
        ctx.fillStyle = C.rockMid;
        ctx.fillRect(sx + 3, sy + 4, 12, 10);
        ctx.fillStyle = C.frost;
        ctx.fillRect(sx + 5, sy, 8, 6);
        ctx.fillStyle = '#44ddff';
        ctx.fillRect(sx + 7, sy + 6, 4, 3);
        ctx.fillStyle = C.iceBright;
        const pw = e.animFrame === 0 ? 16 : 4;
        ctx.fillRect(sx + 9 - pw / 2, sy - 2, pw, 2);
        if (e.animFrame === 0) {
            ctx.fillStyle = 'rgba(160,200,220,0.3)';
            ctx.fillRect(sx + 4, sy + 14, 10, 4);
        }
    }
}

function drawEnemiesOnScreen() {
    for (const e of enemies) {
        if (!e.alive) continue;
        const sx = e.x - camera.x;
        const sy = e.y - camera.y;
        if (sy < -40 || sy > canvas.height + 40) continue;
        if (currentStage === 'icecave') drawIceCaveEnemy(e, sx, sy);
        else drawSteampunkEnemy(e, sx, sy);
    }
}

// ---- BACKGROUND RENDERING ----
function drawSteampunkBackground() {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, COLORS.bg3);
    grad.addColorStop(1, COLORS.bg1);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = COLORS.bg2;
    for (let i = 0; i < 8; i++) {
        const px = i * 120 - (camera.x * 0.1 % 120);
        const py0 = -camera.y * 0.15;
        ctx.fillRect(px, py0, 6, canvas.height);
        ctx.fillRect(px - 4, py0 + 50 + i * 80, 14, 8);
    }

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

function drawIceCaveBackground() {
    const C = ICE_COLORS;
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, C.bg3);
    grad.addColorStop(0.5, C.bg2);
    grad.addColorStop(1, C.bg1);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const r of caveRocks) {
        const rx = r.x - camera.x * 0.15;
        const ry = r.y - camera.y * 0.2;
        if (ry < -80 || ry > canvas.height + 80) continue;
        const shade = Math.floor(r.shade * 30);
        ctx.fillStyle = `rgb(${14 + shade}, ${20 + shade}, ${38 + shade})`;
        ctx.fillRect(rx, ry, r.w, r.h);
        ctx.fillStyle = `rgba(180, 210, 230, ${0.08 + r.shade * 0.08})`;
        ctx.fillRect(rx + 2, ry, r.w - 4, 2);
    }

    ctx.fillStyle = 'rgba(20, 30, 50, 0.6)';
    for (let i = 0; i < 14; i++) {
        const sx = i * 70 + 15 - ((camera.x * 0.08) % 70);
        const sy = -camera.y * 0.1;
        const sw = 3 + (i % 4) * 2;
        const sh = 15 + ((i * 23 + 7) % 35);
        ctx.fillRect(sx, sy, sw, sh);
        ctx.fillRect(sx + 1, sy + sh, sw - 2, Math.floor(sh * 0.4));
    }

    ctx.fillStyle = 'rgba(100, 160, 200, 0.04)';
    for (let i = 0; i < 6; i++) {
        const vx = 100 + i * 130 - ((camera.x * 0.05) % 130);
        ctx.fillRect(vx, 0, 2, canvas.height);
    }
}

function drawBackgroundScene() {
    if (currentStage === 'icecave') drawIceCaveBackground();
    else drawSteampunkBackground();
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

// ---- PLATFORM RENDERING ----
function drawPlatformScene() {
    for (const p of platforms) {
        const sx = p.x - camera.x;
        const sy = p.y - camera.y;
        if (sy > canvas.height + 20 || sy < -220 || sx > canvas.width + 20 || sx + p.w < -20) continue;

        if (p.type === 'wall') {
            if (currentStage === 'icecave') drawIceCaveWall(p, sx, sy);
            else drawSteampunkWall(p, sx, sy);
        } else if (p.type === 'goal') {
            drawGoalPlatform(p, sx, sy);
        } else if (p.type === 'pipe') {
            drawPipePlatform(p, sx, sy);
        } else if (p.type === 'icebridge') {
            drawIceBridge(p, sx, sy);
        } else if (p.type === 'rock') {
            drawRockPlatform(p, sx, sy);
        } else {
            if (currentStage === 'icecave') drawIceSolidPlatform(p, sx, sy);
            else drawSteampunkSolid(p, sx, sy);
        }
    }

    if (currentStage === 'icecave') drawIcicles();
}

function drawSteampunkWall(p, sx, sy) {
    ctx.fillStyle = '#141422';
    ctx.fillRect(sx, sy, p.w, p.h);
    ctx.fillStyle = COLORS.darkSteel;
    for (let ry = 0; ry < p.h; ry += 40) {
        ctx.fillRect(sx + (p.x < 0 ? p.w - 8 : 2), sy + ry + 10, 4, 4);
    }
}

function drawIceCaveWall(p, sx, sy) {
    const C = ICE_COLORS;
    const isLeft = p.x < 0;
    ctx.fillStyle = C.rockDark;
    ctx.fillRect(sx, sy, p.w, p.h);

    for (let ry = 0; ry < p.h; ry += 18) {
        const bumpW = 8 + ((ry * 7 + 5) % 18);
        const bumpH = 10 + ((ry * 3 + 9) % 12);
        const bx = isLeft ? sx + p.w - bumpW - 2 + ((ry * 5) % 6) : sx + 2 - ((ry * 5) % 6);
        ctx.fillStyle = C.rockMid;
        ctx.fillRect(bx, sy + ry, bumpW, bumpH);

        if ((ry * 11) % 5 < 2) {
            const detW = 4 + ((ry * 2) % 8);
            const detX = isLeft ? bx - 2 : bx + bumpW - detW + 2;
            ctx.fillStyle = C.rockLight;
            ctx.fillRect(detX, sy + ry + 2, detW, 6);
        }
    }

    ctx.fillStyle = C.frost;
    const edgeX = isLeft ? sx + p.w - 3 : sx;
    ctx.fillRect(edgeX, sy, 3, p.h);

    ctx.fillStyle = C.snow;
    for (let ry = 0; ry < p.h; ry += 25) {
        const sw = 6 + ((ry * 7 + 3) % 10);
        const srx = isLeft ? p.w - sw - 1 : 1;
        ctx.fillRect(sx + srx, sy + ry, sw, 3);
    }
}

function drawGoalPlatform(p, sx, sy) {
    ctx.fillStyle = COLORS.gold;
    ctx.fillRect(sx, sy, p.w, p.h);
    ctx.fillStyle = COLORS.brass;
    ctx.fillRect(sx, sy, p.w, 3);
    ctx.fillStyle = 'rgba(218, 165, 32, 0.15)';
    ctx.fillRect(sx - 10, sy - 40, p.w + 20, 40);
    const bobY = Math.sin(Date.now() * 0.005) * 5;
    ctx.fillStyle = COLORS.gold;
    ctx.fillRect(sx + p.w / 2 - 6, sy - 30 + bobY, 12, 12);
    ctx.fillRect(sx + p.w / 2 - 3, sy - 36 + bobY, 6, 6);
}

function drawPipePlatform(p, sx, sy) {
    ctx.fillStyle = COLORS.darkTeal;
    ctx.fillRect(sx, sy, p.w, p.h);
    ctx.fillStyle = COLORS.teal;
    ctx.fillRect(sx, sy, p.w, 4);
    ctx.fillStyle = COLORS.brass;
    ctx.fillRect(sx - 2, sy - 2, 8, p.h + 4);
    ctx.fillRect(sx + p.w - 6, sy - 2, 8, p.h + 4);
    if (Math.random() < 0.02) {
        spawnParticles(sx + camera.x + p.w / 2, p.y - 2, 2, COLORS.steam, 'steam');
    }
}

function drawIceBridge(p, sx, sy) {
    const C = ICE_COLORS;
    ctx.fillStyle = C.bridge;
    ctx.fillRect(sx, sy, p.w, p.h);
    ctx.fillStyle = C.bridgeTop;
    ctx.fillRect(sx, sy, p.w, 4);
    ctx.fillStyle = C.bridgeRail;
    ctx.fillRect(sx, sy, p.w, 2);
    ctx.fillStyle = C.rockMid;
    ctx.fillRect(sx - 3, sy - 2, 8, p.h + 4);
    ctx.fillRect(sx + p.w - 5, sy - 2, 8, p.h + 4);
    ctx.fillStyle = C.iceBright;
    for (let rx = 12; rx < p.w - 8; rx += 20) {
        ctx.fillRect(sx + rx, sy + 5, 2, 2);
    }
    if (Math.random() < 0.015) {
        spawnParticles(sx + camera.x + p.w / 2, p.y + p.h, 1, C.frost, 'steam');
    }
}

function drawRockPlatform(p, sx, sy) {
    const C = ICE_COLORS;
    ctx.fillStyle = C.rock;
    ctx.fillRect(sx, sy, p.w, p.h);
    ctx.fillStyle = C.rockMid;
    ctx.fillRect(sx + 3, sy + 4, p.w - 6, p.h - 6);
    ctx.fillStyle = C.rockLight;
    for (let rx = 6; rx < p.w - 6; rx += 14) {
        ctx.fillRect(sx + rx, sy + 6, 5, 4);
    }
    ctx.fillStyle = C.snow;
    ctx.fillRect(sx - 2, sy - 2, p.w + 4, 5);
    ctx.fillStyle = C.snowBright;
    ctx.fillRect(sx, sy - 2, p.w, 3);
    ctx.fillRect(sx - 3, sy - 2, 5, 7);
    ctx.fillRect(sx + p.w - 2, sy - 2, 5, 7);
}

function drawSteampunkSolid(p, sx, sy) {
    ctx.fillStyle = COLORS.darkSteel;
    ctx.fillRect(sx, sy, p.w, p.h);
    ctx.fillStyle = COLORS.steel;
    ctx.fillRect(sx, sy, p.w, 3);
    ctx.fillStyle = COLORS.rivet;
    for (let rx = 8; rx < p.w - 4; rx += 24) {
        ctx.fillRect(sx + rx, sy + 6, 3, 3);
    }
}

function drawIceSolidPlatform(p, sx, sy) {
    const C = ICE_COLORS;
    ctx.fillStyle = C.rock;
    ctx.fillRect(sx, sy, p.w, p.h);
    ctx.fillStyle = C.snow;
    ctx.fillRect(sx, sy, p.w, 4);
    ctx.fillStyle = C.snowBright;
    ctx.fillRect(sx, sy, p.w, 2);
    ctx.fillStyle = C.rockMid;
    for (let rx = 6; rx < p.w - 4; rx += 18) {
        ctx.fillRect(sx + rx, sy + 6, 6, 4);
    }
}

// ---- PARTICLE RENDERING ----
function drawParticleScene() {
    for (const p of particles) {
        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - camera.x, p.y - camera.y, p.size, p.size);
    }
    ctx.globalAlpha = 1;
}

// ---- SNOWFLAKES ----
function drawSnowScene() {
    ctx.fillStyle = ICE_COLORS.snowBright;
    for (const s of snowflakes) {
        ctx.globalAlpha = 0.4 + s.size * 0.15;
        ctx.fillRect(s.x, s.y, s.size, s.size);
    }
    ctx.globalAlpha = 1;
}

// ---- ICICLES ----
function drawIcicles() {
    const C = ICE_COLORS;
    for (const ic of icicles) {
        const sx = ic.x - camera.x;
        const sy = ic.y - camera.y;
        if (sy > canvas.height + 10 || sy + ic.h < -10 || sx < -20 || sx > canvas.width + 20) continue;

        const halfW = Math.floor(ic.w / 2);
        ctx.fillStyle = C.icicle;
        ctx.fillRect(sx - halfW, sy, ic.w, Math.floor(ic.h * 0.4));
        const midW = Math.max(2, ic.w - 2);
        ctx.fillStyle = C.icicleTip;
        ctx.fillRect(sx - Math.floor(midW / 2), sy + Math.floor(ic.h * 0.35), midW, Math.floor(ic.h * 0.35));
        const tipW = Math.max(1, Math.floor(ic.w / 3));
        ctx.fillRect(sx - Math.floor(tipW / 2), sy + Math.floor(ic.h * 0.65), tipW, Math.floor(ic.h * 0.35));
        ctx.fillStyle = 'rgba(200, 230, 255, 0.4)';
        ctx.fillRect(sx - halfW + 1, sy + 1, 1, Math.floor(ic.h * 0.5));
    }
}

// ---- HUD ----
function drawHUDScene() {
    const healthPct = player.hp / player.maxHp;
    document.getElementById('health-fill').style.width = (healthPct * 100) + '%';
    const heightM = Math.max(0, Math.floor((WORLD_HEIGHT - player.y - 60) / 10));
    document.getElementById('height-text').textContent = heightM + 'm';
}
