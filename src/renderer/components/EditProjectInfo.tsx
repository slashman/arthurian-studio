import React, { useState, useEffect } from 'react';
import { useProject } from '../ProjectContext';
import { Info, Folder, FileCode, Tag, Play } from 'lucide-react';

interface EditProjectInfoProps {
  onSave: () => void;
}

const EditProjectInfo: React.FC<EditProjectInfoProps> = ({ onSave }) => {
  const { projectData, setProjectData } = useProject();
  const [runtimes, setRuntimes] = useState<{name: string, directory: string, code: string}[]>([]);

  useEffect(() => {
    const fetchRuntimes = async () => {
      const data = await window.electron.getRuntimes();
      setRuntimes(data.runtimes);
    };
    fetchRuntimes();
  }, []);

  if (!projectData) return null;

  const project = projectData.project;
  const projectDir = projectData.filePath.substring(0, Math.max(projectData.filePath.lastIndexOf('/'), projectData.filePath.lastIndexOf('\\')));

  const updateField = (field: string, value: any) => {
    setProjectData({
      ...projectData,
      project: {
        ...projectData.project,
        [field]: value
      }
    });
  };

  return (
    <div className="main-area">
      <div className="tab-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Info size={20} />
          <h2>Project Information</h2>
        </div>
        <button onClick={onSave}>Save Project Configuration</button>
      </div>

      <div className="edit-area" style={{ padding: '20px', maxWidth: '800px' }}>
        <section style={{ marginBottom: '30px', backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '15px', borderBottom: '1px solid #454545', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tag size={18} /> General
          </h3>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Project Name</label>
            <input 
              type="text" 
              value={project.projectName || ''} 
              onChange={(e) => updateField('projectName', e.target.value)}
              placeholder="Enter project name..."
            />
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
               <Play size={14} /> Runtime
            </label>
            <select 
              value={project.runtimeCode || ''} 
              onChange={(e) => updateField('runtimeCode', e.target.value)}
              style={{ width: '100%', padding: '8px', backgroundColor: '#3c3c3c', border: '1px solid #454545', color: 'white', borderRadius: '4px' }}
            >
              <option value="">Select a runtime...</option>
              {runtimes.map(r => (
                <option key={r.code} value={r.code}>{r.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Project Path</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#858585', padding: '8px', backgroundColor: '#1e1e1e', borderRadius: '4px' }}>
              <Folder size={14} />
              <span style={{ fontSize: '0.9rem', wordBreak: 'break-all' }}>{projectDir}</span>
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '10px' }}>
            <label>Main File</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#858585', padding: '8px', backgroundColor: '#1e1e1e', borderRadius: '4px' }}>
              <FileCode size={14} />
              <span style={{ fontSize: '0.9rem' }}>{projectData.filePath.split(/[/\\]/).pop()}</span>
            </div>
          </div>
        </section>

        <section style={{ backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '15px', borderBottom: '1px solid #454545', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCode size={18} /> Metadata
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Template Code</label>
              <input type="text" value={project.templateCode || 'None'} readOnly style={{ opacity: 0.7 }} />
            </div>
            <div className="form-group">
              <label>Template Version</label>
              <input type="text" value={project.templateVersion || 'N/A'} readOnly style={{ opacity: 0.7 }} />
            </div>
            <div className="form-group">
              <label>Studio Version</label>
              <input type="text" value={project.studioVersion} readOnly style={{ opacity: 0.7 }} />
            </div>
            <div className="form-group">
              <label>Arthurian Version</label>
              <input type="text" value={project.arthurianVersion} readOnly style={{ opacity: 0.7 }} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EditProjectInfo;
