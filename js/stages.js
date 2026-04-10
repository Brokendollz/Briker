// ============================================================
// BRIKER - Stages & Level Generation
// ============================================================

let platforms = [];

function generateLevel() {
    if (currentStage === 'icecave') {
        generateIceCaveLevel();
    } else if (currentStage === 'darkforest') {
        generateDarkForestLevel();
    } else {
        generateSteampunkLevel();
    }
}

function generateSteampunkLevel() {
    // ============================================================
    // Steampunk horizontal level - Factory/Engine theme
    // Design rules:
    //   Max jump height = 120px → safe max: 90px
    //   Max jump distance ≈ 250px → safe max: 130px
    // Slightly easier than Dark Forest - first level
    // ============================================================
    WORLD_WIDTH = 4600;
    WORLD_HEIGHT = 650;
    GOAL_Y = 0;

    platforms = [];

    const GROUND_Y = WORLD_HEIGHT - 40;
    const MAX_SAFE_VGAP = 85;
    const MAX_SAFE_HGAP = 130;

    // Ground floor
    platforms.push({ x: 0, y: GROUND_Y, w: WORLD_WIDTH, h: 40, type: 'solid' });

    // Side walls
    platforms.push({ x: -40, y: 0, w: 50, h: WORLD_HEIGHT, type: 'wall' });
    platforms.push({ x: WORLD_WIDTH - 10, y: 0, w: 50, h: WORLD_HEIGHT, type: 'wall' });

    const rng = seedRandom(42);

    // === ZONE 1: Tutorial (x: 0-500) ===
    // Simple flat area with minimal jumps
    platforms.push({ x: 100, y: GROUND_Y - 50, w: 180, h: 16, type: 'solid' });
    platforms.push({ x: 340, y: GROUND_Y - 50, w: 150, h: 16, type: 'pipe' });

    // === ZONE 2: First pipes section (x: 500-1300) ===
    // Introduce pipes - steampunk element
    platforms.push({ x: 520, y: GROUND_Y - 60, w: 140, h: 16, type: 'pipe' });
    platforms.push({ x: 730, y: GROUND_Y - 55, w: 160, h: 16, type: 'solid' });
    platforms.push({ x: 960, y: GROUND_Y - 65, w: 130, h: 16, type: 'pipe' });
    platforms.push({ x: 1160, y: GROUND_Y - 60, w: 150, h: 16, type: 'solid' });
    // Low level platforms (alternative path)
    platforms.push({ x: 550, y: GROUND_Y - 30, w: 100, h: 16, type: 'solid' });
    platforms.push({ x: 800, y: GROUND_Y - 35, w: 110, h: 16, type: 'solid' });
    platforms.push({ x: 1000, y: GROUND_Y - 30, w: 100, h: 16, type: 'solid' });

    // === ZONE 3: Two-level with steam vents (x: 1300-2300) ===
    // Lower level
    platforms.push({ x: 1320, y: GROUND_Y - 50, w: 130, h: 16, type: 'solid' });
    platforms.push({ x: 1530, y: GROUND_Y - 55, w: 120, h: 16, type: 'pipe' });
    platforms.push({ x: 1730, y: GROUND_Y - 50, w: 140, h: 16, type: 'solid' });
    platforms.push({ x: 1950, y: GROUND_Y - 60, w: 150, h: 16, type: 'pipe' });
    platforms.push({ x: 2200, y: GROUND_Y - 50, w: 120, h: 16, type: 'solid' });
    // Upper level (85px up)
    platforms.push({ x: 1380, y: GROUND_Y - 135, w: 130, h: 16, type: 'solid' });
    platforms.push({ x: 1600, y: GROUND_Y - 140, w: 150, h: 16, type: 'pipe' });
    platforms.push({ x: 1830, y: GROUND_Y - 135, w: 120, h: 16, type: 'solid' });
    platforms.push({ x: 2050, y: GROUND_Y - 140, w: 160, h: 16, type: 'pipe' });

    // === ZONE 4: Complex section with bridges (x: 2300-3300) ===
    // Lower path
    platforms.push({ x: 2320, y: GROUND_Y - 55, w: 140, h: 16, type: 'solid' });
    platforms.push({ x: 2530, y: GROUND_Y - 65, w: 130, h: 16, type: 'pipe' });
    platforms.push({ x: 2740, y: GROUND_Y - 55, w: 150, h: 16, type: 'solid' });
    platforms.push({ x: 2970, y: GROUND_Y - 60, w: 120, h: 16, type: 'pipe' });
    platforms.push({ x: 3170, y: GROUND_Y - 55, w: 140, h: 16, type: 'solid' });
    // Mid path (85px up)
    platforms.push({ x: 2380, y: GROUND_Y - 140, w: 120, h: 16, type: 'pipe' });
    platforms.push({ x: 2600, y: GROUND_Y - 145, w: 140, h: 16, type: 'solid' });
    platforms.push({ x: 2820, y: GROUND_Y - 140, w: 130, h: 16, type: 'pipe' });
    platforms.push({ x: 3040, y: GROUND_Y - 145, w: 150, h: 16, type: 'solid' });
    // Top path (170px up) - challenge
    platforms.push({ x: 2460, y: GROUND_Y - 225, w: 130, h: 16, type: 'solid' });
    platforms.push({ x: 2700, y: GROUND_Y - 230, w: 140, h: 16, type: 'pipe' });
    platforms.push({ x: 2920, y: GROUND_Y - 225, w: 120, h: 16, type: 'solid' });
    platforms.push({ x: 3120, y: GROUND_Y - 230, w: 150, h: 16, type: 'pipe' });

    // === ZONE 5: Approach to goal (x: 3300-4600) ===
    // Staircase pattern ascending toward the engine
    platforms.push({ x: 3320, y: GROUND_Y - 60, w: 140, h: 16, type: 'solid' });
    platforms.push({ x: 3530, y: GROUND_Y - 70, w: 130, h: 16, type: 'pipe' });
    platforms.push({ x: 3420, y: GROUND_Y - 140, w: 120, h: 16, type: 'solid' });
    platforms.push({ x: 3630, y: GROUND_Y - 150, w: 140, h: 16, type: 'pipe' });
    platforms.push({ x: 3540, y: GROUND_Y - 225, w: 130, h: 16, type: 'solid' });
    platforms.push({ x: 3760, y: GROUND_Y - 235, w: 120, h: 16, type: 'pipe' });
    // Final approach
    platforms.push({ x: 3880, y: GROUND_Y - 300, w: 150, h: 16, type: 'solid' });
    platforms.push({ x: 4080, y: GROUND_Y - 310, w: 140, h: 16, type: 'pipe' });
    platforms.push({ x: 4260, y: GROUND_Y - 300, w: 130, h: 16, type: 'solid' });

    // Goal - Big Steam Engine
    platforms.push({ x: 4380, y: GROUND_Y - 380, w: 160, h: 20, type: 'goal' });

    // === Add small pipe accents ===
    for (let i = 0; i < 10; i++) {
        const px = 200 + Math.floor(rng() * (WORLD_WIDTH - 600));
        const py = GROUND_Y - 80 - Math.floor(rng() * 150);
        const pw = 50 + Math.floor(rng() * 50);
        if (px < 4300) {
            platforms.push({ x: px, y: py, w: pw, h: 14, type: 'pipe' });
        }
    }
}

