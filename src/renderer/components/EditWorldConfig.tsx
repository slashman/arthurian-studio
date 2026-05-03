import React from 'react'
import { Save, Settings } from 'lucide-react'
import { Scenario } from '../types/ScenarioEntityTypes'

interface EditWorldConfigProps {
  scenario: Scenario;
  onSave: () => void;
  onUpdateScenario: (updated: Scenario) => void;
}

const EditWorldConfig: React.FC<EditWorldConfigProps> = ({ 
  scenario, 
  onSave, 
  onUpdateScenario 
}) => {
  if (!scenario) return null;

  const updateConfig = (field: keyof Scenario['config'], value: any) => {
    onUpdateScenario({
      ...scenario,
      config: { ...scenario.config, [field]: value }
    });
  };

  return (
    <div className="main-area">
      <div className="toolbar">
        <button onClick={onSave}><Save size={16} /> Save Scenario</button>
      </div>

      <h2>World Configuration</h2>
      <p style={{ color: '#888', marginBottom: '30px' }}>Configure the fundamental dimensions of your game world.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '600px' }}>
        {/* Tile Size Section */}
        <section>
            <h3 style={{ fontSize: '1rem', borderBottom: '1px solid #333', paddingBottom: '8px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={16} /> Tile Size
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>The base pixel dimensions for all tiles in the project (e.g., 16x16 or 32x32).</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <input 
                        type="number" 
                        style={{ width: '70px' }}
                        value={scenario.config.tileWidth} 
                        onChange={(e) => updateConfig('tileWidth', parseInt(e.target.value) || 0)} 
                    />
                </div>
                <span style={{ color: '#666' }}>x</span>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <input 
                        type="number" 
                        style={{ width: '70px' }}
                        value={scenario.config.tileHeight} 
                        onChange={(e) => updateConfig('tileHeight', parseInt(e.target.value) || 0)} 
                    />
                </div>
                <span style={{ fontSize: '0.85rem', color: '#888' }}>pixels</span>
            </div>
        </section>

        {/* Chunk Size Section */}
        <section>
            <h3 style={{ fontSize: '1rem', borderBottom: '1px solid #333', paddingBottom: '8px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={16} /> Chunk Dimensions
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>The size of each map chunk, measured in tiles (width and height are the same).</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <input 
                        type="number" 
                        style={{ width: '70px' }}
                        value={scenario.config.chunkSize} 
                        onChange={(e) => updateConfig('chunkSize', parseInt(e.target.value) || 0)} 
                    />
                </div>
                <span style={{ fontSize: '0.85rem', color: '#888' }}>tiles per side</span>
            </div>
        </section>

        {/* World Size Section */}
        <section>
            <h3 style={{ fontSize: '1rem', borderBottom: '1px solid #333', paddingBottom: '8px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={16} /> World Grid Size
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>The total number of chunks that make up the world grid.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <input 
                        type="number" 
                        style={{ width: '70px' }}
                        value={scenario.config.chunksWidth} 
                        onChange={(e) => updateConfig('chunksWidth', parseInt(e.target.value) || 0)} 
                    />
                </div>
                <span style={{ color: '#666' }}>x</span>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <input 
                        type="number" 
                        style={{ width: '70px' }}
                        value={scenario.config.chunksHeight} 
                        onChange={(e) => updateConfig('chunksHeight', parseInt(e.target.value) || 0)} 
                    />
                </div>
                <span style={{ fontSize: '0.85rem', color: '#888' }}>chunks</span>
            </div>
        </section>
      </div>
    </div>
  )
}

export default EditWorldConfig
