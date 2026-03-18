import * as Phaser from 'phaser';
import Enemy from '../objects/Enemy.js';
import { getAircraftProfile } from '../profiles/aircraftProfiles.js';
import { t } from '../i18n.js';

/**
 * 波次管理器 — 控制關卡模式中的敵人波次生成與 Boss 階段
 */
export default class WaveManager {
    constructor(scene, stageConfig) {
        this.scene = scene;
        this.stageConfig = stageConfig;
        this.currentWaveIndex = 0;
        this.totalWaves = stageConfig.waves.length;
        this.enemiesRemaining = 0;
        this.spawnTimers = [];
        this.isActive = false;
        this.isBossPhase = false;
    }

    start() {
        this.isActive = true;
        this.startNextWave();
    }

    startNextWave() {
        if (!this.isActive) return;

        const waveNum = this.currentWaveIndex + 1;
        const waveConfig = this.stageConfig.waves[this.currentWaveIndex];

        // 更新波次 HUD
        this.scene.events.emit('waveStart', waveNum, this.totalWaves);

        // 顯示波次公告
        this._showAnnouncement(`${t('waveLabel')} ${waveNum} / ${this.totalWaves}`, () => {
            this._spawnWaveEnemies(waveConfig);
        });
    }

    _showAnnouncement(text, onComplete) {
        const announcement = this.scene.add.text(400, 300, text, {
            fontSize: '36px',
            fill: '#fff',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 4,
        }).setOrigin(0.5).setDepth(20).setAlpha(0);

        this.scene.tweens.add({
            targets: announcement,
            alpha: 1,
            duration: 300,
            yoyo: true,
            hold: 1400,
            onComplete: () => {
                announcement.destroy();
                if (onComplete) onComplete();
            }
        });
    }

    _spawnWaveEnemies(waveConfig) {
        // 建立生成佇列：將所有敵人定義展開成一個序列
        const spawnQueue = [];
        for (const group of waveConfig.enemies) {
            for (let i = 0; i < group.count; i++) {
                spawnQueue.push({
                    profileKey: group.profileKey,
                    interval: group.interval,
                });
            }
        }

        this.enemiesRemaining = spawnQueue.length;
        let spawnIndex = 0;

        const spawnNext = () => {
            if (!this.isActive || spawnIndex >= spawnQueue.length) return;

            const entry = spawnQueue[spawnIndex];
            this._spawnEnemy(entry.profileKey);
            spawnIndex++;

            if (spawnIndex < spawnQueue.length) {
                const nextEntry = spawnQueue[spawnIndex];
                const timer = this.scene.time.delayedCall(nextEntry.interval, spawnNext);
                this.spawnTimers.push(timer);
            }
        };

        spawnNext();
    }

    _spawnEnemy(profileKey) {
        const scene = this.scene;
        if (scene.gameOver) return;

        const x = Phaser.Math.Between(50, 750);
        const profile = getAircraftProfile(profileKey);
        const isSpecial = profileKey === 'EN_PURPLE';

        const enemy = new Enemy(scene, x, -50, profile.textureKey, {
            isSpecial,
            hp: profile.hp,
        });
        enemy.isWaveEnemy = true;
        scene.enemies.add(enemy);

        const speed = Phaser.Math.Between(150, 350);
        enemy.setVelocityY(speed);

        // 特殊敵人尾焰
        if (isSpecial) {
            const trail = scene.add.particles(0, 0, 'bullet', profile.trail);
            trail.startFollow(enemy, profile.trailOffset.x, profile.trailOffset.y);
            enemy.once('destroy', () => trail.destroy());
        }

        // 監聽敵人銷毀（被擊敗或飛出螢幕）
        enemy.once('destroy', () => {
            this.onEnemyDefeated();
        });
    }

    onEnemyDefeated() {
        this.enemiesRemaining--;

        if (this.enemiesRemaining <= 0 && this.isActive && !this.isBossPhase) {
            const waveConfig = this.stageConfig.waves[this.currentWaveIndex];
            this.currentWaveIndex++;

            if (this.currentWaveIndex < this.totalWaves) {
                // 還有下一波
                if (waveConfig.restAfter > 0) {
                    this._showRest(waveConfig.restAfter);
                } else {
                    this.startNextWave();
                }
            } else {
                // 所有波次完成，進入 Boss 階段
                this.startBossPhase();
            }
        }
    }

    _showRest(duration) {
        const restText = this.scene.add.text(400, 300, t('restLabel'), {
            fontSize: '32px',
            fill: '#00ff00',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 3,
        }).setOrigin(0.5).setDepth(20);

        const timer = this.scene.time.delayedCall(duration, () => {
            restText.destroy();
            this.startNextWave();
        });
        this.spawnTimers.push(timer);
    }

    startBossPhase() {
        this.isBossPhase = true;
        this.scene.events.emit('bossPhaseStart');

        // 顯示 Boss 警告
        this._showAnnouncement(t('bossWarning'), () => {
            this._spawnBoss();
        });
    }

    _spawnBoss() {
        const scene = this.scene;
        const bossConfig = this.stageConfig.boss;
        const profile = getAircraftProfile(bossConfig.profileKey);

        const x = 400;
        const enemy = new Enemy(scene, x, -50, profile.textureKey, {
            isBoss: true,
            isStageBoss: true,
            hp: profile.hp,
            scoreValue: 200,
        });
        scene.enemies.add(enemy);
        enemy.setVelocityY(60);

        // Boss 尾焰粒子
        const trail = scene.add.particles(0, 0, 'bullet', profile.trail);
        trail.startFollow(enemy, profile.trailOffset.x, profile.trailOffset.y);
        enemy.once('destroy', () => trail.destroy());

        // Boss 射擊計時器
        const fireTimer = scene.time.addEvent({
            delay: bossConfig.fireDelay,
            callback: () => {
                if (enemy.active && !scene.gameOver && !scene.isPaused) {
                    scene.fireBossAttack(enemy, bossConfig.attackPattern);
                } else if (!enemy.active) {
                    fireTimer.remove();
                }
            },
            loop: true,
        });
        enemy.once('destroy', () => fireTimer.remove());
        this.spawnTimers.push(fireTimer);

        // 通知場景設置 Boss HP 條
        scene.events.emit('bossSpawned', enemy, profile);
    }

    pause() {
        for (const timer of this.spawnTimers) {
            if (timer && timer.paused !== undefined) {
                timer.paused = true;
            }
        }
    }

    resume() {
        for (const timer of this.spawnTimers) {
            if (timer && timer.paused !== undefined) {
                timer.paused = false;
            }
        }
    }

    destroy() {
        this.isActive = false;
        for (const timer of this.spawnTimers) {
            if (timer && timer.remove) {
                timer.remove();
            }
        }
        this.spawnTimers = [];
    }
}
