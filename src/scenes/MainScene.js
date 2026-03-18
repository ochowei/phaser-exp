import * as Phaser from 'phaser';
import Enemy from '../objects/Enemy.js';
import Powerup from '../objects/Powerup.js';
import { t } from '../i18n.js';
import { getAircraftProfile } from '../profiles/aircraftProfiles.js';
import {
    createGameTextures,
    createParallaxBackground,
    scrollParallaxBackground,
    createPhysicsGroups,
    setupKeyboardInput,
    setupJoystick,
    createPlayerWithTrail,
    setupPauseSystem,
    setupAudio,
} from '../utils/sceneHelpers.js';

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

        createGameTextures(this);
        createParallaxBackground(this);

        // 遊戲狀態與變數
        this.gameOver = false;
        this.isPaused = false;
        this.score = 0;
        this.highScore = localStorage.getItem('phaserShooterHighScore') || 0;
        this.hasTripleShot = false;
        this.lastFired = 0;
        this.fireRate = 380;

        createPlayerWithTrail(this);
        setupKeyboardInput(this);
        createPhysicsGroups(this);

        // UI 文字
        this.scoreText = this.add.text(16, 16, t('score') + ': 0', { fontSize: '24px', fill: '#fff', fontStyle: 'bold' });
        this.highScoreText = this.add.text(16, 44, t('highScore') + ': ' + this.highScore, { fontSize: '18px', fill: '#aaa' });
        this.healthText = this.add.text(16, 70, 'HP: ❤️❤️❤️', { fontSize: '20px', fill: '#ff4444' });
        this.tripleShotText = this.add.text(16, 560, t('tripleShotActive'), { fontSize: '20px', fill: '#00ff00', fontStyle: 'bold' });
        this.tripleShotText.setVisible(false);

        setupPauseSystem(this, 'StartScene');

        // 敵人生成計時器
        this.enemySpawnTimer = this.time.addEvent({
            delay: 1000,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });

        // 迷你Boss生成計時器（每30秒）
        this.bossSpawnTimer = this.time.addEvent({
            delay: 30000,
            callback: this.spawnMiniBoss,
            callbackScope: this,
            loop: true
        });

        // Boss警告文字
        this.bossWarningText = this.add.text(400, 300, t('miniBossWarning'), {
            fontSize: '36px', fill: '#ff0', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(20).setVisible(false);

        setupJoystick(this);
        setupAudio(this);
    }

    update(time, delta) {
        if (this.gameOver || this.isPaused) return;

        scrollParallaxBackground(this);

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
    }

    togglePause() {
        if (this.gameOver) return;

        this.isPaused = !this.isPaused;
        this.physics.world.isPaused = this.isPaused;
        this.enemySpawnTimer.paused = this.isPaused;
        if (this.bossSpawnTimer) this.bossSpawnTimer.paused = this.isPaused;

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

    fireSingleBullet(velocityX) {
        let bullet = this.bullets.get(this.player.x, this.player.y - 16);
        if (bullet) {
            bullet.fire(this.player.x, this.player.y - 16, velocityX);
        }
    }

    spawnEnemy() {
        if (this.gameOver) return;

        let x = Phaser.Math.Between(50, 750);

        // 20% 機率生成帶著升級道具的紫色特殊敵人
        let isSpecialEnemy = Phaser.Math.Between(1, 100) <= 20;
        let profileKey = isSpecialEnemy ? 'EN_PURPLE' : 'EN_RED';
        let profile = getAircraftProfile(profileKey);

        // 生成敵人物件並加進群組（從上方出現）
        let enemy = new Enemy(this, x, -50, profile.textureKey, { isSpecial: isSpecialEnemy, hp: profile.hp });
        this.enemies.add(enemy);

        // 加入群組後再給予速度，避免被 group default override
        let speed = Phaser.Math.Between(150, 350);
        enemy.setVelocityY(speed);
    }

    spawnMiniBoss() {
        if (this.gameOver) return;

        const x = Phaser.Math.Between(80, 720);
        const bossProfile = getAircraftProfile('EN_BOSS_GREEN');
        const enemy = new Enemy(this, x, -50, bossProfile.textureKey, {
            isBoss: true,
            hp: bossProfile.hp,
            scoreValue: 100,
        });
        this.enemies.add(enemy);
        enemy.setVelocityY(60);

        // Boss尾焰粒子
        const trail = this.add.particles(0, 0, 'bullet', bossProfile.trail);
        trail.startFollow(enemy, bossProfile.trailOffset.x, bossProfile.trailOffset.y);
        enemy.once('destroy', () => trail.destroy());

        // Boss每1.5秒發射子彈
        const fireTimer = this.time.addEvent({
            delay: 1500,
            callback: () => {
                if (enemy.active) {
                    this.spawnEnemyBullet(enemy.x, enemy.y + 24);
                } else {
                    fireTimer.remove();
                }
            },
            loop: true
        });
        enemy.once('destroy', () => fireTimer.remove());

        // 顯示警告文字
        this.bossWarningText.setVisible(true);
        this.time.delayedCall(2000, () => {
            this.bossWarningText.setVisible(false);
        });
    }

    spawnEnemyBullet(x, y) {
        const bullet = this.add.image(x, y, 'enemy_bullet');
        this.physics.add.existing(bullet);
        bullet.body.setVelocityY(300);
        this.enemyBullets.add(bullet);

        // 離開畫面後自動銷毀
        this.time.delayedCall(3000, () => {
            if (bullet.active) bullet.destroy();
        });
    }

    hitPlayerByBullet(player, bullet) {
        if (player.invincible) return;
        bullet.destroy();
        player.receiveDamage();
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
        powerup.setVelocityY(100);
    }

    onPlayerDamaged() {
        this.updateHealthText();
        this.cameras.main.shake(150, 0.008);

        if (this.player.health <= 0) {
            this.physics.pause();
            this.player.setTint(0xff0000);
            this.gameOver = true;
            this.enemySpawnTimer.remove();
            if (this.bossSpawnTimer) this.bossSpawnTimer.remove();

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
                .on('pointerdown', () => this.game.events.emit('returnToMenu'));
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
