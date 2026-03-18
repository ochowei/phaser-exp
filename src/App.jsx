import React, { useState, useRef, useCallback } from 'react';
import StartScreen from './components/StartScreen.jsx';
import GameCanvas from './components/GameCanvas.jsx';

export default function App() {
    const [screen, setScreen] = useState('start');
    const [gameEntry, setGameEntry] = useState('ModeSelectScene');
    const bgmRef = useRef(null);

    const handlePlay = useCallback((entry) => {
        // BGM 不在此停止 — 由 GameCanvas 在 Phaser ready 後無縫銜接
        setGameEntry(entry);
        setScreen('game');
    }, []);

    const handleReturnToMenu = useCallback(() => {
        setScreen('start');
    }, []);

    if (screen === 'game') {
        return <GameCanvas entry={gameEntry} onReturnToMenu={handleReturnToMenu} bgmRef={bgmRef} />;
    }

    return <StartScreen onPlay={handlePlay} bgmRef={bgmRef} />;
}
