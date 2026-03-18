import * as Phaser from 'phaser';
import Powerup from '../objects/Powerup.js';
import { t } from '../i18n.js';
import { getStageById } from '../data/stageData.js';
import WaveManager from '../systems/WaveManager.js';
import {
    createGameTextures,
    createBossTextures,
    createParallaxBackground,
    scrollParallaxBackground,
    createPhysicsGroups,
    setupKeyboardInput,
    setupJoystick,
    createPlayerWithTrail,
    setupPauseSystem,
    setupAudio,
} from '../utils/sceneHelpers.js';

export default class StageScene extends Phaser.Scene {
    constructor() {
        super('StageScene');
    }

    init(data) {
        this.stageId = data.stageId || this.registry.get('stageId') || 1;
    }

    preload() {
        if (!this.cache.audio.exists('bgm_game')) {
            this.load.audio('bgm_game', 'assets/audio/bgm_game.wav');
        }
    }

    create() {
        this.cameras.main.fadeIn(300, 0, 0, 0);

        const stageConfig = getStageById(this.stageId);
        this.stageConfig = stageConfig;

        createGameTextures(this);
        createBossTextures(this, [stageConfig.boss.profileKey]);
        createParallaxBackground(this);

        // 遊戲狀態
        this.gameOver = false;
        this.isPaused = false;
        this.score = 0;
        this.hasTripleShot = false;
        this.lastFired = 0;
        this.fireRate = 380;
        this.trackingBullets = [];
        this.stageBoss = null;

        createPlayerWithTrail(this);
        setupKeyboardInput(this);
        createPhysicsGroups(this);

        // HUD — 關卡名稱
        this.stageNameText = this.add.text(16, 16, t(stageConfig.nameKey), {
            fontSize: '18px', fill: '#aaa'
        });

        // HUD — 分數
        this.scoreText = this.add.text(16, 38, t('score') + ': 0', {
            fontSize: '24px', fill: '#fff', fontStyle: 'bold'
        });

        // HUD — 血量
        this.healthText = this.add.text(16, 66, 'HP: ❤️❤️❤️', {
            fontSize: '20px', fill: '#ff4444'
        });

        // HUD — 三連射
        this.tripleShotText = this.add.text(16, 560, t('tripleShotActive'), {
            fontSize: '20px', fill: '#00ff00', fontStyle: 'bold'
        });
        this.tripleShotText.setVisible(false);

        // HUD — 波次指示器
        this.waveText = this.add.text(680, 50, '', {
            fontSize: '20px', fill: '#fff', fontStyle: 'bold'
        }).setOrigin(0.5, 0);

        setupPauseSystem(this, 'StartScene');
        setupJoystick(this);
        setupAudio(this);

        // Boss HP 條（初始隱藏）
        this.bossHpBarBg = this.add.rectangle(400, 25, 300, 12, 0x333333)
            .setDepth(20).setVisible(false);
        this.bossHpBar = this.add.rectangle(400, 25, 300, 12, 0x00ff00)
            .setDepth(21).setVisible(false);
        this.bossNameText = this.add.text(400, 8, '', {
            fontSize: '14px', fill: '#fff', fontStyle: 'bold'
        }).setOrigin(0.5, 1).setDepth(20).setVisible(false);

        // 事件監聽
        this.events.on('waveStart', (waveNum, totalWaves) => {
            this.waveText.setText(`${t('waveLabel')} ${waveNum}/${totalWaves}`);
            this.waveText.setColor('#fff');
        });

        this.events.on('bossPhaseStart', () => {
            this.waveText.setText(t('bossLabel'));
            this.waveText.setColor('#ff3333');
        });

        this.events.on('bossSpawned', (boss, profile) => {
            this.stageBoss = boss;
            this.bossMaxHp = boss.hp;
            this.bossHpBarBg.setVisible(true);
            this.bossHpBar.setVisible(true);
            const nameKey = `boss${stageConfig.boss.profileKey.replace('EN_BOSS_', '')}Name`;
            const bossName = t(nameKey) !== nameKey ? t(nameKey) : profile.name;
            this.bossNameText.setText(bossName).setVisible(true);
        });

        // 場景清理
        this.events.on('shutdown', () => {
            if (this.waveManager) this.waveManager.destroy();
            this.trackingBullets = [];
        });

        // 啟動波次管理器
        this.waveManager = new WaveManager(this, stageConfig);
        this.waveManager.start();
    }

