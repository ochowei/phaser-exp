import * as Phaser from 'phaser';
import { t } from '../i18n.js';

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
        this.add.text(width / 2, height / 2 - 160, t('selectMode'), {
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
        const endlessBtn = this.add.text(width / 2, height / 2 - 40, t('endlessMode'), {
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
                    this.sound.stopByKey('bgm_menu');
                    this.scene.start('MainScene');
                });
                this.cameras.main.fadeOut(300, 0, 0, 0);
            });

        // Stage Mode Button
        const stageBtn = this.add.text(width / 2, height / 2 + 60, t('stageMode'), {
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
                this.isTransitioning = true;
                stageBtn.disableInteractive();

                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('StageSelectScene');
                });
                this.cameras.main.fadeOut(300, 0, 0, 0);
            });

        // Back Button
        const backBtn = this.add.text(width / 2, height / 2 + 160, t('backArrow'), {
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
