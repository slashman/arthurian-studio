import React from 'react'
import { Plus, Save, Trash2 } from 'lucide-react'
import { NPC } from '../types/NPCEntityTypes'
import AppearanceCanvas from './AppearanceCanvas'
import { useProject } from '../ProjectContext'

interface EditNPCsProps {
  items: NPC[];
  onAddItem: () => void;
  onSave: () => void;
  onEditItem: (item: NPC, index: number) => void;
  onDeleteItem: (index: number) => void;
}

const EditNPCs: React.FC<EditNPCsProps> = ({ 
  items, 
  onAddItem, 
  onSave, 
  onEditItem,
  onDeleteItem
}) => {
  const { projectData } = useProject();

  if (!projectData) return null;

  const getNPCAppearance = (npc: NPC): { tilesetId: string, frameIndex: number } | null => {
    const mobType = projectData.data.mobTypes.find(m => m.id === npc.type);
    if (!mobType) return null;

    const appearanceId = mobType.appearance;
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

      <h2>NPCs</h2>
      <p style={{ color: '#888', marginBottom: '20px' }}>Unique instances of characters in the world. NPCs are built upon Creature templates but have specific behaviors, dialogs and schedules.</p>

      <table>
        <thead>
          <tr>
            <th style={{ width: '50px' }}>Icon</th>
            <th>ID</th>
            <th>Name</th>
            <th>Creature</th>
            <th>Alignment</th>
            <th style={{ width: '50px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const appearance = getNPCAppearance(item);
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
                <td>{item.type}</td>
                <td>{item.alignment || 'N/A'}</td>
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

export default EditNPCs
