import React, { useState } from 'react';
import gameState from '../gameState.js';
import { useLocalization } from '../LocalizationContext.jsx';

export default function ItemsPanel({ onStateChange }) {
    const { t } = useLocalization();
    const allItems = gameState.getItems();
    const detectives = gameState.getUnlockedDetectives();
    const currency = gameState.getCurrency();
    const [selectedDetective, setSelectedDetective] = useState(detectives[0]?.id || null);

    // Filter out old items
    const items = allItems.filter(item => item.definitionId);

    const detective = detectives.find(d => d.id === selectedDetective);

    const handleUpgrade = (item) => {
        if (gameState.upgradeItem(item.id)) {
            onStateChange();
        }
    };

    const handleEquip = (item) => {
        if (!detective) return;
        // Find first empty slot
        const emptySlotIndex = detective.equipment.findIndex(slot => slot === null);
        if (emptySlotIndex !== -1) {
            gameState.equipItem(detective.id, item.id, emptySlotIndex);
            onStateChange();
        } else {
            // No empty slots - maybe show error or replace first?
            // For now, simple: auto-replace slot 0 or just fail safely
            alert(t('items.noSlots') || "No empty slots! Unequip something first.");
        }
    };

    const handleUnequip = (slotIndex) => {
        if (detective) {
            gameState.unequipItem(detective.id, slotIndex);
            onStateChange();
        }
    };

    // Helper to check if item is equipped to ANY detective
    const getEquippedDetective = (itemId) => {
        return detectives.find(d => d.equipment.includes(itemId));
    };

    return (
        <div className="panel">
            <h1 className="panel-title">{t('items.title')}</h1>

            {detectives.length > 0 ? (
                <>
                    {/* Detective Selector */}
                    <div className="card">
                        <h3 style={{ fontSize: '15px', marginBottom: '12px' }}>{t('items.selectDetective')}</h3>
                        <select
                            value={selectedDetective || ''}
                            onChange={(e) => setSelectedDetective(parseInt(e.target.value))}
                            style={{
                                width: '100%',
                                padding: '8px',
                                background: 'rgba(0, 0, 0, 0.5)',
                                color: '#fff',
                                border: '1px solid #666',
                                borderRadius: '4px',
                                fontFamily: 'Minecraftia, monospace',
                                fontSize: '12px'
                            }}
                        >
                            {detectives.map(d => (
                                <option key={d.id} value={d.id}>{d.nameKey ? t(d.nameKey) : d.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Equipment Slots */}
                    {detective && (
                        <div className="card">
                            <h3 style={{ fontSize: '15px', marginBottom: '12px' }}>{t('items.equipmentSlots')}</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                {detective.equipment.map((equippedItemId, index) => {
                                    const equippedItem = equippedItemId ? items.find(i => i.id === equippedItemId) : null;
                                    const def = equippedItem ? gameState.getItemDefinition(equippedItem.definitionId) : null;

                                    return (
                                        <div key={index} style={{
                                            background: 'rgba(0,0,0,0.3)',
                                            border: '1px dashed #666',
                                            borderRadius: '4px',
                                            aspectRatio: '1',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                            padding: '4px'
                                        }}>
                                            <div style={{ position: 'absolute', top: '2px', left: '4px', fontSize: '10px', color: '#666' }}>
                                                {index + 1}
                                            </div>
                                            {equippedItem && def ? (
                                                <>
                                                    <img
                                                        src={`/pics/items/${def.sprite}.png`}
                                                        alt={t(def.nameKey)}
                                                        style={{ width: '32px', height: '32px', imageRendering: 'pixelated', marginBottom: '4px' }}
                                                    />
                                                    <div style={{ fontSize: '9px', textAlign: 'center', lineHeight: '1', marginBottom: '4px' }}>
                                                        {t(def.nameKey)}
                                                    </div>
                                                    <button
                                                        className="button"
                                                        style={{ fontSize: '9px', padding: '2px 6px', width: '100%', background: '#ff4444' }}
                                                        onClick={() => handleUnequip(index)}
                                                    >
                                                        {t('items.unequip')}
                                                    </button>
                                                </>
                                            ) : (
                                                <span style={{ fontSize: '10px', color: '#666' }}>{t('items.empty')}</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="card">
                    <div style={{ fontSize: '12px', color: '#888', padding: '20px', textAlign: 'center' }}>
                        {t('items.noDetectives')}
                    </div>
                </div>
            )}

            {/* Inventory */}
            <div className="card">
                <h3 style={{ fontSize: '15px', marginBottom: '12px' }}>{t('items.inventory')} ({items.length})</h3>

                {items.length === 0 && (
                    <div style={{ fontSize: '12px', color: '#888', padding: '20px', textAlign: 'center' }}>
                        {t('items.noItems')}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                    {items.map(item => {
                        const def = gameState.getItemDefinition(item.definitionId);
                        if (!def) return null;

                        const effect = gameState.getItemEffect(item);
                        const cost = gameState.getItemUpgradeCost(item);
                        const canUpgrade = cost !== null && currency >= cost;
                        const isMaxLevel = item.level >= def.maxLevel;

                        // Equipment Status
                        const equippedTo = getEquippedDetective(item.id);
                        const isEquippedToCurrent = detective && equippedTo && equippedTo.id === detective.id;

                        return (
                            <div
                                key={item.id}
                                className="card"
                                style={{
                                    padding: '12px',
                                    background: 'rgba(0, 0, 0, 0.3)',
                                    position: 'relative',
                                    border: equippedTo ? `1px solid ${isEquippedToCurrent ? '#4CAF50' : '#FFD700'}` : 'none'
                                }}
                            >
                                {/* Item Image */}
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                    <img
                                        src={`/pics/items/${def.sprite}.png`}
                                        alt={t(def.nameKey)}
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            marginRight: '8px',
                                            imageRendering: 'pixelated'
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                                            {t(def.nameKey)}
                                        </div>
                                        <div style={{ fontSize: '9px', color: '#888' }}>
                                            {t('items.level')} {item.level}/{def.maxLevel}
                                        </div>
                                    </div>
                                </div>

                                {/* Effect */}
                                <div style={{ fontSize: '10px', color: '#4CAF50', marginBottom: '8px' }}>
                                    {t(def.descKey, { value: Math.floor(effect) })}
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>

                                    {/* Equip/Unequip Action */}
                                    {equippedTo ? (
                                        <div style={{
                                            fontSize: '10px',
                                            background: isEquippedToCurrent ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 215, 0, 0.2)',
                                            color: isEquippedToCurrent ? '#4CAF50' : '#FFD700',
                                            padding: '6px',
                                            borderRadius: '4px',
                                            textAlign: 'center',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {isEquippedToCurrent ? t('items.equipped') : t('items.equippedTo', { name: equippedTo.name })}
                                        </div>
                                    ) : (
                                        <button
                                            className="button"
                                            onClick={() => handleEquip(item)}
                                            disabled={!detective || detective.equipment.every(s => s !== null)}
                                            style={{
                                                fontSize: '10px',
                                                padding: '6px',
                                                background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)'
                                            }}
                                        >
                                            {t('items.equip')}
                                        </button>
                                    )}

                                    {/* Upgrade Action */}
                                    {!isMaxLevel ? (
                                        <button
                                            className="button"
                                            onClick={() => handleUpgrade(item)}
                                            disabled={!canUpgrade}
                                            style={{
                                                fontSize: '10px',
                                                padding: '6px',
                                                background: canUpgrade ? 'linear-gradient(135deg, #666666 0%, #888888 100%)' : 'rgba(100, 100, 100, 0.3)'
                                            }}
                                        >
                                            {canUpgrade ? `$${cost}` : `$${cost}`}
                                        </button>
                                    ) : (
                                        <div style={{
                                            textAlign: 'center',
                                            fontSize: '10px',
                                            padding: '6px',
                                            background: '#4CAF50',
                                            borderRadius: '4px',
                                            fontWeight: 'bold',
                                            color: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            MAX
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
