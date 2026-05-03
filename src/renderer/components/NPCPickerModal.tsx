import React, { useState } from 'react'
import { Search, X } from 'lucide-react'
import { useProject } from '../ProjectContext'
import AppearanceCanvas from './AppearanceCanvas'

interface NPCPickerModalProps {
  onSelect: (id: string) => void;
  onCancel: () => void;
}

const NPCPickerModal: React.FC<NPCPickerModalProps> = ({ onSelect, onCancel }) => {
  const { projectData } = useProject();
  const [searchTerm, setSearchTerm] = useState('');

  if (!projectData) return null;

  const filteredNPCs = projectData.data.npcs.filter(npc => 
    npc.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (npc.name && npc.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const resolveAppearance = (mobTypeId: string): { tilesetId: string, frameIndex: number } | null => {
    const mobType = projectData.data.mobTypes.find(m => m.id === mobTypeId);
    if (!mobType) return null;
    
    for (const app of projectData.data.appearances) {
        const mobApp = app.mobs?.find(m => m.id === mobType.appearance);
        if (mobApp) {
            // Mobs use direction arrays, items use 'i'
            const frameIndex = (mobApp as any).i !== undefined 
                ? (mobApp as any).i 
                : (mobApp.d ? mobApp.d[0] : 0);

            return {
                tilesetId: app.tileset,
                frameIndex: frameIndex
            };
        }
    }
    return null;
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 2000 }}>
      <div className="modal-content" style={{ width: '80%', height: '80%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Select NPC</h3>
            <button onClick={onCancel} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={24} />
            </button>
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
            <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                <input 
                    placeholder="Search NPC ID or name..." 
                    style={{ paddingLeft: '35px', width: '100%' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                />
            </div>
        </div>

        <div style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px' }}>
                {filteredNPCs.map((npc, idx) => {
                    const appearance = resolveAppearance(npc.type);
                    return (
                        <div 
                            key={idx} 
                            className="appearance-picker-item"
                            onClick={() => onSelect(npc.id)}
                            title={`${npc.name || npc.id} (${npc.id})`}
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
                            <div style={{ fontSize: '0.75rem', marginTop: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%', fontWeight: 'bold' }}>
                                {npc.name || npc.id}
                            </div>
                            <div style={{ fontSize: '0.65rem', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                                {npc.id}
                            </div>
                        </div>
                    );
                })}
            </div>
            {filteredNPCs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    No NPCs found matching "{searchTerm}"
                </div>
            )}
        </div>

        <div className="modal-actions" style={{ marginTop: '20px' }}>
          <button onClick={onCancel} style={{ backgroundColor: '#444' }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default NPCPickerModal
