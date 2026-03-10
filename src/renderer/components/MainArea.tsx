import React from 'react'
import { Plus, Save } from 'lucide-react'
import { MobType, Appearance, MobAppearance, ItemAppearance } from '../EntityTypes'

interface MainAreaProps {
  activeTab: 'mobTypes' | 'appearances';
  items: any[];
  selectedAppearanceIndex: number | null;
  onAddItem: (listType?: 'mobs' | 'items') => void;
  onSave: () => void;
  onEditItem: (item: any, index: number, listType?: 'mobs' | 'items') => void;
}

const MainArea: React.FC<MainAreaProps> = ({ 
  activeTab, 
  items, 
  selectedAppearanceIndex,
  onAddItem, 
  onSave, 
  onEditItem 
}) => {

  if (activeTab === 'appearances' && selectedAppearanceIndex === null) {
      return (
          <div className="main-area">
              <h2>Appearances</h2>
              <p style={{ color: '#858585' }}>Select a tileset in the explorer to edit.</p>
          </div>
      )
  }

  if (activeTab === 'appearances') {
      const selectedAppearance = items[selectedAppearanceIndex!] as Appearance;
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
                <th>Frame Indices (u, d, l, r)</th>
              </tr>
            </thead>
            <tbody>
              {(selectedAppearance.mobs || []).map((mob, idx) => (
                <tr key={idx} onClick={() => onEditItem(mob, idx, 'mobs')}>
                  <td>{mob.id}</td>
                  <td style={{ fontSize: '0.85rem' }}>
                    U:[{mob.u?.join(',')}] D:[{mob.d?.join(',')}] L:[{mob.l?.join(',')}] R:[{mob.r?.join(',')}]
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
                <th>ID</th>
                <th>Frame Index</th>
              </tr>
            </thead>
            <tbody>
              {(selectedAppearance.items || []).map((item, idx) => (
                <tr key={idx} onClick={() => onEditItem(item, idx, 'items')}>
                  <td>{item.id}</td>
                  <td>{item.i}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
  }

  // Default Mob Types view
  return (
    <div className="main-area">
      <div className="toolbar">
        <button onClick={() => onAddItem()}><Plus size={16} /> Add New</button>
        <button onClick={onSave}><Save size={16} /> Save Changes</button>
      </div>

      <h2>Mob Types</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>HP</th>
            <th>Damage</th>
          </tr>
        </thead>
        <tbody>
          {(items as MobType[]).map((item, index) => (
            <tr key={index} onClick={() => onEditItem(item, index)}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.hp}</td>
              <td>{item.damage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MainArea
