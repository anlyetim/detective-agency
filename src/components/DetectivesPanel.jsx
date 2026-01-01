import React, { useState } from 'react';
import gameState from '../gameState.js';
import { calculateDetectiveScore, getDetectiveRank, upgradeDetectiveStat, calculateUpgradeCost } from '../systems/detectiveSystem.js';
import { useLocalization } from '../LocalizationContext.jsx';

const RARITY_COLORS = {
    'COMMON': '#888888',
    'RARE': '#2196F3',
    'VETERAN': '#FFA000',
    'EPIC': '#dc143c'
};

export default function DetectivesPanel({ onStateChange }) {
    const { t } = useLocalization();
    const allDetectives = gameState.getDetectives();
    const unlockedDetectives = allDetectives.filter(d => d.unlocked);
    const lockedDetectives = allDetectives.filter(d => !d.unlocked);
    const currency = gameState.getCurrency();
    const [selectedDetective, setSelectedDetective] = useState(null);

    const handleUpgrade = (detective, stat) => {
        if (upgradeDetectiveStat(detective, stat, gameState)) {
            onStateChange();
        }
    };

    const getRarityColor = (rarity) => {
        return RARITY_COLORS[rarity] || '#888888';
    };

    const renderDetectiveCard = (detective, isLocked = false) => {
        const score = calculateDetectiveScore(detective);
        const rank = getDetectiveRank(score);
        const isExpanded = selectedDetective === detective.id;
        const stats = gameState.getDetectiveStats(detective.id);

        if (!stats) {
            console.error('Missing stats for detective:', detective);
            return null;
        }

        return (
            <div
                key={detective.id}
                className="card"
                style={isLocked ? { opacity: 0.7, border: '2px solid #555' } : {}}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img
                        src={`/assets/pics/${detective.sprite}.png`}
                        alt={detective.name}
                        style={{
                            width: '64px',
                            height: '64px',
                            filter: isLocked ? 'grayscale(100%)' : detective.injured ? 'grayscale(80%) sepia(20%)' : 'none',
                            opacity: detective.injured ? 0.7 : 1
                        }}
                    />

                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ marginBottom: '4px', fontSize: '16px' }}>
                                {detective.nameKey ? t(detective.nameKey) : detective.name}
                            </h3>
                            <span style={{
                                color: getRarityColor(detective.rarity),
                                fontSize: '11px',
                                background: 'rgba(0, 0, 0, 0.3)',
                                padding: '2px 8px',
                                borderRadius: '4px'
                            }}>
                                {t(`rarities.${detective.rarity}`)}
                            </span>
                        </div>

                        {isLocked ? (
                            <>
                                <div style={{ fontSize: '11px', color: '#FFD700', marginBottom: '8px' }}>
                                    🔒 {detective.unlockTaskKey ? t(detective.unlockTaskKey) : detective.unlockTask}
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${Math.min((detective.unlockProgress / detective.unlockRequired) * 100, 100)}%`
                                        }}
                                    ></div>
                                </div>
                                <div style={{ fontSize: '10px', color: '#aaa', marginTop: '4px' }}>
                                    {detective.unlockProgress} / {detective.unlockRequired}
                                </div>
                            </>
                        ) : (
                            <>
                                <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>
                                    {detective.injured
                                        ? <span style={{ color: '#dc143c' }}>🚑 {t('detectives.recovering')}</span>
                                        : detective.assigned
                                            ? `🔍 ${t('detectives.working')}`
                                            : `💤 ${t('detectives.available')}`
                                    }
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                                    <div><img src="/pics/stats_and_currency/speed_stat.png" alt="Speed" style={{ width: "16px", height: "16px", imageRendering: "pixelated", marginRight: "4px" }} /> {t('detectives.stats.speed')}: {stats.speed}{stats.speed !== detective.speed && ` (+${stats.speed - detective.speed})`}</div>
                                    <div><img src="/pics/stats_and_currency/evidence_stat.png" alt="Evidence" style={{ width: "16px", height: "16px", imageRendering: "pixelated", marginRight: "4px" }} /> {t('detectives.stats.evidence')}: {stats.evidence}{stats.evidence !== detective.evidence && ` (+${stats.evidence - detective.evidence})`}</div>
                                    <div><img src="/pics/stats_and_currency/intelligence_stat.png" alt="Intelligence" style={{ width: "16px", height: "16px", imageRendering: "pixelated", marginRight: "4px" }} /> {t('detectives.stats.intelligence')}: {stats.intelligence}{stats.intelligence !== detective.intelligence && ` (+${stats.intelligence - detective.intelligence})`}</div>
                                    <div><img src="/pics/stats_and_currency/risk_stat.png" alt="Risk" style={{ width: "16px", height: "16px", imageRendering: "pixelated", marginRight: "4px" }} /> {t('detectives.stats.risk')}: {stats.risk}{stats.risk !== detective.risk && ` (+${stats.risk - detective.risk})`}</div>
                                </div>
                                {detective.injured && (
                                    <div style={{
                                        marginTop: '12px',
                                        padding: '12px',
                                        background: 'linear-gradient(135deg, rgba(220, 20, 60, 0.15) 0%, rgba(139, 0, 0, 0.15) 100%)',
                                        border: '2px solid rgba(220, 20, 60, 0.3)',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(220, 20, 60, 0.2)'
                                    }}>
                                        <div style={{
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            color: '#ff6b6b',
                                            marginBottom: '8px',
                                            textAlign: 'center'
                                        }}>
                                            ⚠️ {detective.injuryType ? t(`injury.types.${detective.injuryType}`) : t('detectives.injured')}
                                        </div>

                                        {detective.injuryType && (
                                            <div style={{
                                                fontSize: '10px',
                                                color: '#ddd',
                                                marginBottom: '12px',
                                                textAlign: 'center',
                                                fontStyle: 'italic'
                                            }}>
                                                {t(`injury.descriptions.${detective.injuryType}`)}
                                            </div>
                                        )}

                                        {/* Time-based healing */}
                                        {detective.injuryHealMethod === 'time' && detective.injuryHealTime && (
                                            <>
                                                <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '6px' }}>
                                                    {t('injury.healMethods.time', {
                                                        time: Math.max(0, Math.ceil((detective.injuryHealTime - Date.now()) / 1000)) + 's'
                                                    })}
                                                </div>
                                                <div className="progress-bar" style={{ marginBottom: '8px' }}>
                                                    <div
                                                        className="progress-fill"
                                                        style={{
                                                            width: `${Math.min(100, Math.max(0, 100 - ((detective.injuryHealTime - Date.now()) / (detective.injuryHealTime - (detective.injuryHealTime - 180000))) * 100))}%`,
                                                            background: 'linear-gradient(90deg, #4CAF50 0%, #45a049 100%)'
                                                        }}
                                                    ></div>
                                                </div>
                                            </>
                                        )}

                                        {/* XP-based healing */}
                                        {detective.injuryHealMethod === 'xp' && (
                                            <div style={{ fontSize: '11px', color: '#2196F3', marginBottom: '8px', textAlign: 'center' }}>
                                                <img src="/pics/stats_and_currency/experience_currency.png" alt="XP" style={{ width: "16px", height: "16px", imageRendering: "pixelated", marginRight: "4px" }} /> {t('injury.healMethods.xp', { cost: detective.injuryHealCost })}
                                            </div>
                                        )}

                                        {/* Currency-based healing */}
                                        {detective.injuryHealMethod === 'currency' && (
                                            <div style={{ fontSize: '11px', color: '#4CAF50', marginBottom: '8px', textAlign: 'center' }}>
                                                <img src="/pics/stats_and_currency/cash_currency.png" alt="Cash" style={{ width: "16px", height: "16px", imageRendering: "pixelated", marginRight: "4px" }} /> {t('injury.healMethods.currency', { cost: detective.injuryHealCost })}
                                            </div>
                                        )}

                                        {/* Heal button for XP/Currency */}
                                        {(detective.injuryHealMethod === 'xp' || detective.injuryHealMethod === 'currency') && (
                                            <button
                                                className="button"
                                                style={{
                                                    width: '100%',
                                                    fontSize: '11px',
                                                    padding: '8px',
                                                    background: (detective.injuryHealMethod === 'xp' && gameState.getExperience() < detective.injuryHealCost) ||
                                                        (detective.injuryHealMethod === 'currency' && gameState.getCurrency() < detective.injuryHealCost)
                                                        ? 'rgba(100, 100, 100, 0.3)'
                                                        : 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                                                }}
                                                disabled={
                                                    (detective.injuryHealMethod === 'xp' && gameState.getExperience() < detective.injuryHealCost) ||
                                                    (detective.injuryHealMethod === 'currency' && gameState.getCurrency() < detective.injuryHealCost)
                                                }
                                                onClick={() => {
                                                    if (gameState.healDetective(detective.id, true)) {
                                                        onStateChange();
                                                    }
                                                }}
                                            >
                                                {(detective.injuryHealMethod === 'xp' && gameState.getExperience() < detective.injuryHealCost) ||
                                                    (detective.injuryHealMethod === 'currency' && gameState.getCurrency() < detective.injuryHealCost)
                                                    ? t('injury.cannotAfford', {
                                                        resource: detective.injuryHealMethod === 'xp' ? t('common.experience') : t('common.currency')
                                                    })
                                                    : t('injury.healButton')
                                                }
                                            </button>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {!isLocked && (
                    <>
                        <div style={{ marginTop: '12px' }}>
                            <button
                                className="button"
                                style={{ width: '100%' }}
                                onClick={() => setSelectedDetective(isExpanded ? null : detective.id)}
                            >
                                {isExpanded ? t('detectives.hideUpgrades') : t('detectives.showUpgrades')}
                            </button>
                        </div>

                        {isExpanded && (
                            <div style={{
                                marginTop: '12px',
                                padding: '12px',
                                background: 'rgba(0, 0, 0, 0.3)',
                                borderRadius: '4px'
                            }}>
                                <h4 style={{ fontSize: '13px', marginBottom: '12px' }}>Upgrade Stats (Base Only)</h4>

                                {['speed', 'evidence', 'intelligence', 'risk'].map(stat => {
                                    const cost = calculateUpgradeCost(detective[stat]);
                                    const canAfford = currency >= cost;
                                    const maxed = detective[stat] >= 10;

                                    return (
                                        <div key={stat} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '8px'
                                        }}>
                                            <span style={{ textTransform: 'capitalize', fontSize: '11px' }}>
                                                {stat}: {detective[stat]}/10
                                            </span>
                                            <button
                                                className="button"
                                                onClick={() => handleUpgrade(detective, stat)}
                                                disabled={!canAfford || maxed}
                                                style={{ fontSize: '10px', padding: '4px 12px' }}
                                            >
                                                {maxed ? 'MAX' : `$${cost}`}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="panel">
            <h1 className="panel-title">Detective Agency</h1>

            <h2 style={{ fontSize: '16px', marginBottom: '12px', color: '#4CAF50' }}>
                Active Detectives
            </h2>
            {unlockedDetectives.map(d => renderDetectiveCard(d, false))}

            {lockedDetectives.length > 0 && (
                <>
                    <h2 style={{ fontSize: '16px', marginTop: '24px', marginBottom: '12px', color: '#FFD700' }}>
                        Locked Detectives
                    </h2>
                    {lockedDetectives.map(d => renderDetectiveCard(d, true))}
                </>
            )}
        </div>
    );
}
