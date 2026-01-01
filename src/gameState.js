// Centralized game state management with detective unlocks and items
class GameState {
    constructor() {
        this.loadState();
    }

    // Upgrade Definitions (Static)
    static UPGRADES = {
        AUTO_ASSISTANT: {
            id: 'auto_assistant',
            name: 'Field Assistants',
            baseCost: 500,
            costScale: 1.5,
            maxLevel: 1
        },
        RISK_MGMT: {
            id: 'risk_mgmt',
            name: 'Risk Management',
            baseCost: 100,
            costScale: 1.2,
            maxLevel: 50
        },
        EFFICIENCY: {
            id: 'efficiency',
            name: 'Logistics Network',
            baseCost: 200,
            costScale: 1.3,
            maxLevel: 20
        },
        RECOVERY: {
            id: 'recovery',
            name: 'Medical Retainer',
            baseCost: 300,
            costScale: 1.4,
            maxLevel: 10
        }
    };

    // Default game state
    getDefaultState() {
        return {
            currency: 1000,
            experience: 0,
            level: 1,
            lastActiveTime: Date.now(),
            autoAssignMode: false,

            // Newspaper / City State
            crimeRate: 'MEDIUM', // LOW, MEDIUM, HIGH, CHAOS
            newsEvents: [],
            nextEventId: 1,

            // Agency Upgrades (id: level)
            upgrades: {
                auto_assistant: 0, // Level 0 default
                risk_mgmt: 0,
                efficiency: 0,
                recovery: 0
            },

            // City Mood Influence (0-100), 50 = Stable
            moodInfluence: 50,

            // Detective unlock system
            detectives: [
                // COMMON - Starting detective (unlocked)
                {
                    id: 6,
                    name: 'Rookie Blake',
                    nameKey: 'detectives.names.rookie_blake',
                    sprite: 'Detective6',
                    rarity: 'COMMON',
                    unlocked: true,
                    speed: 4,
                    evidence: 4,
                    intelligence: 4,
                    risk: 3,
                    assigned: false,
                    caseId: null,
                    equipment: [null, null, null, null] // 4 item slots
                },
                // RARE
                {
                    id: 1,
                    name: 'Detective Noir',
                    nameKey: 'detectives.names.detective_noir',
                    sprite: 'Detective1',
                    rarity: 'RARE',
                    unlocked: false,
                    unlockTask: 'Solve 3 Common cases',
                    unlockTaskKey: 'detectives.tasks.solve_3_common',
                    unlockProgress: 0,
                    unlockRequired: 3,
                    speed: 6,
                    evidence: 7,
                    intelligence: 7,
                    risk: 4,
                    assigned: false,
                    caseId: null,
                    equipment: [null, null, null, null],
                    injured: false,
                    injuryHealTime: null
                },
                {
                    id: 2,
                    name: 'Agent Shadow',
                    nameKey: 'detectives.names.agent_shadow',
                    sprite: 'Detective2',
                    rarity: 'RARE',
                    unlocked: false,
                    unlockTask: 'Earn 500 coins',
                    unlockTaskKey: 'detectives.tasks.earn_500_coins',
                    unlockProgress: 0,
                    unlockRequired: 500,
                    speed: 7,
                    evidence: 6,
                    intelligence: 6,
                    risk: 6,
                    assigned: false,
                    caseId: null,
                    equipment: [null, null, null, null],
                    injured: false,
                    injuryHealTime: null
                },
                // VETERAN
                {
                    id: 4,
                    name: 'Inspector Steel',
                    nameKey: 'detectives.names.inspector_steel',
                    sprite: 'Detective4',
                    rarity: 'VETERAN',
                    unlocked: false,
                    unlockTask: 'Solve 10 cases total',
                    unlockTaskKey: 'detectives.tasks.solve_10_total',
                    unlockProgress: 0,
                    unlockRequired: 10,
                    speed: 7,
                    evidence: 8,
                    intelligence: 8,
                    risk: 5,
                    assigned: false,
                    caseId: null,
                    equipment: [null, null, null, null],
                    injured: false,
                    injuryHealTime: null
                },
                {
                    id: 5,
                    name: 'Detective Crimson',
                    nameKey: 'detectives.names.detective_crimson',
                    sprite: 'Detective5',
                    rarity: 'VETERAN',
                    unlocked: false,
                    unlockTask: 'Equip 4 items on any detective',
                    unlockTaskKey: 'detectives.tasks.equip_4_items',
                    unlockProgress: 0,
                    unlockRequired: 4,
                    speed: 8,
                    evidence: 7,
                    intelligence: 7,
                    risk: 6,
                    assigned: false,
                    caseId: null,
                    equipment: [null, null, null, null],
                    injured: false,
                    injuryHealTime: null
                },
                // EPIC
                {
                    id: 3,
                    name: 'Master Phantom',
                    nameKey: 'detectives.names.master_phantom',
                    sprite: 'Detective3',
                    rarity: 'EPIC',
                    unlocked: false,
                    unlockTask: 'Complete 2 Veteran cases',
                    unlockTaskKey: 'detectives.tasks.complete_2_veteran',
                    unlockProgress: 0,
                    unlockRequired: 2,
                    speed: 9,
                    evidence: 9,
                    intelligence: 9,
                    risk: 7,
                    assigned: false,
                    caseId: null,
                    equipment: [null, null, null, null],
                    injured: false,
                    injuryHealTime: null
                },
                {
                    id: 7,
                    name: 'Legendary Oracle',
                    nameKey: 'detectives.names.legendary_oracle',
                    sprite: 'Detective7',
                    rarity: 'EPIC',
                    unlocked: false,
                    unlockTask: 'Reach Agency Level 10',
                    unlockTaskKey: 'detectives.tasks.reach_level_10',
                    unlockProgress: 0,
                    unlockRequired: 10,
                    speed: 9,
                    evidence: 8,
                    intelligence: 10,
                    risk: 8,
                    assigned: false,
                    caseId: null,
                    equipment: [null, null, null, null],
                    injured: false,
                    injuryHealTime: null
                }
            ],

            cases: [],
            completedCases: 0,
            completedCommonCases: 0,
            completedVeteranCases: 0,
            totalCoinsEarned: 0,

            // Item inventory
            items: [],
            nextItemId: 1,

            settings: {
                musicEnabled: true,
                musicVolume: 0.3
            }
        };
    }

