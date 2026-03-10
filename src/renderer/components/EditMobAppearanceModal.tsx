import React from 'react'
import { MobAppearance } from '../EntityTypes'

interface EditMobAppearanceModalProps {
  editingItem: MobAppearance;
  editIndex: number;
  onCancel: () => void;
  onConfirm: () => void;
  onUpdateItem: (updated: MobAppearance) => void;
}

const EditMobAppearanceModal: React.FC<EditMobAppearanceModalProps> = ({ 
  editingItem, 
  editIndex, 
  onCancel, 
  onConfirm, 
  onUpdateItem 
}) => {
  const handleFramesChange = (direction: 'u' | 'd' | 'l' | 'r', val: string) => {
      const frames = val.split(',').map(v => parseInt(v.trim()) || 0);
      onUpdateItem({...editingItem, [direction]: frames});
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{editIndex >= 0 ? 'Edit' : 'Add'} Mob Appearance</h3>
        
        <div className="form-group">
            <label>ID</label>
            <input 
              value={editingItem.id || ''} 
              onChange={(e) => onUpdateItem({...editingItem, id: e.target.value})}
            />
        </div>

        <div className="form-group">
            <label>Up Frames (comma separated)</label>
            <input 
              value={editingItem.u?.join(', ') || ''} 
              onChange={(e) => handleFramesChange('u', e.target.value)}
            />
        </div>

        <div className="form-group">
            <label>Down Frames (comma separated)</label>
            <input 
              value={editingItem.d?.join(', ') || ''} 
              onChange={(e) => handleFramesChange('d', e.target.value)}
            />
        </div>

        <div className="form-group">
            <label>Left Frames (comma separated)</label>
            <input 
              value={editingItem.l?.join(', ') || ''} 
              onChange={(e) => handleFramesChange('l', e.target.value)}
            />
        </div>

        <div className="form-group">
            <label>Right Frames (comma separated)</label>
            <input 
              value={editingItem.r?.join(', ') || ''} 
              onChange={(e) => handleFramesChange('r', e.target.value)}
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

export default EditMobAppearanceModal
