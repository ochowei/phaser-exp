import React, { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';
import ModeSelectScene from '../scenes/ModeSelectScene.js';
import OptionScene from '../scenes/OptionScene.js';
import MainScene from '../scenes/MainScene.js';
import StageSelectScene from '../scenes/StageSelectScene.js';
import StageScene from '../scenes/StageScene.js';

const sceneMap = {
    ModeSelectScene,
    OptionScene,
    MainScene,
    StageSelectScene,
    StageScene,
};

export default function GameCanvas({ entry, onReturnToMenu, bgmRef }) {
    const containerRef = useRef(null);
    const gameRef = useRef(null);

    useEffect(() => {
        // 將目標場景排在第一位，使其成為 Phaser 初始場景
        const EntryScene = sceneMap[entry] || ModeSelectScene;
        const otherScenes = Object.values(sceneMap).filter(s => s !== EntryScene);
        const scenes = [EntryScene, ...otherScenes];

        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: containerRef.current,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
            physics: {
                default: 'arcade',
                arcade: { debug: false },
            },
            scene: scenes,
        };

        gameRef.current = new Phaser.Game(config);

        // Phaser ready 後停止 React 側 BGM，實現無縫銜接
        gameRef.current.events.once('ready', () => {
            if (bgmRef && bgmRef.current) {
                bgmRef.current.pause();
                bgmRef.current.currentTime = 0;
            }
        });

        gameRef.current.events.on('returnToMenu', () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
            onReturnToMenu();
        });

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div
            ref={containerRef}
            style={{ width: 800, height: 600, backgroundColor: '#090b22' }}
        />
    );
}
