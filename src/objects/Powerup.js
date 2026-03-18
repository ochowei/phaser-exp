import * as Phaser from 'phaser';

export default class Powerup extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // 道具緩慢向下飄（改由 Scene add 後設定）

        // 加入左右浮動動畫
        scene.tweens.add({
            targets: this,
            x: this.x + Phaser.Math.Between(-20, 20),
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    update(time, delta) {
        if (this.active && this.y > 632) {
            this.destroy();
        }
    }
}
