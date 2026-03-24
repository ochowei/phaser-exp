import * as Phaser from 'phaser';
import Player from '../objects/Player.js';
import Bullet from '../objects/Bullet.js';
import { t } from '../i18n.js';
import { getAircraftProfile, DEFAULT_AIRCRAFT } from '../profiles/aircraftProfiles.js';

/**
 * 產生所有共用的程序紋理（玩家、子彈、敵人、道具等）
 * 使用 textures.exists() 防止重複產生
 */
export function createGameTextures(scene) {
    const graphics = scene.add.graphics();

    // 背景雜訊紋理
    if (!scene.textures.exists('bg_stars3')) {
        graphics.fillStyle(0x555555, 1);
        for (let i = 0; i < 200; i++) graphics.fillRect(Phaser.Math.Between(0, 512), Phaser.Math.Between(0, 512), 2, 2);
        graphics.generateTexture('bg_stars3', 512, 512);
        graphics.clear();
    }

    if (!scene.textures.exists('bg_stars2')) {
        graphics.fillStyle(0xaaaaaa, 1);
        for (let i = 0; i < 100; i++) graphics.fillRect(Phaser.Math.Between(0, 512), Phaser.Math.Between(0, 512), 2, 2);
        graphics.generateTexture('bg_stars2', 512, 512);
        graphics.clear();
    }

    if (!scene.textures.exists('bg_stars1')) {
        graphics.fillStyle(0xffffff, 1);
        for (let i = 0; i < 50; i++) graphics.fillRect(Phaser.Math.Between(0, 512), Phaser.Math.Between(0, 512), 2, 2);
        graphics.generateTexture('bg_stars1', 512, 512);
        graphics.clear();
    }

    // 玩家紋理
    const aircraft = getAircraftProfile(DEFAULT_AIRCRAFT);
    if (!scene.textures.exists(aircraft.textureKey)) {
        aircraft.draw(graphics);
        graphics.generateTexture(aircraft.textureKey, aircraft.textureSize.width, aircraft.textureSize.height);
        graphics.clear();
    }

    // 子彈紋理
    if (!scene.textures.exists('bullet')) {
        graphics.fillStyle(0xffff00, 1);
        graphics.fillCircle(5, 5, 5);
        graphics.generateTexture('bullet', 10, 10);
        graphics.clear();
    }

    // 普通敵人紋理
    const enemyNormalProfile = getAircraftProfile('EN_RED');
    if (!scene.textures.exists(enemyNormalProfile.textureKey)) {
        enemyNormalProfile.draw(graphics);
        graphics.generateTexture(enemyNormalProfile.textureKey, enemyNormalProfile.textureSize.width, enemyNormalProfile.textureSize.height);
        graphics.clear();
    }

    // 特殊敵人紋理
    const enemySpecialProfile = getAircraftProfile('EN_PURPLE');
    if (!scene.textures.exists(enemySpecialProfile.textureKey)) {
        enemySpecialProfile.draw(graphics);
        graphics.generateTexture(enemySpecialProfile.textureKey, enemySpecialProfile.textureSize.width, enemySpecialProfile.textureSize.height);
        graphics.clear();
    }

    // 迷你Boss紋理
    const bossProfile = getAircraftProfile('EN_BOSS_GREEN');
    if (!scene.textures.exists(bossProfile.textureKey)) {
        bossProfile.draw(graphics);
        graphics.generateTexture(bossProfile.textureKey, bossProfile.textureSize.width, bossProfile.textureSize.height);
        graphics.clear();
    }

    // 敵人子彈紋理
    if (!scene.textures.exists('enemy_bullet')) {
        graphics.fillStyle(0xff3333, 1);
        graphics.fillCircle(4, 4, 4);
        graphics.generateTexture('enemy_bullet', 8, 8);
        graphics.clear();
    }

    // 三連射道具紋理
    if (!scene.textures.exists('powerupTexture')) {
        graphics.fillStyle(0x00ff00, 1);
        graphics.fillCircle(10, 10, 10);
        graphics.generateTexture('powerupTexture', 20, 20);
        graphics.clear();
    }

    // 護盾道具紋理（藍色帶白色內環）
    if (!scene.textures.exists('shieldTexture')) {
        graphics.fillStyle(0x2266ff, 1);
        graphics.fillCircle(10, 10, 10);
        graphics.lineStyle(2, 0xffffff, 0.9);
        graphics.strokeCircle(10, 10, 6);
        graphics.generateTexture('shieldTexture', 20, 20);
        graphics.clear();
    }

    // 炸彈道具紋理（橙色帶黃色核心）
    if (!scene.textures.exists('bombTexture')) {
        graphics.fillStyle(0xff5500, 1);
        graphics.fillCircle(10, 10, 10);
        graphics.fillStyle(0xffdd00, 1);
        graphics.fillCircle(10, 10, 4);
        graphics.generateTexture('bombTexture', 20, 20);
        graphics.clear();
    }

    graphics.destroy();
}

/**
 * 產生關卡 Boss 紋理
 */
