import * as Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, texture, isSpecial = false) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.isDropPowerup = isSpecial;
        this.scoreValue = isSpecial ? 20 : 10;
        this.powerupDropRate = isSpecial ? 1 : 0;
        this.startY = y;
        this.moveType = Phaser.Math.Between(0, 1); // 0:直線 1:曲線
        this.timeOffset = scene.time.now;

        // 給予向左隨機速度 (改由 MainScene add 後設定)
    }

    takeHit() {
        if (!this.active) return;

        const { scene } = this;

        if (this.shouldDropPowerup()) {
            scene.spawnPowerup(this.x, this.y);
        }

        scene.cameras.main.shake(100, 0.005);
        scene.updateScore(this.scoreValue);
        this.destroy();
    }

    hitPlayer(player) {
        if (!this.active) return;
        this.destroy();
        player.receiveDamage();
    }

    shouldDropPowerup() {
        return Phaser.Math.FloatBetween(0, 1) <= this.powerupDropRate;
    }

    update(time, delta) {

        if (this.active) {
            // 超出邊界自動銷毀
            if (this.x < -32) {
                this.destroy();
            } else if (this.moveType === 1) {
                // 產生正弦波曲線位移
                this.y = this.startY + Math.sin((time - this.timeOffset) * 0.005) * 100;
            }
        }
    }
}
