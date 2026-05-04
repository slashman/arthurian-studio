import React, { useState } from 'react'
import { Users, Palette, ChevronDown, ChevronRight, FileJson, Sword, Box, FileText, Globe, Settings, FolderOpen, Layers, BookOpen } from 'lucide-react'

interface SidebarProps {
  activeTab: 'mobTypes' | 'appearances' | 'items' | 'npcs' | 'objectTypes' | 'scenario' | 'cutscenes' | 'world-config' | 'world-maps' | 'tilesets' | 'quickstart';
  tilesets: { id: string }[];
  selectedTilesetIndex: number | null;
  onSelectTab: (tab: 'mobTypes' | 'appearances' | 'items' | 'npcs' | 'objectTypes' | 'scenario' | 'cutscenes' | 'world-config' | 'world-maps' | 'tilesets' | 'quickstart') => void;
  onSelectTileset: (index: number) => void;
  onLoadProject: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  tilesets, 
  selectedTilesetIndex, 
  onSelectTab, 
  onSelectTileset,
  onLoadProject
}) => {
  const [tilesetsExpanded, setTilesetsExpanded] = useState(true);
  const [worldExpanded, setWorldExpanded] = useState(true);

  return (
    <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sidebar-header">Explorer</div>
      
      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
          {/* Quickstart Header */}
          <div 
            className={`sidebar-item ${activeTab === 'quickstart' ? 'active' : ''}`}
            onClick={() => onSelectTab('quickstart')}
            style={{ borderBottom: '1px solid #333', marginBottom: '10px', paddingBottom: '10px' }}
          >
            <BookOpen size={16} color="#4ec9b0" /> Quickstart
          </div>

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
            className={`sidebar-item ${(activeTab === 'world-config' || activeTab === 'world-maps') ? 'active' : ''}`}
            onClick={() => {
                setWorldExpanded(!worldExpanded);
                if (!worldExpanded) onSelectTab('world-config');
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexGrow: 1 }}>
                <Globe size={16} />
                <span style={{ flexGrow: 1 }}>World</span>
                {worldExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
          </div>

          {/* Expanded World List */}
          {worldExpanded && (
            <div style={{ marginLeft: '10px' }}>
                <div 
                    className={`sidebar-item ${activeTab === 'world-config' ? 'active' : ''}`}
                    style={{ fontSize: '0.85rem', padding: '4px 15px' }}
                    onClick={() => onSelectTab('world-config')}
                >
                    <Settings size={14} /> Config
                </div>
                <div 
                    className={`sidebar-item ${activeTab === 'world-maps' ? 'active' : ''}`}
                    style={{ fontSize: '0.85rem', padding: '4px 15px' }}
                    onClick={() => onSelectTab('world-maps')}
                >
                    <Globe size={14} /> Maps
                </div>
            </div>
          )}

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

      <div style={{ borderTop: '1px solid #333', padding: '10px 0' }}>
          <div 
            className="sidebar-item"
            onClick={onLoadProject}
            style={{ color: '#4ec9b0' }}
          >
            <FolderOpen size={16} /> Load Project
          </div>
      </div>
    </div>
  )
}

export default Sidebar
