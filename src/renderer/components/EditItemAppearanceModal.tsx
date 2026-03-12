import React from 'react'
import { ItemAppearance } from '../types/AppearanceEntityTypes'
import AppearanceCanvas from './AppearanceCanvas'
import { useProject } from '../ProjectContext'

interface EditItemAppearanceModalProps {
  editingItem: ItemAppearance;
  editIndex: number;
  tileset: string;
  onCancel: () => void;
  onConfirm: () => void;
  onUpdateItem: (updated: ItemAppearance) => void;
}

const EditItemAppearanceModal: React.FC<EditItemAppearanceModalProps> = ({ 
  editingItem, 
  editIndex,
  tileset,
  onCancel, 
  onConfirm, 
  onUpdateItem 
}) => {
  const { projectData } = useProject();

  if (!projectData) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{editIndex >= 0 ? 'Edit' : 'Add'} Item Appearance</h3>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <AppearanceCanvas 
                tilesetId={tileset} 
                frameIndex={editingItem.i || 0} 
            />

            <div style={{ flex: 1 }}>
                <div className="form-group">
                    <label>ID</label>
                    <input 
                      value={editingItem.id || ''} 
                      onChange={(e) => onUpdateItem({...editingItem, id: e.target.value})}
                    />
                </div>

                <div className="form-group">
                    <label>Frame Index</label>
                    <input 
                      type="number"
                      value={editingItem.i || 0} 
                      onChange={(e) => onUpdateItem({...editingItem, i: parseInt(e.target.value) || 0})}
                    />
                </div>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>
                    Tileset: {tileset}
                </div>
            </div>
        </div>

        <div className="modal-actions" style={{ marginTop: '20px' }}>
          <button onClick={onCancel} style={{ backgroundColor: '#444' }}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  )
}

export default EditItemAppearanceModal
