import * as Phaser from 'phaser';
import Player from '../objects/Player.js';
import Enemy from '../objects/Enemy.js';
import Bullet from '../objects/Bullet.js';
import Powerup from '../objects/Powerup.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
    }

    create() {
        const graphics = this.add.graphics();
        
        // 背景雜訊紋理
        graphics.fillStyle(0x555555, 1);
        for(let i=0; i<200; i++) graphics.fillRect(Phaser.Math.Between(0, 512), Phaser.Math.Between(0, 512), 2, 2);
        graphics.generateTexture('bg_stars3', 512, 512);
        graphics.clear();
        
        graphics.fillStyle(0xaaaaaa, 1);
        for(let i=0; i<100; i++) graphics.fillRect(Phaser.Math.Between(0, 512), Phaser.Math.Between(0, 512), 2, 2);
        graphics.generateTexture('bg_stars2', 512, 512);
        graphics.clear();

        graphics.fillStyle(0xffffff, 1);
        for(let i=0; i<50; i++) graphics.fillRect(Phaser.Math.Between(0, 512), Phaser.Math.Between(0, 512), 2, 2);
        graphics.generateTexture('bg_stars1', 512, 512);
        graphics.clear();

        // 建立背景捲動層 
        this.bg3 = this.add.tileSprite(400, 300, 800, 600, 'bg_stars3');
        this.bg2 = this.add.tileSprite(400, 300, 800, 600, 'bg_stars2');
        this.bg1 = this.add.tileSprite(400, 300, 800, 600, 'bg_stars1');

        // 玩家紋理
        graphics.fillStyle(0x0088ff, 1);
        graphics.fillRect(0, 0, 32, 32);
        graphics.generateTexture('playerTexture', 32, 32);
        graphics.clear();

        // 子彈紋理
        graphics.fillStyle(0xffff00, 1);
        graphics.fillCircle(8, 8, 8);
        graphics.generateTexture('bullet', 16, 16);
        graphics.clear();

        // 普通敵人紋理
        graphics.fillStyle(0xff3333, 1);
        graphics.fillRect(0, 0, 32, 32);
        graphics.generateTexture('enemy_normal', 32, 32);
        graphics.clear();

        // 特殊敵人紋理
        graphics.fillStyle(0xcc00ff, 1);
        graphics.fillRect(0, 0, 32, 32);
        graphics.generateTexture('enemy_special', 32, 32);
        graphics.clear();

        // 道具紋理
        graphics.fillStyle(0x00ff00, 1);
        graphics.fillCircle(10, 10, 10);
        graphics.generateTexture('powerupTexture', 20, 20);
        graphics.clear();

        // 遊戲狀態與變數
        this.gameOver = false;
        this.score = 0;
        this.highScore = localStorage.getItem('phaserShooterHighScore') || 0;
        this.hasTripleShot = false;
        this.lastFired = 0;
        this.fireRate = 180;

        // 加入玩家實體
        this.player = new Player(this, 100, 300, 'playerTexture');

        // 鍵盤輸入
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            upArrow: Phaser.Input.Keyboard.KeyCodes.UP,
            downArrow: Phaser.Input.Keyboard.KeyCodes.DOWN,
            leftArrow: Phaser.Input.Keyboard.KeyCodes.LEFT,
            rightArrow: Phaser.Input.Keyboard.KeyCodes.RIGHT
        });

        // 建立群組
        this.bullets = this.physics.add.group({
            classType: Bullet,
            maxSize: 60,
            runChildUpdate: true
        });
        
        // Enemy 群組不需 classType 因為我們手動 new
        this.enemies = this.physics.add.group({
            runChildUpdate: true
        });
        this.powerups = this.physics.add.group({
            runChildUpdate: true
        });

        // 碰撞事件
        this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.hitPlayer, null, this);
        this.physics.add.overlap(this.player, this.powerups, this.collectPowerup, null, this);

        // UI 文字
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff', fontStyle: 'bold' });
        this.highScoreText = this.add.text(16, 44, 'High Score: ' + this.highScore, { fontSize: '18px', fill: '#aaa' });
        this.tripleShotText = this.add.text(16, 560, 'TRIPLE SHOT ACTIVE!', { fontSize: '20px', fill: '#00ff00', fontStyle: 'bold' });
        this.tripleShotText.setVisible(false);

        // 敵人生成計時器
        this.enemySpawnTimer = this.time.addEvent({
            delay: 1000,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });
    }

    update(time, delta) {
        if (this.gameOver) return;

        // 背景捲動
        this.bg3.tilePositionX += 0.2;
        this.bg2.tilePositionX += 0.5;
        this.bg1.tilePositionX += 1.0;

        // 玩家移動
        this.player.update(this.keys);

        // 處理發射子彈
        if (time > this.lastFired) {
            if (this.hasTripleShot) {
                this.fireSingleBullet(0);
                this.fireSingleBullet(-150); 
                this.fireSingleBullet(150);  
            } else {
                this.fireSingleBullet(0);
            }
            this.lastFired = time + this.fireRate;
        }

        // 移除先前的 debugText 覆蓋
    }

    fireSingleBullet(velocityY) {
        let bullet = this.bullets.get(this.player.x + 16, this.player.y);
        if (bullet) {
            bullet.fire(this.player.x + 16, this.player.y, velocityY);
        }
    }

    spawnEnemy() {
        if (this.gameOver) return;
        
        let y = Phaser.Math.Between(50, 550);
        
        // 20% 機率生成帶著升級道具的紫色特殊敵人
        let isSpecialEnemy = Phaser.Math.Between(1, 100) <= 20; 
        let enemyKey = isSpecialEnemy ? 'enemy_special' : 'enemy_normal';
        
        // 生成敵人物件並加進群組 (Phaser.Physics.Arcade.Group.add)
        let enemy = new Enemy(this, 850, y, enemyKey, isSpecialEnemy);
        this.enemies.add(enemy);
        
        // 加入群組後再給予速度，避免被 group default override
        let speed = Phaser.Math.Between(-150, -350);
        enemy.setVelocityX(speed);
    }

    hitEnemy(bullet, enemy) {
        // 回收子彈
        bullet.setActive(false);
        bullet.setVisible(false);
        bullet.body.stop();

        // 掉落道具
        if (enemy.isDropPowerup) {
            let powerup = new Powerup(this, enemy.x, enemy.y, 'powerupTexture');
            this.powerups.add(powerup);
            powerup.setVelocityX(-100);
        }

        enemy.destroy();
        this.cameras.main.shake(100, 0.005);
        this.updateScore(10);
    }

    collectPowerup(player, powerup) {
        powerup.destroy();
        this.hasTripleShot = true;
        this.tripleShotText.setVisible(true);

        this.cameras.main.flash(200, 0, 255, 0);

        if (this.tripleShotTimer) this.tripleShotTimer.remove();
        
        this.tripleShotTimer = this.time.delayedCall(10000, () => {
            this.hasTripleShot = false;
            this.tripleShotText.setVisible(false);
        }, [], this);
        
        this.updateScore(50);
    }

    updateScore(points) {
        this.score += points;
        this.scoreText.setText('Score: ' + this.score);
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreText.setText('High Score: ' + this.highScore);
            localStorage.setItem('phaserShooterHighScore', this.highScore);
        }
    }

    hitPlayer(player, enemy) {
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.gameOver = true;
        this.enemySpawnTimer.remove();
        
        this.cameras.main.shake(300, 0.015);
        this.tripleShotText.setVisible(false);

        let gameOverText = this.add.text(400, 250, 'GAME OVER', { fontSize: '64px', fill: '#ff3333', fontStyle: 'bold' });
        gameOverText.setOrigin(0.5);

        // Restart 按鈕
        const restartBtn = this.add.text(300, 350, 'Restart', {
            fontSize: '28px', fill: '#0f0', backgroundColor: '#000', padding: { x: 15, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => restartBtn.setStyle({ fill: '#fff', backgroundColor: '#333' }))
        .on('pointerout', () => restartBtn.setStyle({ fill: '#0f0', backgroundColor: '#000' }))
        .on('pointerdown', () => this.scene.restart());

        // Main Menu 按鈕
        const menuBtn = this.add.text(500, 350, 'Main Menu', {
            fontSize: '28px', fill: '#0af', backgroundColor: '#000', padding: { x: 15, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => menuBtn.setStyle({ fill: '#fff', backgroundColor: '#333' }))
        .on('pointerout', () => menuBtn.setStyle({ fill: '#0af', backgroundColor: '#000' }))
        .on('pointerdown', () => this.scene.start('StartScene'));
    }
}
