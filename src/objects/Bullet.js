import * as Phaser from 'phaser';

export default class Bullet extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
        // 先假定紋理為 'bullet'，由 Scene 群組分配時會自動設定回來
        super(scene, x, y, 'bullet');
    }

    fire(x, y, velocityY = 0) {
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocityX(600);
        this.setVelocityY(velocityY);
    }

    update(time, delta) {
        if (this.active && (this.x > 800 || this.y < 0 || this.y > 600)) {
            // 回收子彈
            this.setActive(false);
            this.setVisible(false);
            this.body.stop();
        }
    }
}
