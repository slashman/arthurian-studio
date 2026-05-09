import React, { useState, useEffect } from 'react'
import { Save, Trash2, Map as MapIcon, FilePlus } from 'lucide-react'
import { ScenarioMap } from '../types/ScenarioEntityTypes'
import { useProject } from '../ProjectContext'
import CreateMapModal from './CreateMapModal'
import mapStructure from '../mapStructure.json'

interface EditMapChunkModalProps {
  chunk: ScenarioMap | null;
  x: number;
  y: number;
  onCancel: () => void;
  onConfirm: (updated: ScenarioMap | null) => void;
  onOpenEditor: (filename: string) => void;
}

const STYLES = {
  modalContent: { width: '400px' } as React.CSSProperties,
  gridContainer: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' } as React.CSSProperties,
  deleteBtn: { marginRight: 'auto', backgroundColor: '#ff4444' } as React.CSSProperties,
  openEditorBtn: { backgroundColor: '#007acc' } as React.CSSProperties,
  cancelBtn: { backgroundColor: '#444' } as React.CSSProperties,
  row: { display: 'flex', gap: '5px', alignItems: 'center' } as React.CSSProperties,
  createBtn: { 
    background: '#333', 
    border: '1px solid #555', 
    color: '#fff', 
    padding: '4px', 
    borderRadius: '4px', 
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  } as React.CSSProperties
};