    update(time, delta) {
        if (this.gameOver || this.isPaused) return;

        scrollParallaxBackground(this);
        this.player.update(this.keys, this.joystick);

        // 自動發射子彈
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

        // 更新追蹤彈
        this._updateTrackingBullets();

        // 更新 Boss HP 條
        if (this.stageBoss && this.stageBoss.active) {
            const ratio = this.stageBoss.hp / this.bossMaxHp;
            this.bossHpBar.width = 300 * ratio;
            const color = ratio > 0.5 ? 0x00ff00 : (ratio > 0.25 ? 0xffff00 : 0xff0000);
            this.bossHpBar.setFillStyle(color);
        }
    }

    togglePause() {
        if (this.gameOver) return;

        this.isPaused = !this.isPaused;
        this.physics.world.isPaused = this.isPaused;

        if (this.waveManager) {
            if (this.isPaused) this.waveManager.pause();
            else this.waveManager.resume();
        }

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

    // --- Boss 攻擊模式 ---

    fireBossAttack(boss, pattern) {
        if (!boss.active || this.gameOver) return;

        switch (pattern) {
        case 'aimed':
            this._fireBossAimed(boss);
            break;
        case 'scatter':
            this._fireBossScatter(boss);
            break;
        case 'tracking':
            this._fireBossTracking(boss);
            break;
        }
    }

    _fireBossAimed(boss) {
        const angle = Phaser.Math.Angle.Between(boss.x, boss.y, this.player.x, this.player.y);
        const speed = 300;
        const bullet = this._createEnemyBullet(boss.x, boss.y + 24);
        bullet.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
    }

    _fireBossScatter(boss) {
        const baseAngle = Math.PI / 2; // 向下
        const angles = [-30, -15, 0, 15, 30];
        const speed = 250;

        for (const offset of angles) {
            const angle = baseAngle + Phaser.Math.DegToRad(offset);
            const bullet = this._createEnemyBullet(boss.x, boss.y + 24);
            bullet.body.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
        }
    }

    _fireBossTracking(boss) {
        // 限制同時 1 顆追蹤彈
        this.trackingBullets = this.trackingBullets.filter(b => b.active);
        if (this.trackingBullets.length >= 1) return;

        const bullet = this._createEnemyBullet(boss.x, boss.y + 24);
        bullet.isTracking = true;
        bullet.trackSpeed = 200;
        bullet.body.setVelocityY(200);
        this.trackingBullets.push(bullet);

        // 4 秒後自毀
        this.time.delayedCall(4000, () => {
            if (bullet.active) bullet.destroy();
        });
    }

    _createEnemyBullet(x, y) {
        const bullet = this.add.image(x, y, 'enemy_bullet');
        this.physics.add.existing(bullet);
        this.enemyBullets.add(bullet);

        this.time.delayedCall(5000, () => {
            if (bullet.active) bullet.destroy();
        });

        return bullet;
    }

    _updateTrackingBullets() {
        for (const bullet of this.trackingBullets) {
            if (!bullet.active) continue;

            const angle = Phaser.Math.Angle.Between(
                bullet.x, bullet.y, this.player.x, this.player.y
            );
            const currentAngle = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);

            // 最多轉向 2 度/幀
            const maxTurn = Phaser.Math.DegToRad(2);
            let diff = angle - currentAngle;

            // 正規化角度差到 [-PI, PI]
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;

            const newAngle = currentAngle + Phaser.Math.Clamp(diff, -maxTurn, maxTurn);
            bullet.body.setVelocity(
                Math.cos(newAngle) * bullet.trackSpeed,
                Math.sin(newAngle) * bullet.trackSpeed
            );
        }
    }

    // --- 碰撞處理 ---

    hitEnemy(bullet, enemy) {
        bullet.setActive(false);
        bullet.setVisible(false);
        bullet.body.stop();

        enemy.takeHit();
    }

    hitPlayerByBullet(player, bullet) {
        if (player.invincible) return;
        bullet.destroy();
        player.receiveDamage();
    }

