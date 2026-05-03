import React, { useState } from 'react'
import { Save, Search } from 'lucide-react'
import { TilesetDefinition } from '../types/GeneralEntityTypes'
import AssetPickerModal from './AssetPickerModal'

interface EditTilesetModalProps {
  editingItem: Partial<TilesetDefinition>;
  editIndex: number;
  onCancel: () => void;
  onConfirm: () => void;
  onUpdateItem: (updated: Partial<TilesetDefinition>) => void;
}

const EditTilesetModal: React.FC<EditTilesetModalProps> = ({ 
  editingItem, 
  editIndex, 
  onCancel, 
  onConfirm, 
  onUpdateItem 
}) => {
  const [showAssetPicker, setShowAssetPicker] = useState(false);

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '500px' }}>
        <div className="modal-header">
          <h3>{editIndex >= 0 ? 'Edit Tileset' : 'Add Tileset'}</h3>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Tileset ID</label>
            <input 
              value={editingItem.id || ''} 
              onChange={(e) => onUpdateItem({...editingItem, id: e.target.value})} 
              placeholder="e.g. mobs, terrain, items"
            />
          </div>
          <div className="form-group">
            <label>Image Asset</label>
            <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  value={editingItem.file || ''} 
                  readOnly
                  placeholder="Select a PNG from res/ folder"
                  style={{ flexGrow: 1, backgroundColor: '#252526' }}
                />
                <button 
                  onClick={() => setShowAssetPicker(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
                >
                    <Search size={14} /> Browse
                </button>
            </div>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <label style={{ fontSize: '0.9rem', color: '#888', display: 'block', marginBottom: '10px' }}>
              Override Tile Dimensions (Optional)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <span style={{ fontSize: '0.7rem', color: '#666', display: 'block', marginBottom: '4px' }}>Width</span>
                    <input 
                        type="number" 
                        style={{ width: '80px' }}
                        value={editingItem.tileWidth || ''} 
                        onChange={(e) => onUpdateItem({...editingItem, tileWidth: parseInt(e.target.value) || undefined})} 
                        placeholder="Global"
                    />
                </div>
                <span style={{ marginTop: '20px', color: '#666' }}>x</span>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <span style={{ fontSize: '0.7rem', color: '#666', display: 'block', marginBottom: '4px' }}>Height</span>
                    <input 
                        type="number" 
                        style={{ width: '80px' }}
                        value={editingItem.tileHeight || ''} 
                        onChange={(e) => onUpdateItem({...editingItem, tileHeight: parseInt(e.target.value) || undefined})} 
                        placeholder="Global"
                    />
                </div>
                <span style={{ marginTop: '20px', fontSize: '0.85rem', color: '#666' }}>pixels</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#555', marginTop: '8px' }}>
              Leave blank to use the global tile size defined in World Configuration.
            </p>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onCancel} style={{ backgroundColor: '#444' }}>Cancel</button>
          <button onClick={onConfirm}><Save size={16} /> {editIndex >= 0 ? 'Update' : 'Add'}</button>
        </div>
      </div>

      {showAssetPicker && (
        <AssetPickerModal 
          onSelect={(path) => {
            onUpdateItem({...editingItem, file: path});
            setShowAssetPicker(false);
          }}
          onCancel={() => setShowAssetPicker(false)}
        />
      )}
    </div>
  )
}

export default EditTilesetModal
