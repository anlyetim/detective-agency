// Item system functions for GameState
import { ITEM_DEFINITIONS } from './itemSystem.js';

export function generateRandomItem(nextItemId) {
    const itemIds = Object.keys(ITEM_DEFINITIONS);
    const randomId = itemIds[Math.floor(Math.random() * itemIds.length)];

    return {
        id: nextItemId,
        definitionId: randomId,
        level: 1,
        equipped: false,
        equippedTo: null
    };
}

export function getItemEffect(item) {
    const def = ITEM_DEFINITIONS[item.definitionId];
    if (!def) return 0;
    return def.baseValue + (def.valuePerLevel * (item.level - 1));
}

export function getUpgradeCost(item) {
    const def = ITEM_DEFINITIONS[item.definitionId];
    if (!def || item.level >= def.maxLevel) return null;
    return Math.floor(def.upgradeCostBase * (item.level + 1) * 1.5);
}

export function getItemDefinition(definitionId) {
    return ITEM_DEFINITIONS[definitionId];
}

export { ITEM_DEFINITIONS };
