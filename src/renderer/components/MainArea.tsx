import React from 'react'
import { Plus, Save } from 'lucide-react'
import { MobType, Appearance } from '../EntityTypes'

interface MainAreaProps {
  activeTab: 'mobTypes' | 'appearances';
  items: any[];
  onAddItem: () => void;
  onSave: () => void;
  onEditItem: (item: any, index: number) => void;
}

const MainArea: React.FC<MainAreaProps> = ({ 
  activeTab, 
  items, 
  onAddItem, 
  onSave, 
  onEditItem 
}) => {
  return (
    <div className="main-area">
      <div className="toolbar">
        <button onClick={onAddItem}><Plus size={16} /> Add New</button>
        <button onClick={onSave}><Save size={16} /> Save Changes</button>
      </div>

      <h2>{activeTab === 'mobTypes' ? 'Mob Types' : 'Appearances'}</h2>

      <table>
        <thead>
          <tr>
            {activeTab === 'mobTypes' ? (
              <>
                <th>ID</th>
                <th>Name</th>
                <th>HP</th>
                <th>Damage</th>
              </>
            ) : (
              <>
                <th>Tileset</th>
                <th>Details</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} onClick={() => onEditItem(item, index)}>
              {activeTab === 'mobTypes' ? (
                <>
                  <td>{(item as MobType).id}</td>
                  <td>{(item as MobType).name}</td>
                  <td>{(item as MobType).hp}</td>
                  <td>{(item as MobType).damage}</td>
                </>
              ) : (
                <>
                  <td>{(item as Appearance).tileset}</td>
                  <td>
                    {(item as Appearance).mobs ? `${(item as Appearance).mobs?.length} mobs ` : ''} 
                    {(item as Appearance).items ? `${(item as Appearance).items?.length} items` : ''}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MainArea
