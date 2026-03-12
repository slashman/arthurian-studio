import React from 'react'
import { MobAppearance } from '../types/AppearanceEntityTypes'
import AppearanceCanvas from './AppearanceCanvas'
import { Plus, Trash2 } from 'lucide-react'
import { useProject } from '../ProjectContext'

interface EditMobAppearanceModalProps {
  editingItem: MobAppearance;
  editIndex: number;
  tileset: string;
  onCancel: () => void;
  onConfirm: () => void;
  onUpdateItem: (updated: MobAppearance) => void;
}

const EditMobAppearanceModal: React.FC<EditMobAppearanceModalProps> = ({ 
  editingItem, 
  editIndex,
  tileset,
  onCancel, 
  onConfirm, 
  onUpdateItem 
}) => {
  const { projectData } = useProject();

  if (!projectData) return null;
  
  const handleFrameChange = (direction: 'u' | 'd' | 'l' | 'r', frameIdx: number, newVal: number) => {
      const frames = [...(editingItem[direction] || [])];
      frames[frameIdx] = newVal;
      onUpdateItem({...editingItem, [direction]: frames});
  }

  const addFrame = (direction: 'u' | 'd' | 'l' | 'r') => {
      const frames = [...(editingItem[direction] || []), 0];
      onUpdateItem({...editingItem, [direction]: frames});
  }

  const removeFrame = (direction: 'u' | 'd' | 'l' | 'r', frameIdx: number) => {
      const frames = (editingItem[direction] || []).filter((_, i) => i !== frameIdx);
      onUpdateItem({...editingItem, [direction]: frames});
  }

  const renderDirectionColumn = (label: string, direction: 'u' | 'd' | 'l' | 'r') => (
      <div style={{ flex: 1, minWidth: '120px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ margin: 0 }}>{label}</h4>
              <button onClick={() => addFrame(direction)} style={{ padding: '2px 6px', fontSize: '0.7rem' }}><Plus size={10} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(editingItem[direction] || []).map((frame, idx) => (
                  <div key={idx} style={{ background: '#2d2d2d', padding: '5px', borderRadius: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5px' }}>
                        <AppearanceCanvas 
                            tilesetId={tileset} 
                            frameIndex={frame} 
                            size={48} 
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '5px' }}>
                          <input 
                            type="number"
                            style={{ width: '100%', fontSize: '0.8rem', padding: '2px' }}
                            value={frame}
                            onChange={(e) => handleFrameChange(direction, idx, parseInt(e.target.value) || 0)}
                          />
                          <button onClick={() => removeFrame(direction, idx)} style={{ background: '#a33', padding: '2px' }}><Trash2 size={12}/></button>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  )

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h3>{editIndex >= 0 ? 'Edit' : 'Add'} Mob Appearance</h3>
        
        <div className="form-group" style={{ marginBottom: '20px' }}>
            <label>ID</label>
            <input 
              value={editingItem.id || ''} 
              onChange={(e) => onUpdateItem({...editingItem, id: e.target.value})}
            />
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
            {renderDirectionColumn('Up (U)', 'u')}
            {renderDirectionColumn('Down (D)', 'd')}
            {renderDirectionColumn('Left (L)', 'l')}
            {renderDirectionColumn('Right (R)', 'r')}
        </div>

        <div className="modal-actions" style={{ marginTop: '30px' }}>
          <button onClick={onCancel} style={{ backgroundColor: '#444' }}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  )
}

export default EditMobAppearanceModal
