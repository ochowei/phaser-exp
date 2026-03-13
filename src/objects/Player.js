import * as Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        // 將此物件加入場景與物理系統
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.speed = 300;
        this.maxHealth = 3;
        this.health = 3;
    }

    update(keys, joystick) {
        this.setVelocity(0);

        let vx = 0, vy = 0;

        if (keys.left.isDown || keys.leftArrow.isDown) vx = -this.speed;
        else if (keys.right.isDown || keys.rightArrow.isDown) vx = this.speed;

        if (keys.up.isDown || keys.upArrow.isDown) vy = -this.speed;
        else if (keys.down.isDown || keys.downArrow.isDown) vy = this.speed;

        if (joystick && joystick.active) {
            if (Math.abs(joystick.dx) > 0.1) vx = joystick.dx * this.speed;
            if (Math.abs(joystick.dy) > 0.1) vy = joystick.dy * this.speed;
        }

        this.setVelocityX(vx);
        this.setVelocityY(vy);
    }
}
