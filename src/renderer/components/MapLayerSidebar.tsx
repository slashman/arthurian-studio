import React from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface MapLayerSidebarProps {
    layers: any[];
    visibleLayers: Record<number, boolean>;
    onToggleLayer: (idx: number) => void;
}

const MapLayerSidebar: React.FC<MapLayerSidebarProps> = ({ layers, visibleLayers, onToggleLayer }) => {
    return (
        <div style={{ width: '250px', background: '#252526', borderLeft: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px', borderBottom: '1px solid #333', fontWeight: 'bold', fontSize: '0.9rem', background: '#333' }}>Layers</div>
            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '10px' }}>
                {[...layers].reverse().map((layer: any, revIdx: number) => {
                    const lIdx = layers.length - 1 - revIdx;
                    const isVisible = visibleLayers[lIdx];
                    return (
                        <div 
                            key={lIdx} 
                            onClick={() => onToggleLayer(lIdx)}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '10px', 
                                padding: '8px', 
                                marginBottom: '5px',
                                background: isVisible ? '#37373d' : '#2d2d2d',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                opacity: isVisible ? 1 : 0.6
                            }}
                        >
                            {isVisible ? <Eye size={16} color="#4ec9b0" /> : <EyeOff size={16} color="#888" />}
                            <span style={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {layer.name || `Layer ${lIdx}`}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#666' }}>{layer.type}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default MapLayerSidebar
