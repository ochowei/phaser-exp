import React, { useState } from 'react';
import { t, getLang, setLang } from '../i18n.js';
import './OptionsScreen.css';

export default function OptionsScreen({ onBack, bgmRef }) {
    const [lang, setLangState] = useState(getLang);
    const [volume, setVolume] = useState(() => {
        const saved = parseFloat(localStorage.getItem('bgmVolume'));
        return isNaN(saved) ? 0.5 : saved;
    });
    const [muted, setMuted] = useState(
        () => localStorage.getItem('bgmMuted') === 'true'
    );
    const [fading, setFading] = useState(false);

    const handleLang = (newLang) => {
        if (newLang === lang) return;
        setLang(newLang);
        setLangState(newLang);
    };

    const handleVolume = (e) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        localStorage.setItem('bgmVolume', val.toString());
        if (!muted && bgmRef?.current) {
            bgmRef.current.volume = val;
        }
    };

    const handleMute = () => {
        const newMuted = !muted;
        setMuted(newMuted);
        localStorage.setItem('bgmMuted', newMuted.toString());
        if (bgmRef?.current) {
            bgmRef.current.volume = newMuted ? 0 : volume;
        }
    };

    const handleBack = () => {
        if (fading) return;
        setFading(true);
        setTimeout(() => onBack(), 300);
    };

    const volumeLabel = muted ? t('muted') : `${Math.round(volume * 100)}%`;

    return (
        <div className={`options-screen${fading ? ' fading' : ''}`}>
            <div className="starfield">
                <div className="starfield-layer starfield-far" />
                <div className="starfield-layer starfield-mid" />
                <div className="starfield-layer starfield-near" />
            </div>

            <h1 className="options-title">{t('optionsTitle')}</h1>

            <div className="options-section">
                <div className="options-label">{t('language')}</div>
                <div className="options-lang-btns">
                    <button
                        className={`lang-btn${lang === 'en' ? ' active' : ''}`}
                        onClick={() => handleLang('en')}
                    >
                        {t('langEn')}
                    </button>
                    <button
                        className={`lang-btn${lang === 'zh' ? ' active' : ''}`}
                        onClick={() => handleLang('zh')}
                    >
                        {t('langZh')}
                    </button>
                </div>
            </div>

            <div className="options-section">
                <div className="options-label">{t('bgmVolume')}</div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolume}
                    className="volume-slider"
                />
                <div className="volume-display">{volumeLabel}</div>
            </div>

            <button
                className={`mute-btn${muted ? ' muted' : ''}`}
                onClick={handleMute}
            >
                {t(muted ? 'muteOn' : 'muteOff')}
            </button>

            <button className="options-back-btn" onClick={handleBack}>
                {t('back')}
            </button>
        </div>
    );
}
