import React, { useState } from 'react'
import { ProjectData } from './EntityTypes'
import Sidebar from './components/Sidebar'
import MainArea from './components/MainArea'
import EditModal from './components/EditModal'
import ProjectLoader from './components/ProjectLoader'

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
    return <ProjectLoader onOpen={handleOpenProject} />
  }

  return (
    <div className="app-container">
      <Sidebar 
        activeTab={activeTab} 
        onSelectTab={setActiveTab} 
      />

      <MainArea 
        activeTab={activeTab}
        items={projectData.data[activeTab]}
        onAddItem={handleAddItem}
        onSave={handleSave}
        onEditItem={handleEditItem}
      />

      {editingItem && (
        <EditModal 
          activeTab={activeTab}
          editingItem={editingItem}
          editIndex={editIndex}
          onCancel={() => setEditingItem(null)}
          onConfirm={saveEdit}
          onUpdateItem={setEditingItem}
        />
      )}
    </div>
  )
}

export default App
