// ============================================================
// BRIKER - Stages & Level Generation
// ============================================================

let platforms = [];

function generateLevel() {
    if (currentStage === 'icecave') {
        generateIceCaveLevel();
    } else {
        generateSteampunkLevel();
    }
}

function generateSteampunkLevel() {
    platforms = [];
    platforms.push({ x: 0, y: WORLD_HEIGHT - 40, w: WORLD_WIDTH, h: 40, type: 'solid' });

    for (let y = 0; y < WORLD_HEIGHT; y += 200) {
        platforms.push({ x: -40, y: y, w: 50, h: 200, type: 'wall' });
        platforms.push({ x: WORLD_WIDTH - 10, y: y, w: 50, h: 200, type: 'wall' });
    }

    let py = WORLD_HEIGHT - 160;
    const rng = seedRandom(42);

    while (py > GOAL_Y - 100) {
        const pw = 80 + Math.floor(rng() * 100);
        const px = 40 + Math.floor(rng() * (WORLD_WIDTH - pw - 80));
        const type = rng() > 0.7 ? 'pipe' : 'solid';
        platforms.push({ x: px, y: py, w: pw, h: 16, type });

        if (rng() > 0.5) {
            const sx = px + (rng() > 0.5 ? -60 - rng() * 40 : pw + 20 + rng() * 40);
            if (sx > 20 && sx < WORLD_WIDTH - 60) {
                platforms.push({ x: sx, y: py - 40 - rng() * 30, w: 50, h: 12, type: 'solid' });
            }
        }
        py -= 70 + Math.floor(rng() * 60);
    }

    platforms.push({ x: WORLD_WIDTH / 2 - 60, y: GOAL_Y, w: 120, h: 16, type: 'goal' });
}

function generateIceCaveLevel() {
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

function generateEnemies() {
    enemies = [];
    const rng = seedRandom(99);

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
