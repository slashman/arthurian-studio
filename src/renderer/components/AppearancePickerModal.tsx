import React, { useState } from 'react'
import { Search, X } from 'lucide-react'
import { useProject } from '../ProjectContext'
import AppearanceCanvas from './AppearanceCanvas'

interface AppearancePickerModalProps {
  onSelect: (id: string) => void;
  onCancel: () => void;
}

const AppearancePickerModal: React.FC<AppearancePickerModalProps> = ({ onSelect, onCancel }) => {
  const { projectData } = useProject();
  const [searchTerm, setSearchTerm] = useState('');

  if (!projectData) return null;

  const filteredAppearances = projectData.data.appearances.map(tileset => ({
    ...tileset,
    mobs: (tileset.mobs || []).filter(m => m.id.toLowerCase().includes(searchTerm.toLowerCase())),
    items: (tileset.items || []).filter(i => i.id.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(tileset => tileset.mobs.length > 0 || tileset.items.length > 0);

  return (
    <div className="modal-overlay" style={{ zIndex: 2000 }}>
      <div className="modal-content" style={{ width: '80%', height: '80%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Select Appearance</h3>
            <button onClick={onCancel} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={24} />
            </button>
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
            <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                <input 
                    placeholder="Search appearance ID..." 
                    style={{ paddingLeft: '35px', width: '100%' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                />
            </div>
        </div>

        <div style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '10px' }}>
            {filteredAppearances.map((tileset, tIdx) => (
                <div key={tIdx} style={{ marginBottom: '30px' }}>
                    <h4 style={{ borderBottom: '1px solid #444', paddingBottom: '5px', marginBottom: '15px', color: '#aaa' }}>
                        Tileset: {tileset.tileset}
                    </h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '15px' }}>
                        {tileset.mobs.map((mob, mIdx) => (
                            <div 
                                key={`mob-${mIdx}`} 
                                className="appearance-picker-item"
                                onClick={() => onSelect(mob.id)}
                                title={mob.id}
                                style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    padding: '10px', 
                                    background: '#2d2d2d', 
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    border: '1px solid transparent',
                                    transition: 'border-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#007acc'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                            >
                                <AppearanceCanvas 
                                    tilesetId={tileset.tileset}
                                    frameIndex={mob.d && mob.d.length > 0 ? mob.d[0] : 0}
                                    size={32}
                                />
                                <div style={{ fontSize: '0.65rem', marginTop: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%', textAlign: 'center' }}>
                                    {mob.id}
                                </div>
                            </div>
                        ))}
                        {tileset.items.map((item, iIdx) => (
                            <div 
                                key={`item-${iIdx}`} 
                                className="appearance-picker-item"
                                onClick={() => onSelect(item.id)}
                                title={item.id}
                                style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    padding: '10px', 
                                    background: '#2d2d2d', 
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    border: '1px solid transparent',
                                    transition: 'border-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#007acc'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                            >
                                <AppearanceCanvas 
                                    tilesetId={tileset.tileset}
                                    frameIndex={item.i}
                                    size={32}
                                />
                                <div style={{ fontSize: '0.65rem', marginTop: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%', textAlign: 'center' }}>
                                    {item.id}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            {filteredAppearances.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    No appearances found matching "{searchTerm}"
                </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default AppearancePickerModal
