import React, { useEffect, useState } from 'react'
import { useProject } from '../ProjectContext'
import MapLayerSidebar from './MapLayerSidebar'
import MapView from './MapView'
import TilesetPicker from './TilesetPicker'

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
  const [activeLayerIdx, setActiveLayerIdx] = useState<number>(0);
  const [rightSidebarTab, setRightSidebarTab] = useState<'layers' | 'tilesets'>('tilesets');
  const [activeTile, setActiveTile] = useState<{ tilesetName: string, tileId: number } | null>(null);

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

        // Default active layer to the first tilelayer found
        const firstTileLayerIdx = json.layers.findIndex((l: any) => l.type === 'tilelayer');
        if (firstTileLayerIdx !== -1) {
            setActiveLayerIdx(firstTileLayerIdx);
        }

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

  const handleCellClick = (lIdx: number, tIdx: number) => {
    if (!activeTile || !mapData) return;
    if (lIdx !== activeLayerIdx) return;
    
    const layer = mapData.layers[lIdx];
    if (layer.type !== 'tilelayer') return;

    const tileset = mapData.tilesets.find((ts: any) => ts.name === activeTile.tilesetName);
    if (!tileset) return;

    const newGid = tileset.firstgid + activeTile.tileId;

    setMapData((prev: any) => {
        const newLayers = [...prev.layers];
        const newLayer = { ...newLayers[lIdx] };
        
        let data = newLayer.data;
        if (newLayer.encoding === 'base64') {
            const binaryString = window.atob(newLayer.data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const uint32Data = new Uint32Array(bytes.buffer);
            uint32Data[tIdx] = newGid;
            
            const updatedBytes = new Uint8Array(uint32Data.buffer);
            let updatedBinary = '';
            for (let i = 0; i < updatedBytes.length; i++) {
                updatedBinary += String.fromCharCode(updatedBytes[i]);
            }
            newLayer.data = window.btoa(updatedBinary);
        } else {
            const newData = [...data];
            newData[tIdx] = newGid;
            newLayer.data = newData;
        }
        
        newLayers[lIdx] = newLayer;
        return { ...prev, layers: newLayers };
    });
  };

  if (loading) return <div className="main-area">Loading map {filename}...</div>;
  if (error) return <div className="main-area" style={{ color: '#ff4444' }}>{error}</div>;
  if (!mapData) return null;

  const { width, height, tilewidth, tileheight, layers, tilesets } = mapData;

  return (
    <div className="main-area" style={{ padding: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '10px 20px', background: '#252526', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Map Editor: {filename}</h2>
            <div style={{ fontSize: '0.8rem', color: '#888' }}>{width}x{height} tiles ({tilewidth}x{tileheight})</div>
        </div>
        
        <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
            <MapView 
                mapData={mapData}
                tilesetPaths={tilesetPaths}
                visibleLayers={visibleLayers}
                activeLayerIdx={activeLayerIdx}
                onCellClick={handleCellClick}
            />

            <div style={{ width: '300px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #333' }}>
                <div style={{ display: 'flex', background: '#1e1e1e', borderBottom: '1px solid #333' }}>
                    <div 
                        onClick={() => setRightSidebarTab('tilesets')}
                        style={{ 
                            padding: '10px 15px', 
                            cursor: 'pointer', 
                            fontSize: '0.85rem',
                            borderBottom: rightSidebarTab === 'tilesets' ? '2px solid #007acc' : '2px solid transparent',
                            background: rightSidebarTab === 'tilesets' ? '#252526' : 'transparent',
                            flexGrow: 1,
                            textAlign: 'center'
                        }}
                    >
                        Tilesets
                    </div>
                    <div 
                        onClick={() => setRightSidebarTab('layers')}
                        style={{ 
                            padding: '10px 15px', 
                            cursor: 'pointer', 
                            fontSize: '0.85rem',
                            borderBottom: rightSidebarTab === 'layers' ? '2px solid #007acc' : '2px solid transparent',
                            background: rightSidebarTab === 'layers' ? '#252526' : 'transparent',
                            flexGrow: 1,
                            textAlign: 'center'
                        }}
                    >
                        Layers
                    </div>
                </div>

                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {rightSidebarTab === 'tilesets' ? (
                        <TilesetPicker 
                            tilesets={tilesets}
                            tilesetPaths={tilesetPaths}
                            activeTile={activeTile}
                            onSelectTile={(tilesetName, tileId) => setActiveTile({ tilesetName, tileId })}
                        />
                    ) : (
                        <MapLayerSidebar 
                            layers={layers}
                            visibleLayers={visibleLayers}
                            activeLayerIdx={activeLayerIdx}
                            onToggleLayer={toggleLayer}
                            onSelectLayer={setActiveLayerIdx}
                        />
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}

export default TileMapEditor
