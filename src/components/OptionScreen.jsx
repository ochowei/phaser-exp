import React, { useState, useCallback } from 'react';
import { t, getLang, setLang } from '../i18n.js';
import './OptionScreen.css';

export default function OptionScreen({ onBack, bgmRef }) {
    const [fading, setFading] = useState(false);
    const [lang, setLangState] = useState(getLang());
    const [volume, setVolume] = useState(() => {
        const saved = parseFloat(localStorage.getItem('bgmVolume'));
        return isNaN(saved) ? 0.5 : saved;
    });
    const [muted, setMuted] = useState(() => {
        return localStorage.getItem('bgmMuted') === 'true';
    });

    const applyVolume = useCallback((vol, isMuted) => {
        if (bgmRef.current) {
            bgmRef.current.volume = isMuted ? 0 : vol;
        }
    }, [bgmRef]);

    const handleBack = () => {
        if (fading) return;
        setFading(true);
        setTimeout(() => onBack(), 300);
    };

    const handleLangChange = (newLang) => {
        if (newLang === lang) return;
        setLang(newLang);
        setLangState(newLang);
    };

    const handleVolumeChange = (e) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        localStorage.setItem('bgmVolume', val.toString());
        applyVolume(val, muted);
    };

    const handleMuteToggle = () => {
        const newMuted = !muted;
        setMuted(newMuted);
        localStorage.setItem('bgmMuted', newMuted.toString());
        applyVolume(volume, newMuted);
    };

    const volumeLabel = muted ? t('muted') : `${Math.round(volume * 100)}%`;

    return (
        <div className={`option-screen${fading ? ' fading' : ''}`}>
            <div className="starfield">
                <div className="starfield-layer starfield-far" />
                <div className="starfield-layer starfield-mid" />
                <div className="starfield-layer starfield-near" />
            </div>

            <h1 className="option-title">{t('optionsTitle')}</h1>

            {/* Language Selection */}
            <div className="option-section">
                <div className="option-label">{t('language')}</div>
                <div className="option-lang-buttons">
                    <button
                        className={`option-lang-btn${lang === 'en' ? ' active' : ''}`}
                        onClick={() => handleLangChange('en')}
                    >
                        {t('langEn')}
                    </button>
                    <button
                        className={`option-lang-btn${lang === 'zh' ? ' active' : ''}`}
                        onClick={() => handleLangChange('zh')}
                    >
                        {t('langZh')}
                    </button>
                </div>
            </div>

            {/* Volume Control */}
            <div className="option-section">
                <div className="option-label">{t('bgmVolume')}</div>
                <input
                    type="range"
                    className="option-slider"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    style={{ '--slider-progress': `${volume * 100}%` }}
                />
                <div className="option-volume-text">{volumeLabel}</div>
            </div>

            {/* Mute Toggle */}
            <button
                className={`option-mute-btn${muted ? ' muted' : ''}`}
                onClick={handleMuteToggle}
            >
                {muted ? t('muteOn') : t('muteOff')}
            </button>

            {/* Back Button */}
            <button className="option-back-btn" onClick={handleBack}>
                {t('back')}
            </button>
        </div>
    );
}
