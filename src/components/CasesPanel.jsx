import React, { useState } from 'react';
import gameState from '../gameState.js';
import { assignDetectiveToCase, canDetectiveSolveCase, getDifficultyData } from '../systems/caseSystem.js';
import CaseDetailModal from './CaseDetailModal.jsx';
import { useLocalization } from '../LocalizationContext.jsx';

const RARITY_COLORS = {
    'COMMON': '#888888',
    'RARE': '#2196F3',
    'VETERAN': '#FFA000',
    'EPIC': '#dc143c'
};

// Internal component for handling tape animation
function PoliceTapeOverlay({ isVisible, t }) {
    const [render, setRender] = useState(isVisible);
    const [exiting, setExiting] = useState(false);

    React.useEffect(() => {
        if (isVisible) {
            setRender(true);
            setExiting(false);
        } else if (render && !exiting) {
            setExiting(true);
            const timer = setTimeout(() => {
                setRender(false);
                setExiting(false);
            }, 1000); // Match CSS animation duration
            return () => clearTimeout(timer);
        }
    }, [isVisible, render, exiting]);

    if (!render) return null;

    return (
        <div className={`police-tape-overlay ${exiting ? 'police-tape-tearing' : ''}`}>
            <div className="police-tape-strip">
                {t('detectives.injured').toUpperCase()}
            </div>
            <div style={{ color: '#fff', marginTop: '8px', fontSize: '11px', textShadow: '0 1px 2px #000' }}>
                ⏹ {t('cases.investigationPaused')}
            </div>
        </div>
    );
}