    // Load state from localStorage
    loadState() {
        const saved = localStorage.getItem('detectiveAgencyState');
        if (saved) {
            try {
                this.state = JSON.parse(saved);
                // Ensure new fields exist
                if (!this.state.items) this.state.items = [];
                if (!this.state.nextItemId) this.state.nextItemId = 1;
                if (!this.state.completedCommonCases) this.state.completedCommonCases = 0;
                if (!this.state.completedVeteranCases) this.state.completedVeteranCases = 0;
                if (!this.state.totalCoinsEarned) this.state.totalCoinsEarned = 0;
                if (!this.state.crimeRate) this.state.crimeRate = 'MEDIUM';
                if (!this.state.newsEvents) this.state.newsEvents = [];
                if (!this.state.nextEventId) this.state.nextEventId = 1;
                // Ensure all detectives have injury and equipment fields
                this.state.detectives.forEach(d => {
                    if (d.injured === undefined) d.injured = false;
                    if (d.injuryHealTime === undefined) d.injuryHealTime = null;
                    if (!d.equipment || !Array.isArray(d.equipment)) d.equipment = [null, null, null, null];
                });
            } catch (e) {
                console.error('Failed to load state:', e);
                this.state = this.getDefaultState();
            }
        } else {
            this.state = this.getDefaultState();
        }
    }

    // Save state to localStorage
    saveState() {
        this.state.lastActiveTime = Date.now();
        localStorage.setItem('detectiveAgencyState', JSON.stringify(this.state));
    }

    // Getters
    getCurrency() { return this.state.currency; }
    getExperience() { return this.state.experience; }
    getLevel() { return this.state.level; }
    getDetectives() { return this.state.detectives; }
    getUnlockedDetectives() { return this.state.detectives.filter(d => d.unlocked); }
    getLockedDetectives() { return this.state.detectives.filter(d => !d.unlocked); }
    getCases() { return this.state.cases; }
    getAutoAssignMode() { return this.state.autoAssignMode; }
    getSettings() { return this.state.settings; }
    getLastActiveTime() { return this.state.lastActiveTime; }
    getItems() { return this.state.items; }
    hasEpicDetective() {
        return this.state.detectives.some(d => d.unlocked && d.rarity === 'EPIC');
    }

    // Newspaper getters/setters
    getCrimeRate() { return this.state.crimeRate; }
    getNewsEvents() { return this.state.newsEvents; }

    setCrimeRate(rate) {
        this.state.crimeRate = rate;
        this.saveState();
    }



    healDetective(detectiveId, useCurrency = false) {
        const detective = this.state.detectives.find(d => d.id === detectiveId);
        if (detective && detective.injured) {
            if (useCurrency) {
                const cost = 200;
                if (this.state.currency >= cost) {
                    this.state.currency -= cost;
                    detective.injured = false;
                    detective.injuryHealTime = null;
                    this.saveState();
                    return true;
                }
                return false;
            } else {
                // Check if heal time has passed
                if (Date.now() >= detective.injuryHealTime) {
                    detective.injured = false;
                    detective.injuryHealTime = null;
                    this.saveState();
                    return true;
                }
                return false;
            }
        }
        return false;
    }

