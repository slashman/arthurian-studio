import React from 'react'
import { Plus, Save, Trash2 } from 'lucide-react'
import { Appearance } from '../EntityTypes'
import AppearanceCanvas from './AppearanceCanvas'
import { useProject } from '../ProjectContext'

interface EditAppearancesProps {
  items: Appearance[];
  selectedAppearanceIndex: number | null;
  onAddItem: (listType: 'mobs' | 'items') => void;
  onSave: () => void;
  onEditItem: (item: any, index: number, listType: 'mobs' | 'items') => void;
  onDeleteItem: (index: number, listType: 'mobs' | 'items') => void;
}

const EditAppearances: React.FC<EditAppearancesProps> = ({ 
  items, 
  selectedAppearanceIndex,
  onAddItem, 
  onSave, 
  onEditItem,
  onDeleteItem
}) => {
  const { projectData } = useProject();

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
            <th style={{ width: '40px' }}>U</th>
            <th style={{ width: '40px' }}>D</th>
            <th style={{ width: '40px' }}>L</th>
            <th style={{ width: '40px' }}>R</th>
            <th>ID</th>
            <th style={{ width: '50px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(selectedAppearance.mobs || []).map((mob, idx) => (
            <tr key={idx} onClick={() => onEditItem(mob, idx, 'mobs')}>
              <td style={{ padding: '4px' }}>
                  <AppearanceCanvas 
                    tilesetId={selectedAppearance.tileset} 
                    frameIndex={mob.u && mob.u.length > 0 ? mob.u[0] : 0} 
                    size={32} 
                  />
              </td>
              <td style={{ padding: '4px' }}>
                  <AppearanceCanvas 
                    tilesetId={selectedAppearance.tileset} 
                    frameIndex={mob.d && mob.d.length > 0 ? mob.d[0] : 0} 
                    size={32} 
                  />
              </td>
              <td style={{ padding: '4px' }}>
                  <AppearanceCanvas 
                    tilesetId={selectedAppearance.tileset} 
                    frameIndex={mob.l && mob.l.length > 0 ? mob.l[0] : 0} 
                    size={32} 
                  />
              </td>
              <td style={{ padding: '4px' }}>
                  <AppearanceCanvas 
                    tilesetId={selectedAppearance.tileset} 
                    frameIndex={mob.r && mob.r.length > 0 ? mob.r[0] : 0} 
                    size={32} 
                  />
              </td>
              <td>{mob.id}</td>
              <td>
                <button 
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Are you sure you want to delete mob appearance ${mob.id}?`)) {
                      onDeleteItem(idx, 'mobs');
                    }
                  }}
                  style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
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
            <th style={{ width: '50px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(selectedAppearance.items || []).map((item, idx) => (
            <tr key={idx} onClick={() => onEditItem(item, idx, 'items')}>
              <td style={{ padding: '4px' }}>
                  <AppearanceCanvas 
                    tilesetId={selectedAppearance.tileset} 
                    frameIndex={item.i} 
                    size={32} 
                  />
              </td>
              <td>{item.id}</td>
              <td>{item.i}</td>
              <td>
                <button 
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Are you sure you want to delete item appearance ${item.id}?`)) {
                      onDeleteItem(idx, 'items');
                    }
                  }}
                  style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EditAppearances
