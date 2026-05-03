import React, { useState, useEffect } from 'react'
import { Save, X, Trash2 } from 'lucide-react'
import { ScenarioMap } from '../types/ScenarioEntityTypes'

interface EditMapChunkModalProps {
  chunk: ScenarioMap | null;
  x: number;
  y: number;
  onCancel: () => void;
  onConfirm: (updated: ScenarioMap | null) => void;
}

const EditMapChunkModal: React.FC<EditMapChunkModalProps> = ({ 
  chunk, 
  x, 
  y, 
  onCancel, 
  onConfirm 
}) => {
  const [editingChunk, setEditingChunk] = useState<ScenarioMap>({
    name: '',
    filename: '',
    x: x,
    y: y
  });

  useEffect(() => {
    if (chunk) {
      setEditingChunk({ ...chunk });
    } else {
      setEditingChunk({
        name: 'newMap',
        filename: 'newMap.json',
        x: x,
        y: y
      });
    }
  }, [chunk, x, y]);

  const handleSave = () => {
    onConfirm(editingChunk);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete map chunk "${editingChunk.name}"?`)) {
      onConfirm(null);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '400px' }}>
        <div className="modal-header">
          <h3>{chunk ? 'Edit Map Chunk' : 'Add Map Chunk'} at [{x}, {y}]</h3>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Chunk Name</label>
            <input 
              value={editingChunk.name} 
              onChange={(e) => setEditingChunk({...editingChunk, name: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Filename</label>
            <input 
              value={editingChunk.filename} 
              onChange={(e) => setEditingChunk({...editingChunk, filename: e.target.value})} 
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label>Grid X</label>
              <input 
                type="number"
                value={editingChunk.x} 
                onChange={(e) => setEditingChunk({...editingChunk, x: parseInt(e.target.value) || 0})} 
              />
            </div>
            <div className="form-group">
              <label>Grid Y</label>
              <input 
                type="number"
                value={editingChunk.y} 
                onChange={(e) => setEditingChunk({...editingChunk, y: parseInt(e.target.value) || 0})} 
              />
            </div>
          </div>
        </div>

        <div className="modal-actions">
          {chunk && (
            <button className="delete-btn" onClick={handleDelete} style={{ marginRight: 'auto', backgroundColor: '#ff4444' }}>
              <Trash2 size={16} /> Delete
            </button>
          )}
          <button onClick={onCancel} style={{ backgroundColor: '#444' }}>Cancel</button>
          <button onClick={handleSave}><Save size={16} /> {chunk ? 'Update' : 'Add'}</button>
        </div>
      </div>
    </div>
  )
}

export default EditMapChunkModal
