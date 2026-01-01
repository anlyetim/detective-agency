import React, { useEffect, useState } from 'react';
import { useLocalization } from '../LocalizationContext.jsx';

export default function NotificationPopup({ newNews }) {
    const { t } = useLocalization();
    const [isVisible, setIsVisible] = useState(false);
    const [currentNews, setCurrentNews] = useState(null);

    useEffect(() => {
        if (newNews) {
            setCurrentNews(newNews);
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 5000); // Hide after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [newNews]);

    if (!isVisible || !currentNews) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.9)',
            border: '2px solid #fff',
            borderRadius: '8px',
            padding: '12px',
            maxWidth: '280px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            transform: isVisible ? 'translateX(0)' : 'translateX(100px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            pointerEvents: 'none' // Don't block clicks
        }}>
            <img src="/assets/pics/icon_news.png" alt="News" style={{ width: '40px', height: '40px' }} />
            <div>
                <div style={{ color: '#dc143c', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {t('newspaper.title')}
                </div>
                <div style={{ color: '#fff', fontSize: '13px', lineHeight: '1.2' }}>
                    {currentNews.titleKey ? t(currentNews.titleKey) : currentNews.title}
                </div>
                <div style={{ color: '#aaa', fontSize: '10px', fontStyle: 'italic', marginTop: '2px' }}>
                    {currentNews.effectKey ? t(currentNews.effectKey) : (currentNews.effect || '')}
                </div>
            </div>
        </div>
    );
}
