import React from 'react'
import { Plus, Save } from 'lucide-react'
import { MobType, ProjectData, Appearance, MobAppearance } from '../EntityTypes'
import AppearanceCanvas from './AppearanceCanvas'

interface EditMobTypesProps {
  projectData: ProjectData;
  items: MobType[];
  onAddItem: () => void;
  onSave: () => void;
  onEditItem: (item: MobType, index: number) => void;
}

const EditMobTypes: React.FC<EditMobTypesProps> = ({ 
  projectData,
  items, 
  onAddItem, 
  onSave, 
  onEditItem 
}) => {

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
                            projectData={projectData}
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
}

export default EditMobTypes
