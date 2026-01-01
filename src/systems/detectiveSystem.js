// Detective system - manage detective roster and upgrades

export function getDetectiveById(detectives, id) {
    return detectives.find(d => d.id === id);
}

export function calculateDetectiveScore(detective) {
    return detective.speed + detective.evidence + detective.intelligence + detective.risk;
}

export function getDetectiveRank(score) {
    if (score >= 30) return { name: 'Master', nameKey: 'detectives.ranks.master', color: '#9C27B0' };
    if (score >= 25) return { name: 'Expert', nameKey: 'detectives.ranks.expert', color: '#FF5722' };
    if (score >= 20) return { name: 'Veteran', nameKey: 'detectives.ranks.veteran', color: '#FFC107' };
    if (score >= 15) return { name: 'Skilled', nameKey: 'detectives.ranks.skilled', color: '#4CAF50' };
    return { name: 'Rookie', nameKey: 'detectives.ranks.rookie', color: '#607D8B' };
}

export function canUpgradeDetective(detective, stat, currency) {
    const currentValue = detective[stat];
    const upgradeCost = calculateUpgradeCost(currentValue);

    return currency >= upgradeCost && currentValue < 10;
}

export function calculateUpgradeCost(currentValue) {
    // Cost increases exponentially
    return Math.floor(100 * Math.pow(1.5, currentValue));
}

export function upgradeDetectiveStat(detective, stat, gameState) {
    const currentValue = detective[stat];
    const cost = calculateUpgradeCost(currentValue);

    if (gameState.getCurrency() >= cost && currentValue < 10) {
        // Deduct currency
        gameState.addCurrency(-cost);

        // Upgrade stat
        const detectives = gameState.getDetectives();
        const targetDetective = detectives.find(d => d.id === detective.id);
        if (targetDetective) {
            targetDetective[stat]++;
            gameState.saveState();
            return true;
        }
    }

    return false;
}