const EditMapChunkModal: React.FC<EditMapChunkModalProps> = ({ 
  chunk, 
  x, 
  y, 
  onCancel, 
  onConfirm,
  onOpenEditor
}) => {
  const { projectData } = useProject();
  const [mapFiles, setMapFiles] = useState<string[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingChunk, setEditingChunk] = useState<ScenarioMap>({
    name: '',
    filename: '',
    x: x,
    y: y
  });

  const fetchMapFiles = async () => {
    if (!projectData) return;
    setLoadingFiles(true);
    try {
      const lastSlash = Math.max(projectData.filePath.lastIndexOf('/'), projectData.filePath.lastIndexOf('\\'));
      const projectDir = projectData.filePath.substring(0, lastSlash);
      const mapsDir = projectDir + (projectDir.includes('/') ? '/maps' : '\\maps');
      
      const files = await window.electron.listFiles(mapsDir);
      if (files) {
        const jsonFiles = files
          .filter((f: string) => f.toLowerCase().endsWith('.json'))
          .sort((a: string, b: string) => a.localeCompare(b));
        setMapFiles(jsonFiles);
      }
    } catch (e) {
      console.error('Error listing map files:', e);
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    fetchMapFiles();
  }, [projectData]);

  useEffect(() => {
    if (chunk) {
      setEditingChunk({ ...chunk });
    } else {
      setEditingChunk({
        name: 'newMap',
        filename: '',
        x: x,
        y: y
      });
    }
  }, [chunk, x, y]);

  const handleSave = () => {
    if (!editingChunk.filename) {
      alert('Please select a map file.');
      return;
    }
    onConfirm(editingChunk);
  };

  const handleCreateNewMap = async (filename: string, floors: number) => {
    if (!projectData) return;

    try {
        const lastSlash = Math.max(projectData.filePath.lastIndexOf('/'), projectData.filePath.lastIndexOf('\\'));
        const projectDir = projectData.filePath.substring(0, lastSlash);
        const isSlash = projectDir.includes('/');
        const mapsDir = projectDir + (isSlash ? '/maps' : '\\maps');
        const fullPath = mapsDir + (isSlash ? '/' : '\\') + filename;
        const scenarioPath = projectDir + (isSlash ? '/data/scenario.json' : '\\data\\scenario.json');

        // Generate layer structure
        const layers: any[] = [];
        let nextLayerId = 1;
        
        // Load scenario info for chunk size from the data/scenario.json file
        const scenarioContent = await window.electron.loadFile(scenarioPath);
        if (!scenarioContent) {
            throw new Error(`Could not load scenario file at ${scenarioPath}`);
        }
        const scenarioJson = JSON.parse(scenarioContent);
        
        const { chunkSize, tileWidth, tileHeight } = scenarioJson.config;
        
        if (chunkSize === undefined || tileWidth === undefined || tileHeight === undefined) {
            throw new Error("Missing required configuration (chunkSize, tileWidth, or tileHeight) in scenario.json");
        }
        
        const width = chunkSize;
        const height = chunkSize;

        for (let f = 1; f <= floors; f++) {
            const prefix = f > 1 ? `${f} ` : "";
            mapStructure.layers.forEach(baseLayer => {
                const layer: any = {
                    id: nextLayerId++,
                    name: `${prefix}${baseLayer.name}`,
                    opacity: 1,
                    type: baseLayer.type,
                    visible: baseLayer.visible !== false,
                    x: 0,
                    y: 0
                };

                if (baseLayer.type === "tilelayer") {
                    layer.width = width;
                    layer.height = height;
                    layer.data = new Array(width * height).fill(0);
                } else if (baseLayer.type === "objectgroup") {
                    layer.draworder = "topdown";
                    layer.objects = [];
                }

                layers.push(layer);
            });
        }

        const newMap = {
            width,
            height,
            tilewidth: tileWidth,
            tileheight: tileHeight,
            layers: layers,
            nextobjectid: 1,
            orientation: "orthogonal",
            renderorder: "right-down",
            tiledversion: "1.0.3",
            tilesets: mapStructure.tilesets || [],
            type: "map",
            version: 1
        };

        const success = await window.electron.saveData(fullPath, newMap);
        if (success) {
            await fetchMapFiles();
            setEditingChunk(prev => ({ ...prev, filename: filename }));
            setShowCreateModal(false);
        } else {
            alert('Failed to create new map file.');
        }
    } catch (e) {
        console.error('Error creating new map:', e);
        alert(`Error creating new map: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete map chunk "${editingChunk.name}"?`)) {
      onConfirm(null);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={STYLES.modalContent}>
        <div className="modal-header">
          <h3>{chunk ? 'Edit Map Chunk' : 'Add Map Chunk'} at [{x}, {y}]</h3>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Chunk Name</label>
            <input 
              value={editingChunk.name} 
              onChange={(e) => setEditingChunk({...editingChunk, name: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Map File</label>
            <div style={STYLES.row}>
                <select 
                style={{ flexGrow: 1 }}
                value={editingChunk.filename} 
                onChange={(e) => setEditingChunk({...editingChunk, filename: e.target.value})}
                disabled={loadingFiles}
                >
                <option value="">-- Select a Map File --</option>
                {mapFiles.map(file => (
                    <option key={file} value={file}>{file}</option>
                ))}
                </select>
                <button 
                    type="button"
                    style={STYLES.createBtn}
                    onClick={() => setShowCreateModal(true)}
                    title="Create new map file"
                >
                    <FilePlus size={16} />
                </button>
            </div>
          </div>
          <div style={STYLES.gridContainer}>
            <div className="form-group">
              <label>Grid X</label>
              <input 
                type="number"
                value={editingChunk.x} 
                onChange={(e) => setEditingChunk({...editingChunk, x: parseInt(e.target.value) || 0})} 
              />
            </div>
            <div className="form-group">
              <label>Grid Y</label>
              <input 
                type="number"
                value={editingChunk.y} 
                onChange={(e) => setEditingChunk({...editingChunk, y: parseInt(e.target.value) || 0})} 
              />
            </div>
          </div>
        </div>

        <div className="modal-actions">
          {chunk && (
            <button className="delete-btn" onClick={handleDelete} style={STYLES.deleteBtn}>
              <Trash2 size={16} /> Delete
            </button>
          )}
          {chunk && editingChunk.filename && (
            <button onClick={() => onOpenEditor(editingChunk.filename)} style={STYLES.openEditorBtn}>
              <MapIcon size={16} /> Open in Map Editor
            </button>
          )}
          <button onClick={onCancel} style={STYLES.cancelBtn}>Cancel</button>
          <button onClick={handleSave} disabled={!editingChunk.filename}>
            <Save size={16} /> {chunk ? 'Update' : 'Add'}
          </button>
        </div>
      </div>

      {showCreateModal && (
          <CreateMapModal 
            onCancel={() => setShowCreateModal(false)}
            onConfirm={handleCreateNewMap}
          />
      )}
    </div>
  )
}

export default EditMapChunkModal
