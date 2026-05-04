import React, { useEffect, useState } from 'react'
import { useProject } from '../ProjectContext'
import { Eye, EyeOff } from 'lucide-react'

interface TileMapEditorProps {
  filename: string;
}

const TileMapEditor: React.FC<TileMapEditorProps> = ({ filename }) => {
  const { projectData } = useProject();
  const [mapData, setMapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tilesetPaths, setTilesetPaths] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [visibleLayers, setVisibleLayers] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const loadMap = async () => {
      if (!projectData || !filename) return;

      setLoading(true);
      setError(null);

      const lastSlash = Math.max(projectData.filePath.lastIndexOf('/'), projectData.filePath.lastIndexOf('\\'));
      const projectDir = projectData.filePath.substring(0, lastSlash);
      const mapsDir = projectDir + (projectDir.includes('/') ? '/maps' : '\\maps');
      const mapPath = mapsDir + (mapsDir.includes('/') ? '/' : '\\') + filename;

      try {
        const content = await window.electron.loadFile(mapPath);
        if (!content) {
          setError(`Could not find map file: ${mapPath}`);
          setLoading(false);
          return;
        }

        const json = JSON.parse(content);
        setMapData(json);

        // Initialize visibility
        const visibility: Record<number, boolean> = {};
        json.layers.forEach((l: any, idx: number) => {
            visibility[idx] = l.visible !== false;
        });
        setVisibleLayers(visibility);

        // Resolve tileset paths
        const paths: Record<string, string> = {};
        for (const ts of json.tilesets) {
            const imgPathRelative = ts.image;
            let fullImgPath = mapsDir + (mapsDir.includes('/') ? '/' : '\\') + imgPathRelative;
            
            // Check if file exists at original path, if not try project res folder
            const fileExists = await window.electron.loadFile(fullImgPath).then(c => !!c).catch(() => false);
            
            if (!fileExists) {
                const imgFilename = imgPathRelative.split(/[/\\]/).pop();
                const resPath = projectDir + (projectDir.includes('/') ? '/res/' : '\\res\\') + imgFilename;
                const resExists = await window.electron.loadFile(resPath).then(c => !!c).catch(() => false);
                if (resExists) {
                    fullImgPath = resPath;
                }
            }
            
            paths[ts.name] = `media:///${fullImgPath.replace(/\\/g, '/')}`;
        }
        setTilesetPaths(paths);
        setLoading(false);
      } catch (e) {
        console.error('Error loading map:', e);
        setError(`Error loading map: ${e instanceof Error ? e.message : String(e)}`);
        setLoading(false);
      }
    };

    loadMap();
  }, [filename, projectData]);

  const toggleLayer = (idx: number) => {
      setVisibleLayers(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) return <div className="main-area">Loading map {filename}...</div>;
  if (error) return <div className="main-area" style={{ color: '#ff4444' }}>{error}</div>;
  if (!mapData) return null;

  // Flatten tile data for easier rendering in a single loop if needed, 
  // but let's keep layers separate for CSS stacking.
  const { width, height, tilewidth, tileheight, layers, tilesets } = mapData;

  const getTilesetForGid = (gid: number) => {
      for (let i = tilesets.length - 1; i >= 0; i--) {
          if (gid >= tilesets[i].firstgid) {
              return tilesets[i];
          }
      }
      return null;
  };

  const decodeLayerData = (layer: any) => {
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

  return (
    <div className="main-area" style={{ padding: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '10px 20px', background: '#252526', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Map Editor: {filename}</h2>
            <div style={{ fontSize: '0.8rem', color: '#888' }}>{width}x{height} tiles ({tilewidth}x{tileheight})</div>
        </div>
        
        <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
            {/* Map View */}
            <div style={{ flexGrow: 1, background: '#000', overflow: 'auto', position: 'relative' }}>
                <div style={{ 
                    position: 'relative', 
                    width: width * tilewidth, 
                    height: height * tileheight,
                    background: '#111',
                    margin: '20px auto'
                }}>
                    {layers.map((layer: any, lIdx: number) => {
                        if (layer.type !== 'tilelayer' || !visibleLayers[lIdx]) return null;
                        const data = decodeLayerData(layer);
                        
                        return (
                            <div key={lIdx} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', opacity: layer.opacity ?? 1 }}>
                                {data.map((gid, tIdx) => {
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
                    })}
                </div>
            </div>

            {/* Layer Sidebar */}
            <div style={{ width: '250px', background: '#252526', borderLeft: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '10px', borderBottom: '1px solid #333', fontWeight: 'bold', fontSize: '0.9rem', background: '#333' }}>Layers</div>
                <div style={{ flexGrow: 1, overflowY: 'auto', padding: '10px' }}>
                    {[...layers].reverse().map((layer: any, revIdx: number) => {
                        const lIdx = layers.length - 1 - revIdx;
                        const isVisible = visibleLayers[lIdx];
                        return (
                            <div 
                                key={lIdx} 
                                onClick={() => toggleLayer(lIdx)}
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
        </div>
    </div>
  )
}

export default TileMapEditor
