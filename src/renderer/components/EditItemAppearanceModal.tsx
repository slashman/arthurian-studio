import React from 'react'
import { ItemAppearance } from '../EntityTypes'

interface EditItemAppearanceModalProps {
  editingItem: ItemAppearance;
  editIndex: number;
  onCancel: () => void;
  onConfirm: () => void;
  onUpdateItem: (updated: ItemAppearance) => void;
}

const EditItemAppearanceModal: React.FC<EditItemAppearanceModalProps> = ({ 
  editingItem, 
  editIndex, 
  onCancel, 
  onConfirm, 
  onUpdateItem 
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{editIndex >= 0 ? 'Edit' : 'Add'} Item Appearance</h3>
        
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

        <div className="modal-actions">
          <button onClick={onCancel} style={{ backgroundColor: '#444' }}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  )
}

export default EditItemAppearanceModal
