import * as Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        // 將此物件加入場景與物理系統
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.speed = 300;
    }

    update(keys) {
        this.setVelocity(0);

        if (keys.left.isDown || keys.leftArrow.isDown) this.setVelocityX(-this.speed);
        else if (keys.right.isDown || keys.rightArrow.isDown) this.setVelocityX(this.speed);

        if (keys.up.isDown || keys.upArrow.isDown) this.setVelocityY(-this.speed);
        else if (keys.down.isDown || keys.downArrow.isDown) this.setVelocityY(this.speed);
    }
}
