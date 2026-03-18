import React, { useState } from 'react';
import { t } from '../i18n.js';
import { stages } from '../data/stageData.js';
import './StageSelectScreen.css';

function loadProgress() {
    try {
        const data = JSON.parse(localStorage.getItem('stageProgress'));
        if (Array.isArray(data) && data.length === stages.length) {
            return data;
        }
    } catch {
        // fall through
    }
    return new Array(stages.length).fill(false);
}

export default function StageSelectScreen({ onSelectStage, onBack }) {
    const [progress] = useState(loadProgress);
    const [fading, setFading] = useState(false);

    const handleSelect = (stageId) => {
        if (fading) return;
        setFading(true);
        setTimeout(() => onSelectStage(stageId), 300);
    };

    const handleBack = () => {
        if (fading) return;
        setFading(true);
        setTimeout(() => onBack(), 300);
    };

    return (
        <div className={`stage-select-screen${fading ? ' fading' : ''}`}>
            <div className="starfield">
                <div className="starfield-layer starfield-far" />
                <div className="starfield-layer starfield-mid" />
                <div className="starfield-layer starfield-near" />
            </div>

            <h1 className="stage-select-title">{t('stageSelect')}</h1>

            <div className="stage-list">
                {stages.map((stage, i) => {
                    const isCompleted = progress[i];
                    const isUnlocked = i === 0 || progress[i - 1];

                    return (
                        <button
                            key={stage.id}
                            className={`stage-btn${!isUnlocked ? ' locked' : ''}${isCompleted ? ' completed' : ''}`}
                            onClick={() => isUnlocked && handleSelect(stage.id)}
                            disabled={!isUnlocked}
                        >
                            <span className="stage-num">Stage {stage.id}</span>
                            <span className="stage-name">{t(stage.nameKey)}</span>
                            {isCompleted && (
                                <span className="stage-status stage-completed">
                                    ✓ {t('stageCompleted')}
                                </span>
                            )}
                            {!isUnlocked && (
                                <span className="stage-status stage-locked">
                                    🔒 {t('stageLocked')}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            <button className="stage-back-btn" onClick={handleBack}>
                {t('backArrow')}
            </button>
        </div>
    );
}
