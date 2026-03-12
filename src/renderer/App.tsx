import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import EditMobTypes from './components/EditMobTypes'
import EditAppearances from './components/EditAppearances'
import EditItems from './components/EditItems'
import EditNPCs from './components/EditNPCs'
import EditMobTypeModal from './components/EditMobTypeModal'
import EditItemModal from './components/EditItemModal'
import EditNPCModal from './components/EditNPCModal'
import EditMobAppearanceModal from './components/EditMobAppearanceModal'
import EditItemAppearanceModal from './components/EditItemAppearanceModal'
import ProjectLoader from './components/ProjectLoader'
import { useProject } from './ProjectContext'
import { ProjectData } from './types/GeneralEntityTypes'


function App() {
  const { projectData, setProjectData } = useProject();
  const [activeTab, setActiveTab] = useState<'mobTypes' | 'appearances' | 'items' | 'npcs'>('mobTypes')
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
    
    let targetFileRelative = '';
    if (activeTab === 'mobTypes') targetFileRelative = project.mobTypesFile;
    else if (activeTab === 'appearances') targetFileRelative = project.appearancesFile;
    else if (activeTab === 'items') targetFileRelative = project.itemsFile;
    else if (activeTab === 'npcs') targetFileRelative = project.npcsFile;

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

  const handleDeleteItem = (index: number, subtype?: 'mobs' | 'items') => {
    if (!projectData) return;
    const newData = { ...projectData };
    if (activeTab === 'items') {
      const currentList = [...newData.data.items];
      currentList.splice(index, 1);
      newData.data.items = currentList;
    } else if (activeTab === 'mobTypes') {
      const currentList = [...newData.data.mobTypes];
      currentList.splice(index, 1);
      newData.data.mobTypes = currentList;
    } else if (activeTab === 'npcs') {
      const currentList = [...newData.data.npcs];
      currentList.splice(index, 1);
      newData.data.npcs = currentList;
    } else if (activeTab === 'appearances' && selectedAppearanceIndex !== null && subtype) {
      const currentAppearances = [...newData.data.appearances];
      const targetAppearance = { ...currentAppearances[selectedAppearanceIndex] };
      
      if (subtype === 'mobs') {
          const list = [...(targetAppearance.mobs || [])];
          list.splice(index, 1);
          targetAppearance.mobs = list;
      } else {
          const list = [...(targetAppearance.items || [])];
          list.splice(index, 1);
          targetAppearance.items = list;
      }
      
      currentAppearances[selectedAppearanceIndex] = targetAppearance;
      newData.data.appearances = currentAppearances;
    }
    setProjectData(newData);
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
    } else if (activeTab === 'items') {
        const currentList = [...newData.data.items];
        if (editIndex >= 0) {
            currentList[editIndex] = editingItem
        } else {
            currentList.push(editingItem)
        }
        newData.data.items = currentList;
    } else if (activeTab === 'npcs') {
        const currentList = [...newData.data.npcs];
        if (editIndex >= 0) {
            currentList[editIndex] = editingItem
        } else {
            currentList.push(editingItem)
        }
        newData.data.npcs = currentList;
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

  const handleSelectTab = (tab: 'mobTypes' | 'appearances' | 'items' | 'npcs') => {
      setActiveTab(tab);
      if (tab !== 'appearances') setSelectedAppearanceIndex(null);
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

      {activeTab === 'mobTypes' ? (
          <EditMobTypes 
            items={projectData.data.mobTypes}
            onAddItem={() => handleAddItem()}
            onSave={handleSave}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
          />
      ) : activeTab === 'items' ? (
          <EditItems 
            items={projectData.data.items}
            onAddItem={() => handleAddItem()}
            onSave={handleSave}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
          />
      ) : activeTab === 'npcs' ? (
          <EditNPCs 
            items={projectData.data.npcs}
            onAddItem={() => handleAddItem()}
            onSave={handleSave}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
          />
      ) : (
          <EditAppearances 
            items={projectData.data.appearances}
            selectedAppearanceIndex={selectedAppearanceIndex}
            onAddItem={handleAddItem}
            onSave={handleSave}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
          />
      )}

      {editingItem && activeTab === 'mobTypes' && (
        <EditMobTypeModal 
          editingItem={editingItem}
          editIndex={editIndex}
          onCancel={() => setEditingItem(null)}
          onConfirm={saveEdit}
          onUpdateItem={setEditingItem}
        />
      )}

      {editingItem && activeTab === 'items' && (
        <EditItemModal 
          editingItem={editingItem}
          editIndex={editIndex}
          onCancel={() => setEditingItem(null)}
          onConfirm={saveEdit}
          onUpdateItem={setEditingItem}
        />
      )}

      {editingItem && activeTab === 'npcs' && (
        <EditNPCModal 
          editingItem={editingItem}
          editIndex={editIndex}
          onCancel={() => setEditingItem(null)}
          onConfirm={saveEdit}
          onUpdateItem={setEditingItem}
        />
      )}

      {editingItem && activeTab === 'appearances' && editingSubtype === 'mobs' && selectedAppearanceIndex !== null && (
        <EditMobAppearanceModal 
          editingItem={editingItem}
          editIndex={editIndex}
          tileset={projectData.data.appearances[selectedAppearanceIndex].tileset}
          onCancel={() => { setEditingItem(null); setEditingSubtype(null); }}
          onConfirm={saveEdit}
          onUpdateItem={setEditingItem}
        />
      )}

      {editingItem && activeTab === 'appearances' && editingSubtype === 'items' && selectedAppearanceIndex !== null && (
        <EditItemAppearanceModal 
          editingItem={editingItem}
          editIndex={editIndex}
          tileset={projectData.data.appearances[selectedAppearanceIndex].tileset}
          onCancel={() => { setEditingItem(null); setEditingSubtype(null); }}
          onConfirm={saveEdit}
          onUpdateItem={setEditingItem}
        />
      )}
    </div>
  )
}

export default App
