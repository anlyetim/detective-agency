import gameState from '../gameState.js';

// Idle system - handles offline progress
export function calculateIdleRewards() {
    const lastActiveTime = gameState.getLastActiveTime();
    const currentTime = Date.now();
    const elapsedSeconds = Math.floor((currentTime - lastActiveTime) / 1000);

    if (elapsedSeconds < 10) {
        // Less than 10 seconds, no rewards
        return null;
    }

    // Calculate rewards based on active detectives and time
    const activeDetectives = gameState.getActiveDetectives();
    const cases = gameState.getCases();

    let totalCurrency = 0;
    let totalExperience = 0;
    let casesCompleted = 0;

    // Process each assigned case
    // Process each assigned case
    cases.forEach(caseObj => {
        if (caseObj.assignedDetectiveId && caseObj.startTime) {
            const caseElapsed = Math.floor((currentTime - caseObj.startTime) / 1000);
            const completions = Math.floor(caseElapsed / caseObj.duration);

            if (completions > 0) {
                totalCurrency += caseObj.reward * completions;
                totalExperience += caseObj.experienceReward * completions;
                casesCompleted += completions;
            }
        }
    });

    // Check for cap (Level < 10, max 100 cases)
    if (gameState.getLevel() < 10 && casesCompleted > 100) {
        const ratio = 100 / casesCompleted;
        totalCurrency = Math.floor(totalCurrency * ratio);
        totalExperience = Math.floor(totalExperience * ratio);
        casesCompleted = 100;
    }

    // Base idle income (passive earnings)
    const baseIdleRate = 2; // 2 currency per second
    const passiveCurrency = Math.floor(elapsedSeconds * baseIdleRate);
    const passiveExperience = Math.floor(elapsedSeconds * 0.5);

    totalCurrency += passiveCurrency;
    totalExperience += passiveExperience;

    return {
        elapsedSeconds,
        currency: totalCurrency,
        experience: totalExperience,
        casesCompleted
    };
}

export function applyIdleRewards(rewards) {
    if (!rewards) return;

    gameState.addCurrency(rewards.currency);
    gameState.addExperience(rewards.experience);

    // Reset case timers for active cases
    const cases = gameState.getCases();
    const currentTime = Date.now();

    cases.forEach(caseObj => {
        if (caseObj.assignedDetectiveId && caseObj.startTime) {
            // Reset start time to current time
            gameState.updateCase(caseObj.id, { startTime: currentTime });
        }
    });
}

export function formatIdleTime(seconds) {
    if (seconds < 60) {
        return `${seconds} seconds`;
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
        const days = Math.floor(seconds / 86400);
        return `${days} day${days > 1 ? 's' : ''}`;
    }
}
