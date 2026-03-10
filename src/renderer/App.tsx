import React, { useState } from 'react'
import { ProjectData, Appearance } from './EntityTypes'
import Sidebar from './components/Sidebar'
import MainArea from './components/MainArea'
import EditMobTypeModal from './components/EditMobTypeModal'
import EditMobAppearanceModal from './components/EditMobAppearanceModal'
import EditItemAppearanceModal from './components/EditItemAppearanceModal'
import ProjectLoader from './components/ProjectLoader'

function App() {
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [activeTab, setActiveTab] = useState<'mobTypes' | 'appearances'>('mobTypes')
  const [selectedAppearanceIndex, setSelectedAppearanceIndex] = useState<number | null>(null)
  
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [editIndex, setEditIndex] = useState<number>(-1)
  const [editingSubtype, setEditingSubtype] = useState<'mobs' | 'items' | null>(null)

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

  const handleEditItem = (item: any, index: number, subtype?: 'mobs' | 'items') => {
    setEditingItem({ ...item })
    setEditIndex(index)
    setEditingSubtype(subtype || null)
  }

  const handleAddItem = (subtype?: 'mobs' | 'items') => {
    setEditingItem({})
    setEditIndex(-1)
    setEditingSubtype(subtype || null)
  }

  const saveEdit = () => {
    if (!projectData) return;
    const newData = { ...projectData }

    if (activeTab === 'mobTypes') {
        const currentList = [...newData.data.mobTypes];
        if (editIndex >= 0) {
            currentList[editIndex] = editingItem
        } else {
            currentList.push(editingItem)
        }
        newData.data.mobTypes = currentList;
    } else if (activeTab === 'appearances' && selectedAppearanceIndex !== null && editingSubtype) {
        const currentAppearances = [...newData.data.appearances];
        const targetAppearance = { ...currentAppearances[selectedAppearanceIndex] };
        
        if (editingSubtype === 'mobs') {
            const list = [...(targetAppearance.mobs || [])];
            if (editIndex >= 0) list[editIndex] = editingItem;
            else list.push(editingItem);
            targetAppearance.mobs = list;
        } else {
            const list = [...(targetAppearance.items || [])];
            if (editIndex >= 0) list[editIndex] = editingItem;
            else list.push(editingItem);
            targetAppearance.items = list;
        }
        
        currentAppearances[selectedAppearanceIndex] = targetAppearance;
        newData.data.appearances = currentAppearances;
    }
    
    setProjectData(newData)
    setEditingItem(null)
    setEditingSubtype(null)
  }

  const handleSelectTab = (tab: 'mobTypes' | 'appearances') => {
      setActiveTab(tab);
      if (tab === 'mobTypes') setSelectedAppearanceIndex(null);
  }

  const handleSelectAppearance = (index: number) => {
      setActiveTab('appearances');
      setSelectedAppearanceIndex(index);
  }

  if (!projectData) {
    return <ProjectLoader onOpen={handleOpenProject} />
  }

  return (
    <div className="app-container">
      <Sidebar 
        activeTab={activeTab} 
        appearances={projectData.data.appearances}
        selectedAppearanceIndex={selectedAppearanceIndex}
        onSelectTab={handleSelectTab} 
        onSelectAppearance={handleSelectAppearance}
      />

      <MainArea 
        activeTab={activeTab}
        items={projectData.data[activeTab]}
        selectedAppearanceIndex={selectedAppearanceIndex}
        onAddItem={handleAddItem}
        onSave={handleSave}
        onEditItem={handleEditItem}
      />

      {editingItem && activeTab === 'mobTypes' && (
        <EditMobTypeModal 
          editingItem={editingItem}
          editIndex={editIndex}
          onCancel={() => setEditingItem(null)}
          onConfirm={saveEdit}
          onUpdateItem={setEditingItem}
        />
      )}

      {editingItem && activeTab === 'appearances' && editingSubtype === 'mobs' && (
        <EditMobAppearanceModal 
          editingItem={editingItem}
          editIndex={editIndex}
          onCancel={() => { setEditingItem(null); setEditingSubtype(null); }}
          onConfirm={saveEdit}
          onUpdateItem={setEditingItem}
        />
      )}

      {editingItem && activeTab === 'appearances' && editingSubtype === 'items' && (
        <EditItemAppearanceModal 
          editingItem={editingItem}
          editIndex={editIndex}
          onCancel={() => { setEditingItem(null); setEditingSubtype(null); }}
          onConfirm={saveEdit}
          onUpdateItem={setEditingItem}
        />
      )}
    </div>
  )
}

export default App
