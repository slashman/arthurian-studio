import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { MobAppearance } from '../types/AppearanceEntityTypes'
import AppearanceCanvas from './AppearanceCanvas'

interface MobAppearancesTableProps {
  tilesetId: string;
  items: MobAppearance[];
  onAddItem: () => void;
  onEditItem: (item: MobAppearance, index: number) => void;
  onDeleteItem: (index: number) => void;
}

const MobAppearancesTable: React.FC<MobAppearancesTableProps> = ({ 
  tilesetId, 
  items, 
  onAddItem, 
  onEditItem, 
  onDeleteItem 
}) => {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
          <h3>Creatures</h3>
          <button onClick={onAddItem} style={{ padding: '4px 8px', fontSize: '0.8rem' }}><Plus size={14} /> Add Creature Appearance</button>
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
          {items.map((mob, idx) => (
            <tr key={idx} onClick={() => onEditItem(mob, idx)}>
              <td style={{ padding: '4px' }}>
                  <AppearanceCanvas 
                    tilesetId={tilesetId} 
                    frameIndex={mob.u && mob.u.length > 0 ? mob.u[0] : 0} 
                    size={32} 
                  />
              </td>
              <td style={{ padding: '4px' }}>
                  <AppearanceCanvas 
                    tilesetId={tilesetId} 
                    frameIndex={mob.d && mob.d.length > 0 ? mob.d[0] : 0} 
                    size={32} 
                  />
              </td>
              <td style={{ padding: '4px' }}>
                  <AppearanceCanvas 
                    tilesetId={tilesetId} 
                    frameIndex={mob.l && mob.l.length > 0 ? mob.l[0] : 0} 
                    size={32} 
                  />
              </td>
              <td style={{ padding: '4px' }}>
                  <AppearanceCanvas 
                    tilesetId={tilesetId} 
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
                      onDeleteItem(idx);
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
    </>
  )
}

export default MobAppearancesTable
