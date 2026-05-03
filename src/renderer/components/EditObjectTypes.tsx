import React from 'react'
import { Plus, Save, Trash2, Box } from 'lucide-react'
import { ObjectType } from '../types/ObjectEntityTypes'
import AppearanceCanvas from './AppearanceCanvas'
import { useProject } from '../ProjectContext'

interface EditObjectTypesProps {
  items: ObjectType[];
  onAddItem: () => void;
  onSave: () => void;
  onEditItem: (item: ObjectType, index: number) => void;
  onDeleteItem: (index: number) => void;
}

const EditObjectTypes: React.FC<EditObjectTypesProps> = ({ 
  items, 
  onAddItem, 
  onSave, 
  onEditItem,
  onDeleteItem
}) => {
  const { projectData } = useProject();

  if (!projectData) return null;

  const getObjectAppearance = (appearanceId: string): { tilesetId: string, frameIndex: number } | null => {
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

      <h2>Interactables</h2>

      <table>
        <thead>
          <tr>
            <th style={{ width: '50px' }}>Icon</th>
            <th>ID</th>
            <th>Appearances</th>
            <th style={{ width: '50px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const appearanceId = item.closedAppearance || item.appearance || item.background;
            const appearance = appearanceId ? getObjectAppearance(appearanceId) : null;
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
                        <div style={{ width: 32, height: 32, background: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Box size={16} color="#666" />
                        </div>
                    )}
                </td>
                <td>{item.id}</td>
                <td>
                    <div style={{ fontSize: '0.8rem', color: '#858585' }}>
                        {item.closedAppearance && <div>Closed: {item.closedAppearance}</div>}
                        {item.openAppearance && <div>Open: {item.openAppearance}</div>}
                        {item.background && <div>Background: {item.background}</div>}
                        {item.appearance && <div>Appearance: {item.appearance}</div>}
                    </div>
                </td>
                <td>
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Are you sure you want to delete ${item.id}?`)) {
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

export default EditObjectTypes
