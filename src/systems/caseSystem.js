import gameState from '../gameState.js';

let caseIdCounter = 1000;

// Rarity order for comparison
const RARITY_ORDER = {
    'COMMON': 1,
    'RARE': 2,
    'VETERAN': 3,
    'EPIC': 4
};

// Case difficulties with different parameters
const DIFFICULTIES = {
    COMMON: {
        name: 'Common',
        color: '#888888',
        rarity: 'COMMON',
        duration: 30,
        reward: 50,
        experienceReward: 25,
        requiredStats: { speed: 3, evidence: 3, intelligence: 3, risk: 2 }
    },
    RARE: {
        name: 'Rare',
        color: '#2196F3',
        rarity: 'RARE',
        duration: 60,
        reward: 150,
        experienceReward: 75,
        requiredStats: { speed: 5, evidence: 5, intelligence: 5, risk: 4 }
    },
    VETERAN: {
        name: 'Veteran',
        color: '#FFA000',
        rarity: 'VETERAN',
        duration: 120,
        reward: 400,
        experienceReward: 200,
        requiredStats: { speed: 7, evidence: 7, intelligence: 7, risk: 6 }
    },
    EPIC: {
        name: 'Epic',
        color: '#dc143c',
        rarity: 'EPIC',
        duration: 180,
        reward: 1000,
        experienceReward: 500,
        requiredStats: { speed: 9, evidence: 9, intelligence: 9, risk: 8 }
    }
};

// Case keys mapped to rarity
const CASE_KEYS = {
    'COMMON': ['Case1', 'Case2', 'Case7', 'Case9', 'Case10', 'CaseCommon1', 'CaseCommon2', 'CaseCommon3', 'CaseCommon4'],
    'RARE': ['Case3', 'Case4', 'Case8', 'CaseRare1', 'CaseRare2', 'CaseRare3'],
    'VETERAN': ['Case5', 'Case6', 'CaseVeteran1', 'CaseVeteran2'],
    'EPIC': ['EpicCase1', 'EpicCase2', 'EpicCase3', 'EpicCase4']
};

export function generateCase() {
    // Get highest unlocked detective rarity
    const unlockedDetectives = gameState.getUnlockedDetectives();
    if (unlockedDetectives.length === 0) return null;

    const highestRarity = unlockedDetectives.reduce((max, detective) => {
        const detectiveRarityLevel = RARITY_ORDER[detective.rarity] || 0;
        const maxRarityLevel = RARITY_ORDER[max] || 0;
        return detectiveRarityLevel > maxRarityLevel ? detective.rarity : max;
    }, 'COMMON');

    const maxRarityLevel = RARITY_ORDER[highestRarity];

    // Get available case keys based on unlocked rarities
    let availableCaseKeys = [];
    Object.entries(CASE_KEYS).forEach(([rarity, keys]) => {
        const caseRarityLevel = RARITY_ORDER[rarity] || 0;
        if (caseRarityLevel <= maxRarityLevel) {
            availableCaseKeys = availableCaseKeys.concat(keys.map(key => ({ key, rarity })));
        }
    });

    if (availableCaseKeys.length === 0) return null;

    // Select random case from available ones
    const selectedCase = availableCaseKeys[Math.floor(Math.random() * availableCaseKeys.length)];
    const caseKey = selectedCase.key;
    const rarity = selectedCase.rarity;
    const difficultyData = DIFFICULTIES[rarity];

    // Map case keys to sprites (reuse sprites for new cases)
    let spriteName = caseKey;
    if (caseKey.startsWith('CaseCommon')) {
        const sprites = ['Case1', 'Case2', 'Case7', 'Case9'];
        spriteName = sprites[Math.floor(Math.random() * sprites.length)];
    } else if (caseKey.startsWith('CaseRare')) {
        const sprites = ['Case3', 'Case4', 'Case8'];
        spriteName = sprites[Math.floor(Math.random() * sprites.length)];
    } else if (caseKey.startsWith('CaseVeteran')) {
        const sprites = ['Case5', 'Case6'];
        spriteName = sprites[Math.floor(Math.random() * sprites.length)];
    }

    const newCase = {
        id: caseIdCounter++,
        caseKey: caseKey, // Store the key for localization
        titleKey: `cases_data.${caseKey}.title`,
        title: `cases_data.${caseKey}.title`, // Fallback to key
        sprite: spriteName,
        difficulty: rarity,
        rarity: rarity,
        duration: difficultyData.duration,
        reward: difficultyData.reward,
        experienceReward: difficultyData.experienceReward,
        requiredStats: difficultyData.requiredStats,
        textIndex: 0,
        textVariantIndex: Math.floor(Math.random() * 3), // Random variant (0-2)
        assignedDetectiveId: null,
        startTime: null,
        progress: 0
    };

    return newCase;
}

