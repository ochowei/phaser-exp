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
        bgmRef.current.play().catch(() => {
            // 瀏覽器 autoplay 限制 — 等使用者互動後再播放
            const resumeAudio = () => {
                bgmRef.current.play().catch(() => {});
                document.removeEventListener('click', resumeAudio);
            };
            document.addEventListener('click', resumeAudio);
        });

        return () => {
            // 不在 cleanup 停止 BGM — 由 GameCanvas 在 Phaser ready 後處理
        };
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
