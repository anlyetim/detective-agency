import React from 'react';

export default function BottomNav({ currentScreen, onNavigate }) {
    return (
        <div className="bottom-nav">
            <button
                className={`nav-button ${currentScreen === 'detectives' ? 'active' : ''}`}
                onClick={() => onNavigate('detectives')}
            >
                <img src="/assets/pics/icon_detectives_new.png" alt="Detectives" className="nav-icon" />
                <img src="/pics/icon_hat.png" alt="Detectives" className="nav-icon" />
            </button>

            <button
                className={`nav-button ${currentScreen === 'cases' ? 'active' : ''}`}
                onClick={() => onNavigate('cases')}
            >
                <img src="/pics/iconcase.png" alt="Cases" className="nav-icon" />
            </button>

            <button
                className={`nav-button ${currentScreen === 'upgrades' ? 'active' : ''}`}
                onClick={() => onNavigate('upgrades')}
            >
                <img src="/pics/icon_file.png" alt="Upgrades" className="nav-icon" />
            </button>

            <button
                className={`nav-button ${currentScreen === 'items' ? 'active' : ''}`}
                onClick={() => onNavigate('items')}
            >
                <img src="/pics/icon_item.png" alt="Items" className="nav-icon" />
            </button>

            <button
                className={`nav-button ${currentScreen === 'newspaper' ? 'active' : ''}`}
                onClick={() => onNavigate('newspaper')}
            >
                <img src="/pics/iconnews.png" alt="Newspaper" className="nav-icon" />
            </button>

            <button
                className={`nav-button ${currentScreen === 'settings' ? 'active' : ''}`}
                onClick={() => onNavigate('settings')}
            >
                <img src="/pics/icons_settings.png" alt="Settings" className="nav-icon" />
            </button>
        </div>
    );
}
