import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { ItemAppearance } from '../types/AppearanceEntityTypes'
import AppearanceCanvas from './AppearanceCanvas'

interface ItemAppearancesTableProps {
  tilesetId: string;
  items: ItemAppearance[];
  onAddItem: () => void;
  onEditItem: (item: ItemAppearance, index: number) => void;
  onDeleteItem: (index: number) => void;
}

const ItemAppearancesTable: React.FC<ItemAppearancesTableProps> = ({ 
  tilesetId, 
  items, 
  onAddItem, 
  onEditItem, 
  onDeleteItem 
}) => {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' }}>
          <h3>Items</h3>
          <button onClick={onAddItem} style={{ padding: '4px 8px', fontSize: '0.8rem' }}><Plus size={14} /> Add Item Appearance</button>
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
          {items.map((item, idx) => (
            <tr key={idx} onClick={() => onEditItem(item, idx)}>
              <td style={{ padding: '4px' }}>
                  <AppearanceCanvas 
                    tilesetId={tilesetId} 
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

export default ItemAppearancesTable
