import React, { useState, useRef, useCallback } from 'react';
import StartScreen from './components/StartScreen.jsx';
import ModeSelectScreen from './components/ModeSelectScreen.jsx';
import OptionsScreen from './components/OptionsScreen.jsx';
import StageSelectScreen from './components/StageSelectScreen.jsx';
import GameCanvas from './components/GameCanvas.jsx';

export default function App() {
    const [screen, setScreen] = useState('start');
    const [gameEntry, setGameEntry] = useState('MainScene');
    const [gameData, setGameData] = useState(null);
    const [returnScreen, setReturnScreen] = useState('modeSelect');
    const bgmRef = useRef(null);

    const handlePlay = useCallback((entry) => {
        if (entry === 'modeSelect') {
            setScreen('modeSelect');
        } else if (entry === 'options') {
            setScreen('options');
        } else {
            setReturnScreen('start');
            setGameEntry(entry);
            setGameData(null);
            setScreen('game');
        }
    }, []);

    const handleSelectMode = useCallback((entry) => {
        if (entry === 'stageSelect') {
            setScreen('stageSelect');
        } else {
            setReturnScreen('modeSelect');
            setGameEntry(entry);
            setGameData(null);
            setScreen('game');
        }
    }, []);

    const handleSelectStage = useCallback((stageId) => {
        setReturnScreen('stageSelect');
        setGameEntry('StageScene');
        setGameData({ stageId });
        setScreen('game');
    }, []);

    const handleReturnToMenu = useCallback(() => {
        setScreen(returnScreen);
    }, [returnScreen]);

    if (screen === 'game') {
        return (
            <GameCanvas
                entry={gameEntry}
                gameData={gameData}
                onReturnToMenu={handleReturnToMenu}
                bgmRef={bgmRef}
            />
        );
    }

    if (screen === 'options') {
        return <OptionsScreen onBack={() => setScreen('start')} bgmRef={bgmRef} />;
    }

    if (screen === 'stageSelect') {
        return (
            <StageSelectScreen
                onSelectStage={handleSelectStage}
                onBack={() => setScreen('modeSelect')}
            />
        );
    }

    if (screen === 'modeSelect') {
        return (
            <ModeSelectScreen
                onSelectMode={handleSelectMode}
                onBack={() => setScreen('start')}
                bgmRef={bgmRef}
            />
        );
    }

    return <StartScreen onPlay={handlePlay} bgmRef={bgmRef} />;
}
