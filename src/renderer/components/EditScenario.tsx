import React, { useState } from 'react'
import { Save, Plus, Trash2 } from 'lucide-react'
import { Scenario } from '../types/ScenarioEntityTypes'
import NPCPickerModal from './NPCPickerModal'

interface EditScenarioProps {
  scenario: Scenario;
  onSave: () => void;
  onUpdateScenario: (updated: Scenario) => void;
}

const EditScenario: React.FC<EditScenarioProps> = ({ 
  scenario, 
  onSave, 
  onUpdateScenario 
}) => {
  const [showNPCPicker, setShowNPCPicker] = useState(false);

  if (!scenario) {
    return (
        <div className="main-area">
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2>Scenario data not found</h2>
                <p style={{ color: '#888' }}>Please try re-opening the project to load scenario data.</p>
            </div>
        </div>
    );
  }

  const updateStartingState = (field: keyof Scenario['startingState'], value: any) => {
    onUpdateScenario({
      ...scenario,
      startingState: { ...scenario.startingState, [field]: value }
    });
  };

  const updatePosition = (field: 'x' | 'y', value: number) => {
    onUpdateScenario({
      ...scenario,
      startingState: {
        ...scenario.startingState,
        position: { ...scenario.startingState.position, [field]: value }
      }
    });
  };

  const addPartyMember = (id: string) => {
    if (scenario.startingState.party.includes(id)) {
        alert('This NPC is already in the party.');
        return;
    }
    updateStartingState('party', [...scenario.startingState.party, id]);
    setShowNPCPicker(false);
  };

  const removePartyMember = (index: number) => {
    const newParty = [...scenario.startingState.party];
    newParty.splice(index, 1);
    updateStartingState('party', newParty);
  };

  return (
    <div className="main-area">
      <div className="toolbar">
        <button onClick={onSave}><Save size={16} /> Save Scenario</button>
      </div>

      <h2>Scenario Configuration</h2>

      <div className="tab-content" style={{ marginTop: '20px', maxWidth: '800px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div className="form-group">
                <label>Starting Minute of Day</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input 
                        type="number" 
                        style={{ width: '100px' }}
                        value={scenario.startingState.minuteOfDay} 
                        onChange={(e) => updateStartingState('minuteOfDay', parseInt(e.target.value) || 0)} 
                    />
                    <span style={{ color: '#888', fontSize: '0.9rem' }}>
                        {Math.floor(scenario.startingState.minuteOfDay / 60)}:{(scenario.startingState.minuteOfDay % 60).toString().padStart(2, '0')}
                    </span>
                </div>
            </div>
            <div className="form-group">
                <label>Starting Scene</label>
                <select 
                    style={{ width: '100%', backgroundColor: '#3c3c3c', color: 'white', border: '1px solid #555', padding: '6px' }}
                    value={scenario.startingState.scene} 
                    onChange={(e) => updateStartingState('scene', e.target.value)}
                >
                    <option value="">(None)</option>
                    {Object.keys(scenario.scenes).map(sceneId => (
                        <option key={sceneId} value={sceneId}>{sceneId}</option>
                    ))}
                </select>
            </div>
            
            <div className="form-group">
                <label>Starting Position</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.7rem', color: '#666' }}>X</span>
                        <input 
                            type="number" 
                            style={{ width: '70px' }}
                            value={scenario.startingState.position.x} 
                            onChange={(e) => updatePosition('x', parseInt(e.target.value) || 0)} 
                        />
                    </div>
                    <span style={{ marginTop: '15px', color: '#666' }}>x</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.7rem', color: '#666' }}>Y</span>
                        <input 
                            type="number" 
                            style={{ width: '70px' }}
                            value={scenario.startingState.position.y} 
                            onChange={(e) => updatePosition('y', parseInt(e.target.value) || 0)} 
                        />
                    </div>
                </div>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Initial Party Members
                    <button 
                        onClick={() => setShowNPCPicker(true)}
                        style={{ padding: '4px 8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                        <Plus size={14} /> Add Member
                    </button>
                </label>
                <div style={{ 
                    marginTop: '10px', 
                    background: '#1a1a1a', 
                    borderRadius: '4px', 
                    border: '1px solid #333',
                    minHeight: '100px'
                }}>
                    {scenario.startingState.party.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                            No party members selected.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '10px' }}>
                            {scenario.startingState.party.map((npcId, idx) => (
                                <div 
                                    key={idx}
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px', 
                                        background: '#2d2d2d', 
                                        padding: '4px 10px', 
                                        borderRadius: '4px',
                                        fontSize: '0.85rem',
                                        border: '1px solid #444'
                                    }}
                                >
                                    <span style={{ color: '#4ec9b0' }}>{npcId}</span>
                                    <button 
                                        onClick={() => removePartyMember(idx)}
                                        style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', padding: '2px', display: 'flex' }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
          </div>
      </div>

      {showNPCPicker && (
        <NPCPickerModal 
          onSelect={addPartyMember}
          onCancel={() => setShowNPCPicker(false)}
        />
      )}
    </div>
  )
}

export default EditScenario
