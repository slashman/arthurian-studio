import React, { useState } from 'react';

interface MapViewProps {
  mapData: any;
  tilesetPaths: Record<string, string>;
  visibleLayers: Record<number, boolean>;
  activeLayerIdx: number;
  onCellClick: (lIdx: number, tIdx: number) => void;
}

const MapView: React.FC<MapViewProps> = ({ mapData, tilesetPaths, visibleLayers, activeLayerIdx, onCellClick }) => {
  const { width, height, tilewidth, tileheight, layers, tilesets } = mapData;
  const [hoverPos, setHoverPos] = useState<{ col: number, row: number } | null>(null);

  const getTilesetForGid = (gid: number) => {
// ... (rest of getTilesetForGid)
    for (let i = tilesets.length - 1; i >= 0; i--) {
      if (gid >= tilesets[i].firstgid) {
        return tilesets[i];
      }
    }
    return null;
  };

  const decodeLayerData = (layer: any) => {
// ... (rest of decodeLayerData)
    if (layer.encoding === 'base64') {
      const binaryString = window.atob(layer.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return Array.from(new Uint32Array(bytes.buffer));
    }
    return layer.data;
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const col = Math.floor(x / tilewidth);
    const row = Math.floor(y / tileheight);
    
    if (col >= 0 && col < width && row >= 0 && row < height) {
        const tIdx = row * width + col;
        onCellClick(activeLayerIdx, tIdx);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const col = Math.floor(x / tilewidth);
    const row = Math.floor(y / tileheight);
    
    if (col >= 0 && col < width && row >= 0 && row < height) {
        setHoverPos({ col, row });
    } else {
        setHoverPos(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverPos(null);
  };

  return (
    <div style={{ flexGrow: 1, background: '#000', overflow: 'auto', position: 'relative' }}>
      <div 
        onClick={handleMapClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ 
            position: 'relative', 
            width: width * tilewidth, 
            height: height * tileheight,
            background: '#111',
            margin: '20px auto',
            cursor: 'crosshair'
        }}
      >
        {layers.map((layer: any, lIdx: number) => {
// ... (rest of layers.map)
          if (!visibleLayers[lIdx]) return null;

          if (layer.type === 'tilelayer') {
            const data = decodeLayerData(layer);
            return (
              <div key={lIdx} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', opacity: layer.opacity ?? 1 }}>
                {data.map((gid: number, tIdx: number) => {
                  if (gid === 0) return null;
                  const ts = getTilesetForGid(gid);
                  if (!ts || !tilesetPaths[ts.name]) return null;

                  const localId = gid - ts.firstgid;
                  const columns = ts.columns || Math.floor(ts.imagewidth / ts.tilewidth);
                  const tx = (localId % columns) * ts.tilewidth;
                  const ty = Math.floor(localId / columns) * ts.tileheight;

                  const x = (tIdx % layer.width) * tilewidth;
                  const y = Math.floor(tIdx / layer.width) * tileheight;

                  return (
                    <div 
                      key={tIdx}
                      style={{
                        position: 'absolute',
                        left: x,
                        top: y,
                        width: ts.tilewidth,
                        height: ts.tileheight,
                        backgroundImage: `url("${tilesetPaths[ts.name]}")`,
                        backgroundPosition: `-${tx}px -${ty}px`,
                        backgroundRepeat: 'no-repeat',
                        imageRendering: 'pixelated'
                      }}
                    />
                  );
                })}
              </div>
            );
          } else if (layer.type === 'objectgroup') {
            return (
              <div key={lIdx} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', opacity: layer.opacity ?? 1 }}>
                {(layer.objects || []).map((obj: any, oIdx: number) => {
                  if (!obj.gid || !obj.visible) return null;

                  const ts = getTilesetForGid(obj.gid);
                  if (!ts || !tilesetPaths[ts.name]) return null;

                  const localId = obj.gid - ts.firstgid;
                  const columns = ts.columns || Math.floor(ts.imagewidth / ts.tilewidth);
                  const tx = (localId % columns) * ts.tilewidth;
                  const ty = Math.floor(localId / columns) * ts.tileheight;

                  // For tile objects, y is the bottom-left coordinate
                  const x = obj.x;
                  const y = obj.y - obj.height;

                  return (
                    <div 
                      key={oIdx}
                      style={{
                        position: 'absolute',
                        left: x,
                        top: y,
                        width: obj.width,
                        height: obj.height,
                        backgroundImage: `url("${tilesetPaths[ts.name]}")`,
                        backgroundPosition: `-${tx}px -${ty}px`,
                        backgroundRepeat: 'no-repeat',
                        imageRendering: 'pixelated',
                        transform: `rotate(${obj.rotation || 0}deg)`,
                        transformOrigin: 'bottom left'
                      }}
                      title={obj.name || obj.type}
                    />
                  );
                })}
              </div>
            );
          }
          return null;
        })}

        {/* Hover Highlight */}
        {hoverPos && (
            <div style={{
                position: 'absolute',
                left: hoverPos.col * tilewidth,
                top: hoverPos.row * tileheight,
                width: tilewidth,
                height: tileheight,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid #fff',
                pointerEvents: 'none',
                zIndex: 100,
                boxSizing: 'border-box'
            }} />
        )}
      </div>
    </div>
  );
};

export default MapView;
