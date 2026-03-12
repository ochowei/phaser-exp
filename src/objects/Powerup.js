import * as Phaser from 'phaser';

export default class Powerup extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // 道具緩慢向左飄 (改由 MainScene add 後設定)
        
        // 加入上下浮動動畫
        scene.tweens.add({
            targets: this,
            y: this.y + Phaser.Math.Between(-20, 20),
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    update(time, delta) {
        if (this.active && this.x < -32) {
            this.destroy();
        }
    }
}
