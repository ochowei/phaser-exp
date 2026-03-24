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
        // 玩家戰機圖片
        if (!this.textures.exists('playerTexture')) {
            this.load.image('playerTexture', 'assets/image/player.png');
        }
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
        this.hasBombs = 0;
        this.shieldVisual = null;

        createPlayerWithTrail(this);
        setupKeyboardInput(this);
        createPhysicsGroups(this);

        // UI 文字
        this.scoreText = this.add.text(16, 16, t('score') + ': 0', { fontSize: '24px', fill: '#fff', fontStyle: 'bold' });
        this.highScoreText = this.add.text(16, 44, t('highScore') + ': ' + this.highScore, { fontSize: '18px', fill: '#aaa' });
        this.healthText = this.add.text(16, 70, 'HP: ❤️❤️❤️', { fontSize: '20px', fill: '#ff4444' });
        this.shieldIndicatorText = this.add.text(16, 95, '🛡️ ' + t('shieldActive'), { fontSize: '16px', fill: '#44aaff', fontStyle: 'bold' });
        this.shieldIndicatorText.setVisible(false);
        this.bombCountText = this.add.text(16, 115, '💣 x0', { fontSize: '16px', fill: '#ffaa00', fontStyle: 'bold' });
        this.bombCountText.setVisible(false);
        this.tripleShotText = this.add.text(16, 560, t('tripleShotActive'), { fontSize: '20px', fill: '#00ff00', fontStyle: 'bold' });
        this.tripleShotText.setVisible(false);

        setupPauseSystem(this, 'StartScene');

        // 炸彈快捷鍵（Space）
        this.input.keyboard.on('keydown-SPACE', () => {
            if (!this.gameOver && !this.isPaused) this.activateBomb();
        });

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

        // 護盾視覺跟隨玩家
        if (this.shieldVisual && this.player.hasShield) {
            this.shieldVisual.setPosition(this.player.x, this.player.y);
        }

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
        const type = powerup.type;
        powerup.destroy();

        switch (type) {
        case 'shield':
            this.activateShield();
            break;
        case 'bomb':
            this.addBomb();
            break;
        default: // tripleshot
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
    }

    activateShield() {
        this.player.hasShield = true;
        this.shieldIndicatorText.setVisible(true);
        this.cameras.main.flash(200, 0, 100, 255);

        if (this.shieldVisual) this.shieldVisual.destroy();
        this.shieldVisual = this.add.graphics();
        this.shieldVisual.lineStyle(3, 0x44aaff, 1);
        this.shieldVisual.strokeCircle(0, 0, 32);
        this.shieldVisual.setPosition(this.player.x, this.player.y).setDepth(5);
        this.tweens.add({
            targets: this.shieldVisual,
            alpha: 0.4,
            duration: 600,
            yoyo: true,
            repeat: -1
        });
    }

    onShieldBroken() {
        this.shieldIndicatorText.setVisible(false);
        if (this.shieldVisual) {
            this.shieldVisual.destroy();
            this.shieldVisual = null;
        }
        this.cameras.main.flash(150, 0, 150, 255);
        this.cameras.main.shake(100, 0.005);
    }

    addBomb() {
        if (this.hasBombs < 3) {
            this.hasBombs++;
            this.updateBombText();
            this.cameras.main.flash(200, 255, 150, 0);
        }
    }

    updateBombText() {
        this.bombCountText.setText('💣 x' + this.hasBombs);
        this.bombCountText.setVisible(this.hasBombs > 0);
    }

    activateBomb() {
        if (this.hasBombs <= 0) return;

        this.hasBombs--;
        this.updateBombText();

        this.cameras.main.flash(300, 255, 200, 50);
        this.cameras.main.shake(300, 0.015);

        // 消滅所有普通敵人（保留關卡Boss），並結算分數與掉落
        let totalScore = 0;
        this.enemies.getChildren().slice().forEach(enemy => {
            if (enemy.active && !enemy.isStageBoss) {
                totalScore += enemy.scoreValue;
                if (enemy.shouldDropPowerup()) {
                    this.spawnPowerup(enemy.x, enemy.y);
                }
                enemy._destroyHealthBar();
                enemy.destroy();
            }
        });

        // 清除敵方子彈
        this.enemyBullets.getChildren().slice().forEach(bullet => {
            if (bullet.active) bullet.destroy();
        });

        if (totalScore > 0) this.updateScore(totalScore);

        // 爆炸圓環特效
        [0, 100, 200].forEach(delay => {
            this.time.delayedCall(delay, () => {
                const ring = this.add.graphics();
                ring.lineStyle(4, 0xffaa00, 1);
                ring.strokeCircle(this.player.x, this.player.y, 10);
                this.tweens.add({
                    targets: ring,
                    scaleX: 30,
                    scaleY: 30,
                    alpha: 0,
                    duration: 500,
                    ease: 'Cubic.easeOut',
                    onComplete: () => ring.destroy()
                });
            });
        });
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
        const rand = Phaser.Math.Between(1, 4);
        let type, texture;
        if (rand <= 2) { type = 'tripleshot'; texture = 'powerupTexture'; }
        else if (rand === 3) { type = 'shield'; texture = 'shieldTexture'; }
        else { type = 'bomb'; texture = 'bombTexture'; }

        const powerup = new Powerup(this, x, y, texture, type);
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
            this.shieldIndicatorText.setVisible(false);
            this.bombCountText.setVisible(false);
            if (this.shieldVisual) { this.shieldVisual.destroy(); this.shieldVisual = null; }
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
