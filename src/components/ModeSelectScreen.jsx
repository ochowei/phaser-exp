import React, { useState } from 'react';
import { t } from '../i18n.js';
import './ModeSelectScreen.css';

export default function ModeSelectScreen({ onSelectMode, onBack }) {
    const [fading, setFading] = useState(false);

    const handleClick = (action) => {
        if (fading) return;
        setFading(true);
        setTimeout(() => {
            if (action === 'back') {
                onBack();
            } else {
                onSelectMode(action);
            }
        }, 300);
    };

    return (
        <div className={`mode-select-screen${fading ? ' fading' : ''}`}>
            <div className="starfield">
                <div className="starfield-layer starfield-far" />
                <div className="starfield-layer starfield-mid" />
                <div className="starfield-layer starfield-near" />
            </div>

            <h1 className="mode-select-title">{t('selectMode')}</h1>

            <button
                className="mode-btn mode-btn-endless"
                onClick={() => handleClick('MainScene')}
            >
                {t('endlessMode')}
            </button>

            <button
                className="mode-btn mode-btn-stage"
                onClick={() => handleClick('StageSelectScene')}
            >
                {t('stageMode')}
            </button>

            <button
                className="mode-btn mode-btn-back"
                onClick={() => handleClick('back')}
            >
                {t('backArrow')}
            </button>
        </div>
    );
}
