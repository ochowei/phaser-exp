import React, { useState, useRef, useCallback } from 'react';
import StartScreen from './components/StartScreen.jsx';
import ModeSelectScreen from './components/ModeSelectScreen.jsx';
import OptionsScreen from './components/OptionsScreen.jsx';
import BestiaryScreen from './components/BestiaryScreen.jsx';
import StageSelectScreen from './components/StageSelectScreen.jsx';
import GameCanvas from './components/GameCanvas.jsx';
import GameWrapper from './components/GameWrapper.jsx';

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
        } else if (entry === 'bestiary') {
            setScreen('bestiary');
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
            setReturnScreen('start');
            setGameEntry(entry);
            setGameData(null);
            setScreen('game');
        }
    }, []);

    const handleSelectStage = useCallback((stageId) => {
        setReturnScreen('start');
        setGameEntry('StageScene');
        setGameData({ stageId });
        setScreen('game');
    }, []);

    const handleReturnToMenu = useCallback(() => {
        setScreen(returnScreen);
    }, [returnScreen]);

    let content;
    if (screen === 'game') {
        content = (
            <GameCanvas
                entry={gameEntry}
                gameData={gameData}
                onReturnToMenu={handleReturnToMenu}
                bgmRef={bgmRef}
            />
        );
    } else if (screen === 'bestiary') {
        content = <BestiaryScreen onBack={() => setScreen('start')} />;
    } else if (screen === 'options') {
        content = <OptionsScreen onBack={() => setScreen('start')} bgmRef={bgmRef} />;
    } else if (screen === 'stageSelect') {
        content = (
            <StageSelectScreen
                onSelectStage={handleSelectStage}
                onBack={() => setScreen('modeSelect')}
            />
        );
    } else if (screen === 'modeSelect') {
        content = (
            <ModeSelectScreen
                onSelectMode={handleSelectMode}
                onBack={() => setScreen('start')}
                bgmRef={bgmRef}
            />
        );
    } else {
        content = <StartScreen onPlay={handlePlay} bgmRef={bgmRef} />;
    }

    return <GameWrapper>{content}</GameWrapper>;
}
