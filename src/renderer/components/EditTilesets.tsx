import React from 'react'
import { Plus, Trash2, Edit3, Save, Layers } from 'lucide-react'
import { TilesetDefinition } from '../types/GeneralEntityTypes'

interface EditTilesetsProps {
  items: TilesetDefinition[];
  onAddItem: () => void;
  onEditItem: (item: TilesetDefinition, index: number) => void;
  onDeleteItem: (index: number) => void;
  onSave: () => void;
}

const EditTilesets: React.FC<EditTilesetsProps> = ({ 
  items, 
  onAddItem, 
  onEditItem, 
  onDeleteItem, 
  onSave 
}) => {
  return (
    <div className="main-area">
      <div className="toolbar">
        <button onClick={onSave}><Save size={16} /> Save Tilesets</button>
        <button onClick={onAddItem}><Plus size={16} /> Add Tileset</button>
      </div>

      <h2>Tilesets</h2>
      <p style={{ color: '#888', marginBottom: '20px' }}>Manage the graphical assets (spritesheets) used in your project for world tiles, creatures, and items.</p>

      <div className="entity-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>File Path</th>
              <th>Tile Size</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td style={{ fontWeight: 'bold', color: '#4ec9b0' }}>{item.id}</td>
                <td style={{ color: '#ce9178' }}>{item.file}</td>
                <td>
                    {item.tileWidth || 'Global'} x {item.tileHeight || 'Global'}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => onEditItem(item, index)} title="Edit"><Edit3 size={14} /></button>
                    <button className="delete-btn" onClick={() => onDeleteItem(index)} title="Delete"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <Layers size={48} style={{ opacity: 0.2, marginBottom: '10px' }} />
            <p>No tilesets defined. Click "Add Tileset" to begin.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default EditTilesets