    updateInjuries() {
        // Auto-heal detectives whose time has passed
        this.state.detectives.forEach(detective => {
            if (detective.injured && detective.injuryHealTime && Date.now() >= detective.injuryHealTime) {
                detective.injured = false;
                detective.injuryHealTime = null;
            }
        });
        this.saveState();
    }

    getAvailableDetectives() {
        return this.state.detectives.filter(d => d.unlocked && !d.assigned && !d.injured);
    }
    addCurrency(amount) {
        this.state.currency += amount;
        if (amount > 0) {
            this.state.totalCoinsEarned += amount;
            this.checkUnlocks();
        }
        this.saveState();
    }

    addExperience(amount) {
        this.state.experience += amount;
        const newLevel = Math.floor(this.state.experience / 100) + 1;
        if (newLevel > this.state.level) {
            this.state.level = newLevel;
            this.checkUnlocks();
        }
        this.saveState();
    }

    // Newspaper System
    updateNews() {
        // Chance to generate new event
        if (Math.random() < 0.001) { // roughly every 16 seconds at 60fps called from game loop? No, this will be called every second from App.js
            // Wait, App.js calls gameLoop every 1000ms. 0.001 is too low 1/1000. 
            // If called every second, 0.001 means 1 in 1000 seconds ~ 16 mins.
            // Let's make it more frequent. Maybe 5% chance every second? ~every 20 seconds.
            // Or better, just track time.
        }
    }



    // We'll replace the whole block later.


    addCase(caseData) {
        this.state.cases.push(caseData);
        this.saveState();
    }

    removeCase(caseId) {
        this.state.cases = this.state.cases.filter(c => c.id !== caseId);
        this.saveState();
    }

    updateCase(caseId, updates) {
        const caseIndex = this.state.cases.findIndex(c => c.id === caseId);
        if (caseIndex !== -1) {
            this.state.cases[caseIndex] = { ...this.state.cases[caseIndex], ...updates };
            this.saveState();
        }
    }

    assignDetectiveToCase(detectiveId, caseId) {
        const detective = this.state.detectives.find(d => d.id === detectiveId);
        if (detective) {
            detective.assigned = true;
            detective.caseId = caseId;

            const caseObj = this.state.cases.find(c => c.id === caseId);
            if (caseObj) {
                caseObj.assignedDetectiveId = detectiveId;
                caseObj.startTime = Date.now();
                caseObj.textIndex = 0;
            }

            this.saveState();
        }
    }

    unassignDetective(detectiveId) {
        const detective = this.state.detectives.find(d => d.id === detectiveId);
        if (detective) {
            const caseId = detective.caseId;
            detective.assigned = false;
            detective.caseId = null;

            if (caseId) {
                const caseObj = this.state.cases.find(c => c.id === caseId);
                if (caseObj) {
                    caseObj.assignedDetectiveId = null;
                    caseObj.startTime = null;
                }
            }

            this.saveState();
        }
    }

    completeCase(caseId) {
        const caseObj = this.state.cases.find(c => c.id === caseId);
        if (caseObj && caseObj.assignedDetectiveId) {
            this.unassignDetective(caseObj.assignedDetectiveId);
            this.addCurrency(caseObj.reward);
            this.addExperience(caseObj.experienceReward);

            // Track case completion by difficulty
            if (caseObj.difficulty === 'COMMON') this.state.completedCommonCases++;
            if (caseObj.difficulty === 'VETERAN') this.state.completedVeteranCases++;

            this.removeCase(caseId);
            this.state.completedCases++;

            // Random item drop
            if (Math.random() < 0.3) {
                this.addItem(this.generateRandomItem());
            }

            this.checkUnlocks();
            this.saveState();
        }
    }

    toggleAutoAssign() {
        this.state.autoAssignMode = !this.state.autoAssignMode;
        this.saveState();
    }

    updateSettings(settings) {
        this.state.settings = { ...this.state.settings, ...settings };
        this.saveState();
    }



    getActiveDetectives() {
        return this.state.detectives.filter(d => d.unlocked && d.assigned);
    }

    // Item system
    addItem(item) {
        item.id = this.state.nextItemId++;
        this.state.items.push(item);
        this.saveState();
    }

    removeItem(itemId) {
        this.state.items = this.state.items.filter(i => i.id !== itemId);
        this.saveState();
    }

