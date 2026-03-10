import React from 'react'
import { MobType, Appearance } from '../EntityTypes'

interface EditModalProps {
  activeTab: 'mobTypes' | 'appearances';
  editingItem: any;
  editIndex: number;
  onCancel: () => void;
  onConfirm: () => void;
  onUpdateItem: (updated: any) => void;
}

const EditModal: React.FC<EditModalProps> = ({ 
  activeTab, 
  editingItem, 
  editIndex, 
  onCancel, 
  onConfirm, 
  onUpdateItem 
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{editIndex >= 0 ? 'Edit' : 'Add'} {activeTab === 'mobTypes' ? 'Mob Type' : 'Appearance'}</h3>
        
        <div className="form-group">
            <label>ID / Tileset Name</label>
            <input 
              value={activeTab === 'mobTypes' ? (editingItem.id || '') : (editingItem.tileset || '')} 
              onChange={(e) => {
                  const val = e.target.value;
                  onUpdateItem(activeTab === 'mobTypes' ? {...editingItem, id: val} : {...editingItem, tileset: val})
              }}
            />
        </div>

        {activeTab === 'mobTypes' && (
            <>
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
            </>
        )}

        <div className="modal-actions">
          <button onClick={onCancel} style={{ backgroundColor: '#444' }}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  )
}

export default EditModal