function generateIceCaveLevel() {
    WORLD_WIDTH = 800;
    WORLD_HEIGHT = 6000;
    GOAL_Y = 200;
    platforms = [];
    icicles = [];

    platforms.push({ x: 0, y: WORLD_HEIGHT - 40, w: WORLD_WIDTH, h: 40, type: 'solid' });

    const rngWall = seedRandom(55);
    for (let y = 0; y < WORLD_HEIGHT; y += 120) {
        const leftW = 35 + Math.floor(rngWall() * 55);
        const rightW = 35 + Math.floor(rngWall() * 55);
        platforms.push({ x: -40, y: y, w: leftW + 40, h: 120, type: 'wall' });
        platforms.push({ x: WORLD_WIDTH - rightW, y: y, w: rightW + 40, h: 120, type: 'wall' });
    }

    let py = WORLD_HEIGHT - 160;
    const rng = seedRandom(63);

    while (py > GOAL_Y - 100) {
        const pw = 70 + Math.floor(rng() * 130);
        const px = 60 + Math.floor(rng() * (WORLD_WIDTH - pw - 120));
        const type = rng() > 0.7 ? 'icebridge' : 'rock';
        platforms.push({ x: px, y: py, w: pw, h: 18, type });

        if (rng() > 0.35) {
            const icicleCount = 1 + Math.floor(rng() * 4);
            for (let ic = 0; ic < icicleCount; ic++) {
                const ix = px + 8 + Math.floor(rng() * (pw - 16));
                const ih = 10 + Math.floor(rng() * 30);
                const iw = 3 + Math.floor(rng() * 5);
                icicles.push({ x: ix, y: py + 18, h: ih, w: iw });
            }
        }

        if (rng() > 0.45) {
            const sx = px + (rng() > 0.5 ? -65 - rng() * 40 : pw + 20 + rng() * 40);
            if (sx > 40 && sx < WORLD_WIDTH - 80) {
                platforms.push({ x: sx, y: py - 35 - rng() * 30, w: 48, h: 14, type: 'rock' });
            }
        }

        py -= 65 + Math.floor(rng() * 55);
    }

    platforms.push({ x: WORLD_WIDTH / 2 - 60, y: GOAL_Y, w: 120, h: 16, type: 'goal' });

    const rngIce = seedRandom(88);
    for (let ix = 15; ix < WORLD_WIDTH - 15; ix += 12 + Math.floor(rngIce() * 20)) {
        if (rngIce() > 0.25) {
            icicles.push({
                x: ix,
                y: 0,
                h: 20 + Math.floor(rngIce() * 60),
                w: 3 + Math.floor(rngIce() * 7),
            });
        }
    }

    const rngWIce = seedRandom(77);
    for (let wy = 100; wy < WORLD_HEIGHT - 200; wy += 80 + Math.floor(rngWIce() * 120)) {
        if (rngWIce() > 0.4) {
            const lx = Math.floor(rngWIce() * 30) + 10;
            icicles.push({
                x: lx,
                y: wy,
                h: 15 + Math.floor(rngWIce() * 35),
                w: 3 + Math.floor(rngWIce() * 4),
            });
        }
        if (rngWIce() > 0.4) {
            const rx = WORLD_WIDTH - Math.floor(rngWIce() * 30) - 10;
            icicles.push({
                x: rx,
                y: wy,
                h: 15 + Math.floor(rngWIce() * 35),
                w: 3 + Math.floor(rngWIce() * 4),
            });
        }
    }
}

