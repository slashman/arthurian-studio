import React from 'react'
import { Plus, Save } from 'lucide-react'
import { MobType } from '../EntityTypes'

interface EditMobTypesProps {
  items: MobType[];
  onAddItem: () => void;
  onSave: () => void;
  onEditItem: (item: MobType, index: number) => void;
}

const EditMobTypes: React.FC<EditMobTypesProps> = ({ 
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
          {items.map((item, index) => (
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

export default EditMobTypes
