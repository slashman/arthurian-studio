import React from 'react'
import { Eye, EyeOff, Edit3 } from 'lucide-react'

interface MapLayerSidebarProps {
    layers: any[];
    visibleLayers: Record<number, boolean>;
    activeLayerIdx: number;
    onToggleLayer: (idx: number) => void;
    onSelectLayer: (idx: number) => void;
}

const MapLayerSidebar: React.FC<MapLayerSidebarProps> = ({ layers, visibleLayers, activeLayerIdx, onToggleLayer, onSelectLayer }) => {
    return (
        <div style={{ width: '100%', height: '100%', background: '#252526', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px', borderBottom: '1px solid #333', fontWeight: 'bold', fontSize: '0.9rem', background: '#333' }}>Layers</div>
            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '10px' }}>
                {[...layers].reverse().map((layer: any, revIdx: number) => {
                    const lIdx = layers.length - 1 - revIdx;
                    const isVisible = visibleLayers[lIdx];
                    const isActive = activeLayerIdx === lIdx;
                    return (
                        <div 
                            key={lIdx} 
                            onClick={() => onSelectLayer(lIdx)}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '10px', 
                                padding: '8px', 
                                marginBottom: '5px',
                                background: isActive ? '#094771' : (isVisible ? '#37373d' : '#2d2d2d'),
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                opacity: isVisible ? 1 : 0.6,
                                outline: isActive ? '1px solid #007acc' : 'none'
                            }}
                        >
                            <div 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleLayer(lIdx);
                                }}
                                style={{ display: 'flex', alignItems: 'center' }}
                            >
                                {isVisible ? <Eye size={16} color="#4ec9b0" /> : <EyeOff size={16} color="#888" />}
                            </div>
                            
                            <span style={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {layer.name || `Layer ${lIdx}`}
                            </span>
                            
                            {isActive && <Edit3 size={14} color="#fff" title="Active Layer" />}
                            <span style={{ fontSize: '0.7rem', color: isActive ? '#ccc' : '#666' }}>{layer.type}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default MapLayerSidebar
