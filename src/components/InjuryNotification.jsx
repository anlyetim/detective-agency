import React, { useState, useEffect } from 'react';
import { useLocalization } from '../LocalizationContext.jsx';
import './InjuryNotification.css';

export default function InjuryNotification({ detective, onClose }) {
    const { t } = useLocalization();
    const [displayedTitle, setDisplayedTitle] = useState('');
    const [displayedSubtitle, setDisplayedSubtitle] = useState('');
    const [isAnimating, setIsAnimating] = useState(true);
    const [slideIn, setSlideIn] = useState(false);

    const title = t('injury.notification.title');
    const subtitle = t('injury.notification.subtitle', { name: detective.name });

    useEffect(() => {
        // Start slide-in immediately
        const slideTimer = setTimeout(() => setSlideIn(true), 50);

        let titleIndex = 0;
        let subtitleIndex = 0;
        let animationFrameId;
        let stage = 'title'; // 'title', 'subtitle', 'done'

        const animate = () => {
            if (stage === 'title') {
                if (titleIndex <= title.length) {
                    setDisplayedTitle(title.substring(0, titleIndex));
                    titleIndex++;
                    // Faster typing for title
                    setTimeout(() => requestAnimationFrame(animate), 30);
                } else {
                    stage = 'subtitle';
                    setTimeout(() => requestAnimationFrame(animate), 300); // 300ms pause before subtitle
                }
            } else if (stage === 'subtitle') {
                if (subtitleIndex <= subtitle.length) {
                    setDisplayedSubtitle(subtitle.substring(0, subtitleIndex));
                    subtitleIndex++;
                    // Standard typing for subtitle
                    setTimeout(() => requestAnimationFrame(animate), 20);
                } else {
                    stage = 'done';
                    setIsAnimating(false);
                    // Shorter reading time (3s instead of 4s)
                    setTimeout(() => {
                        setSlideIn(false);
                        setTimeout(onClose, 500);
                    }, 3000);
                }
            }
        };

        // Start animation after a short delay to allow slide-in to start
        const startTimer = setTimeout(() => {
            requestAnimationFrame(animate);
        }, 150);

        return () => {
            clearTimeout(slideTimer);
            clearTimeout(startTimer);
            // We can't cancel the recursive setTimeouts easily without refs, 
            // but component unmount will stop state updates safely.
        };
    }, []); // Empty dependency array - run once on mount

    return (
        <>
            <div className="injury-backdrop" onClick={onClose}></div>
            <div className={`injury-notification ${slideIn ? 'slide-in' : ''}`}>
                <div className="injury-panel">
                    {/* Removed emoji icon as requested */}
                    <div className="injury-content">
                        <h2 className="injury-title">
                            {displayedTitle}
                            {isAnimating && displayedSubtitle.length === 0 && <span className="cursor">▌</span>}
                        </h2>
                        <p className="injury-subtitle">
                            {displayedSubtitle}
                            {isAnimating && displayedSubtitle.length > 0 && <span className="cursor">▌</span>}
                        </p>
                        {detective.injuryType && !isAnimating && (
                            <div className="injury-type">
                                <span className="injury-type-label">{t(`injury.types.${detective.injuryType}`)}</span>
                                <span className="injury-description">{t(`injury.descriptions.${detective.injuryType}`)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
