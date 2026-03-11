import React, { useState } from 'react'
import { Item, ItemEffect } from '../EntityTypes'
import AppearanceCanvas from './AppearanceCanvas'
import { useProject } from '../ProjectContext'

interface EditItemModalProps {
  editingItem: Item;
  editIndex: number;
  onCancel: () => void;
  onConfirm: () => void;
  onUpdateItem: (updated: Item) => void;
}

const EditItemModal: React.FC<EditItemModalProps> = ({ 
  editingItem, 
  editIndex, 
  onCancel, 
  onConfirm, 
  onUpdateItem 
}) => {
  const { projectData } = useProject();
  const [activeTab, setActiveTab] = useState<'general' | 'combat' | 'interaction' | 'raw'>('general');

  if (!projectData) return null;

  const resolveAppearance = (id?: string): { tilesetId: string, frameIndex: number } | null => {
    if (!id) return null;
    for (const app of projectData.data.appearances) {
        const itemApp = app.items?.find(i => i.id === id);
        if (itemApp) {
            return {
                tilesetId: app.tileset,
                frameIndex: itemApp.i
            };
        }
    }
    return null;
  };

  const appearancePreview = resolveAppearance(editingItem.appearance);
  const flyAppearancePreview = resolveAppearance(editingItem.flyAppearance);

  const handleEffectChange = (field: keyof ItemEffect, value: any) => {
    const newEffect = { ...(editingItem.effect || { type: '' }), [field]: value };
    onUpdateItem({ ...editingItem, effect: newEffect });
  };

  const renderGeneralTab = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div className="form-group">
            <label>ID</label>
            <input value={editingItem.id || ''} onChange={(e) => onUpdateItem({...editingItem, id: e.target.value})} />
        </div>
        <div className="form-group">
            <label>Name</label>
            <input value={editingItem.name || ''} onChange={(e) => onUpdateItem({...editingItem, name: e.target.value})} />
        </div>
        <div className="form-group">
            <label>Appearance ID</label>
            <input value={editingItem.appearance || ''} onChange={(e) => onUpdateItem({...editingItem, appearance: e.target.value})} />
        </div>
        <div className="form-group">
            <label>Type</label>
            <input value={editingItem.type || ''} onChange={(e) => onUpdateItem({...editingItem, type: e.target.value})} />
        </div>
        <div className="form-group">
            <label>Value</label>
            <input type="number" value={editingItem.value || 0} onChange={(e) => onUpdateItem({...editingItem, value: parseInt(e.target.value) || 0})} />
        </div>
        <div className="form-group">
            <label>Weight</label>
            <input type="number" value={editingItem.weight || 0} onChange={(e) => onUpdateItem({...editingItem, weight: parseFloat(e.target.value) || 0})} />
        </div>
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Description</label>
            <textarea style={{ width: '100%', backgroundColor: '#3c3c3c', color: 'white', border: '1px solid #555', padding: '6px' }} 
                value={editingItem.description || ''} onChange={(e) => onUpdateItem({...editingItem, description: e.target.value})} />
        </div>
    </div>
  );

  const renderCombatTab = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div className="form-group">
            <label>Damage</label>
            <input type="number" value={editingItem.damage || 0} onChange={(e) => onUpdateItem({...editingItem, damage: parseInt(e.target.value) || 0})} />
        </div>
        <div className="form-group">
            <label>Defense</label>
            <input type="number" value={editingItem.defense || 0} onChange={(e) => onUpdateItem({...editingItem, defense: parseInt(e.target.value) || 0})} />
        </div>
        <div className="form-group">
            <label>Range</label>
            <input type="number" value={editingItem.range || 0} onChange={(e) => onUpdateItem({...editingItem, range: parseInt(e.target.value) || 0})} />
        </div>
        <div className="form-group">
            <label>Throwable</label>
            <input type="checkbox" checked={!!editingItem.throwable} onChange={(e) => onUpdateItem({...editingItem, throwable: e.target.checked})} />
        </div>
        <div className="form-group">
            <label>Fly Appearance ID</label>
            <input value={editingItem.flyAppearance || ''} onChange={(e) => onUpdateItem({...editingItem, flyAppearance: e.target.value})} />
        </div>
        <div className="form-group">
            <label>Fly Type (straight, rotate)</label>
            <input value={editingItem.flyType || ''} onChange={(e) => onUpdateItem({...editingItem, flyType: e.target.value})} />
        </div>
        <div className="form-group">
            <label>Projectile Type</label>
            <input value={editingItem.usesProjectileType || ''} onChange={(e) => onUpdateItem({...editingItem, usesProjectileType: e.target.value})} />
        </div>
        <div className="form-group">
            <label>Stack Limit</label>
            <input type="number" value={editingItem.stackLimit || 0} onChange={(e) => onUpdateItem({...editingItem, stackLimit: parseInt(e.target.value) || 0})} />
        </div>
    </div>
  );

  const renderInteractionTab = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div className="form-group">
            <label>Capacity (Container)</label>
            <input type="number" value={editingItem.capacity || 0} onChange={(e) => onUpdateItem({...editingItem, capacity: parseInt(e.target.value) || 0})} />
        </div>
        <div className="form-group">
            <label>Container Type</label>
            <input value={editingItem.containerType || ''} onChange={(e) => onUpdateItem({...editingItem, containerType: e.target.value})} />
        </div>
        <div className="form-group">
            <label>Light Radius</label>
            <input type="number" value={editingItem.lightRadius || 0} onChange={(e) => onUpdateItem({...editingItem, lightRadius: parseInt(e.target.value) || 0})} />
        </div>
        <div className="form-group">
            <label>Solid</label>
            <input type="checkbox" checked={!!editingItem.solid} onChange={(e) => onUpdateItem({...editingItem, solid: e.target.checked})} />
        </div>
        <div className="form-group">
            <label>Fixed</label>
            <input type="checkbox" checked={!!editingItem.fixed} onChange={(e) => onUpdateItem({...editingItem, fixed: e.target.checked})} />
        </div>
        <div className="form-group">
            <label>Spendable</label>
            <input type="checkbox" checked={!!editingItem.spendable} onChange={(e) => onUpdateItem({...editingItem, spendable: e.target.checked})} />
        </div>
        <div className="form-group">
            <label>Use On Self</label>
            <input type="checkbox" checked={!!editingItem.useOnSelf} onChange={(e) => onUpdateItem({...editingItem, useOnSelf: e.target.checked})} />
        </div>
        <div className="form-group">
            <label>Is Book</label>
            <input type="checkbox" checked={!!editingItem.isBook} onChange={(e) => onUpdateItem({...editingItem, isBook: e.target.checked})} />
        </div>
        {editingItem.isBook && (
            <>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Book Title</label>
                    <input value={editingItem.title || ''} onChange={(e) => onUpdateItem({...editingItem, title: e.target.value})} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Book Contents</label>
                    <textarea style={{ width: '100%', backgroundColor: '#3c3c3c', color: 'white', border: '1px solid #555', padding: '6px' }} 
                        value={editingItem.contents || ''} onChange={(e) => onUpdateItem({...editingItem, contents: e.target.value})} />
                </div>
            </>
        )}
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Effect Type</label>
            <input value={editingItem.effect?.type || ''} onChange={(e) => handleEffectChange('type', e.target.value)} />
        </div>
    </div>
  );

  const renderRawTab = () => (
    <div className="form-group">
        <label>JSON Data (for complex/linked attributes)</label>
        <textarea 
            style={{ width: '100%', height: '300px', backgroundColor: '#1e1e1e', color: '#d4d4d4', fontFamily: 'monospace', border: '1px solid #555', padding: '10px' }}
            value={JSON.stringify(editingItem, null, 2)}
            onChange={(e) => {
                try {
                    const parsed = JSON.parse(e.target.value);
                    onUpdateItem(parsed);
                } catch (err) {
                    // Invalid JSON, don't update
                }
            }}
        />
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h3>{editIndex >= 0 ? 'Edit' : 'Add'} Item</h3>
        
        {/* Preview Row */}
        <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', marginBottom: '20px', padding: '10px', background: '#1a1a1a', borderRadius: '4px', border: '1px solid #333' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '5px' }}>Appearance</div>
                <AppearanceCanvas 
                    tilesetId={appearancePreview?.tilesetId || ''}
                    frameIndex={appearancePreview?.frameIndex || 0}
                    size={64}
                />
            </div>
            {editingItem.flyAppearance && (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '5px' }}>Fly Appearance</div>
                    <AppearanceCanvas 
                        tilesetId={flyAppearancePreview?.tilesetId || ''}
                        frameIndex={flyAppearancePreview?.frameIndex || 0}
                        size={64}
                    />
                </div>
            )}
        </div>

        {/* Tab Header */}
        <div className="modal-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #444' }}>
            <button className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')} style={{ padding: '8px 15px', background: activeTab === 'general' ? '#3a3a3a' : 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>General</button>
            <button className={`tab-btn ${activeTab === 'combat' ? 'active' : ''}`} onClick={() => setActiveTab('combat')} style={{ padding: '8px 15px', background: activeTab === 'combat' ? '#3a3a3a' : 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>Combat/Flying</button>
            <button className={`tab-btn ${activeTab === 'interaction' ? 'active' : ''}`} onClick={() => setActiveTab('interaction')} style={{ padding: '8px 15px', background: activeTab === 'interaction' ? '#3a3a3a' : 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>Special</button>
            <button className={`tab-btn ${activeTab === 'raw' ? 'active' : ''}`} onClick={() => setActiveTab('raw')} style={{ padding: '8px 15px', background: activeTab === 'raw' ? '#3a3a3a' : 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>JSON</button>
        </div>

        <div className="modal-tab-content" style={{ marginBottom: '20px' }}>
            {activeTab === 'general' && renderGeneralTab()}
            {activeTab === 'combat' && renderCombatTab()}
            {activeTab === 'interaction' && renderInteractionTab()}
            {activeTab === 'raw' && renderRawTab()}
        </div>

        <div className="modal-actions">
          <button onClick={onCancel} style={{ backgroundColor: '#444' }}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  )
}

export default EditItemModal
