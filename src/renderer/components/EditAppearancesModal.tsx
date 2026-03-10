import React from 'react'
import { Appearance } from '../EntityTypes'

interface EditAppearancesModalProps {
  editingItem: Appearance;
  editIndex: number;
  onCancel: () => void;
  onConfirm: () => void;
  onUpdateItem: (updated: Appearance) => void;
}

const EditAppearancesModal: React.FC<EditAppearancesModalProps> = ({ 
  editingItem, 
  editIndex, 
  onCancel, 
  onConfirm, 
  onUpdateItem 
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{editIndex >= 0 ? 'Edit' : 'Add'} Appearance</h3>
        
        <div className="form-group">
            <label>Tileset Name</label>
            <input 
              value={editingItem.tileset || ''} 
              onChange={(e) => onUpdateItem({...editingItem, tileset: e.target.value})}
            />
        </div>

        <div className="modal-actions">
          <button onClick={onCancel} style={{ backgroundColor: '#444' }}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  )
}

export default EditAppearancesModal
