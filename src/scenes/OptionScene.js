import * as Phaser from 'phaser';
import { t, getLang, setLang } from '../i18n.js';

export default class OptionScene extends Phaser.Scene {
    constructor() {
        super('OptionScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.cameras.main.setBackgroundColor('#090b22');

        // 重用 StartScene 已建立的星空紋理作為背景
        this.bgFar = this.add.tileSprite(width / 2, height / 2, width, height, 'start_bg_stars_far');
        this.bgMid = this.add.tileSprite(width / 2, height / 2, width, height, 'start_bg_stars_mid');
        this.bgNear = this.add.tileSprite(width / 2, height / 2, width, height, 'start_bg_stars_near');

        // 標題
        this.add.text(width / 2, 60, t('optionsTitle'), {
            fontSize: '48px',
            fill: '#f4f8ff',
            fontStyle: 'bold',
            stroke: '#5368ff',
            strokeThickness: 5
        }).setOrigin(0.5);

        // --- 語言選擇區域 ---
        const langY = 140;

        this.add.text(width / 2, langY, t('language'), {
            fontSize: '28px',
            fill: '#a6afd9'
        }).setOrigin(0.5);

        const currentLang = getLang();
        const btnSpacing = 100;

        // English 按鈕
        this.enBtn = this.add.text(width / 2 - btnSpacing, langY + 45, t('langEn'), {
            fontSize: '24px',
            fill: currentLang === 'en' ? '#fff' : '#667',
            backgroundColor: currentLang === 'en' ? '#5368ff' : '#1a1a2e',
            padding: { x: 16, y: 8 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                if (getLang() !== 'en') this.enBtn.setStyle({ fill: '#ccc', backgroundColor: '#333' });
            })
            .on('pointerout', () => {
                const active = getLang() === 'en';
                this.enBtn.setStyle({
                    fill: active ? '#fff' : '#667',
                    backgroundColor: active ? '#5368ff' : '#1a1a2e'
                });
            })
            .on('pointerdown', () => {
                if (getLang() === 'en') return;
                setLang('en');
                this.scene.restart();
            });

        // 中文按鈕
        this.zhBtn = this.add.text(width / 2 + btnSpacing, langY + 45, t('langZh'), {
            fontSize: '24px',
            fill: currentLang === 'zh' ? '#fff' : '#667',
            backgroundColor: currentLang === 'zh' ? '#5368ff' : '#1a1a2e',
            padding: { x: 16, y: 8 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                if (getLang() !== 'zh') this.zhBtn.setStyle({ fill: '#ccc', backgroundColor: '#333' });
            })
            .on('pointerout', () => {
                const active = getLang() === 'zh';
                this.zhBtn.setStyle({
                    fill: active ? '#fff' : '#667',
                    backgroundColor: active ? '#5368ff' : '#1a1a2e'
                });
            })
            .on('pointerdown', () => {
                if (getLang() === 'zh') return;
                setLang('zh');
                this.scene.restart();
            });

        // 從 localStorage 讀取音量設定
        let savedVolume = parseFloat(localStorage.getItem('bgmVolume'));
        if (isNaN(savedVolume)) savedVolume = 0.5;
        let savedMuted = localStorage.getItem('bgmMuted') === 'true';

        this.currentVolume = savedVolume;
        this.isMuted = savedMuted;

        // 套用全域音量
        this.sound.volume = this.isMuted ? 0 : this.currentVolume;

        // --- 音量控制區域 ---
        const sliderY = height / 2 + 10;
        const sliderX = width / 2 - 150;
        const sliderWidth = 300;
        const sliderHeight = 8;

        // 「BGM Volume」標籤
        this.add.text(width / 2, sliderY - 50, t('bgmVolume'), {
            fontSize: '28px',
            fill: '#a6afd9'
        }).setOrigin(0.5);

        // 音量百分比顯示
        this.volumeText = this.add.text(width / 2, sliderY + 40, this.getVolumeLabel(), {
            fontSize: '22px',
            fill: '#fff'
        }).setOrigin(0.5);

        // 滑桿軌道
        this.sliderTrack = this.add.graphics();
        this.drawSliderTrack(sliderX, sliderY, sliderWidth, sliderHeight);

        // 滑桿把手
        const handleX = sliderX + sliderWidth * this.currentVolume;
        this.sliderHandle = this.add.graphics();
        this.drawHandle(handleX, sliderY);

        // 建立一個隱形的互動區域來拖曳把手
        this.handleZone = this.add.zone(handleX, sliderY, 30, 30)
            .setInteractive({ useHandCursor: true, draggable: true });

        this.input.setDraggable(this.handleZone);

        this.input.on('drag', (pointer, gameObject, dragX) => {
            if (gameObject !== this.handleZone) return;

            // 限制在滑桿範圍內
            const clampedX = Phaser.Math.Clamp(dragX, sliderX, sliderX + sliderWidth);
            gameObject.x = clampedX;

            // 計算音量值
            this.currentVolume = (clampedX - sliderX) / sliderWidth;
            this.currentVolume = Math.round(this.currentVolume * 100) / 100;

            // 更新把手繪製
            this.sliderHandle.clear();
            this.drawHandle(clampedX, sliderY);

            // 更新音量
            if (!this.isMuted) {
                this.sound.volume = this.currentVolume;
            }

            // 更新軌道填充
            this.drawSliderTrack(sliderX, sliderY, sliderWidth, sliderHeight);

            // 儲存並更新顯示
            localStorage.setItem('bgmVolume', this.currentVolume.toString());
            this.volumeText.setText(this.getVolumeLabel());
        });

        // 點擊滑桿軌道也可以跳到該位置
        const trackZone = this.add.zone(sliderX + sliderWidth / 2, sliderY, sliderWidth + 20, 30)
            .setInteractive({ useHandCursor: true });

        trackZone.on('pointerdown', (pointer) => {
            const clampedX = Phaser.Math.Clamp(pointer.x, sliderX, sliderX + sliderWidth);
            this.handleZone.x = clampedX;

            this.currentVolume = (clampedX - sliderX) / sliderWidth;
            this.currentVolume = Math.round(this.currentVolume * 100) / 100;

            this.sliderHandle.clear();
            this.drawHandle(clampedX, sliderY);

            if (!this.isMuted) {
                this.sound.volume = this.currentVolume;
            }

            this.drawSliderTrack(sliderX, sliderY, sliderWidth, sliderHeight);

            localStorage.setItem('bgmVolume', this.currentVolume.toString());
            this.volumeText.setText(this.getVolumeLabel());
        });

        // --- 靜音按鈕 ---
        const muteY = sliderY + 100;
        this.muteBtn = this.add.text(width / 2, muteY, this.getMuteLabel(), {
            fontSize: '32px',
            fill: this.isMuted ? '#f55' : '#0f0',
            backgroundColor: '#000',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => this.muteBtn.setStyle({ fill: '#fff', backgroundColor: '#333' }))
            .on('pointerout', () => this.muteBtn.setStyle({
                fill: this.isMuted ? '#f55' : '#0f0',
                backgroundColor: '#000'
            }))
            .on('pointerdown', () => {
                this.isMuted = !this.isMuted;
                this.sound.volume = this.isMuted ? 0 : this.currentVolume;
                localStorage.setItem('bgmMuted', this.isMuted.toString());

                this.muteBtn.setText(this.getMuteLabel());
                this.muteBtn.setStyle({
                    fill: '#fff',
                    backgroundColor: '#333'
                });
                this.volumeText.setText(this.getVolumeLabel());
            });

        // --- Back 按鈕 ---
        const backBtn = this.add.text(width / 2, height - 60, t('back'), {
            fontSize: '32px',
            fill: '#a6afd9',
            backgroundColor: '#000',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => backBtn.setStyle({ fill: '#fff', backgroundColor: '#333' }))
            .on('pointerout', () => backBtn.setStyle({ fill: '#a6afd9', backgroundColor: '#000' }))
            .on('pointerdown', () => {
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.game.events.emit('returnToMenu');
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

    drawSliderTrack(x, y, w, h) {
        this.sliderTrack.clear();
        // 軌道背景
        this.sliderTrack.fillStyle(0x333333, 1);
        this.sliderTrack.fillRoundedRect(x, y - h / 2, w, h, h / 2);
        // 填充部分（亮色）
        const fillWidth = w * this.currentVolume;
        if (fillWidth > 0) {
            this.sliderTrack.fillStyle(0x5368ff, 1);
            this.sliderTrack.fillRoundedRect(x, y - h / 2, fillWidth, h, h / 2);
        }
    }

    drawHandle(x, y) {
        this.sliderHandle.fillStyle(0xffffff, 1);
        this.sliderHandle.fillCircle(x, y, 12);
        this.sliderHandle.fillStyle(0x5368ff, 1);
        this.sliderHandle.fillCircle(x, y, 8);
    }

    getVolumeLabel() {
        if (this.isMuted) return t('muted');
        return `${Math.round(this.currentVolume * 100)}%`;
    }

    getMuteLabel() {
        return this.isMuted ? t('muteOn') : t('muteOff');
    }
}
