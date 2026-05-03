import React from 'react'
import { Plus, Save, Trash2, FileText } from 'lucide-react'

interface Cutscene {
    id: string;
    lines: string[];
}

interface EditCutscenesProps {
  items: Cutscene[];
  onAddItem: () => void;
  onSave: () => void;
  onEditItem: (item: Cutscene, index: number) => void;
  onDeleteItem: (index: number) => void;
}

const EditCutscenes: React.FC<EditCutscenesProps> = ({ 
  items, 
  onAddItem, 
  onSave, 
  onEditItem,
  onDeleteItem
}) => {
  return (
    <div className="main-area">
      <div className="toolbar">
        <button onClick={onAddItem}><Plus size={16} /> Add New</button>
        <button onClick={onSave}><Save size={16} /> Save Changes</button>
      </div>

      <h2>Cutscenes</h2>

      <table>
        <thead>
          <tr>
            <th style={{ width: '200px' }}>ID</th>
            <th>Snippet</th>
            <th style={{ width: '100px' }}>Lines</th>
            <th style={{ width: '50px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const snippet = item.lines.length > 0 ? item.lines[0] : '(Empty)';
            return (
              <tr key={index} onClick={() => onEditItem(item, index)}>
                <td style={{ fontWeight: 'bold', color: '#4ec9b0' }}>{item.id}</td>
                <td style={{ color: '#888', fontSize: '0.9rem' }}>
                    {snippet.substring(0, 100)}{snippet.length > 100 ? '...' : ''}
                </td>
                <td>{item.lines.length}</td>
                <td>
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Are you sure you want to delete cutscene "${item.id}"?`)) {
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

export default EditCutscenes
