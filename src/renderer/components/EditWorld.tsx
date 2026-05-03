import React, { useState } from 'react'
import { Save, Plus } from 'lucide-react'
import { Scenario } from '../types/ScenarioEntityTypes'
import EditMapChunkModal from './EditMapChunkModal'

interface EditWorldProps {
  scenario: Scenario;
  onSave: () => void;
  onUpdateScenario: (updated: Scenario) => void;
}

const EditWorld: React.FC<EditWorldProps> = ({ 
  scenario, 
  onSave, 
  onUpdateScenario 
}) => {
  const [editingPos, setEditingPos] = useState<{x: number, y: number} | null>(null);

  if (!scenario) return null;

  const { chunksWidth, chunksHeight } = scenario.config;

  const getChunkAt = (x: number, y: number) => {
    return scenario.maps.find(m => m.x === x && m.y === y);
  };

  const handleGridClick = (x: number, y: number) => {
    setEditingPos({ x, y });
  };

  const handleConfirmChunk = (updatedChunk: any | null) => {
    if (!editingPos) return;

    let newMaps = [...scenario.maps];

    if (updatedChunk === null) {
      // Deletion
      newMaps = newMaps.filter(m => !(m.x === editingPos.x && m.y === editingPos.y));
    } else {
      // Collision check if moving
      const isMovingOrNew = !getChunkAt(editingPos.x, editingPos.y) || 
                            updatedChunk.x !== editingPos.x || 
                            updatedChunk.y !== editingPos.y;
      
      if (isMovingOrNew) {
        const collision = scenario.maps.find(m => m.x === updatedChunk.x && m.y === updatedChunk.y && !(m.x === editingPos.x && m.y === editingPos.y));
        if (collision) {
          if (!confirm(`A chunk ("${collision.name}") already exists at [${updatedChunk.x}, ${updatedChunk.y}]. Overwrite it?`)) {
            return;
          }
          newMaps = newMaps.filter(m => !(m.x === updatedChunk.x && m.y === updatedChunk.y));
        }
      }

      // Remove old position if it existed
      newMaps = newMaps.filter(m => !(m.x === editingPos.x && m.y === editingPos.y));
      // Add new/updated
      newMaps.push(updatedChunk);
    }

    onUpdateScenario({ ...scenario, maps: newMaps });
    setEditingPos(null);
  };

  return (
    <div className="main-area">
      <div className="toolbar">
        <button onClick={onSave}><Save size={16} /> Save Changes</button>
      </div>

      <h2>Map Chunks</h2>
      <p style={{ color: '#888', marginBottom: '20px' }}>Manage the layout of your world by placing map files on the global grid.</p>

      <div style={{ background: '#1a1a1a', borderRadius: '4px', padding: '20px', overflow: 'auto', border: '1px solid #333', height: 'calc(100vh - 180px)' }}>
          <div style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${chunksWidth}, 150px)`,
              gridTemplateRows: `repeat(${chunksHeight}, 120px)`,
              gap: '10px'
          }}>
              {Array.from({ length: chunksHeight }).map((_, y) => (
                  Array.from({ length: chunksWidth }).map((_, x) => {
                      const chunk = getChunkAt(x, y);
                      return (
                          <div 
                              key={`${x}-${y}`}
                              onClick={() => handleGridClick(x, y)}
                              style={{
                                  border: '1px solid #444',
                                  background: chunk ? '#2d2d2d' : '#111',
                                  borderRadius: '4px',
                                  padding: '10px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  textAlign: 'center',
                                  position: 'relative',
                                  transition: 'all 0.1s'
                              }}
                          >
                              <div style={{ position: 'absolute', top: '2px', left: '5px', fontSize: '0.6rem', color: '#666' }}>{x}, {y}</div>
                              {chunk ? (
                                  <>
                                      <div style={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#fff', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{chunk.name}</div>
                                      <div style={{ fontSize: '0.7rem', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{chunk.filename}</div>
                                  </>
                              ) : (
                                  <div style={{ color: '#333' }}><Plus size={20} /></div>
                              )}
                          </div>
                      );
                  })
              ))}
          </div>
      </div>

      {editingPos && (
        <EditMapChunkModal 
          chunk={getChunkAt(editingPos.x, editingPos.y) || null}
          x={editingPos.x}
          y={editingPos.y}
          onCancel={() => setEditingPos(null)}
          onConfirm={handleConfirmChunk}
        />
      )}
    </div>
  )
}

export default EditWorld