export function createBossTextures(scene, profileKeys) {
    const graphics = scene.add.graphics();
    for (const key of profileKeys) {
        const profile = getAircraftProfile(key);
        if (!scene.textures.exists(profile.textureKey)) {
            profile.draw(graphics);
            graphics.generateTexture(profile.textureKey, profile.textureSize.width, profile.textureSize.height);
            graphics.clear();
        }
    }
    graphics.destroy();
}

/**
 * 產生選單場景共用的星空紋理（start_bg_stars_far/mid/near）
 * 原本由 StartScene 產生，React 遷移後改由此函式提供
 */
export function createMenuStarTextures(scene) {
    const graphics = scene.add.graphics();

    if (!scene.textures.exists('start_bg_stars_far')) {
        graphics.fillStyle(0x24306d, 1);
        for (let i = 0; i < 220; i++) {
            graphics.fillRect(Phaser.Math.Between(0, 512), Phaser.Math.Between(0, 512), 2, 2);
        }
        graphics.generateTexture('start_bg_stars_far', 512, 512);
        graphics.clear();
    }

    if (!scene.textures.exists('start_bg_stars_mid')) {
        graphics.fillStyle(0x6a4ab4, 1);
        for (let i = 0; i < 140; i++) {
            graphics.fillRect(Phaser.Math.Between(0, 512), Phaser.Math.Between(0, 512), 2, 2);
        }
        graphics.generateTexture('start_bg_stars_mid', 512, 512);
        graphics.clear();
    }

    if (!scene.textures.exists('start_bg_stars_near')) {
        graphics.fillStyle(0xe8e7ff, 1);
        for (let i = 0; i < 80; i++) {
            graphics.fillRect(Phaser.Math.Between(0, 512), Phaser.Math.Between(0, 512), 2, 2);
        }
        graphics.generateTexture('start_bg_stars_near', 512, 512);
        graphics.clear();
    }

    graphics.destroy();
}

/**
 * 建立 3 層視差背景
 */
export function createParallaxBackground(scene) {
    scene.bg3 = scene.add.tileSprite(400, 300, 800, 600, 'bg_stars3');
    scene.bg2 = scene.add.tileSprite(400, 300, 800, 600, 'bg_stars2');
    scene.bg1 = scene.add.tileSprite(400, 300, 800, 600, 'bg_stars1');
}

/**
 * 捲動視差背景（在 update 中呼叫）— 由上往下捲動
 */
export function scrollParallaxBackground(scene) {
    scene.bg3.tilePositionY += 0.2;
    scene.bg2.tilePositionY += 0.5;
    scene.bg1.tilePositionY += 1.0;
}

/**
 * 建立物理群組與碰撞設定
 */
export function createPhysicsGroups(scene) {
    scene.bullets = scene.physics.add.group({
        classType: Bullet,
        maxSize: 60,
        runChildUpdate: true
    });

    scene.enemies = scene.physics.add.group({
        runChildUpdate: true
    });

    scene.powerups = scene.physics.add.group({
        runChildUpdate: true
    });

    scene.enemyBullets = scene.physics.add.group();

    scene.physics.add.overlap(scene.bullets, scene.enemies, scene.hitEnemy, null, scene);
    scene.physics.add.overlap(scene.player, scene.enemies, scene.hitPlayer, null, scene);
    scene.physics.add.overlap(scene.player, scene.powerups, scene.collectPowerup, null, scene);
    scene.physics.add.overlap(scene.player, scene.enemyBullets, scene.hitPlayerByBullet, null, scene);
}

/**
 * 建立鍵盤輸入
 */
export function setupKeyboardInput(scene) {
    scene.keys = scene.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        upArrow: Phaser.Input.Keyboard.KeyCodes.UP,
        downArrow: Phaser.Input.Keyboard.KeyCodes.DOWN,
        leftArrow: Phaser.Input.Keyboard.KeyCodes.LEFT,
        rightArrow: Phaser.Input.Keyboard.KeyCodes.RIGHT
    });
}

/**
 * 建立虛擬搖桿（手機觸控）
 */
