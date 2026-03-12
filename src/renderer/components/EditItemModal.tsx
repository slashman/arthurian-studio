import React, { useState } from 'react'
import { Item, ItemEffect } from '../types/ItemEntityTypes'
import AppearanceCanvas from './AppearanceCanvas'
import AppearancePickerModal from './AppearancePickerModal'
import ItemPickerModal from './ItemPickerModal'
import { useProject } from '../ProjectContext'
import { Search } from 'lucide-react'

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
  const [activeTab, setActiveTab] = useState<'general' | 'combat' | 'special' | 'effect' | 'raw'>('general');
  const [pickerTarget, setPickerTarget] = useState<'appearance' | 'flyAppearance' | 'closedAppearance' | 'openAppearance' | null>(null);
  const [itemPickerTarget, setItemPickerTarget] = useState<'usesProjectileType' | 'transformTo' | null>(null);

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

  const appearancePreviewId = (editingItem.type === 'linkedDoor' && editingItem.closedAppearance) ? editingItem.closedAppearance : editingItem.appearance;
  const appearancePreview = resolveAppearance(appearancePreviewId);
  const flyAppearancePreview = resolveAppearance(editingItem.flyAppearance);

  const handleEffectChange = (field: keyof ItemEffect, value: any) => {
    const newEffect = { ...(editingItem.effect || { type: '' }), [field]: value };
    onUpdateItem({ ...editingItem, effect: newEffect });
  };

  const handleSelectFromPicker = (id: string) => {
    if (pickerTarget) {
      onUpdateItem({ ...editingItem, [pickerTarget]: id });
      setPickerTarget(null);
    }
  };

  const handleSelectItemFromPicker = (id: string) => {
    if (itemPickerTarget === 'transformTo') {
        handleEffectChange('transformTo', id);
    } else if (itemPickerTarget === 'usesProjectileType') {
        onUpdateItem({ ...editingItem, usesProjectileType: id });
    }
    setItemPickerTarget(null);
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
            <div style={{ display: 'flex', gap: '5px' }}>
                <input style={{ flexGrow: 1 }} value={editingItem.appearance || ''} onChange={(e) => onUpdateItem({...editingItem, appearance: e.target.value})} />
                <button onClick={() => setPickerTarget('appearance')} style={{ padding: '4px 8px' }} title="Browse appearances"><Search size={14} /></button>
            </div>
        </div>
        <div className="form-group">
            <label>Type</label>
            <select 
                style={{ width: '100%', backgroundColor: '#3c3c3c', color: 'white', border: '1px solid #555', padding: '6px' }}
                value={editingItem.type || ''} 
                onChange={(e) => onUpdateItem({...editingItem, type: e.target.value})}
            >
                <option value="">Standard</option>
                <option value="lightSource">Light Source</option>
                <option value="container">Container</option>
                <option value="linkedDoor">Linked Door</option>
            </select>
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
            <div style={{ display: 'flex', gap: '5px' }}>
                <input style={{ flexGrow: 1 }} value={editingItem.flyAppearance || ''} onChange={(e) => onUpdateItem({...editingItem, flyAppearance: e.target.value})} />
                <button onClick={() => setPickerTarget('flyAppearance')} style={{ padding: '4px 8px' }} title="Browse appearances"><Search size={14} /></button>
            </div>
        </div>
        <div className="form-group">
            <label>Fly Type</label>
            <select 
                style={{ width: '100%', backgroundColor: '#3c3c3c', color: 'white', border: '1px solid #555', padding: '6px' }}
                value={editingItem.flyType || ''} 
                onChange={(e) => onUpdateItem({...editingItem, flyType: e.target.value})}
            >
                <option value="">None</option>
                <option value="straight">Straight</option>
                <option value="rotate">Rotate</option>
            </select>
        </div>
        <div className="form-group">
            <label>Projectile Type</label>
            <div style={{ display: 'flex', gap: '5px' }}>
                <input style={{ flexGrow: 1 }} value={editingItem.usesProjectileType || ''} onChange={(e) => onUpdateItem({...editingItem, usesProjectileType: e.target.value})} />
                <button onClick={() => setItemPickerTarget('usesProjectileType')} style={{ padding: '4px 8px' }} title="Browse items"><Search size={14} /></button>
            </div>
        </div>
        <div className="form-group">
            <label>Stack Limit</label>
            <input type="number" value={editingItem.stackLimit || 0} onChange={(e) => onUpdateItem({...editingItem, stackLimit: parseInt(e.target.value) || 0})} />
        </div>
    </div>
  );

  const renderSpecialTab = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        {editingItem.type === 'container' && (
            <>
                <div className="form-group">
                    <label>Capacity (Container)</label>
                    <input type="number" value={editingItem.capacity || 0} onChange={(e) => onUpdateItem({...editingItem, capacity: parseInt(e.target.value) || 0})} />
                </div>
                <div className="form-group">
                    <label>Container Type</label>
                    <select 
                        style={{ width: '100%', backgroundColor: '#3c3c3c', color: 'white', border: '1px solid #555', padding: '6px' }}
                        value={editingItem.containerType || ''} 
                        onChange={(e) => onUpdateItem({...editingItem, containerType: e.target.value})}
                    >
                        <option value="">None</option>
                        <option value="medium">Medium</option>
                        <option value="backpack">Backpack</option>
                    </select>
                </div>
            </>
        )}
        
        {editingItem.type === 'lightSource' && (
            <div className="form-group">
                <label>Light Radius</label>
                <input type="number" value={editingItem.lightRadius || 0} onChange={(e) => onUpdateItem({...editingItem, lightRadius: parseInt(e.target.value) || 0})} />
            </div>
        )}

        {editingItem.type === 'linkedDoor' && (
            <>
                <div className="form-group">
                    <label>Linked X</label>
                    <input type="number" value={editingItem.linked?.x || 0} onChange={(e) => onUpdateItem({...editingItem, linked: { x: parseInt(e.target.value) || 0, y: editingItem.linked?.y || 0 }})} />
                </div>
                <div className="form-group">
                    <label>Linked Y</label>
                    <input type="number" value={editingItem.linked?.y || 0} onChange={(e) => onUpdateItem({...editingItem, linked: { x: editingItem.linked?.x || 0, y: parseInt(e.target.value) || 0 }})} />
                </div>
                <div className="form-group">
                    <label>Closed Appearance</label>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <input style={{ flexGrow: 1 }} value={editingItem.closedAppearance || ''} onChange={(e) => onUpdateItem({...editingItem, closedAppearance: e.target.value})} />
                        <button onClick={() => setPickerTarget('closedAppearance')} style={{ padding: '4px 8px' }} title="Browse appearances"><Search size={14} /></button>
                    </div>
                </div>
                <div className="form-group">
                    <label>Open Appearance</label>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <input style={{ flexGrow: 1 }} value={editingItem.openAppearance || ''} onChange={(e) => onUpdateItem({...editingItem, openAppearance: e.target.value})} />
                        <button onClick={() => setPickerTarget('openAppearance')} style={{ padding: '4px 8px' }} title="Browse appearances"><Search size={14} /></button>
                    </div>
                </div>
            </>
        )}

        {(editingItem.type !== 'container' && editingItem.type !== 'lightSource' && editingItem.type !== 'linkedDoor') && (
            <div style={{ gridColumn: 'span 2', color: '#888', textAlign: 'center', padding: '20px' }}>
                No special attributes for this item type.
            </div>
        )}
    </div>
  );

  const renderEffectTab = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Effect Type</label>
            <select 
                style={{ width: '100%', backgroundColor: '#3c3c3c', color: 'white', border: '1px solid #555', padding: '6px' }}
                value={editingItem.effect?.type || ''} 
                onChange={(e) => handleEffectChange('type', e.target.value)}
            >
                <option value="">None</option>
                <option value="unlockDoor">Unlock Door</option>
                <option value="recoverHP">Recover HP</option>
                <option value="playMusic">Play Music</option>
                <option value="toggleLit">Toggle Lit</option>
                <option value="reduceHunger">Reduce Hunger</option>
            </select>
        </div>

        {editingItem.effect?.type === 'reduceHunger' && (
            <div className="form-group">
                <label>Hunger Recovery</label>
                <input type="number" value={editingItem.effect?.hungerRecovery || 0} onChange={(e) => handleEffectChange('hungerRecovery', parseInt(e.target.value) || 0)} />
            </div>
        )}

        {editingItem.effect?.type === 'playMusic' && (
            <>
                <div className="form-group">
                    <label>Audio Asset Key</label>
                    <input value={editingItem.effect?.audioAssetKey || ''} onChange={(e) => handleEffectChange('audioAssetKey', e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Offset</label>
                    <input type="number" value={editingItem.effect?.offset || 0} onChange={(e) => handleEffectChange('offset', parseInt(e.target.value) || 0)} />
                </div>
                <div className="form-group">
                    <label>Timing Type</label>
                    <select 
                        style={{ width: '100%', backgroundColor: '#3c3c3c', color: 'white', border: '1px solid #555', padding: '6px' }}
                        value={editingItem.effect?.timingType || ''} 
                        onChange={(e) => handleEffectChange('timingType', e.target.value)}
                    >
                        <option value="">None</option>
                        <option value="fixed">Fixed</option>
                        <option value="manual">Manual</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Fragment Length</label>
                    <input type="number" value={editingItem.effect?.fragmentLength || 0} onChange={(e) => handleEffectChange('fragmentLength', parseInt(e.target.value) || 0)} />
                </div>
                <div className="form-group">
                    <label>Keys</label>
                    <input type="number" value={editingItem.effect?.keys || 0} onChange={(e) => handleEffectChange('keys', parseInt(e.target.value) || 0)} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Fragments (comma separated numbers)</label>
                    <textarea 
                        style={{ width: '100%', backgroundColor: '#3c3c3c', color: 'white', border: '1px solid #555', padding: '6px' }}
                        value={editingItem.effect?.fragments?.join(', ') || ''} 
                        onChange={(e) => {
                            const vals = e.target.value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
                            handleEffectChange('fragments', vals);
                        }}
                    />
                </div>
            </>
        )}

        <div className="form-group">
            <label>Transform To (Item ID)</label>
            <div style={{ display: 'flex', gap: '5px' }}>
                <input style={{ flexGrow: 1 }} value={editingItem.effect?.transformTo || ''} onChange={(e) => handleEffectChange('transformTo', e.target.value)} />
                <button onClick={() => setItemPickerTarget('transformTo')} style={{ padding: '4px 8px' }} title="Browse items"><Search size={14} /></button>
            </div>
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
            <button className={`tab-btn ${activeTab === 'combat' ? 'active' : ''}`} onClick={() => setActiveTab('combat')} style={{ padding: '8px 15px', background: activeTab === 'combat' ? '#3a3a3a' : 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>Combat</button>
            <button className={`tab-btn ${activeTab === 'special' ? 'active' : ''}`} onClick={() => setActiveTab('special')} style={{ padding: '8px 15px', background: activeTab === 'special' ? '#3a3a3a' : 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>Special</button>
            <button className={`tab-btn ${activeTab === 'effect' ? 'active' : ''}`} onClick={() => setActiveTab('effect')} style={{ padding: '8px 15px', background: activeTab === 'effect' ? '#3a3a3a' : 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>Effect</button>
            <button className={`tab-btn ${activeTab === 'raw' ? 'active' : ''}`} onClick={() => setActiveTab('raw')} style={{ padding: '8px 15px', background: activeTab === 'raw' ? '#3a3a3a' : 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>JSON</button>
        </div>

        <div className="modal-tab-content" style={{ marginBottom: '20px' }}>
            {activeTab === 'general' && renderGeneralTab()}
            {activeTab === 'combat' && renderCombatTab()}
            {activeTab === 'special' && renderSpecialTab()}
            {activeTab === 'effect' && renderEffectTab()}
            {activeTab === 'raw' && renderRawTab()}
        </div>

        <div className="modal-actions">
          <button onClick={onCancel} style={{ backgroundColor: '#444' }}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
      {pickerTarget && (
        <AppearancePickerModal 
          onSelect={handleSelectFromPicker} 
          onCancel={() => setPickerTarget(null)} 
        />
      )}
      {itemPickerTarget && (
          <ItemPickerModal 
            onSelect={handleSelectItemFromPicker}
            onCancel={() => setItemPickerTarget(null)}
          />
      )}
    </div>
  )
}

export default EditItemModal
