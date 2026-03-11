import React from 'react'
import { Plus, Save, Trash2 } from 'lucide-react'
import { MobType } from '../EntityTypes'
import AppearanceCanvas from './AppearanceCanvas'
import { useProject } from '../ProjectContext'

interface EditMobTypesProps {
  items: MobType[];
  onAddItem: () => void;
  onSave: () => void;
  onEditItem: (item: MobType, index: number) => void;
  onDeleteItem: (index: number) => void;
}

const EditMobTypes: React.FC<EditMobTypesProps> = ({ 
  items, 
  onAddItem, 
  onSave, 
  onEditItem,
  onDeleteItem
}) => {
  const { projectData } = useProject();

  if (!projectData) return null;

  const getMobAppearance = (appearanceId: string): { tilesetId: string, frameIndex: number } | null => {
    for (const app of projectData.data.appearances) {
        const mobApp = app.mobs?.find(m => m.id === appearanceId);
        if (mobApp) {
            return {
                tilesetId: app.tileset,
                frameIndex: mobApp.d && mobApp.d.length > 0 ? mobApp.d[0] : 0
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

      <h2>Mob Types</h2>

      <table>
        <thead>
          <tr>
            <th style={{ width: '50px' }}>Icon</th>
            <th>ID</th>
            <th>Name</th>
            <th>HP</th>
            <th>Damage</th>
            <th style={{ width: '50px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const appearance = getMobAppearance(item.appearance);
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
                <td>{item.hp}</td>
                <td>{item.damage}</td>
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

export default EditMobTypes
