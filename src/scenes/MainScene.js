import * as Phaser from 'phaser';
import Player from '../objects/Player.js';
import Enemy from '../objects/Enemy.js';
import Bullet from '../objects/Bullet.js';
import Powerup from '../objects/Powerup.js';
import { t } from '../i18n.js';
import { getAircraftProfile, DEFAULT_AIRCRAFT } from '../profiles/aircraftProfiles.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        // 若音效尚未被 StartScene 載入（安全防護）
        if (!this.cache.audio.exists('bgm_game')) {
            this.load.audio('bgm_game', 'assets/audio/bgm_game.wav');
        }
    }

    create() {
        this.cameras.main.fadeIn(300, 0, 0, 0);

        const graphics = this.add.graphics();
        
        // 背景雜訊紋理
        graphics.fillStyle(0x555555, 1);
        for(let i=0; i<200; i++) graphics.fillRect(Phaser.Math.Between(0, 512), Phaser.Math.Between(0, 512), 2, 2);
        graphics.generateTexture('bg_stars3', 512, 512);
        graphics.clear();
        
        graphics.fillStyle(0xaaaaaa, 1);
        for(let i=0; i<100; i++) graphics.fillRect(Phaser.Math.Between(0, 512), Phaser.Math.Between(0, 512), 2, 2);
        graphics.generateTexture('bg_stars2', 512, 512);
        graphics.clear();

        graphics.fillStyle(0xffffff, 1);
        for(let i=0; i<50; i++) graphics.fillRect(Phaser.Math.Between(0, 512), Phaser.Math.Between(0, 512), 2, 2);
        graphics.generateTexture('bg_stars1', 512, 512);
        graphics.clear();

        // 建立背景捲動層 
        this.bg3 = this.add.tileSprite(400, 300, 800, 600, 'bg_stars3');
        this.bg2 = this.add.tileSprite(400, 300, 800, 600, 'bg_stars2');
        this.bg1 = this.add.tileSprite(400, 300, 800, 600, 'bg_stars1');

        // 玩家紋理（從 aircraft profile 繪製）
        const aircraft = getAircraftProfile(DEFAULT_AIRCRAFT);
        aircraft.draw(graphics);
        graphics.generateTexture(aircraft.textureKey, aircraft.textureSize.width, aircraft.textureSize.height);
        graphics.clear();

        // 子彈紋理
        graphics.fillStyle(0xffff00, 1);
        graphics.fillCircle(8, 8, 8);
        graphics.generateTexture('bullet', 16, 16);
        graphics.clear();

        // 普通敵人紋理
        graphics.fillStyle(0xff3333, 1);
        graphics.fillRect(0, 0, 32, 32);
        graphics.generateTexture('enemy_normal', 32, 32);
        graphics.clear();

        // 特殊敵人紋理
        graphics.fillStyle(0xcc00ff, 1);
        graphics.fillRect(0, 0, 32, 32);
        graphics.generateTexture('enemy_special', 32, 32);
        graphics.clear();

        // 道具紋理
        graphics.fillStyle(0x00ff00, 1);
        graphics.fillCircle(10, 10, 10);
        graphics.generateTexture('powerupTexture', 20, 20);
        graphics.clear();

        // 遊戲狀態與變數
        this.gameOver = false;
        this.isPaused = false;
        this.score = 0;
        this.highScore = localStorage.getItem('phaserShooterHighScore') || 0;
        this.hasTripleShot = false;
        this.lastFired = 0;
        this.fireRate = 180;

        // 加入玩家實體
        this.player = new Player(this, 100, 300, 'playerTexture');

        // 玩家噴射尾焰（從 aircraft profile 設定）
        this.playerTrail = this.add.particles(0, 0, 'bullet', aircraft.trail);
        this.playerTrail.startFollow(this.player, aircraft.trailOffset.x, aircraft.trailOffset.y);

        // 鍵盤輸入
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            upArrow: Phaser.Input.Keyboard.KeyCodes.UP,
            downArrow: Phaser.Input.Keyboard.KeyCodes.DOWN,
            leftArrow: Phaser.Input.Keyboard.KeyCodes.LEFT,
            rightArrow: Phaser.Input.Keyboard.KeyCodes.RIGHT
        });

        // 建立群組
        this.bullets = this.physics.add.group({
            classType: Bullet,
            maxSize: 60,
            runChildUpdate: true
        });
        
        // Enemy 群組不需 classType 因為我們手動 new
        this.enemies = this.physics.add.group({
            runChildUpdate: true
        });
        this.powerups = this.physics.add.group({
            runChildUpdate: true
        });

        // 碰撞事件
        this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.hitPlayer, null, this);
        this.physics.add.overlap(this.player, this.powerups, this.collectPowerup, null, this);

        // UI 文字
        this.scoreText = this.add.text(16, 16, t('score') + ': 0', { fontSize: '24px', fill: '#fff', fontStyle: 'bold' });
        this.highScoreText = this.add.text(16, 44, t('highScore') + ': ' + this.highScore, { fontSize: '18px', fill: '#aaa' });
        this.healthText = this.add.text(16, 70, 'HP: ❤️❤️❤️', { fontSize: '20px', fill: '#ff4444' });
        this.tripleShotText = this.add.text(16, 560, t('tripleShotActive'), { fontSize: '20px', fill: '#00ff00', fontStyle: 'bold' });
        this.tripleShotText.setVisible(false);

        // 暫停 UI
        this.pauseButton = this.add.text(784, 16, '⏸', {
            fontSize: '28px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 10, y: 6 }
        })
        .setOrigin(1, 0)
        .setDepth(30)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.togglePause())
        .on('pointerover', () => this.pauseButton.setStyle({ backgroundColor: '#333' }))
        .on('pointerout', () => this.pauseButton.setStyle({ backgroundColor: '#000' }));

        this.pauseOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.45)
            .setDepth(25)
            .setVisible(false);
        this.pauseText = this.add.text(400, 280, t('paused'), {
            fontSize: '64px',
            fill: '#ffffff',
            fontStyle: 'bold'
        })
            .setOrigin(0.5)
            .setDepth(26)
            .setVisible(false);
        this.pauseHintText = this.add.text(400, 345, t('pauseHint'), {
            fontSize: '24px',
            fill: '#dddddd'
        })
            .setOrigin(0.5)
            .setDepth(26)
            .setVisible(false);

        this.pauseMenuBtn = this.add.text(400, 410, t('mainMenu'), {
            fontSize: '26px',
            fill: '#0af',
            backgroundColor: '#000',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setDepth(26)
            .setVisible(false)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => this.pauseMenuBtn.setStyle({ fill: '#fff', backgroundColor: '#1a3a4a' }))
            .on('pointerout', () => this.pauseMenuBtn.setStyle({ fill: '#0af', backgroundColor: '#000' }))
            .on('pointerdown', () => {
                this.isPaused = false;
                if (this.bgm) this.bgm.stop();
                this.scene.start('StartScene');
            });

        this.input.keyboard.on('keydown-P', () => this.togglePause());
        this.input.keyboard.on('keydown-ESC', () => this.togglePause());

        // 敵人生成計時器
        this.enemySpawnTimer = this.time.addEvent({
            delay: 1000,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });

        // 虛擬搖桿（手機觸控）
        this.joystick = { dx: 0, dy: 0, active: false, pointerId: null, startX: 0, startY: 0 };
        const joystickRadius = 60;
        const thumbRadius = 25;

        this.joystickBaseGfx = this.add.graphics();
        this.joystickBaseGfx.fillStyle(0xffffff, 0.2);
        this.joystickBaseGfx.fillCircle(0, 0, joystickRadius);
        this.joystickBaseGfx.lineStyle(2, 0xffffff, 0.4);
        this.joystickBaseGfx.strokeCircle(0, 0, joystickRadius);
        this.joystickBaseGfx.setVisible(false).setDepth(10);

        this.joystickThumbGfx = this.add.graphics();
        this.joystickThumbGfx.fillStyle(0xffffff, 0.5);
        this.joystickThumbGfx.fillCircle(0, 0, thumbRadius);
        this.joystickThumbGfx.setVisible(false).setDepth(11);

        this.input.on('pointerdown', (pointer) => {
            if (this.gameOver) return;
            if (!this.joystick.active) {
                this.joystick.active = true;
                this.joystick.pointerId = pointer.id;
                this.joystick.startX = pointer.x;
                this.joystick.startY = pointer.y;
                this.joystick.dx = 0;
                this.joystick.dy = 0;
                this.joystickBaseGfx.setPosition(pointer.x, pointer.y).setVisible(true);
                this.joystickThumbGfx.setPosition(pointer.x, pointer.y).setVisible(true);
            }
        });

        this.input.on('pointermove', (pointer) => {
            if (!this.joystick.active || pointer.id !== this.joystick.pointerId) return;
            const dx = pointer.x - this.joystick.startX;
            const dy = pointer.y - this.joystick.startY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > joystickRadius) {
                this.joystick.dx = dx / dist;
                this.joystick.dy = dy / dist;
            } else {
                this.joystick.dx = dx / joystickRadius;
                this.joystick.dy = dy / joystickRadius;
            }
            const clampedX = this.joystick.startX + this.joystick.dx * joystickRadius;
            const clampedY = this.joystick.startY + this.joystick.dy * joystickRadius;
            this.joystickThumbGfx.setPosition(clampedX, clampedY);
        });

        this.input.on('pointerup', (pointer) => {
            if (pointer.id === this.joystick.pointerId) {
                this.joystick.active = false;
                this.joystick.dx = 0;
                this.joystick.dy = 0;
                this.joystickBaseGfx.setVisible(false);
                this.joystickThumbGfx.setVisible(false);
            }
        });

        // 從 localStorage 讀取音量設定
        let savedVolume = parseFloat(localStorage.getItem('bgmVolume'));
        if (isNaN(savedVolume)) savedVolume = 0.5;
        const isMuted = localStorage.getItem('bgmMuted') === 'true';
        this.sound.volume = isMuted ? 0 : savedVolume;

        // 播放遊戲背景音樂
        this.bgm = this.sound.add('bgm_game', { loop: true, volume: 1 });
        this.bgm.play();
    }

    update(time, delta) {
        if (this.gameOver || this.isPaused) return;

        // 背景捲動
        this.bg3.tilePositionX += 0.2;
        this.bg2.tilePositionX += 0.5;
        this.bg1.tilePositionX += 1.0;

        // 玩家移動
        this.player.update(this.keys, this.joystick);

        // 處理發射子彈
        if (time > this.lastFired) {
            if (this.hasTripleShot) {
                this.fireSingleBullet(0);
                this.fireSingleBullet(-150); 
                this.fireSingleBullet(150);  
            } else {
                this.fireSingleBullet(0);
            }
            this.lastFired = time + this.fireRate;
        }

        // 移除先前的 debugText 覆蓋
    }

    togglePause() {
        if (this.gameOver) return;

        this.isPaused = !this.isPaused;
        this.physics.world.isPaused = this.isPaused;
        this.enemySpawnTimer.paused = this.isPaused;

        if (this.isPaused) {
            this.playerTrail.pause();
            this.pauseButton.setText('▶');
            if (this.bgm) this.bgm.pause();
        } else {
            this.playerTrail.resume();
            this.pauseButton.setText('⏸');
            if (this.bgm) this.bgm.resume();
        }

        this.pauseOverlay.setVisible(this.isPaused);
        this.pauseText.setVisible(this.isPaused);
        this.pauseHintText.setVisible(this.isPaused);
        this.pauseMenuBtn.setVisible(this.isPaused);
    }

    fireSingleBullet(velocityY) {
        let bullet = this.bullets.get(this.player.x + 16, this.player.y);
        if (bullet) {
            bullet.fire(this.player.x + 16, this.player.y, velocityY);
        }
    }

    spawnEnemy() {
        if (this.gameOver) return;
        
        let y = Phaser.Math.Between(50, 550);
        
        // 20% 機率生成帶著升級道具的紫色特殊敵人
        let isSpecialEnemy = Phaser.Math.Between(1, 100) <= 20; 
        let enemyKey = isSpecialEnemy ? 'enemy_special' : 'enemy_normal';
        
        // 生成敵人物件並加進群組 (Phaser.Physics.Arcade.Group.add)
        let enemy = new Enemy(this, 850, y, enemyKey, isSpecialEnemy);
        this.enemies.add(enemy);
        
        // 加入群組後再給予速度，避免被 group default override
        let speed = Phaser.Math.Between(-150, -350);
        enemy.setVelocityX(speed);
    }

    hitEnemy(bullet, enemy) {
        // 回收子彈
        bullet.setActive(false);
        bullet.setVisible(false);
        bullet.body.stop();

        enemy.takeHit();
    }

    collectPowerup(player, powerup) {
        powerup.destroy();
        this.hasTripleShot = true;
        this.tripleShotText.setVisible(true);

        this.cameras.main.flash(200, 0, 255, 0);

        if (this.tripleShotTimer) this.tripleShotTimer.remove();
        
        this.tripleShotTimer = this.time.delayedCall(10000, () => {
            this.hasTripleShot = false;
            this.tripleShotText.setVisible(false);
        }, [], this);
        
        this.updateScore(50);
    }

    updateScore(points) {
        this.score += points;
        this.scoreText.setText(t('score') + ': ' + this.score);

        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreText.setText(t('highScore') + ': ' + this.highScore);
            localStorage.setItem('phaserShooterHighScore', this.highScore);
        }
    }

    updateHealthText() {
        const hp = this.player.health;
        const hearts = '❤️'.repeat(hp) + '🖤'.repeat(this.player.maxHealth - hp);
        this.healthText.setText('HP: ' + hearts);
    }

    hitPlayer(player, enemy) {
        if (player.invincible) return;

        enemy.hitPlayer(player);
    }

    spawnPowerup(x, y) {
        let powerup = new Powerup(this, x, y, 'powerupTexture');
        this.powerups.add(powerup);
        powerup.setVelocityX(-100);
    }

    onPlayerDamaged() {
        this.updateHealthText();
        this.cameras.main.shake(150, 0.008);

        if (this.player.health <= 0) {
            this.physics.pause();
            this.player.setTint(0xff0000);
            this.gameOver = true;
            this.enemySpawnTimer.remove();

            this.cameras.main.shake(300, 0.015);
            this.tripleShotText.setVisible(false);
            this.playerTrail.stop();
            if (this.bgm) this.bgm.stop();

            let gameOverText = this.add.text(400, 250, t('gameOver'), { fontSize: '64px', fill: '#ff3333', fontStyle: 'bold' });
            gameOverText.setOrigin(0.5);

            // Restart 按鈕
            const restartBtn = this.add.text(300, 350, t('restart'), {
                fontSize: '28px', fill: '#0f0', backgroundColor: '#000', padding: { x: 15, y: 10 }
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => restartBtn.setStyle({ fill: '#fff', backgroundColor: '#333' }))
            .on('pointerout', () => restartBtn.setStyle({ fill: '#0f0', backgroundColor: '#000' }))
            .on('pointerdown', () => this.scene.restart());

            // Main Menu 按鈕
            const menuBtn = this.add.text(500, 350, t('mainMenu'), {
                fontSize: '28px', fill: '#0af', backgroundColor: '#000', padding: { x: 15, y: 10 }
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => menuBtn.setStyle({ fill: '#fff', backgroundColor: '#333' }))
            .on('pointerout', () => menuBtn.setStyle({ fill: '#0af', backgroundColor: '#000' }))
            .on('pointerdown', () => this.scene.start('StartScene'));
        } else {
            // 短暫無敵並閃爍
            this.player.invincible = true;
            this.player.setTint(0xff6666);
            this.time.delayedCall(1000, () => {
                if (this.player.active) {
                    this.player.clearTint();
                    this.player.invincible = false;
                }
            });
        }
    }
}

