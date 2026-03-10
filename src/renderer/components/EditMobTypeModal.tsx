import React from 'react'
import { MobType, MobItem } from '../EntityTypes'
import { Plus, Trash2 } from 'lucide-react'
import AppearanceCanvas from './AppearanceCanvas'
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
  const corpsePreview = resolveAppearance(editingItem.corpse);
  const portraitPreview = resolveAppearance(editingItem.portrait);

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
                <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '5px' }}>Corpse</div>
                <AppearanceCanvas 
                    tilesetId={corpsePreview?.tilesetId || ''}
                    frameIndex={corpsePreview?.frameIndex || 0}
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
                <input 
                value={editingItem.appearance || ''} 
                onChange={(e) => onUpdateItem({...editingItem, appearance: e.target.value})}
                />
            </div>

            <div className="form-group">
                <label>Corpse ID</label>
                <input 
                value={editingItem.corpse || ''} 
                onChange={(e) => onUpdateItem({...editingItem, corpse: e.target.value})}
                />
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
                <input 
                  value={editingItem.weapon || ''} 
                  onChange={(e) => onUpdateItem({...editingItem, weapon: e.target.value})}
                />
            </div>

            <div className="form-group">
                <label>Portrait ID</label>
                <input 
                  value={editingItem.portrait || ''} 
                  onChange={(e) => onUpdateItem({...editingItem, portrait: e.target.value})}
                />
            </div>

            <div className="form-group">
                <label>Alignment</label>
                <input 
                  value={editingItem.alignment || ''} 
                  onChange={(e) => onUpdateItem({...editingItem, alignment: e.target.value})}
                />
            </div>

            <div className="form-group">
                <label>Intent</label>
                <input 
                  value={editingItem.intent || ''} 
                  onChange={(e) => onUpdateItem({...editingItem, intent: e.target.value})}
                />
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
                        <input 
                            placeholder="Item ID"
                            style={{ flex: 2 }}
                            value={item.itemId} 
                            onChange={(e) => handleItemChange(idx, 'itemId', e.target.value)}
                        />
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
    </div>
  )
}

export default EditMobTypeModal
