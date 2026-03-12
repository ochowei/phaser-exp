import * as Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Title
        this.add.text(width / 2, height / 2 - 100, 'SPACE SHOOTER', {
            fontSize: '48px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Start Game Button
        const startBtn = this.add.text(width / 2, height / 2, 'Start Game', {
            fontSize: '32px',
            fill: '#0f0',
            backgroundColor: '#000',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => startBtn.setStyle({ fill: '#fff', backgroundColor: '#333' }))
        .on('pointerout', () => startBtn.setStyle({ fill: '#0f0', backgroundColor: '#000' }))
        .on('pointerdown', () => this.scene.start('MainScene'));

        // About Phaser Button
        const aboutBtn = this.add.text(width / 2, height / 2 + 80, 'About Phaser', {
            fontSize: '32px',
            fill: '#0af',
            backgroundColor: '#000',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => aboutBtn.setStyle({ fill: '#fff', backgroundColor: '#333' }))
        .on('pointerout', () => aboutBtn.setStyle({ fill: '#0af', backgroundColor: '#000' }))
        .on('pointerdown', () => window.open('https://phaser.io', '_blank'));
    }
}
