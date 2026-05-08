import React, { useState, useEffect } from 'react'
import { FolderOpen, FilePlus, ChevronRight } from 'lucide-react'

interface ProjectLoaderProps {
  onOpen: (filePath?: string) => void;
  initialShowNewProject?: boolean;
}

interface Template {
  name: string;
  directory: string;
}

const ProjectLoader: React.FC<ProjectLoaderProps> = ({ onOpen, initialShowNewProject = false }) => {
  const [showNewProject, setShowNewProject] = useState(initialShowNewProject);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [projectName, setProjectName] = useState('MyNewProject');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      const data = await window.electron.getTemplates();
      setTemplates(data.templates);
      if (data.templates.length > 0) {
        setSelectedTemplate(data.templates[0].directory);
      }
    };
    fetchTemplates();
  }, []);

  const handleCreateProject = async () => {
    if (!selectedTemplate) return;
    try {
        const newProjPath = await window.electron.createProject(projectName, selectedTemplate);
        if (newProjPath) {
            onOpen(newProjPath);
        }
    } catch (e) {
        alert(`Failed to create project: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  if (showNewProject) {
    return (
      <div className="main-area" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div style={{ width: '400px', backgroundColor: '#2d2d2d', padding: '30px', borderRadius: '8px', border: '1px solid #454545' }}>
          <h2 style={{ marginBottom: '20px' }}>Create New Project</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>Project Filename</label>
            <input 
              type="text" 
              value={projectName} 
              onChange={(e) => setProjectName(e.target.value)}
              style={{ width: '100%', padding: '8px', backgroundColor: '#3c3c3c', border: '1px solid #454545', color: 'white', borderRadius: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>Select Template</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {templates.map(t => (
                <div 
                  key={t.directory}
                  onClick={() => setSelectedTemplate(t.directory)}
                  style={{ 
                    padding: '10px', 
                    backgroundColor: selectedTemplate === t.directory ? '#007acc' : '#3c3c3c',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    border: '1px solid #454545',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{t.name}</span>
                  {selectedTemplate === t.directory && <ChevronRight size={16} />}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => setShowNewProject(false)}
              className="secondary"
              style={{ padding: '8px 16px' }}
            >
              Cancel
            </button>
            <button 
              onClick={handleCreateProject}
              style={{ padding: '8px 16px' }}
            >
              Confirm & Create
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="main-area" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>Arthurian Studio</h1>
        <p style={{ color: '#858585', marginBottom: '40px', fontSize: '1.1rem' }}>Get started with your game project.</p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button 
            onClick={() => onOpen()} 
            style={{ 
              padding: '20px 40px', 
              fontSize: '1.2rem', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              gap: '15px',
              width: '200px'
            }}
          >
            <FolderOpen size={48} />
            <span>Open Project</span>
          </button>

          <button 
            onClick={() => setShowNewProject(true)} 
            className="secondary"
            style={{ 
              padding: '20px 40px', 
              fontSize: '1.2rem', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              gap: '15px',
              width: '200px'
            }}
          >
            <FilePlus size={48} />
            <span>New Project</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectLoader
