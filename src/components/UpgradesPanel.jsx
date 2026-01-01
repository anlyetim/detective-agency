import React from 'react';
import gameState from '../gameState.js';
import { useLocalization } from '../LocalizationContext.jsx';

export default function UpgradesPanel({ onStateChange }) {
    const { t } = useLocalization();
    const upgrades = gameState.getUpgrades();
    const experience = gameState.getExperience();

    const handleBuy = (upgradeId) => {
        if (gameState.buyUpgrade(upgradeId)) {
            if (onStateChange) onStateChange();
        }
    };

    const upgradeDefs = [
        { id: 'auto_assistant', icon: '🤖' },
        { id: 'risk_mgmt', icon: '🛡️' },
        { id: 'efficiency', icon: '⚡' },
        { id: 'recovery', icon: '❤️' }
    ];

    return (
        <div className="panel">
            <h1 className="panel-title" style={{ textAlign: 'center', marginBottom: '20px' }}>
                🏗️ {t('upgrades.title') || 'Agency Upgrades'} 🏗️
            </h1>

            <div className="upgrades-list">
                {upgradeDefs.map(def => {
                    const id = def.id;
                    const definition = Object.values(gameState.constructor.UPGRADES).find(u => u.id === id);
                    const currentLevel = upgrades[id] || 0;
                    const cost = gameState.getUpgradeCost(id);
                    const isMaxed = currentLevel >= definition.maxLevel;
                    const canAfford = experience >= cost;

                    return (
                        <div key={id} className="case-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ fontSize: '24px' }}>{def.icon}</div>
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: '#fff' }}>
                                            {t(`upgrades.items.${id}.name`)}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#aaa' }}>
                                            {t('upgrades.level')} {currentLevel} / {definition.maxLevel}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ fontWeight: 'bold', color: '#2196F3' }}>
                                    {isMaxed ? t('upgrades.max') : `${cost} ${t('common.experience')}`}
                                </div>
                            </div>

                            <div style={{ fontSize: '13px', color: '#ccc', fontStyle: 'italic' }}>
                                {t(`upgrades.items.${id}.description`)}
                            </div>

                            <button
                                className="button"
                                disabled={isMaxed || !canAfford}
                                onClick={() => handleBuy(id)}
                                style={{
                                    opacity: (isMaxed || !canAfford) ? 0.5 : 1,
                                    marginTop: '8px'
                                }}
                            >
                                {isMaxed ? t('upgrades.maxLevel') : t('upgrades.upgrade')}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#2196F3' }}>
                {t('upgrades.availableXP')}: {experience}
            </div>
        </div >
    );
}
