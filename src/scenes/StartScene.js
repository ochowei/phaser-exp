import * as Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
        this.menuButtons = [];
        this.focusedButtonIndex = 0;
    }

    createMenuButton(x, y, label, baseColor, onClick) {
        const buttonWidth = 320;
        const buttonHeight = 70;
        const cornerRadius = 18;

        const palette = {
            baseBg: Phaser.Display.Color.HexStringToColor('#101737').color,
            hoverBg: Phaser.Display.Color.HexStringToColor('#1f2b61').color,
            downBg: Phaser.Display.Color.HexStringToColor('#2f3f82').color,
            textBase: Phaser.Display.Color.HexStringToColor(baseColor).color,
            textHover: Phaser.Display.Color.HexStringToColor('#ffffff').color,
            textDown: Phaser.Display.Color.HexStringToColor('#dbe4ff').color,
            borderBase: Phaser.Display.Color.HexStringToColor('#33408c').color,
            borderFocus: Phaser.Display.Color.HexStringToColor('#ffd166').color
        };

        const toHexColor = (value) => `#${value.toString(16).padStart(6, '0')}`;

        const bg = this.add.graphics();
        const labelText = this.add.text(0, 0, label, {
            fontSize: '30px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: toHexColor(palette.textBase)
        }).setOrigin(0.5);

        const button = this.add.container(x, y, [bg, labelText]);
        button.setSize(buttonWidth, buttonHeight);
        button.setInteractive(new Phaser.Geom.Rectangle(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);

        const state = {
            bgColor: palette.baseBg,
            textColor: palette.textBase,
            borderColor: palette.borderBase,
            scale: 1,
            isFocused: false,
            isPressed: false,
            onClick
        };

        const redrawButton = () => {
            bg.clear();
            bg.lineStyle(state.isFocused ? 4 : 2, state.isFocused ? palette.borderFocus : state.borderColor, 1);
            bg.fillStyle(state.bgColor, 0.94);
            bg.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);
            bg.strokeRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);

            labelText.setColor(toHexColor(state.textColor));
        };

        const tweenToState = (to) => {
            this.tweens.killTweensOf(state);
            this.tweens.killTweensOf(button);

            this.tweens.add({
                targets: state,
                bgColor: to.bgColor,
                textColor: to.textColor,
                borderColor: to.borderColor,
                duration: to.duration ?? 120,
                ease: 'Sine.easeOut',
                onUpdate: redrawButton
            });

            this.tweens.add({
                targets: button,
                scaleX: to.scale,
                scaleY: to.scale,
                duration: to.duration ?? 120,
                ease: 'Sine.easeOut'
            });
        };

        const applyVisualState = () => {
            if (state.isPressed) {
                tweenToState({
                    bgColor: palette.downBg,
                    textColor: palette.textDown,
                    borderColor: palette.borderBase,
                    scale: 0.98,
                    duration: 80
                });
                return;
            }

            if (state.isFocused) {
                tweenToState({
                    bgColor: palette.hoverBg,
                    textColor: palette.textHover,
                    borderColor: palette.borderFocus,
                    scale: 1.06,
                    duration: 120
                });
                return;
            }

            tweenToState({
                bgColor: palette.baseBg,
                textColor: palette.textBase,
                borderColor: palette.borderBase,
                scale: 1,
                duration: 140
            });
        };

        button.setDataEnabled();
        button.setData('setFocused', (focused) => {
            state.isFocused = focused;
            applyVisualState();
        });
        button.setData('trigger', () => state.onClick());

        button.on('pointerover', () => {
            const buttonIndex = this.menuButtons.indexOf(button);
            if (buttonIndex >= 0) {
                this.focusedButtonIndex = buttonIndex;
                this.updateFocusState();
            }
        });
        button.on('pointerout', () => {
            state.isPressed = false;
            applyVisualState();
        });
        button.on('pointerdown', () => {
            state.isPressed = true;
            applyVisualState();
        });
        button.on('pointerup', () => {
            state.isPressed = false;
            applyVisualState();
            state.onClick();
        });

        redrawButton();
        return button;
    }

    updateFocusState() {
        this.menuButtons.forEach((button, index) => {
            const setFocused = button.getData('setFocused');
            setFocused(index === this.focusedButtonIndex);
        });
    }

    setupMenuKeyboardControls() {
        this.input.keyboard.on('keydown-UP', () => {
            this.focusedButtonIndex = Phaser.Math.Wrap(this.focusedButtonIndex - 1, 0, this.menuButtons.length);
            this.updateFocusState();
        });

        this.input.keyboard.on('keydown-DOWN', () => {
            this.focusedButtonIndex = Phaser.Math.Wrap(this.focusedButtonIndex + 1, 0, this.menuButtons.length);
            this.updateFocusState();
        });

        this.input.keyboard.on('keydown-TAB', (event) => {
            event.preventDefault();
            this.focusedButtonIndex = Phaser.Math.Wrap(this.focusedButtonIndex + 1, 0, this.menuButtons.length);
            this.updateFocusState();
        });

        const triggerFocusedButton = () => {
            const button = this.menuButtons[this.focusedButtonIndex];
            if (!button) return;
            const trigger = button.getData('trigger');
            trigger();
        };

        this.input.keyboard.on('keydown-ENTER', triggerFocusedButton);
        this.input.keyboard.on('keydown-SPACE', triggerFocusedButton);
    }

    create() {
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

        this.add.text(width / 2, titleText.y + 32, 'Press Start to Begin', {
            fontSize: '24px',
            fill: '#a6afd9',
            fontStyle: 'normal'
        }).setOrigin(0.5);

        const startButton = this.createMenuButton(
            width / 2,
            height / 2,
            'Start Game',
            '#52ff8e',
            () => this.scene.start('MainScene')
        );

        const aboutButton = this.createMenuButton(
            width / 2,
            height / 2 + 86,
            'About Phaser',
            '#63c7ff',
            () => window.open('https://phaser.io', '_blank')
        );

        this.menuButtons = [startButton, aboutButton];
        this.updateFocusState();
        this.setupMenuKeyboardControls();
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
