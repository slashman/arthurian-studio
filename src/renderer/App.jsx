import React, { useState, useEffect } from 'react'
import { FolderOpen, Users, Palette, Plus, Save } from 'lucide-react'

function App() {
  const [projectData, setProjectData] = useState(null)
  const [activeTab, setActiveTab] = useState('mobTypes')
  const [editingItem, setEditingItem] = useState(null)
  const [editIndex, setEditIndex] = useState(-1)

  const handleOpenProject = async () => {
    const data = await window.electron.openProject()
    if (data) {
      setProjectData(data)
    }
  }

  const handleSave = async () => {
      // Logic to save the data back to the file
      // In a real app we'd save the specific file that was changed
      // For this prototype, let's just assume we're saving the whole project state if needed
      // Actually, we'll save the specific list we are editing
      const { filePath, project } = projectData;
      const projectDir = filePath.substring(0, filePath.lastIndexOf('\\')) // Simple path manipulation
      
      let targetFile = activeTab === 'mobTypes' ? project.mobTypesFile : project.appearancesFile;
      // Resolve path
      const fullPath = projectDir + '\\' + targetFile;
      
      await window.electron.saveData(fullPath, projectData.data[activeTab])
      alert('Saved!')
  }

  const handleEditItem = (item, index) => {
    setEditingItem({ ...item })
    setEditIndex(index)
  }

  const handleAddItem = () => {
    setEditingItem({})
    setEditIndex(-1)
  }

  const saveEdit = () => {
    const newData = { ...projectData }
    if (editIndex >= 0) {
      newData.data[activeTab][editIndex] = editingItem
    } else {
      newData.data[activeTab].push(editingItem)
    }
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
            {items.map((item, index) => (
              <tr key={index} onClick={() => handleEditItem(item, index)}>
                {activeTab === 'mobTypes' ? (
                  <>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.hp}</td>
                    <td>{item.damage}</td>
                  </>
                ) : (
                  <>
                    <td>{item.tileset}</td>
                    <td>
                      {item.mobs ? `${item.mobs.length} mobs` : ''} 
                      {item.items ? `${item.items.length} items` : ''}
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
                      setEditingItem(prev => activeTab === 'mobTypes' ? {...prev, id: val} : {...prev, tileset: val})
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
                          onChange={(e) => setEditingItem({...editingItem, hp: parseInt(e.target.value)})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Damage</label>
                        <input 
                          type="number"
                          value={editingItem.damage || 0} 
                          onChange={(e) => setEditingItem({...editingItem, damage: parseInt(e.target.value)})}
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
