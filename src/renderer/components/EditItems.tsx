import React from 'react'
import { Plus, Save, Trash2 } from 'lucide-react'
import { Item } from '../EntityTypes'
import AppearanceCanvas from './AppearanceCanvas'
import { useProject } from '../ProjectContext'

interface EditItemsProps {
  items: Item[];
  onAddItem: () => void;
  onSave: () => void;
  onEditItem: (item: Item, index: number) => void;
  onDeleteItem: (index: number) => void;
}

const EditItems: React.FC<EditItemsProps> = ({ 
  items, 
  onAddItem, 
  onSave, 
  onEditItem,
  onDeleteItem
}) => {
  const { projectData } = useProject();

  if (!projectData) return null;

  const getItemAppearance = (appearanceId: string): { tilesetId: string, frameIndex: number } | null => {
    for (const app of projectData.data.appearances) {
        const itemApp = app.items?.find(i => i.id === appearanceId);
        if (itemApp) {
            return {
                tilesetId: app.tileset,
                frameIndex: itemApp.i
            };
        }
    }
    return null;
  };

  return (
    <div className="main-area">
      <div className="toolbar">
        <button onClick={onAddItem}><Plus size={16} /> Add New</button>
        <button onClick={onSave}><Save size={16} /> Save Changes</button>
      </div>

      <h2>Items</h2>

      <table>
        <thead>
          <tr>
            <th style={{ width: '50px' }}>Icon</th>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Value</th>
            <th style={{ width: '50px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const appearanceId = (item.type === 'linkedDoor' && item.closedAppearance) ? item.closedAppearance : item.appearance;
            const appearance = appearanceId ? getItemAppearance(appearanceId) : null;
            return (
              <tr key={index} onClick={() => onEditItem(item, index)}>
                <td style={{ padding: '4px' }}>
                    {appearance ? (
                        <AppearanceCanvas 
                            tilesetId={appearance.tilesetId}
                            frameIndex={appearance.frameIndex}
                            size={32}
                        />
                    ) : (
                        <div style={{ width: 32, height: 32, background: '#333' }}></div>
                    )}
                </td>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.type || 'N/A'}</td>
                <td>{item.value || 0}</td>
                <td>
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Are you sure you want to delete ${item.name || item.id}?`)) {
                        onDeleteItem(index);
                      }
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
}

export default EditItems
