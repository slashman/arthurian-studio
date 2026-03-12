import React, { useState } from 'react'
import { Search, X } from 'lucide-react'
import { useProject } from '../ProjectContext'
import AppearanceCanvas from './AppearanceCanvas'

interface MobTypePickerModalProps {
  onSelect: (id: string) => void;
  onCancel: () => void;
}

const MobTypePickerModal: React.FC<MobTypePickerModalProps> = ({ onSelect, onCancel }) => {
  const { projectData } = useProject();
  const [searchTerm, setSearchTerm] = useState('');

  if (!projectData) return null;

  const filteredMobTypes = projectData.data.mobTypes.filter(m => 
    m.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.name && m.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const resolveAppearance = (appearanceId: string): { tilesetId: string, frameIndex: number } | null => {
    if (!appearanceId) return null;
    for (const app of projectData.data.appearances) {
        const mobApp = app.mobs?.find(m => m.id === appearanceId);
        if (mobApp) {
            return {
                tilesetId: app.tileset,
                frameIndex: mobApp.d && mobApp.d.length > 0 ? mobApp.d[0] : 0
            };
        }
    }
    return null;
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 2000 }}>
      <div className="modal-content" style={{ width: '80%', height: '80%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Select Mob Type</h3>
            <button onClick={onCancel} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={24} />
            </button>
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
            <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                <input 
                    placeholder="Search mob type ID or name..." 
                    style={{ paddingLeft: '35px', width: '100%' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                />
            </div>
        </div>

        <div style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '15px' }}>
                {filteredMobTypes.map((mobType, idx) => {
                    const appearance = resolveAppearance(mobType.appearance);
                    return (
                        <div 
                            key={idx} 
                            className="appearance-picker-item"
                            onClick={() => onSelect(mobType.id)}
                            title={`${mobType.name || mobType.id} (${mobType.id})`}
                            style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                padding: '10px', 
                                background: '#2d2d2d', 
                                borderRadius: '4px',
                                cursor: 'pointer',
                                border: '1px solid transparent',
                                transition: 'border-color 0.2s',
                                textAlign: 'center'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#007acc'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                        >
                            {appearance ? (
                                <AppearanceCanvas 
                                    tilesetId={appearance.tilesetId}
                                    frameIndex={appearance.frameIndex}
                                    size={32}
                                />
                            ) : (
                                <div style={{ width: 32, height: 32, background: '#333' }}></div>
                            )}
                            <div style={{ fontSize: '0.65rem', marginTop: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                                {mobType.name || mobType.id}
                            </div>
                            <div style={{ fontSize: '0.55rem', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                                {mobType.id}
                            </div>
                        </div>
                    );
                })}
            </div>
            {filteredMobTypes.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    No mob types found matching "{searchTerm}"
                </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default MobTypePickerModal