    equipItem(detectiveId, itemId, slotIndex) {
        const detective = this.state.detectives.find(d => d.id === detectiveId);
        const item = this.state.items.find(i => i.id === itemId);

        if (detective && item && slotIndex >= 0 && slotIndex < 4) {
            // Unequip current item in slot if any
            if (detective.equipment[slotIndex]) {
                detective.equipment[slotIndex] = null;
            }

            // Equip new item
            detective.equipment[slotIndex] = itemId;
            this.checkUnlocks();
            this.saveState();
        }
    }

    unequipItem(detectiveId, slotIndex) {
        const detective = this.state.detectives.find(d => d.id === detectiveId);
        if (detective && slotIndex >= 0 && slotIndex < 4) {
            detective.equipment[slotIndex] = null;
            this.saveState();
        }
    }

    generateRandomItem() {
        const { ITEM_DEFINITIONS } = require('./systems/itemSystem.js');
        const itemIds = Object.keys(ITEM_DEFINITIONS);
        const randomId = itemIds[Math.floor(Math.random() * itemIds.length)];

        return {
            id: this.state.nextItemId++,
            definitionId: randomId,
            level: 1
        };
    }

    getDetectiveStats(detectiveId) {
        const detective = this.state.detectives.find(d => d.id === detectiveId);
        if (!detective) return null;

        let stats = {
            speed: detective.speed,
            evidence: detective.evidence,
            intelligence: detective.intelligence,
            risk: detective.risk,
            // Modifiers
            injuryReduction: 0,
            healingSpeed: 0,
            caseSpeed: 0,
            evidenceSpeed: 0,
            thinkingSpeed: 0,
            dodgeChance: 0,
            incomeBoost: 0
        };

        // Apply equipment bonuses
        if (detective.equipment && Array.isArray(detective.equipment)) {
            detective.equipment.forEach(itemId => {
                if (itemId) {
                    const item = this.state.items.find(i => i.id === itemId);
                    if (item && item.definitionId) {
                        const def = this.getItemDefinition(item.definitionId);
                        const effectValue = this.getItemEffect(item);

                        if (def && effectValue > 0) {
                            switch (def.effectType) {
                                case 'stat_speed':
                                    stats.speed += effectValue;
                                    break;
                                case 'stat_evidence':
                                    stats.evidence += effectValue;
                                    break;
                                case 'stat_intelligence':
                                    stats.intelligence += effectValue;
                                    break;
                                case 'stat_risk':
                                    stats.risk += effectValue;
                                    break;
                                case 'injury_reduction':
                                    stats.injuryReduction += effectValue;
                                    break;
                                case 'healing_speed':
                                    stats.healingSpeed += effectValue;
                                    break;
                                case 'case_speed':
                                    stats.caseSpeed += effectValue;
                                    break;
                                case 'evidence_speed':
                                    stats.evidenceSpeed += effectValue;
                                    break;
                                case 'thinking_speed':
                                    stats.thinkingSpeed += effectValue;
                                    break;
                                case 'dodge_chance':
                                    stats.dodgeChance += effectValue;
                                    break;
                                case 'income_boost':
                                    stats.incomeBoost += effectValue;
                                    break;
                            }
                        }
                    }
                }
            });
        }

        return stats;
    }

    checkUnlocks() {
        this.state.detectives.forEach(detective => {
            if (detective.unlocked) return;

            let progress = 0;

            if (detective.unlockTask.includes('Common cases')) {
                progress = this.state.completedCommonCases;
            } else if (detective.unlockTask.includes('coins')) {
                progress = this.state.totalCoinsEarned;
            } else if (detective.unlockTask.includes('cases total')) {
                progress = this.state.completedCases;
            } else if (detective.unlockTask.includes('Equip 4 items')) {
                const equipped = this.state.detectives.reduce((acc, d) => {
                    return acc + d.equipment.filter(e => e !== null).length;
                }, 0);
                progress = equipped >= 4 ? 4 : equipped;
            } else if (detective.unlockTask.includes('Veteran cases')) {
                progress = this.state.completedVeteranCases;
            } else if (detective.unlockTask.includes('Level')) {
                progress = this.state.level;
            }

            detective.unlockProgress = progress;

            if (progress >= detective.unlockRequired) {
                detective.unlocked = true;
            }
        });
    }

    // Newspaper & Injury System
    getCrimeRate() {
        const influence = this.state.moodInfluence !== undefined ? this.state.moodInfluence : 50;
        if (influence >= 90) return 'CHAOS';
        if (influence >= 75) return 'HIGH';
        if (influence <= 25) return 'LOW';
        return 'MEDIUM';
    }

    getNewsEvents() {
        return this.state.newsEvents || [];
    }

