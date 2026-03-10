import React, { useState } from 'react'
import { Users, Palette, ChevronDown, ChevronRight, FileJson } from 'lucide-react'
import { Appearance } from '../EntityTypes'

interface SidebarProps {
  activeTab: 'mobTypes' | 'appearances';
  appearances: Appearance[];
  selectedAppearanceIndex: number | null;
  onSelectTab: (tab: 'mobTypes' | 'appearances') => void;
  onSelectAppearance: (index: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  appearances, 
  selectedAppearanceIndex, 
  onSelectTab, 
  onSelectAppearance 
}) => {
  const [appearancesExpanded, setAppearancesExpanded] = useState(true);

  return (
    <div className="sidebar">
      <div className="sidebar-header">Explorer</div>
      
      {/* Mob Types Header */}
      <div 
        className={`sidebar-item ${activeTab === 'mobTypes' ? 'active' : ''}`}
        onClick={() => onSelectTab('mobTypes')}
      >
        <Users size={16} /> Mob Types
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
            {appearancesExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <Palette size={16} /> Appearances
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
  )
}

export default Sidebar
