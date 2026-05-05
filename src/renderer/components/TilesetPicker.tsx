import React, { useState } from 'react';

interface TilesetPickerProps {
    tilesets: any[];
    tilesetPaths: Record<string, string>;
    activeTile: { tilesetName: string, tileId: number } | null;
    onSelectTile: (tilesetName: string, tileId: number) => void;
}

const TilesetPicker: React.FC<TilesetPickerProps> = ({ tilesets, tilesetPaths, activeTile, onSelectTile }) => {
    const [selectedTilesetIndex, setSelectedTilesetIndex] = useState(0);

    const currentTileset = tilesets[selectedTilesetIndex];
    if (!currentTileset) return null;

    const tilesetPath = tilesetPaths[currentTileset.name];
    
    // Calculate tile count
    const columns = currentTileset.columns || Math.floor(currentTileset.imagewidth / currentTileset.tilewidth);
    const rows = Math.floor(currentTileset.imageheight / currentTileset.tileheight);
    const totalTiles = columns * rows;

    const tiles = Array.from({ length: totalTiles }, (_, i) => i);

    return (
        <div style={{ width: '300px', background: '#252526', borderLeft: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #333', overflowX: 'auto', background: '#1e1e1e' }}>
                {tilesets.map((ts, idx) => (
                    <div 
                        key={ts.name}
                        onClick={() => setSelectedTilesetIndex(idx)}
                        style={{
                            padding: '10px 15px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            borderBottom: selectedTilesetIndex === idx ? '2px solid #007acc' : '2px solid transparent',
                            background: selectedTilesetIndex === idx ? '#252526' : 'transparent',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {ts.name}
                    </div>
                ))}
            </div>

            {/* Tileset Grid */}
            <div style={{ flexGrow: 1, overflow: 'auto', padding: '10px', background: '#000' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columns}, ${currentTileset.tilewidth}px)`,
                    gap: '1px',
                    width: 'fit-content',
                    margin: '0 auto'
                }}>
                    {tiles.map(tileId => {
                        const tx = (tileId % columns) * currentTileset.tilewidth;
                        const ty = Math.floor(tileId / columns) * currentTileset.tileheight;
                        const isActive = activeTile?.tilesetName === currentTileset.name && activeTile?.tileId === tileId;

                        return (
                            <div 
                                key={tileId}
                                onClick={() => onSelectTile(currentTileset.name, tileId)}
                                style={{
                                    width: currentTileset.tilewidth,
                                    height: currentTileset.tileheight,
                                    backgroundImage: `url("${tilesetPath}")`,
                                    backgroundPosition: `-${tx}px -${ty}px`,
                                    backgroundRepeat: 'no-repeat',
                                    imageRendering: 'pixelated',
                                    cursor: 'pointer',
                                    outline: isActive ? '2px solid #007acc' : 'none',
                                    zIndex: isActive ? 1 : 0
                                }}
                                title={`Tile ID: ${tileId}`}
                            />
                        );
                    })}
                </div>
            </div>
            
            {/* Active Tile Preview */}
            <div style={{ padding: '10px', borderTop: '1px solid #333', background: '#252526' }}>
                <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '5px' }}>Selected Tile</div>
                {activeTile ? (() => {
                    const activeTs = tilesets.find(t => t.name === activeTile.tilesetName);
                    if (!activeTs) return <div style={{ fontSize: '0.8rem', color: '#555' }}>None</div>;

                    const activeCols = activeTs.columns || Math.floor(activeTs.imagewidth / activeTs.tilewidth);
                    const ptx = (activeTile.tileId % activeCols) * activeTs.tilewidth;
                    const pty = Math.floor(activeTile.tileId / activeCols) * activeTs.tileheight;

                    return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: activeTs.tilewidth,
                                height: activeTs.tileheight,
                                backgroundImage: `url("${tilesetPaths[activeTile.tilesetName]}")`,
                                backgroundPosition: `-${ptx}px -${pty}px`,
                                backgroundRepeat: 'no-repeat',
                                imageRendering: 'pixelated',
                                border: '1px solid #444'
                            }} />
                            <div style={{ fontSize: '0.8rem' }}>
                                <div style={{ fontWeight: 'bold' }}>{activeTile.tilesetName}</div>
                                <div style={{ color: '#aaa' }}>ID: {activeTile.tileId}</div>
                            </div>
                        </div>
                    );
                })() : (
                    <div style={{ fontSize: '0.8rem', color: '#555' }}>None</div>
                )}
            </div>
        </div>
    );
};

export default TilesetPicker;
