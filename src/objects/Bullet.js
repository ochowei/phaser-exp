import * as Phaser from 'phaser';

export default class Bullet extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
        // 先假定紋理為 'bullet'，由 Scene 群組分配時會自動設定回來
        super(scene, x, y, 'bullet');
    }

    fire(x, y, velocityX = 0) {
        this.body.reset(x, y);
        this.startY = y;

        this.setActive(true);
        this.setVisible(true);

        this.setVelocityY(-600);
        this.setVelocityX(velocityX);
    }

    update(time, delta) {
        const maxRange = 400;
        if (this.active && (this.startY - this.y > maxRange || this.x < 0 || this.x > 800)) {
            // 回收子彈
            this.setActive(false);
            this.setVisible(false);
            this.body.stop();
        }
    }
}
