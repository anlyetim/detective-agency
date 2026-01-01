import React from 'react';
import { formatIdleTime } from '../systems/idleSystem.js';
import { useLocalization } from '../LocalizationContext.jsx';

export default function IdlePopup({ rewards, onClose }) {
    const { t } = useLocalization();

    const iconStyle = { width: '20px', height: '20px', imageRendering: 'pixelated', marginRight: '4px' };

    return (
        <>
            <div className="popup-backdrop" onClick={onClose}></div>
            <div className="idle-popup">
                <h2 className="panel-title" style={{ marginBottom: '20px' }}>
                    {t('idle.welcomeBack')}
                </h2>

                <div style={{ marginBottom: '20px', textAlign: 'center', color: '#cccccc' }}>
                    {t('idle.awayFor')} {formatIdleTime(rewards.elapsedSeconds)}
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <div style={{
                        background: 'rgba(74, 26, 31, 0.4)',
                        padding: '16px',
                        borderRadius: '8px',
                        marginBottom: '12px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                            <span style={{ color: '#4CAF50', display: 'flex', alignItems: 'center' }}>
                                <img src="/pics/stats_and_currency/cash_currency.png" alt="Cash" style={iconStyle} />
                                {t('idle.currencyEarned')}
                            </span>
                            <span style={{ color: '#FFD700', fontWeight: 'bold' }}>
                                +${rewards.currency.toLocaleString()}
                            </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                            <span style={{ color: '#2196F3', display: 'flex', alignItems: 'center' }}>
                                <img src="/pics/stats_and_currency/experience_currency.png" alt="XP" style={iconStyle} />
                                {t('idle.experienceGained')}
                            </span>
                            <span style={{ color: '#FFD700', fontWeight: 'bold' }}>
                                +{rewards.experience.toLocaleString()} {t('common.experience')}
                            </span>
                        </div>

                        {rewards.casesCompleted > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#9C27B0' }}>📋 {t('idle.casesCompleted')}</span>
                                <span style={{ color: '#FFD700', fontWeight: 'bold' }}>
                                    {rewards.casesCompleted}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <button className="button" onClick={onClose} style={{ width: '100%' }}>
                    {t('idle.collectRewards')}
                </button>
            </div>
        </>
    );
}
