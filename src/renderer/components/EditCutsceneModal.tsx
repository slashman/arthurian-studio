import React, { useState } from 'react'
import { FileText } from 'lucide-react'

interface EditCutsceneModalProps {
  editingItem: { id: string; lines: string[] };
  editIndex: number;
  onCancel: () => void;
  onConfirm: (updated: { id: string; lines: string[] }) => void;
  onUpdateItem: (updated: { id: string; lines: string[] }) => void;
}

const EditCutsceneModal: React.FC<EditCutsceneModalProps> = ({ 
  editingItem, 
  editIndex, 
  onCancel, 
  onConfirm, 
  onUpdateItem 
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '700px' }}>
        <h3>{editIndex >= 0 ? 'Edit' : 'Add'} Cutscene</h3>
        
        <div className="form-group">
            <label>ID</label>
            <input 
                value={editingItem.id || ''} 
                onChange={(e) => onUpdateItem({...editingItem, id: e.target.value})} 
                placeholder="sceneId"
            />
        </div>

        <div className="form-group" style={{ marginTop: '20px' }}>
            <label>Lines (one per line)</label>
            <textarea 
                style={{ 
                    width: '100%', 
                    minHeight: '300px', 
                    backgroundColor: '#3c3c3c', 
                    color: 'white', 
                    border: '1px solid #555', 
                    padding: '10px',
                    fontFamily: 'monospace',
                    resize: 'vertical'
                }}
                value={(editingItem.lines || []).join('\n')}
                onChange={(e) => onUpdateItem({...editingItem, lines: e.target.value.split('\n')})}
                placeholder="Enter scene dialogue lines here..."
            />
        </div>

        <div className="modal-actions" style={{ marginTop: '30px' }}>
          <button onClick={onCancel} style={{ backgroundColor: '#444' }}>Cancel</button>
          <button onClick={() => onConfirm(editingItem)}>Confirm</button>
        </div>
      </div>
    </div>
  )
}

export default EditCutsceneModal