    updateNews() {
        // Mood Influence Decay (Trend towards 50)
        // Decay happens once per second (called by game loop)
        if (this.state.moodInfluence !== undefined) {
            if (this.state.moodInfluence > 50) this.state.moodInfluence = Math.max(50, this.state.moodInfluence - 0.5); // Slow decay down
            else if (this.state.moodInfluence < 50) this.state.moodInfluence = Math.min(50, this.state.moodInfluence + 0.5); // Slow recovery up
        } else {
            this.state.moodInfluence = 50;
        }

        // 5% chance every second to generate news
        if (Math.random() < 0.05) {
            this.generateNewsEvent();
        }

        // Random Injury Risk for assigned detectives
        // Higher risk if CHAOS or HIGH crime, and modified by upgrades
        // Random Injury Risk for assigned detectives
        // Reduced frequency based on user feedback (too high even when safe)
        // Checks once per second globally
        let baseRisk = 0.001; // 0.1% chance per second (Safe)
        if (this.state.crimeRate === 'CHAOS') baseRisk = 0.04; // 4% (Chaos)
        else if (this.state.crimeRate === 'HIGH') baseRisk = 0.015; // 1.5% (High)
        else if (this.state.crimeRate === 'MEDIUM') baseRisk = 0.005; // 0.5% (Medium)

        // Apply Risk Management Upgrade
        const riskReduction = this.getRiskReduction();
        const injuryChance = baseRisk * (1 - riskReduction);

        if (Math.random() < injuryChance) {
            const assignedDetectives = this.state.detectives.filter(d => d.assigned && !d.injured);
            if (assignedDetectives.length > 0) {
                const victim = assignedDetectives[Math.floor(Math.random() * assignedDetectives.length)];
                this.injureDetective(victim.id);
            }
        }

        // Heal injured detectives naturally
        const now = Date.now();
        let changed = false;
        this.state.detectives.forEach(d => {
            if (d.injured && d.injuryHealTime && now >= d.injuryHealTime) {
                d.injured = false;
                d.injuryHealTime = null;
                changed = true;
                this.addNewsEvent({
                    title: 'Detective Recovered',
                    titleKey: 'newspaper.events.DETECTIVE_RECOVERED.title',
                    description: `${d.name} has recovered from their injuries and is ready for duty.`,
                    descriptionKey: 'newspaper.events.DETECTIVE_RECOVERED.description',
                    params: { name: d.name },
                    effect: 'Detective Available',
                    effectKey: 'newspaper.effects.detectiveAvailable',
                    timestamp: now
                });
            }
        });

        if (changed) this.saveState();
    }

    addNewsEvent(event) {
        event.id = this.state.nextEventId++;
        event.timestamp = event.timestamp || Date.now();
        this.state.newsEvents.unshift(event);

        // Keep only last 10 events
        if (this.state.newsEvents.length > 10) {
            this.state.newsEvents.pop();
        }
        this.saveState();
    }

