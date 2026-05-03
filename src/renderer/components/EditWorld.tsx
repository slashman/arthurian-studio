import React, { useState } from 'react'
import { Save, Plus, Trash2, Globe, Edit3 } from 'lucide-react'
import { Scenario, ScenarioMap } from '../types/ScenarioEntityTypes'

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
  const [selectedGrid, setSelectedGrid] = useState<{x: number, y: number} | null>(null);
  const [editingChunk, setEditingChunk] = useState<ScenarioMap | null>(null);

  if (!scenario) return null;

  const { chunksWidth, chunksHeight } = scenario.config;

  const getChunkAt = (x: number, y: number) => {
    return scenario.maps.find(m => m.x === x && m.y === y);
  };

  const handleGridClick = (x: number, y: number) => {
    setSelectedGrid({ x, y });
    const chunk = getChunkAt(x, y);
    if (chunk) {
        setEditingChunk({ ...chunk });
    } else {
        setEditingChunk(null);
    }
  };

  const saveChunk = () => {
    if (!selectedGrid || !editingChunk) return;
    
    // Check for collision at target coordinates
    const isMoving = editingChunk.x !== selectedGrid.x || editingChunk.y !== selectedGrid.y;
    if (isMoving) {
        const collision = scenario.maps.find(m => m.x === editingChunk.x && m.y === editingChunk.y);
        if (collision) {
            if (!confirm(`A chunk ("${collision.name}") already exists at [${editingChunk.x}, ${editingChunk.y}]. Overwrite it?`)) {
                return;
            }
        }
    }

    let newMaps = [...scenario.maps];
    
    // Filter out both the chunk at the target (if any) and the chunk at the source
    newMaps = newMaps.filter(m => 
        !(m.x === editingChunk.x && m.y === editingChunk.y) && 
        !(m.x === selectedGrid.x && m.y === selectedGrid.y)
    );

    // Add the updated chunk at its new position
    newMaps.push(editingChunk);

    onUpdateScenario({ ...scenario, maps: newMaps });
    setSelectedGrid({ x: editingChunk.x, y: editingChunk.y });
  };

  const deleteSelectedChunk = () => {
    if (!selectedGrid) return;
    const chunk = getChunkAt(selectedGrid.x, selectedGrid.y);
    if (!chunk) return;

    if (confirm(`Are you sure you want to delete map chunk "${chunk.name}" at [${selectedGrid.x}, ${selectedGrid.y}]?`)) {
        const newMaps = scenario.maps.filter(m => !(m.x === selectedGrid.x && m.y === selectedGrid.y));
        onUpdateScenario({ ...scenario, maps: newMaps });
        setEditingChunk(null);
    }
  };

  const addNewAtSelected = () => {
    if (!selectedGrid) return;
    setEditingChunk({
        name: 'newMap',
        filename: 'newMap.json',
        x: selectedGrid.x,
        y: selectedGrid.y
    });
  };

  return (
    <div className="main-area">
      <div className="toolbar">
        <button onClick={onSave}><Save size={16} /> Save Changes</button>
      </div>

      <h2>Map Chunks</h2>

      <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 150px)' }}>
        {/* Grid Container */}
        <div style={{ 
            flex: 1, 
            background: '#1a1a1a', 
            borderRadius: '4px', 
            padding: '20px', 
            overflow: 'auto',
            border: '1px solid #333'
        }}>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: `repeat(${chunksWidth}, 150px)`,
                gridTemplateRows: `repeat(${chunksHeight}, 120px)`,
                gap: '10px'
            }}>
                {Array.from({ length: chunksHeight }).map((_, y) => (
                    Array.from({ length: chunksWidth }).map((_, x) => {
                        const chunk = getChunkAt(x, y);
                        const isSelected = selectedGrid?.x === x && selectedGrid?.y === y;
                        return (
                            <div 
                                key={`${x}-${y}`}
                                onClick={() => handleGridClick(x, y)}
                                style={{
                                    border: isSelected ? '2px solid #4ec9b0' : '1px solid #444',
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

        {/* Info/Editor Sidebar */}
        <div style={{ width: '300px', background: '#1e1e1e', padding: '20px', borderRadius: '4px', border: '1px solid #333' }}>
            {selectedGrid ? (
                <>
                    <h3 style={{ marginTop: 0 }}>Coord: [{selectedGrid.x}, {selectedGrid.y}]</h3>
                    
                    {editingChunk ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div className="form-group">
                                <label>Chunk Name</label>
                                <input 
                                    value={editingChunk.name} 
                                    onChange={(e) => setEditingChunk({...editingChunk, name: e.target.value})} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Filename</label>
                                <input 
                                    value={editingChunk.filename} 
                                    onChange={(e) => setEditingChunk({...editingChunk, filename: e.target.value})} 
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div className="form-group">
                                    <label>Grid X</label>
                                    <input 
                                        type="number"
                                        value={editingChunk.x} 
                                        onChange={(e) => setEditingChunk({...editingChunk, x: parseInt(e.target.value) || 0})} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Grid Y</label>
                                    <input 
                                        type="number"
                                        value={editingChunk.y} 
                                        onChange={(e) => setEditingChunk({...editingChunk, y: parseInt(e.target.value) || 0})} 
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button onClick={saveChunk} style={{ flex: 1 }}><Edit3 size={14} /> Update</button>
                                <button onClick={deleteSelectedChunk} style={{ background: '#ff4444' }} title="Delete Chunk"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '20px' }}>No chunk defined here.</p>
                            <button onClick={addNewAtSelected} style={{ width: '100%' }}><Plus size={14} /> Add New Chunk</button>
                        </div>
                    )}
                </>
            ) : (
                <div style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>
                    <Globe size={48} style={{ opacity: 0.2, marginBottom: '20px' }} />
                    <p>Select a grid cell to manage world chunks.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default EditWorld
