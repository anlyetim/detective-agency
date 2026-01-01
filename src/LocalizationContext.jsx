import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from './locales/en.json';
import trTranslations from './locales/tr.json';

const translations = {
    en: enTranslations,
    tr: trTranslations
};

const LocalizationContext = createContext();

export function LocalizationProvider({ children }) {
    const [language, setLanguage] = useState('tr');

    useEffect(() => {
        // Load saved language from localStorage
        const saved = localStorage.getItem('gameLanguage');
        if (saved && translations[saved]) {
            setLanguage(saved);
        } else {
            // Default to Turkish if no saved preference
            setLanguage('tr');
            localStorage.setItem('gameLanguage', 'tr');
        }
    }, []);

    const changeLanguage = (lang) => {
        if (translations[lang]) {
            setLanguage(lang);
            localStorage.setItem('gameLanguage', lang);
        }
    };

    const t = (key, params = {}) => {
        const keys = key.split('.');
        let value = translations[language];

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key; // Return key if translation not found
            }
        }

        let text = value || key;

        // Simple interpolation: replace {key} with params[key]
        if (params && typeof text === 'string') {
            Object.keys(params).forEach(paramKey => {
                text = text.replace(new RegExp(`{${paramKey}}`, 'g'), params[paramKey]);
            });
        }

        return text;
    };

    return (
        <LocalizationContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LocalizationContext.Provider>
    );
}

export function useLocalization() {
    const context = useContext(LocalizationContext);
    if (!context) {
        throw new Error('useLocalization must be used within LocalizationProvider');
    }
    return context;
}
