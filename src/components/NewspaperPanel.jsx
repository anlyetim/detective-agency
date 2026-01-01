import React, { useEffect, useState } from 'react';
import gameState from '../gameState.js';
import { useLocalization } from '../LocalizationContext.jsx';

export default function NewspaperPanel({ onStateChange }) {
    const { t } = useLocalization();
    const newsEvents = gameState.getNewsEvents();
    const [animationClass, setAnimationClass] = useState('entering');
    const crimeRate = gameState.getCrimeRate();

    // Determine header color based on crime rate
    const getHeaderColor = () => {
        if (crimeRate === 'CHAOS') return '#cc0000'; // Dark Red
        if (crimeRate === 'HIGH') return '#ff4444'; // Medium Red
        return '#666666'; // Gray (SAFE)
    };

    // Get crime rate label for display
    const getCrimeRateLabel = () => {
        if (crimeRate === 'CHAOS') return t('newspaper.crimeRate.chaos');
        if (crimeRate === 'HIGH') return t('newspaper.crimeRate.high');
        return t('newspaper.crimeRate.safe');
    };

    useEffect(() => {
        // Play sound effect
        const audio = new Audio('/assets/music/newspaper.wav');
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio play failed', e));

        return () => {
            // Mark all valid news as read when closing the paper
            gameState.markAllNewsRead();
            if (onStateChange) onStateChange();
        };
    }, []);

    // Format relative time (e.g., "2 hours ago")
    const formatTime = (timestamp) => {
        const diff = Math.floor((Date.now() - timestamp) / 60000); // minutes
        if (diff < 1) return t('newspaper.time.justNow');
        if (diff < 60) return `${diff} ${t('newspaper.time.minAgo')}`;
        const hours = Math.floor(diff / 60);
        return `${hours} ${hours > 1 ? t('newspaper.time.hoursAgo') : t('newspaper.time.hourAgo')}`;
    };

    return (
        <div className="newspaper-overlay">
            <div className="newspaper-panel">
                <h1 className="newspaper-title" style={{
                    fontFamily: 'Minecraftia, monospace',
                    textAlign: 'center',
                    fontSize: '24px',
                    margin: '20px 0 10px 0',
                    borderBottom: `2px solid ${getHeaderColor()}`,
                    paddingBottom: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    color: getHeaderColor(),
                    transition: 'all 0.5s ease',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span style={{ flex: 1, textAlign: 'center' }}>
                        {t('newspaper.title')}
                    </span>
                    <span style={{
                        fontSize: '12px',
                        fontFamily: 'Minecraftia, monospace',
                        background: getHeaderColor(),
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        letterSpacing: '1px',
                        fontWeight: 'bold',
                        transition: 'all 0.5s ease',
                        boxShadow: `0 0 10px ${getHeaderColor()}aa`
                    }}>
                        {getCrimeRateLabel()}
                    </span>
                </h1>

                {newsEvents.length === 0 ? (
                    <div className="newspaper-body" style={{ textAlign: 'center', fontStyle: 'italic', marginTop: '100px' }}>
                        {t('newspaper.noNews')}
                    </div>
                ) : (
                    newsEvents.map((event, index) => (
                        <div key={event.id} className={event.read ? "newspaper-read" : ""}>
                            <div className="newspaper-headline">
                                {event.titleKey ? t(event.titleKey) : event.title}
                            </div>
                            <div className="newspaper-date">
                                {formatTime(event.timestamp)}
                            </div>
                            <div className="newspaper-body">
                                {event.descriptionKey ? t(event.descriptionKey, {
                                    ...event.params,
                                    name: event.params && event.params.name && event.params.name.startsWith('items.') ? t(event.params.name) : (event.params ? event.params.name : '')
                                }) : event.description}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