function generateDarkForestLevel() {
    // ============================================================
    // Horizontal side-scrolling forest level
    // Design rules based on player physics:
    //   Max jump height = v^2/(2g) = 144/1.2 = 120px → safe max: 90px
    //   Max jump distance ≈ 250px → safe max: 140px
    //   Min platform width = player.w * 2 = 64px
    // ============================================================
    WORLD_WIDTH = 4800;
    WORLD_HEIGHT = 700;
    GOAL_Y = 0;

    platforms = [];
    icicles = [];

    const GROUND_Y = WORLD_HEIGHT - 40;
    const MAX_SAFE_VGAP = 85;   // vertical gap between platforms
    const MAX_SAFE_HGAP = 130;  // horizontal gap between platforms
    const MIN_PLAT_W = 70;      // minimum platform width

    // Ground floor
    platforms.push({ x: 0, y: GROUND_Y, w: WORLD_WIDTH, h: 40, type: 'solid' });

    // Side walls
    platforms.push({ x: -40, y: 0, w: 50, h: WORLD_HEIGHT, type: 'wall' });
    platforms.push({ x: WORLD_WIDTH - 10, y: 0, w: 50, h: WORLD_HEIGHT, type: 'wall' });

    const rng = seedRandom(51);

    // === ZONE 1: Safe start area (x: 0-600) ===
    // Teach the player: flat ground with small jumps
    platforms.push({ x: 120, y: GROUND_Y - 70, w: 140, h: 16, type: 'mossybrick' });
    platforms.push({ x: 310, y: GROUND_Y - 65, w: 120, h: 16, type: 'mossybrick' });
    platforms.push({ x: 470, y: GROUND_Y - 80, w: 100, h: 16, type: 'vineplat' });

    // === ZONE 2: First platforms section (x: 600-1500) ===
    // Two layers - ground path always available
    // Layer 1 (low)
    platforms.push({ x: 620, y: GROUND_Y - 75, w: 160, h: 16, type: 'mossybrick' });
    platforms.push({ x: 850, y: GROUND_Y - 80, w: 130, h: 16, type: 'mossybrick' });
    platforms.push({ x: 1050, y: GROUND_Y - 70, w: 150, h: 16, type: 'vineplat' });
    platforms.push({ x: 1270, y: GROUND_Y - 80, w: 120, h: 16, type: 'mossybrick' });
    // Layer 2 (mid) - reachable from layer 1 (85px up)
    platforms.push({ x: 680, y: GROUND_Y - 160, w: 140, h: 16, type: 'mossybrick' });
    platforms.push({ x: 900, y: GROUND_Y - 155, w: 180, h: 16, type: 'mossybrick' });
    platforms.push({ x: 1150, y: GROUND_Y - 160, w: 130, h: 16, type: 'vineplat' });
    platforms.push({ x: 1340, y: GROUND_Y - 155, w: 100, h: 16, type: 'mossybrick' });

    // === ZONE 3: Multi-layer section (x: 1500-2800) ===
    // Three layers with clear stepping paths
    // Layer 1 (low)
    platforms.push({ x: 1500, y: GROUND_Y - 75, w: 130, h: 16, type: 'mossybrick' });
    platforms.push({ x: 1720, y: GROUND_Y - 80, w: 160, h: 16, type: 'mossybrick' });
    platforms.push({ x: 1960, y: GROUND_Y - 70, w: 120, h: 16, type: 'vineplat' });
    platforms.push({ x: 2160, y: GROUND_Y - 80, w: 140, h: 16, type: 'mossybrick' });
    platforms.push({ x: 2400, y: GROUND_Y - 75, w: 110, h: 16, type: 'mossybrick' });
    platforms.push({ x: 2600, y: GROUND_Y - 80, w: 130, h: 16, type: 'vineplat' });
    // Layer 2 (mid)
    platforms.push({ x: 1550, y: GROUND_Y - 160, w: 150, h: 16, type: 'mossybrick' });
    platforms.push({ x: 1780, y: GROUND_Y - 165, w: 180, h: 16, type: 'vineplat' });
    platforms.push({ x: 2030, y: GROUND_Y - 155, w: 140, h: 16, type: 'mossybrick' });
    platforms.push({ x: 2250, y: GROUND_Y - 160, w: 160, h: 16, type: 'mossybrick' });
    platforms.push({ x: 2480, y: GROUND_Y - 165, w: 120, h: 16, type: 'vineplat' });
    // Layer 3 (high)
    platforms.push({ x: 1620, y: GROUND_Y - 245, w: 130, h: 16, type: 'mossybrick' });
    platforms.push({ x: 1850, y: GROUND_Y - 240, w: 160, h: 16, type: 'mossybrick' });
    platforms.push({ x: 2100, y: GROUND_Y - 245, w: 140, h: 16, type: 'vineplat' });
    platforms.push({ x: 2340, y: GROUND_Y - 240, w: 120, h: 16, type: 'mossybrick' });
    platforms.push({ x: 2550, y: GROUND_Y - 250, w: 150, h: 16, type: 'mossybrick' });

    // === ZONE 4: Challenge section (x: 2800-3800) ===
    // Tighter gaps, more vertical movement
    // Ground blocks to force upward
    platforms.push({ x: 2850, y: GROUND_Y - 30, w: 80, h: 30, type: 'mossybrick' });
    platforms.push({ x: 3200, y: GROUND_Y - 30, w: 80, h: 30, type: 'mossybrick' });
    // Layer 1
    platforms.push({ x: 2820, y: GROUND_Y - 80, w: 110, h: 16, type: 'mossybrick' });
    platforms.push({ x: 3000, y: GROUND_Y - 85, w: 130, h: 16, type: 'vineplat' });
    platforms.push({ x: 3200, y: GROUND_Y - 75, w: 100, h: 16, type: 'mossybrick' });
    platforms.push({ x: 3380, y: GROUND_Y - 85, w: 120, h: 16, type: 'mossybrick' });
    platforms.push({ x: 3560, y: GROUND_Y - 80, w: 140, h: 16, type: 'vineplat' });
    // Layer 2
    platforms.push({ x: 2880, y: GROUND_Y - 165, w: 120, h: 16, type: 'mossybrick' });
    platforms.push({ x: 3080, y: GROUND_Y - 160, w: 150, h: 16, type: 'mossybrick' });
    platforms.push({ x: 3300, y: GROUND_Y - 170, w: 110, h: 16, type: 'vineplat' });
    platforms.push({ x: 3480, y: GROUND_Y - 160, w: 130, h: 16, type: 'mossybrick' });
    // Layer 3
    platforms.push({ x: 2950, y: GROUND_Y - 250, w: 140, h: 16, type: 'mossybrick' });
    platforms.push({ x: 3150, y: GROUND_Y - 245, w: 120, h: 16, type: 'vineplat' });
    platforms.push({ x: 3350, y: GROUND_Y - 250, w: 150, h: 16, type: 'mossybrick' });
    platforms.push({ x: 3550, y: GROUND_Y - 245, w: 110, h: 16, type: 'mossybrick' });
    // Top path
    platforms.push({ x: 3050, y: GROUND_Y - 330, w: 130, h: 16, type: 'mossybrick' });
    platforms.push({ x: 3250, y: GROUND_Y - 335, w: 160, h: 16, type: 'vineplat' });
    platforms.push({ x: 3480, y: GROUND_Y - 330, w: 120, h: 16, type: 'mossybrick' });

    // === ZONE 5: Castle approach (x: 3800-4800) ===
    // Staircase ascent toward the castle
    platforms.push({ x: 3800, y: GROUND_Y - 75, w: 140, h: 16, type: 'mossybrick' });
    platforms.push({ x: 3980, y: GROUND_Y - 85, w: 120, h: 16, type: 'mossybrick' });
    platforms.push({ x: 3900, y: GROUND_Y - 160, w: 130, h: 16, type: 'mossybrick' });
    platforms.push({ x: 4080, y: GROUND_Y - 155, w: 110, h: 16, type: 'vineplat' });
    platforms.push({ x: 4000, y: GROUND_Y - 240, w: 140, h: 16, type: 'mossybrick' });
    platforms.push({ x: 4180, y: GROUND_Y - 235, w: 120, h: 16, type: 'mossybrick' });
    // Final staircase to castle
    platforms.push({ x: 4280, y: GROUND_Y - 310, w: 110, h: 16, type: 'mossybrick' });
    platforms.push({ x: 4400, y: GROUND_Y - 240, w: 100, h: 16, type: 'mossybrick' });
    platforms.push({ x: 4480, y: GROUND_Y - 320, w: 100, h: 16, type: 'mossybrick' });

    // Castle / Goal platform
    platforms.push({ x: 4550, y: GROUND_Y - 400, w: 160, h: 16, type: 'goal' });

    // === Add procedural variety (small extra platforms) ===
    for (let i = 0; i < 15; i++) {
        const ex = 300 + Math.floor(rng() * (WORLD_WIDTH - 700));
        const ey = GROUND_Y - 90 - Math.floor(rng() * 200);
        const ew = MIN_PLAT_W + Math.floor(rng() * 60);
        const type = rng() > 0.6 ? 'vineplat' : 'mossybrick';
        // Only add if not overlapping goal area
        if (ex < 4400 || ey > GROUND_Y - 350) {
            platforms.push({ x: ex, y: ey, w: ew, h: 14, type });
        }
    }
}

