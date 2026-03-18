import React, { useState, useRef, useCallback } from 'react';
import StartScreen from './components/StartScreen.jsx';
import ModeSelectScreen from './components/ModeSelectScreen.jsx';
import GameCanvas from './components/GameCanvas.jsx';

export default function App() {
    const [screen, setScreen] = useState('start');
    const [gameEntry, setGameEntry] = useState('MainScene');
    const [returnScreen, setReturnScreen] = useState('modeSelect');
    const bgmRef = useRef(null);

    const handlePlay = useCallback((entry) => {
        if (entry === 'modeSelect') {
            setScreen('modeSelect');
        } else {
            // Options 等直接進入 Phaser 的場景
            setReturnScreen('start');
            setGameEntry(entry);
            setScreen('game');
        }
    }, []);

    const handleSelectMode = useCallback((entry) => {
        setReturnScreen('modeSelect');
        setGameEntry(entry);
        setScreen('game');
    }, []);

    const handleReturnToMenu = useCallback(() => {
        setScreen(returnScreen);
    }, [returnScreen]);

    if (screen === 'game') {
        return <GameCanvas entry={gameEntry} onReturnToMenu={handleReturnToMenu} bgmRef={bgmRef} />;
    }

    if (screen === 'modeSelect') {
        return <ModeSelectScreen onSelectMode={handleSelectMode} onBack={() => setScreen('start')} bgmRef={bgmRef} />;
    }

    return <StartScreen onPlay={handlePlay} bgmRef={bgmRef} />;
}
