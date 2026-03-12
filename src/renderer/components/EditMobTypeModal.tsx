import React, { useState } from 'react'
import { MobType, MobItem } from '../types/MobEntityTypes'
import { Plus, Trash2, Search } from 'lucide-react'
import AppearanceCanvas from './AppearanceCanvas'
import AppearancePickerModal from './AppearancePickerModal'
import ItemPickerModal from './ItemPickerModal'
import { useProject } from '../ProjectContext'

interface EditMobTypeModalProps {
  editingItem: MobType;
  editIndex: number;
  onCancel: () => void;
  onConfirm: () => void;
  onUpdateItem: (updated: MobType) => void;
}

const EditMobTypeModal: React.FC<EditMobTypeModalProps> = ({ 
  editingItem, 
  editIndex, 
  onCancel, 
  onConfirm, 
  onUpdateItem 
}) => {
  const { projectData } = useProject();
  const [pickerTarget, setPickerTarget] = useState<'appearance' | 'portrait' | null>(null);
  const [itemPickerTarget, setItemPickerTarget] = useState<'corpse' | 'weapon' | 'list' | null>(null);
  const [itemPickerIndex, setItemPickerIndex] = useState<number>(-1);

  if (!projectData) return null;

  const handleItemChange = (index: number, field: keyof MobItem, value: string | number) => {
    const newItems = [...(editingItem.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    onUpdateItem({ ...editingItem, items: newItems });
  };

  const addItem = () => {
    const newItems = [...(editingItem.items || []), { itemId: '', quantity: 1 }];
    onUpdateItem({ ...editingItem, items: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = (editingItem.items || []).filter((_, i) => i !== index);
    onUpdateItem({ ...editingItem, items: newItems });
  };

  const resolveAppearance = (id: string): { tilesetId: string, frameIndex: number } | null => {
    if (!id) return null;
    for (const app of projectData.data.appearances) {
        // Check mobs
        const mobApp = app.mobs?.find(m => m.id === id);
        if (mobApp) {
            return {
                tilesetId: app.tileset,
                frameIndex: mobApp.d && mobApp.d.length > 0 ? mobApp.d[0] : 0
            };
        }
        // Check items
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
  const portraitPreview = resolveAppearance(editingItem.portrait);

  const handleSelectFromPicker = (id: string) => {
    if (pickerTarget) {
      onUpdateItem({ ...editingItem, [pickerTarget]: id });
      setPickerTarget(null);
    }
  };

  const handleSelectItemFromPicker = (id: string) => {
    if (itemPickerTarget === 'list' && itemPickerIndex >= 0) {
        handleItemChange(itemPickerIndex, 'itemId', id);
    } else if (itemPickerTarget === 'corpse' || itemPickerTarget === 'weapon') {
        onUpdateItem({ ...editingItem, [itemPickerTarget]: id });
    }
    setItemPickerTarget(null);
    setItemPickerIndex(-1);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '650px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h3>{editIndex >= 0 ? 'Edit' : 'Add'} Mob Type</h3>
        
        {/* Preview Row */}
        <div style={{ display: 'flex', gap: '30px', marginBottom: '25px', padding: '10px', background: '#1a1a1a', borderRadius: '4px', border: '1px solid #333' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '5px' }}>Appearance</div>
                <AppearanceCanvas 
                    tilesetId={appearancePreview?.tilesetId || ''}
                    frameIndex={appearancePreview?.frameIndex || 0}
                    size={64}
                />
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '5px' }}>Portrait</div>
                <AppearanceCanvas 
                    tilesetId={portraitPreview?.tilesetId || ''}
                    frameIndex={portraitPreview?.frameIndex || 0}
                    size={64}
                />
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
                <label>ID</label>
                <input 
                value={editingItem.id || ''} 
                onChange={(e) => onUpdateItem({...editingItem, id: e.target.value})}
                />
            </div>

            <div className="form-group">
                <label>Name</label>
                <input 
                value={editingItem.name || ''} 
                onChange={(e) => onUpdateItem({...editingItem, name: e.target.value})}
                />
            </div>

            <div className="form-group">
                <label>Appearance ID</label>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <input 
                    style={{ flexGrow: 1 }}
                    value={editingItem.appearance || ''} 
                    onChange={(e) => onUpdateItem({...editingItem, appearance: e.target.value})}
                    />
                    <button onClick={() => setPickerTarget('appearance')} style={{ padding: '4px 8px' }} title="Browse appearances"><Search size={14} /></button>
                </div>
            </div>

            <div className="form-group">
                <label>Corpse ID</label>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <input 
                    style={{ flexGrow: 1 }}
                    value={editingItem.corpse || ''} 
                    onChange={(e) => onUpdateItem({...editingItem, corpse: e.target.value})}
                    />
                    <button onClick={() => setItemPickerTarget('corpse')} style={{ padding: '4px 8px' }} title="Browse items"><Search size={14} /></button>
                </div>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px' }}>
            <div className="form-group">
                <label>HP</label>
                <input 
                  type="number"
                  value={editingItem.hp || 0} 
                  onChange={(e) => onUpdateItem({...editingItem, hp: parseInt(e.target.value) || 0})}
                />
            </div>

            <div className="form-group">
                <label>Damage</label>
                <input 
                  type="number"
                  value={editingItem.damage || 0} 
                  onChange={(e) => onUpdateItem({...editingItem, damage: parseInt(e.target.value) || 0})}
                />
            </div>

            <div className="form-group">
                <label>Defense</label>
                <input 
                  type="number"
                  value={editingItem.defense || 0} 
                  onChange={(e) => onUpdateItem({...editingItem, defense: parseInt(e.target.value) || 0})}
                />
            </div>

            <div className="form-group">
                <label>Speed</label>
                <input 
                  type="number"
                  value={editingItem.speed || 0} 
                  onChange={(e) => onUpdateItem({...editingItem, speed: parseInt(e.target.value) || 0})}
                />
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
                <label>Weapon</label>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <input 
                    style={{ flexGrow: 1 }}
                    value={editingItem.weapon || ''} 
                    onChange={(e) => onUpdateItem({...editingItem, weapon: e.target.value})}
                    />
                    <button onClick={() => setItemPickerTarget('weapon')} style={{ padding: '4px 8px' }} title="Browse items"><Search size={14} /></button>
                </div>
            </div>

            <div className="form-group">
                <label>Portrait ID</label>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <input 
                    style={{ flexGrow: 1 }}
                    value={editingItem.portrait || ''} 
                    onChange={(e) => onUpdateItem({...editingItem, portrait: e.target.value})}
                    />
                    <button onClick={() => setPickerTarget('portrait')} style={{ padding: '4px 8px' }} title="Browse appearances"><Search size={14} /></button>
                </div>
            </div>

            <div className="form-group">
                <label>Alignment</label>
                <select 
                  style={{ width: '100%', backgroundColor: '#3c3c3c', color: 'white', border: '1px solid #555', padding: '6px' }}
                  value={editingItem.alignment || ''} 
                  onChange={(e) => onUpdateItem({...editingItem, alignment: e.target.value})}
                >
                    <option value="">None</option>
                    <option value="enemy">Enemy</option>
                    <option value="player">Player</option>
                </select>
            </div>

            <div className="form-group">
                <label>Intent</label>
                <select 
                  style={{ width: '100%', backgroundColor: '#3c3c3c', color: 'white', border: '1px solid #555', padding: '6px' }}
                  value={editingItem.intent || ''} 
                  onChange={(e) => onUpdateItem({...editingItem, intent: e.target.value})}
                >
                    <option value="">None</option>
                    <option value="waitCommand">Wait Command</option>
                    <option value="seekPlayer">Seek Player</option>
                    <option value="followSchedule">Follow Schedule</option>
                </select>
            </div>
        </div>

        <div className="form-group">
            <label>Description</label>
            <textarea 
              style={{ width: '100%', backgroundColor: '#3c3c3c', color: 'white', border: '1px solid #555', padding: '6px' }}
              value={editingItem.description || ''} 
              onChange={(e) => onUpdateItem({...editingItem, description: e.target.value})}
            />
        </div>

        <div className="form-group">
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Items
                <button onClick={addItem} style={{ padding: '2px 8px', fontSize: '0.8rem' }}><Plus size={12} /> Add Item</button>
            </label>
            <div style={{ marginTop: '10px', background: '#2d2d2d', padding: '10px' }}>
                {(editingItem.items || []).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '5px', flex: 2 }}>
                            <input 
                                placeholder="Item ID"
                                style={{ flexGrow: 1 }}
                                value={item.itemId} 
                                onChange={(e) => handleItemChange(idx, 'itemId', e.target.value)}
                            />
                            <button onClick={() => { setItemPickerTarget('list'); setItemPickerIndex(idx); }} style={{ padding: '4px 8px' }} title="Browse items"><Search size={14} /></button>
                        </div>
                        <input 
                            type="number"
                            placeholder="Qty"
                            style={{ flex: 1 }}
                            value={item.quantity} 
                            onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value) || 0)}
                        />
                        <button onClick={() => removeItem(idx)} style={{ backgroundColor: '#a33', padding: '4px' }}>
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
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
            onCancel={() => { setItemPickerTarget(null); setItemPickerIndex(-1); }}
          />
      )}
    </div>
  )
}

export default EditMobTypeModal
