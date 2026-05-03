import React, { useState } from 'react'
import { ObjectType } from '../types/ObjectEntityTypes'
import AppearanceCanvas from './AppearanceCanvas'
import AppearancePickerModal from './AppearancePickerModal'
import { useProject } from '../ProjectContext'
import { Search } from 'lucide-react'

interface EditObjectTypeModalProps {
  editingItem: ObjectType;
  editIndex: number;
  onCancel: () => void;
  onConfirm: () => void;
  onUpdateItem: (updated: ObjectType) => void;
}

const EditObjectTypeModal: React.FC<EditObjectTypeModalProps> = ({ 
  editingItem, 
  editIndex, 
  onCancel, 
  onConfirm, 
  onUpdateItem 
}) => {
  const { projectData } = useProject();
  const [pickerTarget, setPickerTarget] = useState<'closedAppearance' | 'openAppearance' | 'background' | 'appearance' | null>(null);

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

  const closedPreview = resolveAppearance(editingItem.closedAppearance);
  const openPreview = resolveAppearance(editingItem.openAppearance);
  const backgroundPreview = resolveAppearance(editingItem.background);
  const appearancePreview = resolveAppearance(editingItem.appearance);

  const handleSelectFromPicker = (id: string) => {
    if (pickerTarget) {
      onUpdateItem({ ...editingItem, [pickerTarget]: id });
      setPickerTarget(null);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '600px' }}>
        <h3>{editIndex >= 0 ? 'Edit' : 'Add'} Interactable</h3>
        
        <div className="form-group">
            <label>ID</label>
            <input value={editingItem.id || ''} onChange={(e) => onUpdateItem({...editingItem, id: e.target.value})} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
            {/* Toggleable Section */}
            <div style={{ padding: '15px', background: '#1a1a1a', borderRadius: '4px', border: '1px solid #333' }}>
                <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#888' }}>Toggleable Object</h4>
                
                <div className="form-group">
                    <label>Closed Appearance</label>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <input style={{ flexGrow: 1 }} value={editingItem.closedAppearance || ''} onChange={(e) => onUpdateItem({...editingItem, closedAppearance: e.target.value})} />
                        <button onClick={() => setPickerTarget('closedAppearance')} style={{ padding: '4px 8px' }} title="Browse appearances"><Search size={14} /></button>
                    </div>
                    {closedPreview && (
                        <div style={{ marginTop: '10px', textAlign: 'center' }}>
                            <AppearanceCanvas tilesetId={closedPreview.tilesetId} frameIndex={closedPreview.frameIndex} size={64} />
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label>Open Appearance</label>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <input style={{ flexGrow: 1 }} value={editingItem.openAppearance || ''} onChange={(e) => onUpdateItem({...editingItem, openAppearance: e.target.value})} />
                        <button onClick={() => setPickerTarget('openAppearance')} style={{ padding: '4px 8px' }} title="Browse appearances"><Search size={14} /></button>
                    </div>
                    {openPreview && (
                        <div style={{ marginTop: '10px', textAlign: 'center' }}>
                            <AppearanceCanvas tilesetId={openPreview.tilesetId} frameIndex={openPreview.frameIndex} size={64} />
                        </div>
                    )}
                </div>
            </div>

            {/* Inspectable Section */}
            <div style={{ padding: '15px', background: '#1a1a1a', borderRadius: '4px', border: '1px solid #333' }}>
                <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#888' }}>Inspectable Object</h4>

                <div className="form-group">
                    <label>Background</label>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <input style={{ flexGrow: 1 }} value={editingItem.background || ''} onChange={(e) => onUpdateItem({...editingItem, background: e.target.value})} />
                        <button onClick={() => setPickerTarget('background')} style={{ padding: '4px 8px' }} title="Browse appearances"><Search size={14} /></button>
                    </div>
                    {backgroundPreview && (
                        <div style={{ marginTop: '10px', textAlign: 'center' }}>
                            <AppearanceCanvas tilesetId={backgroundPreview.tilesetId} frameIndex={backgroundPreview.frameIndex} size={64} />
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label>Appearance</label>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <input style={{ flexGrow: 1 }} value={editingItem.appearance || ''} onChange={(e) => onUpdateItem({...editingItem, appearance: e.target.value})} />
                        <button onClick={() => setPickerTarget('appearance')} style={{ padding: '4px 8px' }} title="Browse appearances"><Search size={14} /></button>
                    </div>
                    {appearancePreview && (
                        <div style={{ marginTop: '10px', textAlign: 'center' }}>
                            <AppearanceCanvas tilesetId={appearancePreview.tilesetId} frameIndex={appearancePreview.frameIndex} size={64} />
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className="modal-actions" style={{ marginTop: '30px' }}>
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
    </div>
  )
}

export default EditObjectTypeModal
