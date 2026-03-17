import * as Phaser from 'phaser';
import MainScene from './scenes/MainScene.js';
import StartScene from './scenes/StartScene.js';
import ModeSelectScene from './scenes/ModeSelectScene.js';
import OptionScene from './scenes/OptionScene.js';

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
    scene: [StartScene, ModeSelectScene, OptionScene, MainScene]
};

// eslint-disable-next-line no-unused-vars
const game = new Phaser.Game(config);
