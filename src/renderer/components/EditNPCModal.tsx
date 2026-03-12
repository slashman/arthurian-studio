import React, { useState } from 'react'
import { NPC } from '../types/NPCEntityTypes'
import { MobItem } from '../types/MobEntityTypes'
import AppearanceCanvas from './AppearanceCanvas'
import ItemPickerModal from './ItemPickerModal'
import MobTypePickerModal from './MobTypePickerModal'
import EditNPCDialogs from './EditNPCDialogs'
import { useProject } from '../ProjectContext'
import { Search, Plus, Trash2, MessageSquare } from 'lucide-react'

interface EditNPCModalProps {
  editingItem: NPC;
  editIndex: number;
  onCancel: () => void;
  onConfirm: () => void;
  onUpdateItem: (updated: NPC) => void;
}

const EditNPCModal: React.FC<EditNPCModalProps> = ({ 
  editingItem, 
  editIndex, 
  onCancel, 
  onConfirm, 
  onUpdateItem 
}) => {
  const { projectData } = useProject();
  const [activeTab, setActiveTab] = useState<'general' | 'inventory' | 'dialogs' | 'raw'>('general');
  const [mobTypePickerOpen, setMobTypePickerOpen] = useState(false);
  const [itemPickerTarget, setItemPickerTarget] = useState<'weapon' | 'armor' | 'backpack' | 'list' | null>(null);
  const [itemPickerIndex, setItemPickerIndex] = useState<number>(-1);

  if (!projectData) return null;

  const resolveNPCAppearance = (typeId: string): { tilesetId: string, frameIndex: number } | null => {
    const mobType = projectData.data.mobTypes.find(m => m.id === typeId);
    if (!mobType) return null;

    const appearanceId = mobType.appearance;
    for (const app of projectData.data.appearances) {
        const mobApp = app.mobs?.find(m => m.id === appearanceId);
        if (mobApp) {
            return {
                tilesetId: app.tileset,
                frameIndex: mobApp.d && mobApp.d.length > 0 ? mobApp.d[0] : 0
            };
        }
    }
    return null;
  };

  const appearancePreview = resolveNPCAppearance(editingItem.type);

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

  const handleSelectItemFromPicker = (id: string) => {
    if (itemPickerTarget === 'list' && itemPickerIndex >= 0) {
        handleItemChange(itemPickerIndex, 'itemId', id);
    } else if (itemPickerTarget && itemPickerTarget !== 'list') {
        onUpdateItem({ ...editingItem, [itemPickerTarget]: id });
    }
    setItemPickerTarget(null);
    setItemPickerIndex(-1);
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
            <label>Mob Type</label>
            <div style={{ display: 'flex', gap: '5px' }}>
                <input style={{ flexGrow: 1 }} value={editingItem.type || ''} onChange={(e) => onUpdateItem({...editingItem, type: e.target.value})} />
                <button onClick={() => setMobTypePickerOpen(true)} style={{ padding: '4px 8px' }} title="Browse mob types"><Search size={14} /></button>
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
                <option value="player">Player</option>
                <option value="enemy">Enemy</option>
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
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Description</label>
            <textarea style={{ width: '100%', backgroundColor: '#3c3c3c', color: 'white', border: '1px solid #555', padding: '6px' }} 
                value={editingItem.description || ''} onChange={(e) => onUpdateItem({...editingItem, description: e.target.value})} />
        </div>
    </div>
  );

  const renderInventoryTab = () => (
    <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div className="form-group">
                <label>Weapon</label>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <input style={{ flexGrow: 1 }} value={editingItem.weapon || ''} onChange={(e) => onUpdateItem({...editingItem, weapon: e.target.value})} />
                    <button onClick={() => setItemPickerTarget('weapon')} style={{ padding: '4px 8px' }} title="Browse items"><Search size={14} /></button>
                </div>
            </div>
            <div className="form-group">
                <label>Armor</label>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <input style={{ flexGrow: 1 }} value={editingItem.armor || ''} onChange={(e) => onUpdateItem({...editingItem, armor: e.target.value})} />
                    <button onClick={() => setItemPickerTarget('armor')} style={{ padding: '4px 8px' }} title="Browse items"><Search size={14} /></button>
                </div>
            </div>
            <div className="form-group">
                <label>Backpack</label>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <input style={{ flexGrow: 1 }} value={editingItem.backpack || ''} onChange={(e) => onUpdateItem({...editingItem, backpack: e.target.value})} />
                    <button onClick={() => setItemPickerTarget('backpack')} style={{ padding: '4px 8px' }} title="Browse items"><Search size={14} /></button>
                </div>
            </div>
        </div>

        <div className="form-group">
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Inventory Items
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
    </div>
  );

  const renderRawTab = () => (
    <div className="form-group">
        <label>JSON Data (Full NPC Object)</label>
        <textarea 
            style={{ width: '100%', height: '350px', backgroundColor: '#1e1e1e', color: '#d4d4d4', fontFamily: 'monospace', border: '1px solid #555', padding: '10px' }}
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
      <div className="modal-content" style={{ width: '850px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h3>{editIndex >= 0 ? 'Edit' : 'Add'} NPC</h3>
        
        {/* Preview Row */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', padding: '10px', background: '#1a1a1a', borderRadius: '4px', border: '1px solid #333' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '5px' }}>Mob Type Appearance</div>
                <AppearanceCanvas 
                    tilesetId={appearancePreview?.tilesetId || ''}
                    frameIndex={appearancePreview?.frameIndex || 0}
                    size={64}
                />
            </div>
        </div>

        {/* Tab Header */}
        <div className="modal-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #444' }}>
            <button className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')} style={{ padding: '8px 15px', background: activeTab === 'general' ? '#3a3a3a' : 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>General</button>
            <button className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')} style={{ padding: '8px 15px', background: activeTab === 'inventory' ? '#3a3a3a' : 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>Inventory</button>
            <button className={`tab-btn ${activeTab === 'dialogs' ? 'active' : ''}`} onClick={() => setActiveTab('dialogs')} style={{ padding: '8px 15px', background: activeTab === 'dialogs' ? '#3a3a3a' : 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MessageSquare size={14}/> Dialogs</div></button>
            <button className={`tab-btn ${activeTab === 'raw' ? 'active' : ''}`} onClick={() => setActiveTab('raw')} style={{ padding: '8px 15px', background: activeTab === 'raw' ? '#3a3a3a' : 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>JSON</button>
        </div>

        <div className="modal-tab-content" style={{ marginBottom: '20px' }}>
            {activeTab === 'general' && renderGeneralTab()}
            {activeTab === 'inventory' && renderInventoryTab()}
            {activeTab === 'dialogs' && (
                <EditNPCDialogs 
                    dialog={editingItem.dialog || []} 
                    onUpdateDialog={(newDialog) => onUpdateItem({ ...editingItem, dialog: newDialog })} 
                />
            )}
            {activeTab === 'raw' && renderRawTab()}
        </div>

        <div className="modal-actions">
          <button onClick={onCancel} style={{ backgroundColor: '#444' }}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
      {mobTypePickerOpen && (
        <MobTypePickerModal 
          onSelect={(id) => { onUpdateItem({...editingItem, type: id}); setMobTypePickerOpen(false); }} 
          onCancel={() => setMobTypePickerOpen(false)} 
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

export default EditNPCModal
