import React, { useState, useRef, useEffect } from 'react';
import { t } from '../i18n.js';
import aircraftProfiles from '../profiles/aircraftProfiles.js';
import { enemyEntries } from '../data/enemyData.js';
import { renderProfileToCanvas } from '../utils/canvasRenderer.js';
import './BestiaryScreen.css';

const TYPE_KEY_MAP = {
    normal: 'enemyTypeNormal',
    special: 'enemyTypeSpecial',
    miniBoss: 'enemyTypeMiniBoss',
    boss: 'enemyTypeBoss',
};

const ATTACK_KEY_MAP = {
    aimed: 'attackAimed',
    scatter: 'attackScatter',
    tracking: 'attackTracking',
};

function EnemyCard({ entry }) {
    const canvasRef = useRef(null);
    const profile = aircraftProfiles[entry.profileKey];

    useEffect(() => {
        if (canvasRef.current && profile) {
            renderProfileToCanvas(profile, canvasRef.current);
        }
    }, [profile]);

    if (!profile) return null;

    const attackPattern = profile.attackPattern;
    const attackLabel = attackPattern
        ? t(ATTACK_KEY_MAP[attackPattern])
        : t('attackNone');

    return (
        <div className="bestiary-card" data-type={entry.type}>
            <canvas ref={canvasRef} />
            <div className="bestiary-card-name">{t(entry.nameKey)}</div>
            <span className="bestiary-card-type" data-type={entry.type}>
                {t(TYPE_KEY_MAP[entry.type])}
            </span>
            <div className="bestiary-card-desc">{t(entry.descKey)}</div>
            <div className="bestiary-card-stats">
                <span>{t('enemyHp')}: <span className="bestiary-stat-value">{profile.hp}</span></span>
                <span>{t('enemyScore')}: <span className="bestiary-stat-value">{entry.score}</span></span>
                <span>{t('enemyAttack')}: <span className="bestiary-stat-value">{attackLabel}</span></span>
            </div>
        </div>
    );
}

export default function BestiaryScreen({ onBack }) {
    const [fading, setFading] = useState(false);

    const handleBack = () => {
        if (fading) return;
        setFading(true);
        setTimeout(() => onBack(), 300);
    };

    return (
        <div className={`bestiary-screen${fading ? ' fading' : ''}`}>
            <div className="starfield">
                <div className="starfield-layer starfield-far" />
                <div className="starfield-layer starfield-mid" />
                <div className="starfield-layer starfield-near" />
            </div>

            <h1 className="bestiary-title">{t('bestiaryTitle')}</h1>

            <div className="bestiary-grid">
                {enemyEntries.map((entry) => (
                    <EnemyCard key={entry.profileKey} entry={entry} />
                ))}
            </div>

            <button className="bestiary-back-btn" onClick={handleBack}>
                {t('backArrow')}
            </button>
        </div>
    );
}
