import React from 'react'
import { Save } from 'lucide-react'
import MobAppearancesTable from './MobAppearancesTable'
import ItemAppearancesTable from './ItemAppearancesTable'
import { useProject } from '../ProjectContext'

interface EditAppearancesProps {
  tilesetId: string | null;
  onAddItem: (listType: 'mobs' | 'items', initialData?: any) => void;
  onSave: () => void;
  onEditItem: (item: any, index: number, listType: 'mobs' | 'items') => void;
  onDeleteItem: (index: number, listType: 'mobs' | 'items') => void;
}

const EditAppearances: React.FC<EditAppearancesProps> = ({ 
  tilesetId, 
  onAddItem, 
  onSave, 
  onEditItem,
  onDeleteItem
}) => {
  const { projectData } = useProject();

  if (tilesetId === null) {
      return (
          <div className="main-area">
              <h2>Tileset Editor</h2>
              <p style={{ color: '#888', marginBottom: '20px' }}>Select a tileset in the explorer to edit its appearances (mobs and items).</p>
          </div>
      )
  }

  const matchingAppearances = projectData?.data.appearances.filter(a => a.tileset === tilesetId) || [];
  const selectedAppearance = {
      tileset: tilesetId,
      mobs: matchingAppearances.flatMap(a => a.mobs || []),
      items: matchingAppearances.flatMap(a => a.items || [])
  };

  return (
    <div className="main-area">
      <div className="toolbar">
        <button onClick={onSave}><Save size={16} /> Save Changes</button>
      </div>

      <h2>Tileset: {tilesetId}</h2>
      <p style={{ color: '#888', marginBottom: '20px' }}>Appearances map specific regions of a Tileset to entity IDs, defining how Creatures and Items look in the game.</p>

      <MobAppearancesTable 
        tilesetId={selectedAppearance.tileset}
        items={selectedAppearance.mobs}
        onAddItem={() => onAddItem('mobs')}
        onEditItem={(item, idx) => onEditItem(item, idx, 'mobs')}
        onDeleteItem={(idx) => onDeleteItem(idx, 'mobs')}
      />

      <ItemAppearancesTable 
        tilesetId={selectedAppearance.tileset}
        items={selectedAppearance.items}
        onAddItem={(initialData) => onAddItem('items', initialData)}
        onEditItem={(item, idx) => onEditItem(item, idx, 'items')}
        onDeleteItem={(idx) => onDeleteItem(idx, 'items')}
      />
    </div>
  )
}

export default EditAppearances