    generateNewsEvent() {
        const influence = this.state.moodInfluence !== undefined ? this.state.moodInfluence : 50;
        const now = Date.now();
        let titleKey = '';
        let descriptionKey = '';

        if (influence >= 90 && Math.random() < 0.3) {
            // Crime Wave (CHAOS)
            titleKey = 'newspaper.events.CRIME_WAVE.title';
            descriptionKey = 'newspaper.events.CRIME_WAVE.description';
            this.state.moodInfluence = Math.min(100, influence + 15);
        } else if (influence <= 25 && Math.random() < 0.3) {
            // Peaceful (SAFE)
            titleKey = 'newspaper.events.PEACEFUL.title';
            descriptionKey = 'newspaper.events.PEACEFUL.description';
            this.state.moodInfluence = Math.max(0, influence - 15);
        } else {
            const roll = Math.random();
            if (roll < 0.4) {
                // Injury Risk
                titleKey = 'newspaper.events.INJURY_RISK.title';
                descriptionKey = 'newspaper.events.INJURY_RISK.description';
                this.state.moodInfluence = Math.min(100, influence + 5);
            } else {
                // Funding Bonus
                this.state.moodInfluence = influence;
                titleKey = 'newspaper.events.BONUS.title';
                descriptionKey = 'newspaper.events.BONUS.description';
                this.addCurrency(200);
                // Filter out recently used event keys to ensure uniqueness in the last 4 items
                const recentKeys = this.state.newsEvents.slice(0, 4).map(e => e.titleKey);

                let possibleEvents = [];

                // POOL OF 20+ UNIQUE EVENTS
                // High Influence (Good Mood)
                if (influence >= 80) {
                    [
                        { t: 'newspaper.events.CRIME_WAVE.title', d: 'newspaper.events.CRIME_WAVE.description', val: 10 }, // Kept for safety
                        { t: 'newspaper.events.FESTIVAL.title', d: 'newspaper.events.FESTIVAL.description', val: 5 },
                        { t: 'newspaper.events.NEW_SCHOOL.title', d: 'newspaper.events.NEW_SCHOOL.description', val: 5 },
                        { t: 'newspaper.events.PARK_OPENING.title', d: 'newspaper.events.PARK_OPENING.description', val: 5 },
                        { t: 'newspaper.events.CHARITY_GALA.title', d: 'newspaper.events.CHARITY_GALA.description', val: 5 },
                        { t: 'newspaper.events.TECH_BOOM.title', d: 'newspaper.events.TECH_BOOM.description', val: 10 },
                    ].forEach(e => possibleEvents.push({ titleKey: e.t, descKey: e.d, influenceChange: e.val }));
                }
                // Low Influence (Bad Mood)
                else if (influence <= 30) {
                    [
                        { t: 'newspaper.events.PEACEFUL.title', d: 'newspaper.events.PEACEFUL.description', val: -10 }, // Kept for safety
                        { t: 'newspaper.events.RIOTS.title', d: 'newspaper.events.RIOTS.description', val: -10 },
                        { t: 'newspaper.events.BLACKOUT.title', d: 'newspaper.events.BLACKOUT.description', val: -5 },
                        { t: 'newspaper.events.GANG_WAR.title', d: 'newspaper.events.GANG_WAR.description', val: -15 },
                        { t: 'newspaper.events.CORRUPTION.title', d: 'newspaper.events.CORRUPTION.description', val: -5 },
                        { t: 'newspaper.events.PRISON_BREAK.title', d: 'newspaper.events.PRISON_BREAK.description', val: -20 },
                    ].forEach(e => possibleEvents.push({ titleKey: e.t, descKey: e.d, influenceChange: e.val }));
                }
                // Neutral / Random Events
                else {
                    [
                        { t: 'newspaper.events.INJURY_RISK.title', d: 'newspaper.events.INJURY_RISK.description', val: -2 },
                        { t: 'newspaper.events.BONUS.title', d: 'newspaper.events.BONUS.description', val: 5 },
                        { t: 'newspaper.events.CAT_RESCUED.title', d: 'newspaper.events.CAT_RESCUED.description', val: 2 },
                        { t: 'newspaper.events.STREET_MARKET.title', d: 'newspaper.events.STREET_MARKET.description', val: 3 },
                        { t: 'newspaper.events.TRAFFIC_JAM.title', d: 'newspaper.events.TRAFFIC_JAM.description', val: -3 },
                        { t: 'newspaper.events.SUBWAY_DELAY.title', d: 'newspaper.events.SUBWAY_DELAY.description', val: -2 },
                        { t: 'newspaper.events.LOCAL_HERO.title', d: 'newspaper.events.LOCAL_HERO.description', val: 5 },
                        { t: 'newspaper.events.RAIN_STORM.title', d: 'newspaper.events.RAIN_STORM.description', val: -1 },
                        { t: 'newspaper.events.MUSEUM_EXHIBIT.title', d: 'newspaper.events.MUSEUM_EXHIBIT.description', val: 4 },
                        { t: 'newspaper.events.BRIDGE_REPAIR.title', d: 'newspaper.events.BRIDGE_REPAIR.description', val: -2 },
                        { t: 'newspaper.events.ELECTION_CYCLE.title', d: 'newspaper.events.ELECTION_CYCLE.description', val: 0 },
                        { t: 'newspaper.events.SPORT_VICTORY.title', d: 'newspaper.events.SPORT_VICTORY.description', val: 5 }
                    ].forEach(e => possibleEvents.push({ titleKey: e.t, descKey: e.d, influenceChange: e.val }));
                }

                // Filter possible events
                const uniqueEvents = possibleEvents.filter(e => !recentKeys.includes(e.titleKey));

                // Use unique event if available, otherwise pick random from possible (fallback)
                const selectedEvent = uniqueEvents.length > 0
                    ? uniqueEvents[Math.floor(Math.random() * uniqueEvents.length)]
                    : possibleEvents[Math.floor(Math.random() * possibleEvents.length)];

                if (selectedEvent) {
                    titleKey = selectedEvent.titleKey;
                    descriptionKey = selectedEvent.descKey;

                    // Adjust influence
                    if (selectedEvent.influenceChange > 0) {
                        this.state.moodInfluence = Math.min(100, influence + selectedEvent.influenceChange);
                    } else {
                        this.state.moodInfluence = Math.max(0, influence + selectedEvent.influenceChange);
                    }

                    // Limit news history to 4 items
                    if (this.state.newsEvents.length >= 4) {
                        this.state.newsEvents.pop(); // Remove oldest
                    }

                    // Add event with localization keys
                    this.addNewsEvent({
                        titleKey,
                        descriptionKey,
                        title: titleKey, // Fallback
                        description: descriptionKey, // Fallback
                        timestamp: now,
                        read: false
                    });
                    this.saveState();
                }
            }
        }
    }

