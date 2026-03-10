import React, { useState } from 'react'
import { FolderOpen, Users, Palette, Plus, Save } from 'lucide-react'
import { ProjectData, MobType, Appearance } from './EntityTypes'

function App() {
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [activeTab, setActiveTab] = useState<'mobTypes' | 'appearances'>('mobTypes')
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [editIndex, setEditIndex] = useState<number>(-1)

  const handleOpenProject = async () => {
    const data = await window.electron.openProject()
    if (data) {
      setProjectData(data as ProjectData)
    }
  }

  const handleSave = async () => {
      if (!projectData) return;

      const { filePath, project } = projectData;
      // Extract directory path carefully
      const lastSlash = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
      const projectDir = filePath.substring(0, lastSlash);
      
      const targetFileRelative = activeTab === 'mobTypes' ? project.mobTypesFile : project.appearancesFile;
      const fullPath = projectDir + (projectDir.includes('/') ? '/' : '\\') + targetFileRelative;
      
      const dataToSave = projectData.data[activeTab];
      await window.electron.saveData(fullPath, dataToSave)
      alert('Saved!')
  }

  const handleEditItem = (item: any, index: number) => {
    setEditingItem({ ...item })
    setEditIndex(index)
  }

  const handleAddItem = () => {
    setEditingItem({})
    setEditIndex(-1)
  }

  const saveEdit = () => {
    if (!projectData) return;
    const newData = { ...projectData }
    const currentList = [...newData.data[activeTab]] as any[];

    if (editIndex >= 0) {
      currentList[editIndex] = editingItem
    } else {
      currentList.push(editingItem)
    }
    
    (newData.data as any)[activeTab] = currentList;
    setProjectData(newData)
    setEditingItem(null)
  }

  if (!projectData) {
    return (
      <div className="main-area" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Arthurian Studio</h1>
          <button onClick={handleOpenProject} style={{ padding: '15px 30px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FolderOpen /> Open Project
          </button>
        </div>
      </div>
    )
  }

  const items = projectData.data[activeTab]

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">Explorer</div>
        <div 
          className={`sidebar-item ${activeTab === 'mobTypes' ? 'active' : ''}`}
          onClick={() => setActiveTab('mobTypes')}
        >
          <Users size={16} /> Mob Types
        </div>
        <div 
          className={`sidebar-item ${activeTab === 'appearances' ? 'active' : ''}`}
          onClick={() => setActiveTab('appearances')}
        >
          <Palette size={16} /> Appearances
        </div>
      </div>

      <div className="main-area">
        <div className="toolbar">
          <button onClick={handleAddItem}><Plus size={16} /> Add New</button>
          <button onClick={handleSave}><Save size={16} /> Save Changes</button>
        </div>

        <h2>{activeTab === 'mobTypes' ? 'Mob Types' : 'Appearances'}</h2>

        <table>
          <thead>
            <tr>
              {activeTab === 'mobTypes' ? (
                <>
                  <th>ID</th>
                  <th>Name</th>
                  <th>HP</th>
                  <th>Damage</th>
                </>
              ) : (
                <>
                  <th>Tileset</th>
                  <th>Details</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {(items as any[]).map((item, index) => (
              <tr key={index} onClick={() => handleEditItem(item, index)}>
                {activeTab === 'mobTypes' ? (
                  <>
                    <td>{(item as MobType).id}</td>
                    <td>{(item as MobType).name}</td>
                    <td>{(item as MobType).hp}</td>
                    <td>{(item as MobType).damage}</td>
                  </>
                ) : (
                  <>
                    <td>{(item as Appearance).tileset}</td>
                    <td>
                      {(item as Appearance).mobs ? `${(item as Appearance).mobs?.length} mobs ` : ''} 
                      {(item as Appearance).items ? `${(item as Appearance).items?.length} items` : ''}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editIndex >= 0 ? 'Edit' : 'Add'} {activeTab === 'mobTypes' ? 'Mob Type' : 'Appearance'}</h3>
            
            <div className="form-group">
                <label>ID / Tileset Name</label>
                <input 
                  value={activeTab === 'mobTypes' ? (editingItem.id || '') : (editingItem.tileset || '')} 
                  onChange={(e) => {
                      const val = e.target.value;
                      setEditingItem((prev: any) => activeTab === 'mobTypes' ? {...prev, id: val} : {...prev, tileset: val})
                  }}
                />
            </div>

            {activeTab === 'mobTypes' && (
                <>
                    <div className="form-group">
                        <label>Name</label>
                        <input 
                          value={editingItem.name || ''} 
                          onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>HP</label>
                        <input 
                          type="number"
                          value={editingItem.hp || 0} 
                          onChange={(e) => setEditingItem({...editingItem, hp: parseInt(e.target.value) || 0})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Damage</label>
                        <input 
                          type="number"
                          value={editingItem.damage || 0} 
                          onChange={(e) => setEditingItem({...editingItem, damage: parseInt(e.target.value) || 0})}
                        />
                    </div>
                </>
            )}

            <div className="modal-actions">
              <button onClick={() => setEditingItem(null)} style={{ backgroundColor: '#444' }}>Cancel</button>
              <button onClick={saveEdit}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
