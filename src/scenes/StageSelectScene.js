import * as Phaser from 'phaser';
import { t } from '../i18n.js';
import { stages } from '../data/stageData.js';

export default class StageSelectScene extends Phaser.Scene {
    constructor() {
        super('StageSelectScene');
        this.isTransitioning = false;
    }

    create() {
        this.isTransitioning = false;
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.cameras.main.setBackgroundColor('#090b22');

        // 重用 StartScene 的星空紋理
        this.bgFar = this.add.tileSprite(width / 2, height / 2, width, height, 'start_bg_stars_far');
        this.bgMid = this.add.tileSprite(width / 2, height / 2, width, height, 'start_bg_stars_mid');
        this.bgNear = this.add.tileSprite(width / 2, height / 2, width, height, 'start_bg_stars_near');

        // 標題
        this.add.text(width / 2, 80, t('stageSelect'), {
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

        // 讀取進度
        const progress = this._loadProgress();

        // 建立關卡按鈕
        const startY = 180;
        const spacing = 100;

        for (let i = 0; i < stages.length; i++) {
            const stage = stages[i];
            const y = startY + i * spacing;
            const isCompleted = progress[i];
            const isUnlocked = i === 0 || progress[i - 1];

            this._createStageButton(width / 2, y, stage, i + 1, isUnlocked, isCompleted);
        }

        // 返回按鈕
        const backBtn = this.add.text(width / 2, height - 60, t('backArrow'), {
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
                    this.scene.start('ModeSelectScene');
                });
                this.cameras.main.fadeOut(300, 0, 0, 0);
            });

        this.cameras.main.fadeIn(300, 0, 0, 0);
    }

    _createStageButton(x, y, stage, stageNum, isUnlocked, isCompleted) {
        const boxWidth = 360;
        const boxHeight = 70;

        if (!isUnlocked) {
            // 鎖定狀態 — 灰色方框
            this.add.rectangle(x, y, boxWidth, boxHeight, 0x1a1f4e, 0.5)
                .setStrokeStyle(2, 0x333366);

            this.add.text(x - 140, y - 12, `Stage ${stageNum}`, {
                fontSize: '22px', fill: '#555577', fontStyle: 'bold'
            });

            this.add.text(x - 140, y + 12, t(stage.nameKey), {
                fontSize: '16px', fill: '#444466'
            });

            this.add.text(x + 140, y, `🔒 ${t('stageLocked')}`, {
                fontSize: '16px', fill: '#555577'
            }).setOrigin(1, 0.5);

            return;
        }

        // 解鎖 / 已完成
        const borderColor = isCompleted ? 0x22c55e : 0xf4a800;
        const textColor = isCompleted ? '#22c55e' : '#f4a800';

        const box = this.add.rectangle(x, y, boxWidth, boxHeight, 0x1a1f4e)
            .setStrokeStyle(2, borderColor)
            .setInteractive({ useHandCursor: true });

        this.add.text(x - 140, y - 12, `Stage ${stageNum}`, {
            fontSize: '22px', fill: textColor, fontStyle: 'bold'
        });

        this.add.text(x - 140, y + 12, t(stage.nameKey), {
            fontSize: '16px', fill: '#c0c8e8'
        });

        if (isCompleted) {
            this.add.text(x + 140, y, `✓ ${t('stageCompleted')}`, {
                fontSize: '16px', fill: '#22c55e'
            }).setOrigin(1, 0.5);
        }

        // Hover 效果
        box.on('pointerover', () => {
            box.setFillStyle(0x2a2f6e);
        });
        box.on('pointerout', () => {
            box.setFillStyle(0x1a1f4e);
        });
        box.on('pointerdown', () => {
            if (this.isTransitioning) return;
            this.isTransitioning = true;

            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.sound.stopByKey('bgm_menu');
                this.scene.start('StageScene', { stageId: stageNum });
            });
            this.cameras.main.fadeOut(300, 0, 0, 0);
        });
    }

    _loadProgress() {
        try {
            const data = JSON.parse(localStorage.getItem('stageProgress'));
            if (Array.isArray(data) && data.length === stages.length) {
                return data;
            }
        } catch {
            // fall through
        }
        return new Array(stages.length).fill(false);
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
