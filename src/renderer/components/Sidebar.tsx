import React, { useState } from 'react'
import { Users, Palette, ChevronDown, ChevronRight, FileJson, Sword, Box, FileText, Globe, Settings, FolderOpen, Layers } from 'lucide-react'
import { Tileset } from '../types/AppearanceEntityTypes'

interface SidebarProps {
  activeTab: 'mobTypes' | 'appearances' | 'items' | 'npcs' | 'objectTypes' | 'scenario' | 'cutscenes' | 'world-config' | 'world-maps' | 'tilesets';
  appearances: Tileset[];
  selectedAppearanceIndex: number | null;
  onSelectTab: (tab: 'mobTypes' | 'appearances' | 'items' | 'npcs' | 'objectTypes' | 'scenario' | 'cutscenes' | 'world-config' | 'world-maps' | 'tilesets') => void;
  onSelectAppearance: (index: number) => void;
  onLoadProject: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  appearances, 
  selectedAppearanceIndex, 
  onSelectTab, 
  onSelectAppearance,
  onLoadProject
}) => {
  const [appearancesExpanded, setAppearancesExpanded] = useState(true);
  const [worldExpanded, setWorldExpanded] = useState(true);

  return (
    <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sidebar-header">Explorer</div>
      
      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
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

          {/* Tilesets Header */}
          <div 
            className={`sidebar-item ${activeTab === 'tilesets' ? 'active' : ''}`}
            onClick={() => onSelectTab('tilesets')}
          >
            <Layers size={16} /> Tilesets
          </div>

          {/* Scenario Header */}

          {/* Cutscenes Header */}
          <div 
            className={`sidebar-item ${activeTab === 'cutscenes' ? 'active' : ''}`}
            onClick={() => onSelectTab('cutscenes')}
          >
            <FileText size={16} /> Cutscenes
          </div>

          {/* Mob Types Header */}
          <div 
            className={`sidebar-item ${activeTab === 'mobTypes' ? 'active' : ''}`}
            onClick={() => onSelectTab('mobTypes')}
          >
            <Users size={16} /> Mob Types
          </div>

          {/* NPCs Header */}
          <div 
            className={`sidebar-item ${activeTab === 'npcs' ? 'active' : ''}`}
            onClick={() => onSelectTab('npcs')}
          >
            <Users size={16} /> NPCs
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

          {/* Appearances Header */}
          <div 
            className={`sidebar-item ${activeTab === 'appearances' && selectedAppearanceIndex === null ? 'active' : ''}`}
            onClick={() => {
                onSelectTab('appearances');
                setAppearancesExpanded(!appearancesExpanded);
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexGrow: 1 }}>
                <Palette size={16} />
                <span style={{ flexGrow: 1 }}>Appearances</span>
                {appearancesExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
          </div>

          {/* Expanded Appearances List */}
          {appearancesExpanded && (
            <div style={{ marginLeft: '10px' }}>
                {appearances.map((app, idx) => (
                    <div 
                        key={idx}
                        className={`sidebar-item ${activeTab === 'appearances' && selectedAppearanceIndex === idx ? 'active' : ''}`}
                        style={{ fontSize: '0.85rem', padding: '4px 15px' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectAppearance(idx);
                        }}
                    >
                        <FileJson size={14} /> {app.tileset}
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
