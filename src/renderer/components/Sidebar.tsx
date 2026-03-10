import React from 'react'
import { Users, Palette } from 'lucide-react'

interface SidebarProps {
  activeTab: 'mobTypes' | 'appearances';
  onSelectTab: (tab: 'mobTypes' | 'appearances') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">Explorer</div>
      <div 
        className={`sidebar-item ${activeTab === 'mobTypes' ? 'active' : ''}`}
        onClick={() => onSelectTab('mobTypes')}
      >
        <Users size={16} /> Mob Types
      </div>
      <div 
        className={`sidebar-item ${activeTab === 'appearances' ? 'active' : ''}`}
        onClick={() => onSelectTab('appearances')}
      >
        <Palette size={16} /> Appearances
      </div>
    </div>
  )
}

export default Sidebar
