import React, { useState, useEffect } from 'react'
import { Search, X, Image as ImageIcon } from 'lucide-react'
import { useProject } from '../ProjectContext'

interface AssetPickerModalProps {
  onSelect: (path: string) => void;
  onCancel: () => void;
}

const AssetPickerModal: React.FC<AssetPickerModalProps> = ({ onSelect, onCancel }) => {
  const { projectData } = useProject();
  const [files, setFiles] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFiles = async () => {
      if (!projectData) return;
      
      const lastSlash = Math.max(projectData.filePath.lastIndexOf('/'), projectData.filePath.lastIndexOf('\\'));
      const projectDir = projectData.filePath.substring(0, lastSlash);
      const resDir = projectDir + (projectDir.includes('/') ? '/' : '\\') + 'res';
      
      const allFiles = await window.electron.listFiles(resDir);
      // Filter for PNG files
      setFiles(allFiles.filter(f => f.toLowerCase().endsWith('.png')));
      setLoading(false);
    };
    
    loadFiles();
  }, [projectData]);

  if (!projectData) return null;

  const filteredFiles = files.filter(f => f.toLowerCase().includes(searchTerm.toLowerCase()));

  const getMediaUrl = (filename: string) => {
    const lastSlash = Math.max(projectData.filePath.lastIndexOf('/'), projectData.filePath.lastIndexOf('\\'));
    const projectDir = projectData.filePath.substring(0, lastSlash);
    const fullPath = projectDir + (projectDir.includes('/') ? '/' : '\\') + 'res' + (projectDir.includes('/') ? '/' : '\\') + filename;
    return `media:///${fullPath.replace(/\\/g, '/')}`;
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 3000 }}>
      <div className="modal-content" style={{ width: '600px', height: '70%', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Select Asset (res/*.png)</h3>
          <button onClick={onCancel} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input 
                placeholder="Filter assets..." 
                style={{ paddingLeft: '35px', width: '100%' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div style={{ flexGrow: 1, overflowY: 'auto', background: '#111', borderRadius: '4px', padding: '10px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Loading assets...</div>
            ) : filteredFiles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                {searchTerm ? 'No assets match your search.' : 'No PNG files found in res/ folder.'}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
                {filteredFiles.map((file, idx) => (
                  <div 
                    key={idx}
                    onClick={() => onSelect(`res/${file}`)}
                    style={{
                      background: '#222',
                      border: '1px solid #333',
                      borderRadius: '4px',
                      padding: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#4ec9b0';
                      e.currentTarget.style.background = '#2a2a2a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#333';
                      e.currentTarget.style.background = '#222';
                    }}
                  >
                    <div style={{ width: '64px', height: '64px', background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                      <img 
                        src={getMediaUrl(file)} 
                        alt={file}
                        style={{ maxWidth: '100%', maxHeight: '100%', imageRendering: 'pixelated' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          ((e.target as HTMLElement).parentElement as HTMLElement).innerHTML = '<div style="color: #444"><ImageIcon size={32} /></div>';
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#ccc', textAlign: 'center', wordBreak: 'break-all' }}>{file}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onCancel} style={{ backgroundColor: '#444' }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default AssetPickerModal
