import React, { useState, useRef, useCallback } from 'react';
import StartScreen from './components/StartScreen.jsx';
import GameCanvas from './components/GameCanvas.jsx';

export default function App() {
    const [screen, setScreen] = useState('start');
    const [gameEntry, setGameEntry] = useState('ModeSelectScene');
    const bgmRef = useRef(null);

    const handlePlay = useCallback((entry) => {
        // 停止 React 側 BGM
        if (bgmRef.current) {
            bgmRef.current.pause();
            bgmRef.current.currentTime = 0;
        }
        setGameEntry(entry);
        setScreen('game');
    }, []);

    const handleReturnToMenu = useCallback(() => {
        setScreen('start');
    }, []);

    if (screen === 'game') {
        return <GameCanvas entry={gameEntry} onReturnToMenu={handleReturnToMenu} />;
    }

    return <StartScreen onPlay={handlePlay} bgmRef={bgmRef} />;
}
