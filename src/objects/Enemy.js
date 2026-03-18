import * as Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, texture, config = {}) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        const {
            isSpecial = false,
            hp = 1,
            scoreValue = null,
            isBoss = false,
            isStageBoss = false,
        } = config;

        this.maxHp = hp;
        this.hp = hp;
        this.isBoss = isBoss || isStageBoss;
        this.isStageBoss = isStageBoss;
        this.isDropPowerup = isSpecial || isBoss;
        this.scoreValue = scoreValue ?? (isSpecial ? 20 : 10);
        this.powerupDropRate = (isSpecial || isBoss) ? 1 : 0;
        this.startX = x;
        this.moveType = isBoss ? 2 : Phaser.Math.Between(0, 1); // 0:直線 1:曲線 2:Boss
        this.timeOffset = scene.time.now;

        this.healthBar = null;
        this.healthBarBg = null;

        if (this.maxHp > 1) {
            this._createHealthBar(scene);
        }
    }

    _createHealthBar(scene) {
        const barWidth = this.isBoss ? 50 : 30;
        const barHeight = this.isBoss ? 6 : 4;
        const offsetY = this.isBoss ? -35 : -22;
        this._healthBarWidth = barWidth;
        this._healthBarOffsetY = offsetY;
        this.healthBarBg = scene.add.rectangle(this.x, this.y + offsetY, barWidth, barHeight, 0x333333);
        this.healthBarBg.setDepth(20);
        this.healthBar = scene.add.rectangle(this.x, this.y + offsetY, barWidth, barHeight, 0x00ff00);
        this.healthBar.setDepth(21);
    }

    _updateHealthBar() {
        if (this.healthBar) {
            const ratio = this.hp / this.maxHp;
            this.healthBar.width = this._healthBarWidth * ratio;
            const color = ratio > 0.5 ? 0x00ff00 : (ratio > 0.25 ? 0xffff00 : 0xff0000);
            this.healthBar.setFillStyle(color);
        }
    }

    _destroyHealthBar() {
        if (this.healthBar) {
            this.healthBar.destroy();
            this.healthBar = null;
        }
        if (this.healthBarBg) {
            this.healthBarBg.destroy();
            this.healthBarBg = null;
        }
    }

    takeHit() {
        if (!this.active) return;

        const { scene } = this;

        this.hp -= 1;

        if (this.hp <= 0) {
            if (this.shouldDropPowerup()) {
                scene.spawnPowerup(this.x, this.y);
            }
            scene.cameras.main.shake(this.isBoss ? 200 : 100, this.isBoss ? 0.01 : 0.005);
            scene.updateScore(this.scoreValue);
            this._destroyHealthBar();

            // 關卡 Boss 被擊敗時通知場景
            if (this.isStageBoss && scene.onStageBossDefeated) {
                scene.onStageBossDefeated();
            }

            this.destroy();
        } else {
            // 受擊閃白
            this.setTint(0xffffff);
            scene.time.delayedCall(80, () => {
                if (this.active) this.clearTint();
            });
            scene.cameras.main.shake(50, 0.003);
            this._updateHealthBar();
        }
    }

    hitPlayer(player) {
        if (!this.active) return;
        this._destroyHealthBar();
        this.destroy();
        player.receiveDamage();
    }

    shouldDropPowerup() {
        return Phaser.Math.FloatBetween(0, 1) <= this.powerupDropRate;
    }

    update(time, delta) {
        if (!this.active) return;

        // 飛出螢幕下方時銷毀
        const boundaryY = this.isBoss ? 664 : 632;
        if (this.y > boundaryY) {
            this._destroyHealthBar();
            this.destroy();
            return;
        }

        if (this.moveType === 1) {
            // 正弦波曲線位移（水平擺動）
            this.x = this.startX + Math.sin((time - this.timeOffset) * 0.005) * 100;
        } else if (this.moveType === 2) {
            // Boss: 較慢的正弦波，較大振幅，限制在畫面內（水平擺動）
            this.x = Phaser.Math.Clamp(
                this.startX + Math.sin((time - this.timeOffset) * 0.002) * 150,
                40, 760
            );
        }

        // 更新血條位置
        if (this.healthBar && this.healthBarBg) {
            this.healthBar.setPosition(this.x, this.y + this._healthBarOffsetY);
            this.healthBarBg.setPosition(this.x, this.y + this._healthBarOffsetY);
        }
    }

    destroy(fromScene) {
        this._destroyHealthBar();
        super.destroy(fromScene);
    }
}
