import React, { useState } from 'react'
import { Eye, EyeOff, Edit3, ChevronDown, ChevronRight } from 'lucide-react'

interface MapLayerSidebarProps {
    layers: any[];
    visibleLayers: Record<number, boolean>;
    activeLayerIdx: number;
    onToggleLayer: (idx: number) => void;
    onSelectLayer: (idx: number) => void;
}

const MapLayerSidebar: React.FC<MapLayerSidebarProps> = ({ layers, visibleLayers, activeLayerIdx, onToggleLayer, onSelectLayer }) => {
    const [expandedFloors, setExpandedFloors] = useState<Record<number, boolean>>({ 1: true, 2: true });

    const getFloor = (name: string) => {
        const match = name.match(/^(\d+)\s/);
        return match ? parseInt(match[1], 10) : 1;
    };

    const toggleFloor = (floor: number) => {
        setExpandedFloors(prev => ({ ...prev, [floor]: !prev[floor] }));
    };

    const groups = layers.reduce((acc, layer, idx) => {
        const floor = getFloor(layer.name || "");
        if (!acc[floor]) acc[floor] = [];
        acc[floor].push({ layer, idx });
        return acc;
    }, {} as Record<number, { layer: any, idx: number }[]>);

    const sortedFloors = Object.keys(groups).map(Number).sort((a, b) => b - a);

    return (
        <div style={{ width: '100%', height: '100%', background: '#252526', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px', borderBottom: '1px solid #333', fontWeight: 'bold', fontSize: '0.9rem', background: '#333' }}>Layers</div>
            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '10px' }}>
                {sortedFloors.map(floor => (
                    <div key={floor} style={{ marginBottom: '10px' }}>
                        <div 
                            onClick={() => toggleFloor(floor)}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '5px', 
                                padding: '8px', 
                                background: '#333', 
                                cursor: 'pointer', 
                                fontSize: '0.8rem', 
                                fontWeight: 'bold',
                                borderRadius: '4px',
                                marginBottom: '5px'
                            }}
                        >
                            {expandedFloors[floor] !== false ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            Floor {floor}
                        </div>
                        {expandedFloors[floor] !== false && (
                            <div>
                                {[...groups[floor]].reverse().map(({ layer, idx }) => {
                                    const isVisible = visibleLayers[idx];
                                    const isActive = activeLayerIdx === idx;
                                    return (
                                        <div 
                                            key={idx} 
                                            onClick={() => onSelectLayer(idx)}
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
                                                    onToggleLayer(idx);
                                                }}
                                                style={{ display: 'flex', alignItems: 'center' }}
                                            >
                                                {isVisible ? <Eye size={16} color="#4ec9b0" /> : <EyeOff size={16} color="#888" />}
                                            </div>
                                            
                                            <span style={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {layer.name || `Layer ${idx}`}
                                            </span>
                                            
                                            {isActive && <Edit3 size={14} color="#fff" title="Active Layer" />}
                                            <span style={{ fontSize: '0.7rem', color: isActive ? '#ccc' : '#666' }}>{layer.type}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MapLayerSidebar
