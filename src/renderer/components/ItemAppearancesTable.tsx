import React, { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { ItemAppearance } from '../types/AppearanceEntityTypes'
import AppearanceCanvas from './AppearanceCanvas'
import { useProject } from '../ProjectContext'

interface ItemAppearancesTableProps {
  tilesetId: string;
  items: ItemAppearance[];
  onAddItem: (initialData: any) => void;
  onEditItem: (item: ItemAppearance, index: number) => void;
  onDeleteItem: (index: number) => void;
}

const ItemAppearancesTable: React.FC<ItemAppearancesTableProps> = ({ 
  tilesetId, 
  items, 
  onAddItem, 
  onEditItem, 
  onDeleteItem 
}) => {
  const { projectData } = useProject();
  const [totalFrames, setTotalFrames] = useState<number>(0);

  useEffect(() => {
    if (!projectData) return;
    const tilesets = projectData.data.tilesets || [];
    const tilesetDef = tilesets.find((ts: any) => ts.id === tilesetId);
    if (!tilesetDef) return;

    const tileWidth = tilesetDef?.tileWidth || projectData.project.tileWidth || 16;
    const tileHeight = tilesetDef?.tileHeight || projectData.project.tileHeight || 16;

    const lastSlash = Math.max(projectData.filePath.lastIndexOf('/'), projectData.filePath.lastIndexOf('\\'));
    const projectDir = projectData.filePath.substring(0, lastSlash);
    const imgPathRelative = tilesetDef?.file || '';
    
    if (!imgPathRelative) return;

    const mediaUrl = `media:///${(projectDir + (projectDir.includes('/') ? '/' : '\\') + imgPathRelative).replace(/\\/g, '/')}`;

    const img = new Image();
    img.src = mediaUrl;
    img.onload = () => {
        const columns = Math.floor(img.width / tileWidth);
        const rows = Math.floor(img.height / tileHeight);
        setTotalFrames(columns * rows);
    };
  }, [tilesetId, projectData]);

  // Create a map for easy lookup
  const frameMap: Record<number, { item: ItemAppearance, index: number }> = {};
  items.forEach((item, index) => {
      frameMap[item.i] = { item, index };
  });

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', marginBottom: '15px' }}>
          <h3>Items</h3>
          <p style={{ color: '#888', fontSize: '0.85rem' }}>Select a tile to create or edit an item appearance.</p>
      </div>
      
      <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
          gap: '10px',
          background: '#1e1e1e',
          padding: '15px',
          borderRadius: '4px',
          border: '1px solid #333',
          maxHeight: '500px',
          overflowY: 'auto'
      }}>
          {Array.from({ length: totalFrames }).map((_, i) => {
              const existing = frameMap[i];
              return (
                <div 
                    key={i}
                    onClick={() => existing ? onEditItem(existing.item, existing.index) : onAddItem({ i })}
                    style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: '5px',
                        padding: '10px',
                        background: existing ? '#2d2d2d' : '#252526',
                        border: existing ? '1px solid #4ec9b0' : '1px solid #333',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'transform 0.1s, border-color 0.1s'
                    }}
                    title={`Frame ${i}${existing ? `: ${existing.item.id}` : ''}`}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#4ec9b0';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = existing ? '#4ec9b0' : '#333';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <AppearanceCanvas tilesetId={tilesetId} frameIndex={i} size={48} />
                    <span style={{ 
                        fontSize: '0.7rem', 
                        color: existing ? '#4ec9b0' : '#666',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%',
                        textAlign: 'center'
                    }}>
                        {existing ? existing.item.id : `Frame ${i}`}
                    </span>
                    {existing && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Delete item appearance ${existing.item.id}?`)) {
                                    onDeleteItem(existing.index);
                                }
                            }}
                            style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                background: 'rgba(255, 68, 68, 0.8)',
                                border: 'none',
                                color: 'white',
                                borderRadius: '2px',
                                padding: '2px',
                                cursor: 'pointer',
                                display: 'flex'
                            }}
                        >
                            <Trash2 size={12} />
                        </button>
                    )}
                </div>
              );
          })}
      </div>
    </>
  )
}

export default ItemAppearancesTable
