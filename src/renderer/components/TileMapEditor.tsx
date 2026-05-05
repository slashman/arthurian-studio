import React, { useEffect, useState } from 'react'
import { useProject } from '../ProjectContext'
import MapLayerSidebar from './MapLayerSidebar'
import MapView from './MapView'

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

  const { width, height, tilewidth, tileheight, layers } = mapData;

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
            />

            <MapLayerSidebar 
                layers={layers}
                visibleLayers={visibleLayers}
                onToggleLayer={toggleLayer}
            />
        </div>
    </div>
  )
}

export default TileMapEditor
