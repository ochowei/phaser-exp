import * as Phaser from 'phaser';
import MainScene from './scenes/MainScene.js';
import StartScene from './scenes/StartScene.js';
import ModeSelectScene from './scenes/ModeSelectScene.js';
import OptionScene from './scenes/OptionScene.js';
import StageSelectScene from './scenes/StageSelectScene.js';
import StageScene from './scenes/StageScene.js';

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
    scene: [StartScene, ModeSelectScene, OptionScene, MainScene, StageSelectScene, StageScene]
};

// eslint-disable-next-line no-unused-vars
const game = new Phaser.Game(config);