export function canDetectiveSolveCase(detective, caseObj) {
    const stats = gameState.getDetectiveStats(detective.id) || detective;
    const required = caseObj.requiredStats;

    // Also check rarity - detective must be same or higher rarity than case
    const detectiveRarityLevel = RARITY_ORDER[detective.rarity] || 0;
    const caseRarityLevel = RARITY_ORDER[caseObj.rarity] || 0;

    if (detectiveRarityLevel < caseRarityLevel) return false;

    return (
        stats.speed >= required.speed &&
        stats.evidence >= required.evidence &&
        stats.intelligence >= required.intelligence &&
        stats.risk >= required.risk
    );
}

export function assignDetectiveToCase(detectiveId, caseId) {
    const detective = gameState.getDetectives().find(d => d.id === detectiveId);
    const caseObj = gameState.getCases().find(c => c.id === caseId);

    if (!detective || !caseObj) return false;
    if (detective.assigned) return false;
    if (caseObj.assignedDetectiveId) return false;
    if (!detective.unlocked) return false;
    if (!canDetectiveSolveCase(detective, caseObj)) return false;

    gameState.assignDetectiveToCase(detectiveId, caseId);
    return true;
}

export function updateCaseProgress() {
    const cases = gameState.getCases();
    const currentTime = Date.now();

    cases.forEach(caseObj => {
        // Paused if detective is injured
        if (caseObj.assignedDetectiveId) {
            const detective = gameState.getDetectives().find(d => d.id === caseObj.assignedDetectiveId);
            if (detective && detective.injured) {
                return;
            }
        }

        // Normal Detective Investigation
        if (caseObj.assignedDetectiveId && caseObj.startTime) {
            const elapsed = (currentTime - caseObj.startTime) / 1000;
            const efficiencyMult = gameState.getEfficiencyMultiplier();

            // Get Detective Stats for Bonus Speed
            const stats = gameState.getDetectiveStats(caseObj.assignedDetectiveId);
            let detectiveSpeedMult = 1.0;

            if (stats) {
                // Sum up all speed bonuses (percentage)
                // thinking_speed, evidence_speed, case_speed (arrival speed)
                // Treat them all as "Work Speed" for simplicity in this abstract logic
                const totalBonus = (stats.thinkingSpeed || 0) + (stats.evidenceSpeed || 0) + (stats.caseSpeed || 0);
                if (totalBonus > 0) {
                    detectiveSpeedMult += (totalBonus / 100);
                }
            }

            const progress = Math.min((elapsed / caseObj.duration) * 100 * efficiencyMult * detectiveSpeedMult, 100);

            // Update text index based on progress (0-3 stages)
            const textIndex = Math.min(Math.floor((progress / 100) * 4), 3);

            gameState.updateCase(caseObj.id, { progress, textIndex });

            if (progress >= 100) {
                gameState.completeCase(caseObj.id);
            }
        } else if (!caseObj.assignedDetectiveId && caseObj.rarity === 'COMMON' && gameState.hasAutoAssistant()) {
            if (!caseObj.startTime) {
                // Start "assistant" work now
                gameState.updateCase(caseObj.id, { startTime: currentTime });
            } else {
                const elapsed = (currentTime - caseObj.startTime) / 1000;
                // Assistants work at 50% speed base, but benefit from efficiency upgrades too
                const efficiencyMult = gameState.getEfficiencyMultiplier();
                const progress = Math.min((elapsed / caseObj.duration) * 100 * 0.5 * efficiencyMult, 100);

                // Generic text index update (0-3 stages)
                const textIndex = Math.min(Math.floor((progress / 100) * 4), 3);

                gameState.updateCase(caseObj.id, { progress, textIndex });

                if (progress >= 100) {
                    gameState.completeAssistantCase(caseObj.id);
                }
            }
        }
    });
}

export function autoAssignCases() {
    if (!gameState.getAutoAssignMode()) return;

    const availableDetectives = gameState.getAvailableDetectives();
    const unassignedCases = gameState.getCases().filter(c => !c.assignedDetectiveId);

    // Sort cases by rarity (highest first for auto-assign priority)
    const sortedCases = unassignedCases.sort((a, b) => {
        const rarityA = RARITY_ORDER[a.rarity] || 0;
        const rarityB = RARITY_ORDER[b.rarity] || 0;
        return rarityB - rarityA;
    });

    sortedCases.forEach(caseObj => {
        const suitableDetectives = availableDetectives.filter(d =>
            canDetectiveSolveCase(d, caseObj)
        );

        if (suitableDetectives.length > 0) {
            assignDetectiveToCase(suitableDetectives[0].id, caseObj.id);
        }
    });
}

export function getDifficultyData(difficulty) {
    return DIFFICULTIES[difficulty] || DIFFICULTIES.COMMON;
}

export { RARITY_ORDER };
