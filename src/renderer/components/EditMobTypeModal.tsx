import React from 'react'
import { MobType } from '../EntityTypes'

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
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{editIndex >= 0 ? 'Edit' : 'Add'} Mob Type</h3>
        
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

        <div className="modal-actions">
          <button onClick={onCancel} style={{ backgroundColor: '#444' }}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  )
}

export default EditMobTypeModal
