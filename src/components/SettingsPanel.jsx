import React from 'react';
import gameState from '../gameState.js';
import musicManager from '../systems/musicManager.js';
import { useLocalization } from '../LocalizationContext.jsx';

export default function SettingsPanel({ onStateChange }) {
    const { language, changeLanguage, t } = useLocalization();
    const settings = gameState.getSettings();

    const handleToggleMusic = () => {
        const newEnabled = musicManager.toggle();
        gameState.updateSettings({ musicEnabled: newEnabled });
        onStateChange();
    };

    const handleVolumeChange = (e) => {
        const volume = parseFloat(e.target.value);
        musicManager.setVolume(volume);
        gameState.updateSettings({ musicVolume: volume });
        onStateChange();
    };

    const handleLanguageChange = (e) => {
        changeLanguage(e.target.value);
        onStateChange();
    };

    const handleResetProgress = () => {
        // Use a safer confirmation method or double check
        if (window.confirm(t('settings.resetConfirm'))) {
            localStorage.removeItem('detectiveAgencyState');
            // Forcefully clear current state instance to prevent auto-save race condition
            if (gameState) {
                gameState.state = gameState.getDefaultState();
                gameState.saveState(); // Overwrite with clean state
            }
            location.reload();
        }
    };

    return (
        <div className="panel">
            <h1 className="panel-title">{t('settings.title')}</h1>

            <div className="card">
                <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>{t('settings.audio')}</h3>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                }}>
                    <span style={{ fontSize: '13px' }}>{t('settings.backgroundMusic')}</span>
                    <button
                        className="button"
                        onClick={handleToggleMusic}
                        style={{
                            background: settings.musicEnabled ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' : undefined
                        }}
                    >
                        {settings.musicEnabled ? t('cases.on') : t('cases.off')}
                    </button>
                </div>

                <div>
                    <label style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                        {t('settings.volume')}
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.musicVolume}
                        onChange={handleVolumeChange}
                        style={{ width: '100%' }}
                    />
                    <div style={{ fontSize: '11px', color: '#888', textAlign: 'right', marginTop: '4px' }}>
                        {Math.round(settings.musicVolume * 100)}%
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>{t('settings.language')}</h3>

                <select
                    value={language}
                    onChange={handleLanguageChange}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(0, 0, 0, 0.5)',
                        color: '#fff',
                        border: '2px solid var(--noir-crimson)',
                        borderRadius: '4px',
                        fontFamily: 'Minecraftia, monospace',
                        fontSize: '13px',
                        cursor: 'pointer'
                    }}
                >
                    <option value="en">English</option>
                    <option value="tr">Türkçe</option>
                </select>
            </div>

            <div className="card">
                <h3 style={{ fontSize: '15px', marginBottom: '12px' }}>{t('settings.gameInfo')}</h3>

                <div style={{ fontSize: '12px', color: '#aaa', lineHeight: '1.8' }}>
                    <div><strong style={{ color: '#fff' }}>{t('settings.game')}:</strong> Detective Agency</div>
                    <div><strong style={{ color: '#fff' }}>{t('settings.version')}:</strong> 1.0.0</div>
                    <div><strong style={{ color: '#fff' }}>{t('settings.type')}:</strong> Idle Management</div>
                    <div style={{ marginTop: '12px', fontSize: '11px', lineHeight: '1.6' }}>
                        {t('settings.description')}
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ fontSize: '15px', marginBottom: '12px', color: '#FF5722' }}>{t('settings.dangerZone')}</h3>

                <button
                    className="button"
                    onClick={handleResetProgress}
                    style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #8b0000 0%, #dc143c 100%)'
                    }}
                >
                    {t('settings.resetProgress')}
                </button>
            </div>

            <div style={{
                textAlign: 'center',
                fontSize: '10px',
                color: '#666',
                marginTop: '30px',
                paddingBottom: '20px'
            }}>
                {t('settings.footer')}
            </div>
        </div>
    );
}
