import React, { useState } from 'react'
import { Save, Clock, PlayCircle, Settings } from 'lucide-react'
import { Scenario } from '../types/ScenarioEntityTypes'
import { useProject } from '../ProjectContext'

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
  const [activeTab, setActiveTab] = useState<'config' | 'startingState'>('config');

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

  const updateConfig = (field: keyof Scenario['config'], value: any) => {
    onUpdateScenario({
      ...scenario,
      config: { ...scenario.config, [field]: value }
    });
  };

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

  return (
    <div className="main-area">
      <div className="toolbar">
        <button onClick={onSave}><Save size={16} /> Save Scenario</button>
      </div>

      <h2>Scenario Configuration</h2>

      <div className="modal-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #444' }}>
        <button className={`tab-btn ${activeTab === 'config' ? 'active' : ''}`} onClick={() => setActiveTab('config')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', background: activeTab === 'config' ? '#3a3a3a' : 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><Settings size={14} /> Global Config</button>
        <button className={`tab-btn ${activeTab === 'startingState' ? 'active' : ''}`} onClick={() => setActiveTab('startingState')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', background: activeTab === 'startingState' ? '#3a3a3a' : 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><PlayCircle size={14} /> Starting State</button>
      </div>

      <div className="tab-content">
        {activeTab === 'config' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '800px' }}>
            <div className="form-group">
                <label>Tile Width</label>
                <input type="number" value={scenario.config.tileWidth} onChange={(e) => updateConfig('tileWidth', parseInt(e.target.value) || 0)} />
            </div>
            <div className="form-group">
                <label>Tile Height</label>
                <input type="number" value={scenario.config.tileHeight} onChange={(e) => updateConfig('tileHeight', parseInt(e.target.value) || 0)} />
            </div>
            <div className="form-group">
                <label>Chunk Size</label>
                <input type="number" value={scenario.config.chunkSize} onChange={(e) => updateConfig('chunkSize', parseInt(e.target.value) || 0)} />
            </div>
            <div className="form-group">
                <label>Chunks Width</label>
                <input type="number" value={scenario.config.chunksWidth} onChange={(e) => updateConfig('chunksWidth', parseInt(e.target.value) || 0)} />
            </div>
            <div className="form-group">
                <label>Chunks Height</label>
                <input type="number" value={scenario.config.chunksHeight} onChange={(e) => updateConfig('chunksHeight', parseInt(e.target.value) || 0)} />
            </div>
          </div>
        )}

        {activeTab === 'startingState' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '800px' }}>
            <div className="form-group">
                <label>Starting Minute of Day</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" value={scenario.startingState.minuteOfDay} onChange={(e) => updateStartingState('minuteOfDay', parseInt(e.target.value) || 0)} />
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
                <label>Starting X</label>
                <input type="number" value={scenario.startingState.position.x} onChange={(e) => updatePosition('x', parseInt(e.target.value) || 0)} />
            </div>
            <div className="form-group">
                <label>Starting Y</label>
                <input type="number" value={scenario.startingState.position.y} onChange={(e) => updatePosition('y', parseInt(e.target.value) || 0)} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Initial Party Members (comma separated IDs)</label>
                <input 
                    value={scenario.startingState.party.join(', ')} 
                    onChange={(e) => updateStartingState('party', e.target.value.split(',').map(s => s.trim()).filter(s => s))} 
                />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EditScenario
