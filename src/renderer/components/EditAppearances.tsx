import React from 'react'
import { Plus, Save } from 'lucide-react'
import { Appearance, MobType, ProjectData } from '../EntityTypes'
import AppearanceCanvas from './AppearanceCanvas'

interface EditAppearancesProps {
  projectData: ProjectData;
  items: Appearance[];
  selectedAppearanceIndex: number | null;
  onAddItem: (listType: 'mobs' | 'items') => void;
  onSave: () => void;
  onEditItem: (item: any, index: number, listType: 'mobs' | 'items') => void;
}

const EditAppearances: React.FC<EditAppearancesProps> = ({ 
  projectData,
  items, 
  selectedAppearanceIndex,
  onAddItem, 
  onSave, 
  onEditItem 
}) => {

  if (selectedAppearanceIndex === null) {
      return (
          <div className="main-area">
              <h2>Appearances</h2>
              <p style={{ color: '#858585' }}>Select a tileset in the explorer to edit.</p>
          </div>
      )
  }

  const selectedAppearance = items[selectedAppearanceIndex] as Appearance;

  return (
    <div className="main-area">
      <div className="toolbar">
        <button onClick={onSave}><Save size={16} /> Save Changes</button>
      </div>

      <h2>Tileset: {selectedAppearance.tileset}</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
          <h3>Mobs</h3>
          <button onClick={() => onAddItem('mobs')} style={{ padding: '4px 8px', fontSize: '0.8rem' }}><Plus size={14} /> Add Mob Appearance</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th style={{ width: '40px' }}>U</th>
            <th style={{ width: '40px' }}>D</th>
            <th style={{ width: '40px' }}>L</th>
            <th style={{ width: '40px' }}>R</th>
          </tr>
        </thead>
        <tbody>
          {(selectedAppearance.mobs || []).map((mob, idx) => (
            <tr key={idx} onClick={() => onEditItem(mob, idx, 'mobs')}>
              <td>{mob.id}</td>
              <td style={{ padding: '4px' }}>
                  <AppearanceCanvas 
                    projectData={projectData} 
                    tilesetId={selectedAppearance.tileset} 
                    frameIndex={mob.u && mob.u.length > 0 ? mob.u[0] : 0} 
                    size={32} 
                  />
              </td>
              <td style={{ padding: '4px' }}>
                  <AppearanceCanvas 
                    projectData={projectData} 
                    tilesetId={selectedAppearance.tileset} 
                    frameIndex={mob.d && mob.d.length > 0 ? mob.d[0] : 0} 
                    size={32} 
                  />
              </td>
              <td style={{ padding: '4px' }}>
                  <AppearanceCanvas 
                    projectData={projectData} 
                    tilesetId={selectedAppearance.tileset} 
                    frameIndex={mob.l && mob.l.length > 0 ? mob.l[0] : 0} 
                    size={32} 
                  />
              </td>
              <td style={{ padding: '4px' }}>
                  <AppearanceCanvas 
                    projectData={projectData} 
                    tilesetId={selectedAppearance.tileset} 
                    frameIndex={mob.r && mob.r.length > 0 ? mob.r[0] : 0} 
                    size={32} 
                  />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' }}>
          <h3>Items</h3>
          <button onClick={() => onAddItem('items')} style={{ padding: '4px 8px', fontSize: '0.8rem' }}><Plus size={14} /> Add Item Appearance</button>
      </div>
      <table>
        <thead>
          <tr>
            <th style={{ width: '50px' }}>Icon</th>
            <th>ID</th>
            <th>Frame Index</th>
          </tr>
        </thead>
        <tbody>
          {(selectedAppearance.items || []).map((item, idx) => (
            <tr key={idx} onClick={() => onEditItem(item, idx, 'items')}>
              <td style={{ padding: '4px' }}>
                  <AppearanceCanvas 
                    projectData={projectData} 
                    tilesetId={selectedAppearance.tileset} 
                    frameIndex={item.i} 
                    size={32} 
                  />
              </td>
              <td>{item.id}</td>
              <td>{item.i}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EditAppearances
