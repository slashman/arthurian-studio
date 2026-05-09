import React, { useEffect, useState, useRef } from 'react'
import { Save, Undo, Redo } from 'lucide-react'
import { useProject } from '../ProjectContext'
import { useMapHistory } from '../hooks/useMapHistory'
import MapLayerSidebar from './MapLayerSidebar'
import MapView from './MapView'
import TilesetPicker from './TilesetPicker'
import EditMapObjectModal, { MapObject } from './EditMapObjectModal'
import mapObjectTypes from '../mapObjectTypes.json'

interface TileMapEditorProps {
  filename: string;
}

const STYLES = {
    container: { padding: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' } as React.CSSProperties,
    toolbar: { padding: '10px 20px', background: '#252526', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 } as React.CSSProperties,
    toolbarLeft: { display: 'flex', alignItems: 'center', gap: '20px' } as React.CSSProperties,
    title: { margin: 0, fontSize: '1.2rem' } as React.CSSProperties,
    subtitle: { fontSize: '0.8rem', color: '#888' } as React.CSSProperties,
    historyControls: { display: 'flex', background: '#333', borderRadius: '4px', padding: '2px' } as React.CSSProperties,
    historyButton: (disabled: boolean) => ({ background: 'none', border: 'none', color: !disabled ? '#fff' : '#666', padding: '6px 10px', cursor: !disabled ? 'pointer' : 'default', display: 'flex', alignItems: 'center' }) as React.CSSProperties,
    saveButton: { display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 15px' } as React.CSSProperties,
    mainContent: { display: 'flex', flexGrow: 1, overflow: 'hidden' } as React.CSSProperties,
    sidebar: { width: '300px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #333' } as React.CSSProperties,
    tabContainer: { display: 'flex', background: '#1e1e1e', borderBottom: '1px solid #333' } as React.CSSProperties,
    tab: (active: boolean) => ({ 
        padding: '10px 15px', 
        cursor: 'pointer', 
        fontSize: '0.85rem',
        borderBottom: active ? '2px solid #007acc' : '2px solid transparent',
        background: active ? '#252526' : 'transparent',
        flexGrow: 1,
        textAlign: 'center' as const
    }) as React.CSSProperties,
    tabContent: { flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' } as React.CSSProperties
};

const TileMapEditor: React.FC<TileMapEditorProps> = ({ filename }) => {
  const { projectData } = useProject();
  const { mapData, setMapData, performAction, undo, redo, canUndo, canRedo } = useMapHistory(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tilesetPaths, setTilesetPaths] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [visibleLayers, setVisibleLayers] = useState<Record<number, boolean>>({});
  const [activeLayerIdx, setActiveLayerIdx] = useState<number>(0);
  const [rightSidebarTab, setRightSidebarTab] = useState<'layers' | 'tilesets'>('tilesets');
  const [activeTile, setActiveTile] = useState<{ tilesetName: string, tileId: number } | null>(null);
  const [editingObject, setEditingObject] = useState<MapObject | null>(null);
  const [isNewObject, setIsNewObject] = useState(false);
  const strokeBuffer = useRef<{ lIdx: number, tIdx: number, oldGid: number, newGid: number }[] | null>(null);
  const lastProcessedPos = useRef<{ col: number, row: number } | null>(null);
  const isMouseDown = useRef(false);

  const getLayerCategory = (lIdx: number) => {
    if (!mapData) return null;
    const layerName = mapData.layers[lIdx].name;
    return mapObjectTypes.layerCategories.find(cat => layerName.includes(cat)) || null;
  };

  const getMapPath = () => {
    if (!projectData || !filename) return null;
    const lastSlash = Math.max(projectData.filePath.lastIndexOf('/'), projectData.filePath.lastIndexOf('\\'));
    const projectDir = projectData.filePath.substring(0, lastSlash);
    const mapsDir = projectDir + (projectDir.includes('/') ? '/maps' : '\\maps');
    return mapsDir + (mapsDir.includes('/') ? '/' : '\\') + filename;
  };

  useEffect(() => {
    const loadMap = async () => {
      const mapPath = getMapPath();
      if (!mapPath) return;

      setLoading(true);
      setError(null);

      try {
        const content = await window.electron.loadFile(mapPath);
        if (!content) {
          setError(`Could not find map file: ${mapPath}`);
          setLoading(false);
          return;
        }

        const json = JSON.parse(content);
        
        // PRE-DECODE all tile layers into Uint32Array
        json.layers.forEach((layer: any) => {
            if (layer.type === 'tilelayer') {
                if (layer.encoding === 'base64') {
                    const binaryString = window.atob(layer.data);
                    const bytes = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
                    layer.data = new Uint32Array(bytes.buffer);
                } else if (Array.isArray(layer.data)) {
                    layer.data = new Uint32Array(layer.data);
                }
            }
        });

        setMapData(json, true);

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
        const lastSlash = Math.max(projectData!.filePath.lastIndexOf('/'), projectData!.filePath.lastIndexOf('\\'));
        const projectDir = projectData!.filePath.substring(0, lastSlash);
        const mapsDir = projectDir + (projectDir.includes('/') ? '/maps' : '\\maps');

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

  const handleSave = async () => {
    const mapPath = getMapPath();
    if (!mapPath || !mapData) return;

    setSaving(true);
    try {
        // Clone and RE-ENCODE back to original format for saving
        const dataToSave = JSON.parse(JSON.stringify(mapData, (key, value) => {
            if (value instanceof Uint32Array) return Array.from(value);
            return value;
        }));

        dataToSave.layers.forEach((layer: any, idx: number) => {
            if (layer.type === 'tilelayer') {
                const sourceData = mapData.layers[idx].data;
                if (sourceData instanceof Uint32Array) {
                    if (layer.encoding === 'base64') {
                        const updatedBytes = new Uint8Array(sourceData.buffer);
                        let updatedBinary = '';
                        for (let i = 0; i < updatedBytes.length; i++) {
                            updatedBinary += String.fromCharCode(updatedBytes[i]);
                        }
                        layer.data = window.btoa(updatedBinary);
                    } else {
                        layer.data = Array.from(sourceData);
                    }
                }
            }
        });

        const success = await window.electron.saveData(mapPath, dataToSave);
        if (success) {
            alert('Map saved successfully!');
        } else {
            alert('Failed to save map.');
        }
    } catch (e) {
        console.error('Error saving map:', e);
        alert(`Error saving map: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
        setSaving(false);
    }
  };

  const toggleLayer = (idx: number) => {
      setVisibleLayers(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const handleMouseDown = () => {
    isMouseDown.current = true;
    strokeBuffer.current = [];
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
    if (strokeBuffer.current && strokeBuffer.current.length > 0) {
      performAction({
        type: 'MULTI_DRAW_TILE',
        actions: [...strokeBuffer.current]
      });
    }
    strokeBuffer.current = null;
    lastProcessedPos.current = null;
  };

  const handleCellClick = (lIdx: number, tIdx: number) => {
    if (!mapData) return;
    const layer = mapData.layers[lIdx];
    const { width, tilewidth, tileheight } = mapData;
    const col = tIdx % width;
    const row = Math.floor(tIdx / width);

    if (layer.type === 'objectgroup') {
        // Only allow interaction on the initial mousedown or a single click, not during a drag movement
        if (isMouseDown.current && lastProcessedPos.current) return;

        const existingObj = (layer.objects || []).find((obj: any) => {
            const objCol = Math.floor(obj.x / tilewidth);
            const objRow = Math.floor(obj.y / tileheight) - 1; 
            return objCol === col && objRow === row;
        });

        if (existingObj) {
            setEditingObject(existingObj);
            setIsNewObject(false);
        } else {
            if (!activeTile) {
                alert('Please select a tile first to add an object.');
                return;
            }
            const tileset = mapData.tilesets.find((ts: any) => ts.name === activeTile.tilesetName);
            if (!tileset) return;
            const gid = tileset.firstgid + activeTile.tileId;

            const nextId = Math.max(0, ...mapData.layers.flatMap((l: any) => (l.objects || []).map((o: any) => o.id))) + 1;

            setEditingObject({
                id: nextId,
                name: '',
                type: '',
                x: col * tilewidth,
                y: (row + 1) * tileheight,
                width: tilewidth,
                height: tileheight,
                gid: gid,
                rotation: 0,
                visible: true,
                properties: {},
                propertytypes: {}
            });
            setIsNewObject(true);
        }

        if (isMouseDown.current) {
            lastProcessedPos.current = { col, row };
        }
    } else if (layer.type === 'tilelayer') {
        if (lIdx !== activeLayerIdx) return;

        // Continuous stamping interpolation
        if (isMouseDown.current && lastProcessedPos.current) {
            const x0 = lastProcessedPos.current.col;
            const y0 = lastProcessedPos.current.row;
            const x1 = col;
            const y1 = row;

            const dx = Math.abs(x1 - x0);
            const dy = Math.abs(y1 - y0);
            const sx = (x0 < x1) ? 1 : -1;
            const sy = (y0 < y1) ? 1 : -1;
            let err = dx - dy;

            let currX = x0;
            let currY = y0;

            while (true) {
                if (currX === x1 && currY === y1) break;
                const e2 = 2 * err;
                if (e2 > -dy) { err -= dy; currX += sx; }
                if (e2 < dx) { err += dx; currY += sy; }
                
                const interpIdx = currY * width + currX;
                stampTile(lIdx, interpIdx);
            }
        }

        stampTile(lIdx, tIdx);
        if (isMouseDown.current) {
            lastProcessedPos.current = { col, row };
        }
    }
  };

  const stampTile = (lIdx: number, tIdx: number) => {
    const layer = mapData.layers[lIdx];
    if (layer.type !== 'tilelayer') return;
    if (!activeTile) return;

    // Avoid redundant actions within the same stroke
    if (strokeBuffer.current && strokeBuffer.current.some(a => a.tIdx === tIdx && a.lIdx === lIdx)) return;

    const tileset = mapData.tilesets.find((ts: any) => ts.name === activeTile.tilesetName);
    if (!tileset) return;

    const newGid = tileset.firstgid + activeTile.tileId;
    const oldGid = layer.data[tIdx];

    if (oldGid === newGid) return;

    const action = { lIdx, tIdx, oldGid, newGid };

    if (strokeBuffer.current) {
        strokeBuffer.current.push(action);
        
        // Direct mutation for immediate visual feedback (it's safe as we clone mapData shortly)
        layer.data[tIdx] = newGid;
        
        // Trigger a re-render
        setMapData({ ...mapData, layers: [...mapData.layers] });
    } else {
        performAction({
            type: 'DRAW_TILE',
            lIdx,
            tIdx,
            oldGid,
            newGid
        });
    }
  };

  const handleConfirmObject = (updated: MapObject) => {
    if (isNewObject) {
        performAction({
            type: 'CREATE_OBJECT',
            lIdx: activeLayerIdx,
            object: updated
        });
    } else {
        const oldObject = (mapData.layers[activeLayerIdx].objects || []).find((o: any) => o.id === updated.id);
        if (oldObject) {
            performAction({
                type: 'UPDATE_OBJECT',
                lIdx: activeLayerIdx,
                oldObject: { ...oldObject },
                newObject: updated
            });
        }
    }
    setEditingObject(null);
  };

  const handleDeleteObject = (id: number) => {
    const oldObject = (mapData.layers[activeLayerIdx].objects || []).find((o: any) => o.id === id);
    if (oldObject) {
        performAction({
            type: 'DELETE_OBJECT',
            lIdx: activeLayerIdx,
            object: { ...oldObject }
        });
    }
    setEditingObject(null);
  };

  if (loading) return <div className="main-area">Loading map {filename}...</div>;
  if (error) return <div className="main-area" style={{ color: '#ff4444' }}>{error}</div>;
  if (!mapData) return null;

  const { width, height, tilewidth, tileheight, layers, tilesets } = mapData;

  return (
    <div className="main-area" style={STYLES.container}>
        <div style={STYLES.toolbar}>
            <div style={STYLES.toolbarLeft}>
                <div>
                    <h2 style={STYLES.title}>Map Editor: {filename}</h2>
                    <div style={STYLES.subtitle}>{width}x{height} tiles ({tilewidth}x{tileheight})</div>
                </div>
                <div style={STYLES.historyControls}>
                    <button 
                        onClick={undo} 
                        disabled={!canUndo}
                        title="Undo (Ctrl+Z)"
                        style={STYLES.historyButton(!canUndo)}
                    >
                        <Undo size={18} />
                    </button>
                    <button 
                        onClick={redo} 
                        disabled={!canRedo}
                        title="Redo (Ctrl+Y)"
                        style={STYLES.historyButton(!canRedo)}
                    >
                        <Redo size={18} />
                    </button>
                </div>
            </div>
            <button 
                onClick={handleSave} 
                disabled={saving}
                className="button-primary"
                style={STYLES.saveButton}
            >
                <Save size={16} />
                {saving ? 'Saving...' : 'Save Map'}
            </button>
        </div>
        
        <div style={STYLES.mainContent}>
            <MapView 
                mapData={mapData}
                tilesetPaths={tilesetPaths}
                visibleLayers={visibleLayers}
                activeLayerIdx={activeLayerIdx}
                onCellClick={handleCellClick}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
            />

            <div style={STYLES.sidebar}>
                <div style={STYLES.tabContainer}>
                    <div 
                        onClick={() => setRightSidebarTab('tilesets')}
                        style={STYLES.tab(rightSidebarTab === 'tilesets')}
                    >
                        Tilesets
                    </div>
                    <div 
                        onClick={() => setRightSidebarTab('layers')}
                        style={STYLES.tab(rightSidebarTab === 'layers')}
                    >
                        Layers
                    </div>
                </div>

                <div style={STYLES.tabContent}>
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

        {editingObject && (
            <EditMapObjectModal 
                object={editingObject}
                isNew={isNewObject}
                layerCategory={getLayerCategory(activeLayerIdx)}
                onCancel={() => setEditingObject(null)}
                onConfirm={handleConfirmObject}
                onDelete={handleDeleteObject}
            />
        )}
    </div>
  )
}

export default TileMapEditor