export function setupJoystick(scene) {
    const joystickRadius = 60;
    const thumbRadius = 25;

    scene.joystick = { dx: 0, dy: 0, active: false, pointerId: null, startX: 0, startY: 0 };

    scene.joystickBaseGfx = scene.add.graphics();
    scene.joystickBaseGfx.fillStyle(0xffffff, 0.2);
    scene.joystickBaseGfx.fillCircle(0, 0, joystickRadius);
    scene.joystickBaseGfx.lineStyle(2, 0xffffff, 0.4);
    scene.joystickBaseGfx.strokeCircle(0, 0, joystickRadius);
    scene.joystickBaseGfx.setVisible(false).setDepth(10);

    scene.joystickThumbGfx = scene.add.graphics();
    scene.joystickThumbGfx.fillStyle(0xffffff, 0.5);
    scene.joystickThumbGfx.fillCircle(0, 0, thumbRadius);
    scene.joystickThumbGfx.setVisible(false).setDepth(11);

    scene.input.on('pointerdown', (pointer) => {
        if (scene.gameOver) return;
        if (!scene.joystick.active) {
            scene.joystick.active = true;
            scene.joystick.pointerId = pointer.id;
            scene.joystick.startX = pointer.x;
            scene.joystick.startY = pointer.y;
            scene.joystick.dx = 0;
            scene.joystick.dy = 0;
            scene.joystickBaseGfx.setPosition(pointer.x, pointer.y).setVisible(true);
            scene.joystickThumbGfx.setPosition(pointer.x, pointer.y).setVisible(true);
        }
    });

    scene.input.on('pointermove', (pointer) => {
        if (!scene.joystick.active || pointer.id !== scene.joystick.pointerId) return;
        const dx = pointer.x - scene.joystick.startX;
        const dy = pointer.y - scene.joystick.startY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > joystickRadius) {
            scene.joystick.dx = dx / dist;
            scene.joystick.dy = dy / dist;
        } else {
            scene.joystick.dx = dx / joystickRadius;
            scene.joystick.dy = dy / joystickRadius;
        }
        const clampedX = scene.joystick.startX + scene.joystick.dx * joystickRadius;
        const clampedY = scene.joystick.startY + scene.joystick.dy * joystickRadius;
        scene.joystickThumbGfx.setPosition(clampedX, clampedY);
    });

    scene.input.on('pointerup', (pointer) => {
        if (pointer.id === scene.joystick.pointerId) {
            scene.joystick.active = false;
            scene.joystick.dx = 0;
            scene.joystick.dy = 0;
            scene.joystickBaseGfx.setVisible(false);
            scene.joystickThumbGfx.setVisible(false);
        }
    });
}

/**
 * 建立玩家與尾焰粒子
 */
export function createPlayerWithTrail(scene) {
    const aircraft = getAircraftProfile(DEFAULT_AIRCRAFT);
    scene.player = new Player(scene, 400, 500, 'playerTexture');
    scene.player.setDisplaySize(aircraft.textureSize.width, aircraft.textureSize.height);
    scene.player.baseScaleX = scene.player.scaleX;
    scene.playerTrail = scene.add.particles(0, 0, 'bullet', aircraft.trail);
    scene.playerTrail.startFollow(scene.player, aircraft.trailOffset.x, aircraft.trailOffset.y);
}

/**
 * 建立暫停系統 UI
 * @param {string} menuDestination - 主選單按鈕跳轉的場景名稱
 */
export function setupPauseSystem(scene, menuDestination) {
    scene.pauseButton = scene.add.text(784, 16, '⏸', {
        fontSize: '28px',
        fill: '#fff',
        backgroundColor: '#000',
        padding: { x: 10, y: 6 }
    })
        .setOrigin(1, 0)
        .setDepth(30)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => scene.togglePause())
        .on('pointerover', () => scene.pauseButton.setStyle({ backgroundColor: '#333' }))
        .on('pointerout', () => scene.pauseButton.setStyle({ backgroundColor: '#000' }));

    scene.pauseOverlay = scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.45)
        .setDepth(25)
        .setVisible(false);
    scene.pauseText = scene.add.text(400, 280, t('paused'), {
        fontSize: '64px',
        fill: '#ffffff',
        fontStyle: 'bold'
    })
        .setOrigin(0.5)
        .setDepth(26)
        .setVisible(false);
    scene.pauseHintText = scene.add.text(400, 345, t('pauseHint'), {
        fontSize: '24px',
        fill: '#dddddd'
    })
        .setOrigin(0.5)
        .setDepth(26)
        .setVisible(false);

    scene.pauseMenuBtn = scene.add.text(400, 410, t('mainMenu'), {
        fontSize: '26px',
        fill: '#0af',
        backgroundColor: '#000',
        padding: { x: 20, y: 10 }
    })
        .setOrigin(0.5)
        .setDepth(26)
        .setVisible(false)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => scene.pauseMenuBtn.setStyle({ fill: '#fff', backgroundColor: '#1a3a4a' }))
        .on('pointerout', () => scene.pauseMenuBtn.setStyle({ fill: '#0af', backgroundColor: '#000' }))
        .on('pointerdown', () => {
            scene.isPaused = false;
            if (scene.bgm) scene.bgm.stop();
            if (menuDestination === 'StartScene') {
                scene.game.events.emit('returnToMenu');
            } else {
                scene.scene.start(menuDestination);
            }
        });

    scene.input.keyboard.on('keydown-P', () => scene.togglePause());
    scene.input.keyboard.on('keydown-ESC', () => scene.togglePause());
}

/**
 * 讀取音量設定並播放遊戲 BGM
 */
export function setupAudio(scene) {
    let savedVolume = parseFloat(localStorage.getItem('bgmVolume'));
    if (isNaN(savedVolume)) savedVolume = 0.5;
    const isMuted = localStorage.getItem('bgmMuted') === 'true';
    scene.sound.volume = isMuted ? 0 : savedVolume;

    scene.bgm = scene.sound.add('bgm_game', { loop: true, volume: 1 });
    scene.bgm.play();
}
