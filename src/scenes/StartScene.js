import * as Phaser from 'phaser';
import { t } from '../i18n.js';

export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
        this.isStarting = false;
    }

    preload() {
        this.load.audio('bgm_menu', 'assets/audio/bgm_menu.wav');
        this.load.audio('bgm_game', 'assets/audio/bgm_game.wav');
    }

    create() {
        this.isStarting = false;
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const graphics = this.add.graphics();
        this.cameras.main.setBackgroundColor('#090b22');

        // 建立與 MainScene 風格一致的星空紋理（若已存在則重用）
        if (!this.textures.exists('start_bg_stars_far')) {
            graphics.fillStyle(0x24306d, 1);
            for (let i = 0; i < 220; i++) {
                graphics.fillRect(Phaser.Math.Between(0, 512), Phaser.Math.Between(0, 512), 2, 2);
            }
            graphics.generateTexture('start_bg_stars_far', 512, 512);
            graphics.clear();
        }

        if (!this.textures.exists('start_bg_stars_mid')) {
            graphics.fillStyle(0x6a4ab4, 1);
            for (let i = 0; i < 140; i++) {
                graphics.fillRect(Phaser.Math.Between(0, 512), Phaser.Math.Between(0, 512), 2, 2);
            }
            graphics.generateTexture('start_bg_stars_mid', 512, 512);
            graphics.clear();
        }

        if (!this.textures.exists('start_bg_stars_near')) {
            graphics.fillStyle(0xe8e7ff, 1);
            for (let i = 0; i < 80; i++) {
                graphics.fillRect(Phaser.Math.Between(0, 512), Phaser.Math.Between(0, 512), 2, 2);
            }
            graphics.generateTexture('start_bg_stars_near', 512, 512);
            graphics.clear();
        }

        graphics.destroy();

        // 背景視差層（先建立避免覆蓋 UI）
        this.bgFar = this.add.tileSprite(width / 2, height / 2, width, height, 'start_bg_stars_far');
        this.bgMid = this.add.tileSprite(width / 2, height / 2, width, height, 'start_bg_stars_mid');
        this.bgNear = this.add.tileSprite(width / 2, height / 2, width, height, 'start_bg_stars_near');

        // Title
        const titleText = this.add.text(width / 2, height / 2 - 110, 'SPACE SHOOTER', {
            fontSize: '56px',
            fill: '#f4f8ff',
            fontStyle: 'bold',
            stroke: '#5368ff',
            strokeThickness: 7,
            shadow: {
                offsetX: 0,
                offsetY: 8,
                color: '#101537',
                blur: 12,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5);

        this.tweens.add({
            targets: titleText,
            y: titleText.y - 10,
            duration: 1800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        // Start Game Button
        const startBtn = this.add.text(width / 2, height / 2, t('startGame'), {
            fontSize: '32px',
            fill: '#0f0',
            backgroundColor: '#000',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => startBtn.setStyle({ fill: '#fff', backgroundColor: '#333' }))
            .on('pointerout', () => startBtn.setStyle({ fill: '#0f0', backgroundColor: '#000' }))
            .on('pointerdown', () => {
                if (this.isStarting) return;

                this.isStarting = true;
                startBtn.disableInteractive();

                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('ModeSelectScene');
                });

                this.cameras.main.fadeOut(300, 0, 0, 0);
            });

        // 從 localStorage 讀取音量設定
        let savedVolume = parseFloat(localStorage.getItem('bgmVolume'));
        if (isNaN(savedVolume)) savedVolume = 0.5;
        const isMuted = localStorage.getItem('bgmMuted') === 'true';
        this.sound.volume = isMuted ? 0 : savedVolume;

        // 播放選單背景音樂（若尚未播放）
        if (!this.sound.get('bgm_menu') || !this.sound.get('bgm_menu').isPlaying) {
            this.sound.stopAll();
            this.sound.add('bgm_menu', { loop: true, volume: 1 }).play();
        }

        // Options Button
        const optionsBtn = this.add.text(width / 2, height / 2 + 60, t('options'), {
            fontSize: '32px',
            fill: '#f80',
            backgroundColor: '#000',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => optionsBtn.setStyle({ fill: '#fff', backgroundColor: '#333' }))
            .on('pointerout', () => optionsBtn.setStyle({ fill: '#f80', backgroundColor: '#000' }))
            .on('pointerdown', () => {
                if (this.isStarting) return;
                this.isStarting = true;
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('OptionScene');
                });
                this.cameras.main.fadeOut(300, 0, 0, 0);
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
