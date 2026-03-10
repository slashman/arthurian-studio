import React from 'react'
import { FolderOpen } from 'lucide-react'

interface ProjectLoaderProps {
  onOpen: () => void;
}

const ProjectLoader: React.FC<ProjectLoaderProps> = ({ onOpen }) => {
  return (
    <div className="main-area" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Arthurian Studio</h1>
        <p style={{ color: '#858585', marginBottom: '20px' }}>Open a .arthurian project file to begin editing.</p>
        <button onClick={onOpen} style={{ padding: '15px 30px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FolderOpen /> Open Project
        </button>
      </div>
    </div>
  )
}

export default ProjectLoader