    // Auto Assign Logic
    unlockAutoAssign() {
        if (!this.state.autoAssignUnlocked && this.state.currency >= 300) {
            this.state.currency -= 300;
            this.state.autoAssignUnlocked = true;
            this.saveState();
            return true;
        }
        return false;
    }

    isAutoAssignUnlocked() {
        return !!this.state.autoAssignUnlocked;
    }

    // Mark all current news as read
    markAllNewsRead() {
        let changed = false;
        this.state.newsEvents.forEach(event => {
            if (!event.read) {
                event.read = true;
                changed = true;
            }
        });
        if (changed) this.saveState();
    }


    // Injury type definitions
    static INJURY_TYPES = {
        BROKEN_LEG: { healMethod: 'time', healTime: 180000, healCost: 0 }, // 3 minutes
        HEART_ATTACK: { healMethod: 'xp', healTime: 0, healCost: 100 }, // 100 XP
        SURGERY: { healMethod: 'currency', healTime: 0, healCost: 300 }, // $300
        STABBED: { healMethod: 'currency', healTime: 0, healCost: 200 }, // $200
        CONCUSSION: { healMethod: 'time', healTime: 120000, healCost: 0 }, // 2 minutes
        GUNSHOT: { healMethod: 'xp', healTime: 0, healCost: 150 } // 150 XP
    };

    injureDetective(detectiveId) {
        const detective = this.state.detectives.find(d => d.id === detectiveId);
        if (detective && !detective.injured) {
            detective.injured = true;
            detective.assigned = false; // Force unassign
            detective.caseId = null;

            // Randomly select injury type
            const injuryTypes = Object.keys(GameState.INJURY_TYPES);
            const randomType = injuryTypes[Math.floor(Math.random() * injuryTypes.length)];
            const injuryData = GameState.INJURY_TYPES[randomType];

            detective.injuryType = randomType;
            detective.injuryHealMethod = injuryData.healMethod;
            detective.injuryHealCost = injuryData.healCost;

            // Calculate heal time with recovery bonus if time-based
            if (injuryData.healMethod === 'time') {
                const recoveryBonus = this.getRecoverySpeedBonus();
                const healTimeReduced = injuryData.healTime * (1 - recoveryBonus);
                detective.injuryHealTime = Date.now() + healTimeReduced;
            } else {
                detective.injuryHealTime = null;
            }

            this.addNewsEvent({
                titleKey: 'newspaper.events.DETECTIVE_INJURED.title',
                descriptionKey: 'newspaper.events.DETECTIVE_INJURED.description',
                params: { name: detective.name },
                title: 'Detective Injured!', // Fallback
                description: `${detective.name} was injured`, // Fallback
                timestamp: Date.now(),
                read: false
            });

            this.saveState();

            // Trigger injury notification callback
            if (this.onDetectiveInjured) {
                this.onDetectiveInjured(detective);
            }

            // Return detective for notification
            return detective;
        }
        return null;
    }

    healDetective(detectiveId, forceHeal = false) {
        const detective = this.state.detectives.find(d => d.id === detectiveId);
        if (!detective || !detective.injured) return false;

        // Time-based healing - check if time has passed
        if (detective.injuryHealMethod === 'time' && !forceHeal) {
            if (Date.now() >= detective.injuryHealTime) {
                detective.injured = false;
                detective.injuryHealTime = null;
                detective.injuryType = null;
                detective.injuryHealMethod = null;
                detective.injuryHealCost = null;
                this.saveState();
                return true;
            }
            return false;
        }

        // Force heal with resources
        if (forceHeal) {
            if (detective.injuryHealMethod === 'currency') {
                if (this.state.currency >= detective.injuryHealCost) {
                    this.state.currency -= detective.injuryHealCost;
                } else {
                    return false; // Not enough money
                }
            } else if (detective.injuryHealMethod === 'xp') {
                if (this.state.experience >= detective.injuryHealCost) {
                    this.state.experience -= detective.injuryHealCost;
                } else {
                    return false; // Not enough XP
                }
            }

            detective.injured = false;
            detective.injuryHealTime = null;
            detective.injuryType = null;
            detective.injuryHealMethod = null;
            detective.injuryHealCost = null;
            this.saveState();
            return true;
        }

        return false;
    }