    hitPlayer(player, enemy) {
        if (player.invincible) return;
        enemy.hitPlayer(player);
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

    spawnPowerup(x, y) {
        let powerup = new Powerup(this, x, y, 'powerupTexture');
        this.powerups.add(powerup);
        powerup.setVelocityY(100);
    }

    updateScore(points) {
        this.score += points;
        this.scoreText.setText(t('score') + ': ' + this.score);
    }

    updateHealthText() {
        const hp = this.player.health;
        const hearts = '❤️'.repeat(hp) + '🖤'.repeat(this.player.maxHealth - hp);
        this.healthText.setText('HP: ' + hearts);
    }

    // --- 玩家被擊中 ---

    onPlayerDamaged() {
        this.updateHealthText();
        this.cameras.main.shake(150, 0.008);

        if (this.player.health <= 0) {
            this.physics.pause();
            this.player.setTint(0xff0000);
            this.gameOver = true;
            if (this.waveManager) this.waveManager.destroy();

            this.cameras.main.shake(300, 0.015);
            this.tripleShotText.setVisible(false);
            this.playerTrail.stop();
            if (this.bgm) this.bgm.stop();

            this.add.text(400, 250, t('gameOver'), {
                fontSize: '64px', fill: '#ff3333', fontStyle: 'bold'
            }).setOrigin(0.5);

            // Retry 按鈕
            const retryBtn = this.add.text(300, 350, t('retry'), {
                fontSize: '28px', fill: '#0f0', backgroundColor: '#000', padding: { x: 15, y: 10 }
            })
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true })
                .on('pointerover', () => retryBtn.setStyle({ fill: '#fff', backgroundColor: '#333' }))
                .on('pointerout', () => retryBtn.setStyle({ fill: '#0f0', backgroundColor: '#000' }))
                .on('pointerdown', () => this.scene.restart({ stageId: this.stageId }));

            // Stage Select 按鈕
            const selectBtn = this.add.text(500, 350, t('stageSelect'), {
                fontSize: '28px', fill: '#0af', backgroundColor: '#000', padding: { x: 15, y: 10 }
            })
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true })
                .on('pointerover', () => selectBtn.setStyle({ fill: '#fff', backgroundColor: '#333' }))
                .on('pointerout', () => selectBtn.setStyle({ fill: '#0af', backgroundColor: '#000' }))
                .on('pointerdown', () => this.game.events.emit('returnToMenu'));
        } else {
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

    // --- Boss 被擊敗（由 Enemy.takeHit 中觸發） ---

    onStageBossDefeated() {
        this.gameOver = true;
        if (this.waveManager) this.waveManager.destroy();

        // 隱藏 Boss HP 條
        this.bossHpBarBg.setVisible(false);
        this.bossHpBar.setVisible(false);
        this.bossNameText.setVisible(false);

        this.cameras.main.shake(300, 0.02);
        this.playerTrail.stop();

        // 儲存通關進度
        this._saveProgress();

        // 顯示通關畫面
        this.time.delayedCall(500, () => {
            const isLastStage = this.stageId >= 3;
            const clearMsg = isLastStage ? t('allClear') : t('stageClear');

            const clearText = this.add.text(400, 220, clearMsg, {
                fontSize: '48px', fill: '#ffd700', fontStyle: 'bold',
                stroke: '#000', strokeThickness: 4,
            }).setOrigin(0.5).setDepth(30).setScale(0.5);

            this.tweens.add({
                targets: clearText,
                scale: 1,
                duration: 500,
                ease: 'Back.easeOut',
            });

            // 分數顯示
            this.add.text(400, 290, `${t('score')}: ${this.score}`, {
                fontSize: '28px', fill: '#fff',
            }).setOrigin(0.5).setDepth(30);

            // 按鈕
            const btnY = 360;

            if (!isLastStage) {
                const nextBtn = this.add.text(300, btnY, t('nextStage'), {
                    fontSize: '28px', fill: '#0f0', backgroundColor: '#000', padding: { x: 15, y: 10 }
                })
                    .setOrigin(0.5).setDepth(30)
                    .setInteractive({ useHandCursor: true })
                    .on('pointerover', () => nextBtn.setStyle({ fill: '#fff', backgroundColor: '#333' }))
                    .on('pointerout', () => nextBtn.setStyle({ fill: '#0f0', backgroundColor: '#000' }))
                    .on('pointerdown', () => {
                        if (this.bgm) this.bgm.stop();
                        this.scene.start('StageScene', { stageId: this.stageId + 1 });
                    });
            }

            const selectBtn = this.add.text(isLastStage ? 400 : 500, btnY, t('stageSelect'), {
                fontSize: '28px', fill: '#0af', backgroundColor: '#000', padding: { x: 15, y: 10 }
            })
                .setOrigin(0.5).setDepth(30)
                .setInteractive({ useHandCursor: true })
                .on('pointerover', () => selectBtn.setStyle({ fill: '#fff', backgroundColor: '#333' }))
                .on('pointerout', () => selectBtn.setStyle({ fill: '#0af', backgroundColor: '#000' }))
                .on('pointerdown', () => {
                    if (this.bgm) this.bgm.stop();
                    this.game.events.emit('returnToMenu');
                });
        });
    }

    _saveProgress() {
        let progress;
        try {
            progress = JSON.parse(localStorage.getItem('stageProgress')) || [false, false, false];
        } catch {
            progress = [false, false, false];
        }
        progress[this.stageId - 1] = true;
        localStorage.setItem('stageProgress', JSON.stringify(progress));
    }
}
