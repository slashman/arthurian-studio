import React, { useState } from 'react'
import { Users, Palette, ChevronDown, ChevronRight, FileJson, Sword, Box, FileText, Globe, Settings, FolderOpen, Layers, BookOpen, Play, FilePlus, Info } from 'lucide-react'

interface SidebarProps {
  activeTab: 'mobTypes' | 'appearances' | 'items' | 'npcs' | 'objectTypes' | 'scenario' | 'cutscenes' | 'world-config' | 'world-maps' | 'tilesets' | 'quickstart' | 'map-editor' | 'project-info';
  tilesets: { id: string }[];
  selectedTilesetIndex: number | null;
  onSelectTab: (tab: 'mobTypes' | 'appearances' | 'items' | 'npcs' | 'objectTypes' | 'scenario' | 'cutscenes' | 'world-config' | 'world-maps' | 'tilesets' | 'quickstart' | 'map-editor' | 'project-info') => void;
  onSelectTileset: (index: number) => void;
  projectInfo?: { name: string; path: string };
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  tilesets, 
  selectedTilesetIndex, 
  onSelectTab, 
  onSelectTileset,
  projectInfo
}) => {
  const [tilesetsExpanded, setTilesetsExpanded] = useState(true);

  return (
    <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sidebar-header" style={{ padding: '15px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#fff', marginBottom: '4px' }}>
              {projectInfo?.name || 'Arthurian Studio'}
          </div>
          {projectInfo && (
              <div style={{ fontSize: '0.7rem', color: '#858585', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {projectInfo.path}
              </div>
          )}
      </div>
      
      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
          {/* Scenario Header */}
          <div 
            className={`sidebar-item ${activeTab === 'scenario' ? 'active' : ''}`}
            onClick={() => onSelectTab('scenario')}
          >
            <FileText size={16} /> Scenario
          </div>

          {/* NPCs Header */}
          <div 
            className={`sidebar-item ${activeTab === 'npcs' ? 'active' : ''}`}
            onClick={() => onSelectTab('npcs')}
          >
            <Users size={16} /> NPCs
          </div>

          {/* Creatures Header */}
          <div 
            className={`sidebar-item ${activeTab === 'mobTypes' ? 'active' : ''}`}
            onClick={() => onSelectTab('mobTypes')}
          >
            <Users size={16} /> Creatures
          </div>

          {/* Items Header */}
          <div 
            className={`sidebar-item ${activeTab === 'items' ? 'active' : ''}`}
            onClick={() => onSelectTab('items')}
          >
            <Sword size={16} /> Items
          </div>

          {/* Interactables Header */}
          <div 
            className={`sidebar-item ${activeTab === 'objectTypes' ? 'active' : ''}`}
            onClick={() => onSelectTab('objectTypes')}
          >
            <Box size={16} /> Interactables
          </div>

          {/* World Header */}
          <div 
            className={`sidebar-item ${activeTab === 'world-config' ? 'active' : ''}`}
            onClick={() => onSelectTab('world-config')}
          >
            <Settings size={16} /> World
          </div>

          {/* Maps Header */}
          <div 
            className={`sidebar-item ${activeTab === 'world-maps' ? 'active' : ''}`}
            onClick={() => onSelectTab('world-maps')}
          >
            <Globe size={16} /> Maps
          </div>

          {/* Cutscenes Header */}
          <div 
            className={`sidebar-item ${activeTab === 'cutscenes' ? 'active' : ''}`}
            onClick={() => onSelectTab('cutscenes')}
          >
            <FileText size={16} /> Cutscenes
          </div>

          {/* Tilesets Header */}
          <div 
            className={`sidebar-item ${activeTab === 'tilesets' && selectedTilesetIndex === null ? 'active' : ''}`}
            onClick={() => {
                onSelectTab('tilesets');
                setTilesetsExpanded(!tilesetsExpanded);
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexGrow: 1 }}>
                <Layers size={16} />
                <span style={{ flexGrow: 1 }}>Tilesets</span>
                {tilesetsExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
          </div>

          {/* Expanded Tilesets List */}
          {tilesetsExpanded && (
            <div style={{ marginLeft: '10px' }}>
                {tilesets.map((ts, idx) => (
                    <div 
                        key={idx}
                        className={`sidebar-item ${activeTab === 'appearances' && selectedTilesetIndex === idx ? 'active' : ''}`}
                        style={{ fontSize: '0.85rem', padding: '4px 15px' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectTileset(idx);
                        }}
                    >
                        <FileJson size={14} /> {ts.id}
                    </div>
                ))}
            </div>
          )}
      </div>
    </div>
  )
}

export default Sidebar
