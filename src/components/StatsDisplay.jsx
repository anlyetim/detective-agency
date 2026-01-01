import React from 'react';
import gameState from '../gameState.js';
import { useLocalization } from '../LocalizationContext.jsx';

export default function StatsDisplay() {
    const { t } = useLocalization();
    const currency = gameState.getCurrency();
    const experience = gameState.getExperience();
    const level = gameState.getLevel();

    const iconStyle = {
        width: '20px',
        height: '20px',
        imageRendering: 'pixelated',
        marginRight: '4px'
    };

    return (
        <div className="stats-display">
            <div className="stat-item">
                <span style={{ color: '#FFD700' }}>{t('common.level')}</span>
                <span>{level}</span>
            </div>

            <div className="stat-item">
                <img src="/pics/stats_and_currency/cash_currency.png" alt="Cash" style={iconStyle} />
                <span>${currency.toLocaleString()}</span>
            </div>

            <div className="stat-item">
                <img src="/pics/stats_and_currency/experience_currency.png" alt="XP" style={iconStyle} />
                <span>{experience.toLocaleString()} {t('common.experience')}</span>
            </div>
        </div>
    );
}
