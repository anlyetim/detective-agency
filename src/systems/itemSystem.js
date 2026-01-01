// ITEM SYSTEM
// Item definitions with upgrade properties
export const ITEM_DEFINITIONS = {
    'aid_bandage_epic': {
        id: 'aid_bandage_epic',
        sprite: 'aid_bandage_epic',
        nameKey: 'items.aid_bandage_epic.name',
        descKey: 'items.aid_bandage_epic.desc',
        effectType: 'healing_speed',
        baseValue: 50,
        valuePerLevel: 25, // 50, 75, 100
        maxLevel: 3,
        upgradeCostBase: 400
    },
    'band_aid': {
        id: 'band_aid',
        sprite: 'band_aid',
        nameKey: 'items.band_aid.name',
        descKey: 'items.band_aid.desc',
        effectType: 'healing_speed',
        baseValue: 25,
        valuePerLevel: 7.5, // 25, 32.5, 40
        maxLevel: 3,
        upgradeCostBase: 150
    },
    'car_key_epic': {
        id: 'car_key_epic',
        sprite: 'car_key_epic',
        nameKey: 'items.car_key_epic.name',
        descKey: 'items.car_key_epic.desc',
        effectType: 'case_speed',
        baseValue: 50,
        valuePerLevel: 25, // 50, 75, 100
        maxLevel: 3,
        upgradeCostBase: 400
    },
    'shoes': {
        id: 'shoes',
        sprite: 'shoes',
        nameKey: 'items.shoes.name',
        descKey: 'items.shoes.desc',
        effectType: 'stat_speed',
        baseValue: 1,
        valuePerLevel: 1, // 1, 2, 3
        maxLevel: 3,
        upgradeCostBase: 200
    },
    'chemistry': {
        id: 'chemistry',
        sprite: 'chemistry',
        nameKey: 'items.chemistry.name',
        descKey: 'items.chemistry.desc',
        effectType: 'stat_evidence',
        baseValue: 1,
        valuePerLevel: 1, // 1, 2, 3
        maxLevel: 3,
        upgradeCostBase: 200
    },
    'laptop': {
        id: 'laptop',
        sprite: 'laptop',
        nameKey: 'items.laptop.name',
        descKey: 'items.laptop.desc',
        effectType: 'stat_evidence',
        baseValue: 1,
        valuePerLevel: 1, // 1, 2, 3
        maxLevel: 3,
        upgradeCostBase: 250
    },
    'magnifying_glass': {
        id: 'magnifying_glass',
        sprite: 'magnifying_glass',
        nameKey: 'items.magnifying_glass.name',
        descKey: 'items.magnifying_glass.desc',
        effectType: 'evidence_speed',
        baseValue: 10,
        valuePerLevel: 7.5, // 10, 17.5, 25
        maxLevel: 3,
        upgradeCostBase: 150
    },
    'magnifying_glass_lv2': {
        id: 'magnifying_glass_lv2',
        sprite: 'magnifying_glass_lv2',
        nameKey: 'items.magnifying_glass_lv2.name',
        descKey: 'items.magnifying_glass_lv2.desc',
        effectType: 'evidence_speed',
        baseValue: 25,
        valuePerLevel: 7.5, // 25, 32.5, 40
        maxLevel: 3,
        upgradeCostBase: 300
    },
    'glasses': {
        id: 'glasses',
        sprite: 'glasses',
        nameKey: 'items.glasses.name',
        descKey: 'items.glasses.desc',
        effectType: 'stat_intelligence',
        baseValue: 1,
        valuePerLevel: 1, // 1, 2, 3
        maxLevel: 3,
        upgradeCostBase: 200
    },
    'pencil': {
        id: 'pencil',
        sprite: 'pencil',
        nameKey: 'items.pencil.desc',
        descKey: 'items.pencil.desc',
        effectType: 'stat_intelligence',
        baseValue: 1,
        valuePerLevel: 1, // 1, 2, 3
        maxLevel: 3,
        upgradeCostBase: 150
    },
    'notebook': {
        id: 'notebook',
        sprite: 'notebook',
        nameKey: 'items.notebook.name',
        descKey: 'items.notebook.desc',
        effectType: 'thinking_speed',
        baseValue: 10,
        valuePerLevel: 7.5, // 10, 17.5, 25
        maxLevel: 3,
        upgradeCostBase: 150
    },
    'notebook_lv2': {
        id: 'notebook_lv2',
        sprite: 'notebook_lv2',
        nameKey: 'items.notebook_lv2.name',
        descKey: 'items.notebook_lv2.desc',
        effectType: 'thinking_speed',
        baseValue: 25,
        valuePerLevel: 7.5, // 25, 32.5, 40
        maxLevel: 3,
        upgradeCostBase: 300
    },
    'gun': {
        id: 'gun',
        sprite: 'gun',
        nameKey: 'items.gun.name',
        descKey: 'items.gun.desc',
        effectType: 'injury_reduction',
        baseValue: 20,
        valuePerLevel: 7.5, // 20, 27.5, 35
        maxLevel: 3,
        upgradeCostBase: 250
    },
    'revolver_lv2': {
        id: 'revolver_lv2',
        sprite: 'revolver_lv2',
        nameKey: 'items.revolver_lv2.name',
        descKey: 'items.revolver_lv2.desc',
        effectType: 'injury_reduction',
        baseValue: 30,
        valuePerLevel: 10, // 30, 40, 50
        maxLevel: 3,
        upgradeCostBase: 350
    },
    'knife': {
        id: 'knife',
        sprite: 'knife',
        nameKey: 'items.knife.name',
        descKey: 'items.knife.desc',
        effectType: 'injury_reduction',
        baseValue: 10,
        valuePerLevel: 7.5, // 10, 17.5, 25
        maxLevel: 3,
        upgradeCostBase: 200
    },
    'katana_epic': {
        id: 'katana_epic',
        sprite: 'katana_epic',
        nameKey: 'items.katana_epic.name',
        descKey: 'items.katana_epic.desc',
        effectType: 'injury_reduction',
        baseValue: 75,
        valuePerLevel: 12.5, // 75, 87.5, 100 (immune)
        maxLevel: 3,
        upgradeCostBase: 500
    },
    'rope': {
        id: 'rope',
        sprite: 'rope',
        nameKey: 'items.rope.name',
        descKey: 'items.rope.desc',
        effectType: 'dodge_chance',
        baseValue: 5,
        valuePerLevel: 2.5, // 5, 7.5, 10
        maxLevel: 3,
        upgradeCostBase: 150
    },
    'rope_lv2': {
        id: 'rope_lv2',
        sprite: 'rope_lv2',
        nameKey: 'items.rope_lv2.name',
        descKey: 'items.rope_lv2.desc',
        effectType: 'dodge_chance',
        baseValue: 10,
        valuePerLevel: 7.5, // 10, 17.5, 25
        maxLevel: 3,
        upgradeCostBase: 250
    },
    'debit_card_epic': {
        id: 'debit_card_epic',
        sprite: 'debit_card_epic',
        nameKey: 'items.debit_card_epic.name',
        descKey: 'items.debit_card_epic.desc',
        effectType: 'income_boost',
        baseValue: 25,
        valuePerLevel: 25, // 25, 50, 75
        maxLevel: 3,
        upgradeCostBase: 400
    },
    'phone': {
        id: 'phone',
        sprite: 'phone',
        nameKey: 'items.phone.name',
        descKey: 'items.phone.desc',
        effectType: 'stat_risk',
        baseValue: 1,
        valuePerLevel: 1, // 1, 2, 3
        maxLevel: 3,
        upgradeCostBase: 150
    }
};