export default function CasesPanel({ onStateChange }) {
    const { t } = useLocalization();
    const cases = gameState.getCases();
    const detectives = gameState.getUnlockedDetectives();
    const autoAssignMode = gameState.getAutoAssignMode();
    const isAutoAssignUnlocked = gameState.isAutoAssignUnlocked(); // Add this getter to gameState plan
    const currency = gameState.getCurrency();
    const [selectedCase, setSelectedCase] = useState(null);

    const handleAssign = (caseId, detectiveId) => {
        if (assignDetectiveToCase(detectiveId, caseId)) {
            onStateChange();
        }
    };

    const handleToggleAutoAssign = () => {
        gameState.toggleAutoAssign();
        onStateChange();
    };

    const handleUnlockAutoAssign = () => {
        if (gameState.unlockAutoAssign()) {
            onStateChange();
        }
    };

    const getAssignedDetectiveName = (caseObj) => {
        if (!caseObj.assignedDetectiveId) return null;
        const detective = detectives.find(d => d.id === caseObj.assignedDetectiveId);
        return detective ? detective.name : t('common.unknown');
    };

    // Helper to check if assigned detective is injured
    const isAssignedDetectiveInjured = (caseObj) => {
        if (!caseObj.assignedDetectiveId) return false;
        const detective = detectives.find(d => d.id === caseObj.assignedDetectiveId);
        return detective && detective.injured;
    };

    return (
        <div className="panel">
            <h1 className="panel-title">{t('cases.title')}</h1>

            <div style={{
                marginBottom: '20px',
                padding: '12px',
                background: 'rgba(74, 26, 31, 0.4)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <span style={{ fontSize: '13px' }}>{t('cases.autoAssignMode')}</span>

                {isAutoAssignUnlocked ? (
                    <button
                        className="button"
                        onClick={handleToggleAutoAssign}
                        style={{
                            background: autoAssignMode ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' : undefined
                        }}
                    >
                        {autoAssignMode ? t('cases.on') : t('cases.off')}
                    </button>
                ) : (
                    <button
                        className="button"
                        onClick={handleUnlockAutoAssign}
                        disabled={currency < 300}
                        style={{
                            background: currency >= 300 ? 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)' : '#555',
                            opacity: currency >= 300 ? 1 : 0.7,
                            fontSize: '11px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        <img src="/pics/stats_and_currency/cash_currency.png" alt="$" style={{ width: "12px", height: "12px", imageRendering: "pixelated" }} /> 300
                    </button>
                )}
            </div>

            {
                cases.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#888',
                        fontSize: '13px'
                    }}>
                        {t('cases.noCases')}
                    </div>
                )
            }

            {
                cases.map(caseObj => {
                    const difficultyData = getDifficultyData(caseObj.difficulty);
                    const assignedDetectiveName = getAssignedDetectiveName(caseObj);
                    const assignedInjured = isAssignedDetectiveInjured(caseObj);

                    const availableDetectives = detectives.filter(d =>
                        !d.assigned && !d.injured && canDetectiveSolveCase(d, caseObj)
                    );

                    const isEpic = caseObj.difficulty === 'EPIC';
                    const rarityColor = RARITY_COLORS[caseObj.rarity] || '#888888';

                    return (
                        <div
                            key={caseObj.id}
                            className="card"
                            style={isEpic ? {
                                boxShadow: `0 4px 20px ${rarityColor}80, 0 0 30px ${rarityColor}60`,
                                border: `2px solid ${rarityColor}`,
                                position: 'relative',
                                overflow: 'hidden'
                            } : {
                                border: `2px solid ${rarityColor}40`,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onClick={() => assignedDetectiveName && !assignedInjured && setSelectedCase(caseObj)}
                        >
                            {/* Police Tape Overlay for Injured Detective */}
                            {/* Police Tape Overlay controlled component */}
                            <PoliceTapeOverlay isVisible={assignedInjured} t={t} />
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', opacity: assignedInjured ? 0.5 : 1 }}>
                                <img
                                    src={`/assets/pics/${caseObj.sprite}.png`}
                                    alt={caseObj.title}
                                    style={{
                                        width: '64px',
                                        height: '64px',
                                        filter: isEpic ?
                                            `drop-shadow(0 0 12px ${rarityColor}80)` :
                                            `drop-shadow(0 0 6px ${rarityColor}50)`,
                                        cursor: assignedDetectiveName ? 'pointer' : 'default'
                                    }}
                                />

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <h3 style={{ fontSize: '15px', marginBottom: '4px' }}>
                                            {caseObj.titleKey ? t(caseObj.titleKey) : caseObj.title}
                                        </h3>
                                        <span style={{
                                            color: rarityColor,
                                            fontSize: '11px',
                                            background: 'rgba(0, 0, 0, 0.3)',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {t(`rarities.${caseObj.rarity}`)}
                                        </span>
                                    </div>

                                    <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>
                                        <img src="/pics/stats_and_currency/timer.png" alt="Time" style={{ width: "16px", height: "16px", imageRendering: "pixelated", marginRight: "4px" }} /> {caseObj.duration}{t('common.seconds')} | <img src="/pics/stats_and_currency/cash_currency.png" alt="Cash" style={{ width: "16px", height: "16px", imageRendering: "pixelated", marginRight: "4px" }} /> ${caseObj.reward} | <img src="/pics/stats_and_currency/experience_currency.png" alt="XP" style={{ width: "16px", height: "16px", imageRendering: "pixelated", marginRight: "4px" }} /> {caseObj.experienceReward} {t('common.experience')}
                                    </div>

                                    <div style={{
                                        fontSize: '10px',
                                        color: '#aaa',
                                        marginBottom: '12px',
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '4px'
                                    }}>
                                        <div><img src="/pics/stats_and_currency/speed_stat.png" alt="Speed" style={{ width: "16px", height: "16px", imageRendering: "pixelated", marginRight: "4px" }} /> {t('detectives.stats.speed')}: {caseObj.requiredStats.speed}</div>
                                        <div><img src="/pics/stats_and_currency/evidence_stat.png" alt="Evidence" style={{ width: "16px", height: "16px", imageRendering: "pixelated", marginRight: "4px" }} /> {t('detectives.stats.evidence')}: {caseObj.requiredStats.evidence}</div>
                                        <div><img src="/pics/stats_and_currency/intelligence_stat.png" alt="Intelligence" style={{ width: "16px", height: "16px", imageRendering: "pixelated", marginRight: "4px" }} /> {t('detectives.stats.intelligence')}: {caseObj.requiredStats.intelligence}</div>
                                        <div><img src="/pics/stats_and_currency/risk_stat.png" alt="Risk" style={{ width: "16px", height: "16px", imageRendering: "pixelated", marginRight: "4px" }} /> {t('detectives.stats.risk')}: {caseObj.requiredStats.risk}</div>
                                    </div>

                                    {assignedDetectiveName ? (
                                        <>
                                            <div style={{ fontSize: '12px', color: assignedInjured ? '#888' : '#4CAF50', marginBottom: '8px' }}>
                                                {assignedInjured ? '🛑 ' : '🔍 '} {assignedDetectiveName} {assignedInjured ? t('detectives.injured') : t('cases.investigating')}
                                                {!assignedInjured && assignedDetectiveName && (
                                                    <span style={{ fontSize: '10px', color: '#FFD700', marginLeft: '8px', cursor: 'pointer' }}>
                                                        {t('cases.viewDetails')}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{
                                                        width: `${caseObj.progress || 0}%`,
                                                        background: assignedInjured
                                                            ? `repeating-linear-gradient(45deg, #FFD700, #FFD700 10px, #000 10px, #000 20px)`
                                                            : `linear-gradient(90deg, ${rarityColor}80 0%, ${rarityColor} 100%)`,
                                                        transition: 'width 0.3s ease'
                                                    }}
                                                ></div>
                                            </div>
                                            <div style={{ fontSize: '10px', color: '#888', marginTop: '4px', textAlign: 'right' }}>
                                                {t('common.percent', { value: Math.floor(caseObj.progress || 0) })}
                                            </div>
                                        </>
                                    ) : (
                                        <div onClick={(e) => e.stopPropagation()}>
                                            {availableDetectives.length > 0 ? (
                                                <select
                                                    style={{
                                                        width: '100%',
                                                        padding: '8px',
                                                        marginBottom: '8px',
                                                        background: 'rgba(0, 0, 0, 0.5)',
                                                        color: '#fff',
                                                        border: '1px solid var(--noir-crimson)',
                                                        borderRadius: '4px',
                                                        fontFamily: 'Minecraftia, monospace',
                                                        fontSize: '11px'
                                                    }}
                                                    onChange={(e) => {
                                                        if (e.target.value) {
                                                            handleAssign(caseObj.id, parseInt(e.target.value));
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                    defaultValue=""
                                                >
                                                    <option value="">{t('cases.assignDetective')}</option>
                                                    {availableDetectives.map(d => (
                                                        <option key={d.id} value={d.id}>
                                                            {d.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <div style={{
                                                    fontSize: '11px',
                                                    color: '#FF5722',
                                                    padding: '8px',
                                                    background: 'rgba(255, 87, 34, 0.1)',
                                                    borderRadius: '4px'
                                                }}>
                                                    ⚠️ {t('cases.noQualifiedDetectives')}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })
            }

            {
                selectedCase && (
                    <CaseDetailModal
                        caseObj={selectedCase}
                        onClose={() => setSelectedCase(null)}
                    />
                )
            }
        </div >
    );
}