let forestTrees = [];

function generateForestTrees() {
    forestTrees = [];
    const rng = seedRandom(73);
    for (let i = 0; i < 45; i++) {
        forestTrees.push({
            x: rng() * WORLD_WIDTH,
            y: rng() * WORLD_HEIGHT,
            w: 20 + rng() * 40,
            h: 40 + rng() * 80,
            shade: rng(),
        });
    }
}

let fireflies = [];

function generateFireflies() {
    fireflies = [];
    for (let i = 0; i < 60; i++) {
        fireflies.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: 0.2 + Math.random() * 0.6,
            size: 1 + Math.random() * 2,
            drift: (Math.random() - 0.5) * 0.5,
            phase: Math.random() * Math.PI * 2,
        });
    }
}

function updateFireflies() {
    for (const f of fireflies) {
        f.phase += 0.02 + Math.random() * 0.01;
        f.x += f.drift + Math.sin(f.phase * 0.7) * 0.4;
        f.y += Math.cos(f.phase) * 0.3;
        if (f.x > canvas.width + 5) f.x = -5;
        if (f.x < -5) f.x = canvas.width + 5;
        if (f.y > canvas.height + 5) f.y = -5;
        if (f.y < -5) f.y = canvas.height + 5;
    }
}

function generateEnemies() {
    enemies = [];
    const rng = seedRandom(99);

    for (const p of platforms) {
        if (p.type === 'wall' || p.type === 'goal') continue;
        if (p.w >= WORLD_WIDTH || p.h > 30) continue;
        if (currentStage === 'darkforest' || currentStage === 'steampunk') {
            // Skip platforms near spawn (left) and goal (right) for horizontal stages
            if (p.x < 150 || p.x > WORLD_WIDTH - 300) continue;
        } else {
            if (p.y < GOAL_Y + 100) continue;
        }
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

function seedRandom(seed) {
    return function () {
        seed = (seed * 16807 + 0) % 2147483647;
        return (seed - 1) / 2147483646;
    };
}

let bgGears = [];
let caveRocks = [];

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

function generateCaveRocks() {
    caveRocks.length = 0;
    const rng = seedRandom(66);
    for (let i = 0; i < 50; i++) {
        caveRocks.push({
            x: rng() * WORLD_WIDTH,
            y: rng() * WORLD_HEIGHT,
            w: 15 + rng() * 55,
            h: 12 + rng() * 40,
            shade: rng(),
        });
    }
}
