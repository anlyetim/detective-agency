import React, { useState, useEffect } from 'react';
import { useLocalization } from '../LocalizationContext.jsx';

const RARITY_COLORS = {
    'COMMON': '#888888',
    'RARE': '#2196F3',
    'VETERAN': '#FFA000',
    'EPIC': '#dc143c'
};

function getStageText(progress, t) {
    if (progress < 20) return t('investigation.stages.0');
    if (progress < 40) return t('investigation.stages.20');
    if (progress < 60) return t('investigation.stages.40');
    if (progress < 80) return t('investigation.stages.60');
    if (progress < 100) return t('investigation.stages.80');
    return t('investigation.stages.100');
}

export default function CaseDetailModal({ caseObj, onClose, onProgressUpdate }) {
    const { t } = useLocalization();
    const [displayedText, setDisplayedText] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentProgress, setCurrentProgress] = useState(caseObj.progress || 0);

    const rarityColor = RARITY_COLORS[caseObj.rarity] || '#888888';
    const isEpic = caseObj.difficulty === 'EPIC';

    // Get current stage text based on progress using localization
    let currentStageText = '';
    let textsKey = '';

    if (currentProgress >= 100) {
        currentStageText = t('investigation.stages.100');
    } else if (caseObj.caseKey) {
        // Calculate which stage we're at (0-3 for most cases)
        const stageIndex = Math.min(Math.floor(currentProgress / 25), 3);

        // Get the text variants for this stage from localization
        textsKey = `cases_data.${caseObj.caseKey}.texts.${stageIndex}`;
        const textVariants = t(textsKey);

        if (Array.isArray(textVariants)) {
            // Select a random variant (consistent for the current stage)
            const variantIndex = caseObj.textVariantIndex !== undefined ?
                caseObj.textVariantIndex :
                Math.floor(Math.random() * textVariants.length);
            currentStageText = textVariants[variantIndex] || t('investigation.stages.0');
        } else {
            // Fallback to generic text
            currentStageText = getStageText(currentProgress, t);
        }
    }

    // Fallback to generic text if no specific text found
    if (!currentStageText || currentStageText === textsKey) {
        currentStageText = getStageText(currentProgress, t);
    }

    // Update progress from parent component in real-time
    useEffect(() => {
        setCurrentProgress(caseObj.progress || 0);
    }, [caseObj.progress]);

    // Typewriter animation for stage text
    useEffect(() => {
        setIsAnimating(true);
        setDisplayedText('');

        let index = 0;
        const interval = setInterval(() => {
            if (index < currentStageText.length) {
                setDisplayedText(currentStageText.substring(0, index + 1));
                index++;
            } else {
                setIsAnimating(false);
                clearInterval(interval);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [currentStageText]);

    return (
        <>
            <div className="popup-backdrop" onClick={onClose}></div>
            <div
                className="idle-popup"
                style={{
                    boxShadow: `0 8px 32px ${rarityColor}80, 0 0 60px ${rarityColor}40`,
                    border: `3px solid ${rarityColor}`
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                        src={`/pics/${caseObj.sprite}.png`}
                        alt={caseObj.title}
                        style={{
                            maxWidth: '200px',
                            maxHeight: '200px',
                            filter: `drop-shadow(0 0 ${isEpic ? '20px' : '10px'} ${rarityColor}80)`
                        }}
                    />
                </div>

                <h2
                    className="panel-title"
                    style={{
                        marginBottom: '16px',
                        fontSize: '18px',
                        color: rarityColor
                    }}
                >
                    {t(caseObj.title)}
                </h2>

                <div style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    minHeight: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{
                        fontSize: isEpic ? '13px' : '12px',
                        lineHeight: '1.6',
                        color: '#fff',
                        fontStyle: 'italic',
                        textAlign: 'center'
                    }}>
                        {displayedText}
                        {isAnimating && <span style={{ opacity: 0.5 }}>▌</span>}
                    </div>
                </div>

                {/* Progress bar removed for narrative focus */}

                <button
                    className="button"
                    onClick={onClose}
                    style={{ width: '100%' }}
                >
                    {t('common.close')}
                </button>
            </div>
        </>
    );
}
