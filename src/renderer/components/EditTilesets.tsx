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
      <p style={{ color: '#888', marginBottom: '20px' }}>Tilesets are the core graphical assets of your project. They are spritesheets containing multiple frames for world tiles, creatures, and items.</p>
      
      <div style={{ backgroundColor: '#1e1e1e', padding: '15px', borderRadius: '5px', marginBottom: '20px', borderLeft: '4px solid #4ec9b0' }}>
          <h4 style={{ marginTop: 0, color: '#4ec9b0' }}>How to use:</h4>
          <ul style={{ color: '#ccc', fontSize: '0.9rem', paddingLeft: '20px' }}>
              <li><strong>Add Tileset:</strong> Register a new PNG file as a tileset.</li>
              <li><strong>Appearances:</strong> Once added, look at the sidebar under the Tilesets section. Each tileset has its own sub-item.</li>
              <li><strong>Define Regions:</strong> Select a tileset in the sidebar to define specific regions of the spritesheet as Creature or Item appearances.</li>
          </ul>
      </div>

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
