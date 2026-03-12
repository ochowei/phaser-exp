import * as Phaser from 'phaser';
import MainScene from './scenes/MainScene.js';
import StartScene from './scenes/StartScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [StartScene, MainScene]
};

const game = new Phaser.Game(config);
