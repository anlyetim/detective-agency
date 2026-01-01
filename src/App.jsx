import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { createGame } from './game/config.js';
import gameState from './gameState.js';
import { calculateIdleRewards, applyIdleRewards, formatIdleTime } from './systems/idleSystem.js';
import { generateCase, updateCaseProgress, autoAssignCases } from './systems/caseSystem.js';
import { LocalizationProvider } from './LocalizationContext.jsx';

import BottomNav from './components/BottomNav.jsx';
import StatsDisplay from './components/StatsDisplay.jsx';
import DetectivesPanel from './components/DetectivesPanel.jsx';
import CasesPanel from './components/CasesPanel.jsx';
import ItemsPanel from './components/ItemsPanel.jsx';
import NewspaperPanel from './components/NewspaperPanel.jsx';
import UpgradesPanel from './components/UpgradesPanel.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import IdlePopup from './components/IdlePopup.jsx';
import InjuryNotification from './components/InjuryNotification.jsx';

function App() {
    const gameRef = useRef(null);
    const [currentScreen, setCurrentScreen] = useState('cases');
    const [, forceUpdate] = useState(0);
    const [idleRewards, setIdleRewards] = useState(null);
    const [injuredDetective, setInjuredDetective] = useState(null);

    // Dynamic Mood System
    const crimeRate = gameState.getCrimeRate();
    let moodClass = 'mood-safe';
    if (crimeRate === 'HIGH') moodClass = 'mood-unstable';
    if (crimeRate === 'CHAOS') moodClass = 'mood-chaos';

    useEffect(() => {
        if (!gameRef.current) {
            gameRef.current = createGame();
        }

        // Passive income disabled as per user request
        /*
        const rewards = calculateIdleRewards();
        if (rewards) {
            setIdleRewards(rewards);
        }
        */

        const gameLoop = setInterval(() => {
            updateCaseProgress();
            gameState.updateNews();
            forceUpdate(prev => prev + 1);
        }, 1000);

        const caseGenerator = setInterval(() => {
            const cases = gameState.getCases();
            if (cases.length < 5) {
                const newCase = generateCase();
                if (newCase) {
                    gameState.addCase(newCase);
                    autoAssignCases();
                }
                forceUpdate(prev => prev + 1);
            }
        }, 15000);

        // Register injury callback
        gameState.onDetectiveInjured = (detective) => {
            setInjuredDetective(detective);
        };

        return () => {
            clearInterval(gameLoop);
            clearInterval(caseGenerator);
            gameState.onDetectiveInjured = null;
        };
    }, []);

    const handleCloseIdlePopup = () => {
        try {
            if (idleRewards) {
                applyIdleRewards(idleRewards);
                forceUpdate(prev => prev + 1);
            }
        } catch (error) {
            console.error('Error applying idle rewards:', error);
        } finally {
            setIdleRewards(null);
        }
    };

    const handleStateChange = () => {
        forceUpdate(prev => prev + 1);
    };

    return (
        <LocalizationProvider>
            <div className={`app-container ${moodClass}`}>
                <div id="game-container"></div>

                <div className="ui-overlay">
                    <div className="top-bar">
                        <StatsDisplay />
                    </div>

                    <div className="main-content">
                        {currentScreen === 'detectives' && (
                            <DetectivesPanel onStateChange={handleStateChange} />
                        )}
                        {currentScreen === 'cases' && (
                            <CasesPanel onStateChange={handleStateChange} />
                        )}
                        {currentScreen === 'items' && (
                            <ItemsPanel onStateChange={handleStateChange} />
                        )}
                        {currentScreen === 'upgrades' && (
                            <UpgradesPanel onStateChange={handleStateChange} />
                        )}
                        {currentScreen === 'newspaper' && (
                            <NewspaperPanel onStateChange={handleStateChange} />
                        )}
                        {currentScreen === 'settings' && (
                            <SettingsPanel onStateChange={handleStateChange} />
                        )}
                    </div>

                    <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
                </div>

                {/* Idle popup disabled
                {idleRewards && (
                    <IdlePopup rewards={idleRewards} onClose={handleCloseIdlePopup} />
                )}
                */}

                {injuredDetective && (
                    <InjuryNotification
                        detective={injuredDetective}
                        onClose={() => setInjuredDetective(null)}
                    />
                )}
            </div>
        </LocalizationProvider>
    );
}

export default App;
