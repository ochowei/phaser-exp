import React, { useEffect, useState } from 'react';
import { t } from '../i18n.js';
import './StartScreen.css';

export default function StartScreen({ onPlay, bgmRef }) {
    const [fading, setFading] = useState(false);

    useEffect(() => {
        const savedVolume = parseFloat(localStorage.getItem('bgmVolume'));
        const volume = isNaN(savedVolume) ? 0.5 : savedVolume;
        const isMuted = localStorage.getItem('bgmMuted') === 'true';

        if (!bgmRef.current) {
            bgmRef.current = new Audio('assets/audio/bgm_menu.wav');
            bgmRef.current.loop = true;
        }

        bgmRef.current.volume = isMuted ? 0 : volume;

        const cleanup = () => {
            document.removeEventListener('pointerdown', tryPlay);
            document.removeEventListener('keydown', tryPlay);
            document.removeEventListener('visibilitychange', onVisible);
        };

        const tryPlay = () => {
            bgmRef.current.play().then(() => {
                cleanup();
            }).catch(() => {});
        };

        const onVisible = () => {
            if (document.visibilityState === 'visible') tryPlay();
        };

        // 嘗試自動播放（可能被瀏覽器擋下）
        tryPlay();

        // Fallback: pointerdown 比 click 更早觸發，確保點按鈕時音樂在導航前開始
        document.addEventListener('pointerdown', tryPlay, { once: true });
        document.addEventListener('keydown', tryPlay, { once: true });
        // 切換到此分頁時嘗試播放
        document.addEventListener('visibilitychange', onVisible);

        return cleanup;
    }, [bgmRef]);

    const handleClick = (entry) => {
        if (fading) return;
        setFading(true);
        setTimeout(() => onPlay(entry), 300);
    };

    return (
        <div className={`start-screen${fading ? ' fading' : ''}`}>
            <div className="starfield">
                <div className="starfield-layer starfield-far" />
                <div className="starfield-layer starfield-mid" />
                <div className="starfield-layer starfield-near" />
            </div>

            <h1 className="start-title">SPACE SHOOTER</h1>

            <button
                className="start-btn start-btn-play"
                onClick={() => handleClick('modeSelect')}
            >
                {t('startGame')}
            </button>

            <button
                className="start-btn start-btn-options"
                onClick={() => handleClick('options')}
            >
                {t('options')}
            </button>
        </div>
    );
}
