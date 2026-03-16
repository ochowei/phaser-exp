import * as Phaser from 'phaser';

export default class ModeSelectScene extends Phaser.Scene {
    constructor() {
        super('ModeSelectScene');
        this.isTransitioning = false;
    }

    create() {
        this.isTransitioning = false;
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.cameras.main.setBackgroundColor('#090b22');

        // Reuse star textures created by StartScene
        this.bgFar = this.add.tileSprite(width / 2, height / 2, width, height, 'start_bg_stars_far');
        this.bgMid = this.add.tileSprite(width / 2, height / 2, width, height, 'start_bg_stars_mid');
        this.bgNear = this.add.tileSprite(width / 2, height / 2, width, height, 'start_bg_stars_near');

        // Title
        this.add.text(width / 2, height / 2 - 160, 'SELECT MODE', {
            fontSize: '48px',
            fill: '#f4f8ff',
            fontStyle: 'bold',
            stroke: '#5368ff',
            strokeThickness: 6,
            shadow: {
                offsetX: 0,
                offsetY: 6,
                color: '#101537',
                blur: 10,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5);

        // Endless Mode Button
        const endlessBtn = this.add.text(width / 2, height / 2 - 40, 'Endless Mode', {
            fontSize: '32px',
            fill: '#0f0',
            backgroundColor: '#000',
            padding: { x: 24, y: 12 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => endlessBtn.setStyle({ fill: '#fff', backgroundColor: '#333' }))
        .on('pointerout', () => endlessBtn.setStyle({ fill: '#0f0', backgroundColor: '#000' }))
        .on('pointerdown', () => {
            if (this.isTransitioning) return;
            this.isTransitioning = true;
            endlessBtn.disableInteractive();

            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('MainScene');
            });
            this.cameras.main.fadeOut(300, 0, 0, 0);
        });

        // Stage Mode Button
        const stageBtn = this.add.text(width / 2, height / 2 + 60, '關卡模式', {
            fontSize: '32px',
            fill: '#f4a800',
            backgroundColor: '#000',
            padding: { x: 24, y: 12 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => stageBtn.setStyle({ fill: '#fff', backgroundColor: '#333' }))
        .on('pointerout', () => stageBtn.setStyle({ fill: '#f4a800', backgroundColor: '#000' }))
        .on('pointerdown', () => {
            if (this.isTransitioning) return;
            this._showUnderConstruction();
        });

        // Back Button
        const backBtn = this.add.text(width / 2, height / 2 + 160, '← 返回', {
            fontSize: '24px',
            fill: '#a6afd9',
            backgroundColor: '#000',
            padding: { x: 18, y: 8 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => backBtn.setStyle({ fill: '#fff', backgroundColor: '#333' }))
        .on('pointerout', () => backBtn.setStyle({ fill: '#a6afd9', backgroundColor: '#000' }))
        .on('pointerdown', () => {
            if (this.isTransitioning) return;
            this.isTransitioning = true;
            backBtn.disableInteractive();

            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('StartScene');
            });
            this.cameras.main.fadeOut(300, 0, 0, 0);
        });

        // Fade in on enter
        this.cameras.main.fadeIn(300, 0, 0, 0);
    }

    _showUnderConstruction() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Overlay
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7)
            .setInteractive();

        // Dialog box
        const box = this.add.rectangle(width / 2, height / 2, 360, 200, 0x1a1f4e)
            .setStrokeStyle(2, 0x5368ff);

        // Icon + text
        const icon = this.add.text(width / 2, height / 2 - 45, '🚧', {
            fontSize: '40px'
        }).setOrigin(0.5);

        const msg = this.add.text(width / 2, height / 2 + 10, '施工中\nUnder Construction', {
            fontSize: '24px',
            fill: '#f4f8ff',
            align: 'center'
        }).setOrigin(0.5);

        // Close button
        const closeBtn = this.add.text(width / 2, height / 2 + 75, '關閉', {
            fontSize: '20px',
            fill: '#0f0',
            backgroundColor: '#000',
            padding: { x: 16, y: 6 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => closeBtn.setStyle({ fill: '#fff', backgroundColor: '#333' }))
        .on('pointerout', () => closeBtn.setStyle({ fill: '#0f0', backgroundColor: '#000' }))
        .on('pointerdown', () => {
            overlay.destroy();
            box.destroy();
            icon.destroy();
            msg.destroy();
            closeBtn.destroy();
        });
    }

    update() {
        if (!this.bgFar || !this.bgMid || !this.bgNear) return;

        this.bgFar.tilePositionY += 0.15;
        this.bgMid.tilePositionY += 0.35;
        this.bgNear.tilePositionY += 0.65;

        this.bgFar.tilePositionX += 0.05;
        this.bgMid.tilePositionX += 0.12;
        this.bgNear.tilePositionX += 0.2;
    }
}