    getInjuryInfo(detectiveId) {
        const detective = this.state.detectives.find(d => d.id === detectiveId);
        if (!detective || !detective.injured) return null;

        return {
            type: detective.injuryType,
            method: detective.injuryHealMethod,
            cost: detective.injuryHealCost,
            healTime: detective.injuryHealTime
        };
    }

    // Agency Upgrades System
    getUpgrades() {
        // Ensure upgrades object exists (for backward compatibility)
        if (!this.state.upgrades) {
            this.state.upgrades = {
                auto_assistant: 0,
                risk_mgmt: 0,
                efficiency: 0,
                recovery: 0
            };
        }
        return this.state.upgrades;
    }

    getUpgradeCost(upgradeId) {
        const upgradeDef = Object.values(GameState.UPGRADES).find(u => u.id === upgradeId);
        if (!upgradeDef) return 0;

        const currentLevel = this.getUpgrades()[upgradeId] || 0;
        if (currentLevel >= upgradeDef.maxLevel) return Infinity;

        return Math.floor(upgradeDef.baseCost * Math.pow(upgradeDef.costScale, currentLevel));
    }

    buyUpgrade(upgradeId) {
        const cost = this.getUpgradeCost(upgradeId);
        if (this.state.experience >= cost) {
            this.state.experience -= cost;

            if (!this.state.upgrades) this.getUpgrades(); // Init if needed
            this.state.upgrades[upgradeId] = (this.state.upgrades[upgradeId] || 0) + 1;

            this.saveState();
            return true;
        }
        return false;
    }

    // Upgrade Effect Getters
    getRiskReduction() {
        const level = this.getUpgrades().risk_mgmt || 0;
        // 1% per level, max 50%
        return Math.min(level * 0.01, 0.50);
    }

    getEfficiencyMultiplier() {
        const level = this.getUpgrades().efficiency || 0;
        // 2% faster per level (1.02, 1.04, etc)
        return 1 + (level * 0.02);
    }

    getRecoverySpeedBonus() {
        const level = this.getUpgrades().recovery || 0;
        // 5% faster heal per level
        return level * 0.05;
    }

    hasAutoAssistant() {
        return (this.getUpgrades().auto_assistant || 0) > 0;
    }

    // Special method for assistant completion that bypasses assigned detective check
    completeAssistantCase(caseId) {
        const caseObj = this.state.cases.find(c => c.id === caseId);
        if (caseObj) {
            // Apply rewards (no XP for assistants? or reduced? Spec said "No rewards are increased", implies normal rewards?)
            // "Common cases no longer require detectives" - implying automated solving.
            // Let's give full currency reward but maybe reduced XP or full XP. Plan said "No rewards are increased".
            // Let's assume standard rewards for now.
            this.state.currency += caseObj.reward;
            this.state.experience += caseObj.experienceReward || 0;
            this.state.completedCommonCases++;

            // Remove case
            this.state.cases = this.state.cases.filter(c => c.id !== caseId);
            this.saveState();
        }
    }
    // ===== ITEM SYSTEM METHODS =====
    upgradeItem(itemId) {
        const item = this.state.items.find(i => i.id === itemId);
        if (!item) return false;
        const { ITEM_DEFINITIONS } = require('./systems/itemSystem.js');
        const def = ITEM_DEFINITIONS[item.definitionId];
        if (!def || item.level >= def.maxLevel) return false;
        const cost = Math.floor(def.upgradeCostBase * (item.level + 1) * 1.5);
        if (this.state.currency < cost) return false;
        this.state.currency -= cost;
        item.level++;
        this.saveState();
        return true;
    }

    getItemDefinition(definitionId) {
        const { ITEM_DEFINITIONS } = require('./systems/itemSystem.js');
        return ITEM_DEFINITIONS[definitionId];
    }

    getItemEffect(item) {
        const { ITEM_DEFINITIONS } = require('./systems/itemSystem.js');
        const def = ITEM_DEFINITIONS[item.definitionId];
        if (!def) return 0;
        return def.baseValue + (def.valuePerLevel * (item.level - 1));
    }

    getItemUpgradeCost(item) {
        const { ITEM_DEFINITIONS } = require('./systems/itemSystem.js');
        const def = ITEM_DEFINITIONS[item.definitionId];
        if (!def || item.level >= def.maxLevel) return null;
        return Math.floor(def.upgradeCostBase * (item.level + 1) * 1.5);
    }

}

// Create singleton instance
const gameState = new GameState();

export default gameState;
