import React, { useState } from 'react'
import { Save, X } from 'lucide-react'

interface CreateMapModalProps {
  onCancel: () => void;
  onConfirm: (filename: string, floors: number) => void;
}

const STYLES = {
  modalContent: { width: '350px' } as React.CSSProperties,
  formGroup: { marginBottom: '15px' } as React.CSSProperties,
  label: { display: 'block', marginBottom: '5px', fontSize: '0.9rem' } as React.CSSProperties,
  input: { width: '100%', padding: '8px', boxSizing: 'border-box' } as React.CSSProperties
};

const CreateMapModal: React.FC<CreateMapModalProps> = ({ onCancel, onConfirm }) => {
  const [filename, setFilename] = useState('');
  const [floors, setFloors] = useState(1);

  const handleConfirm = () => {
    if (!filename) {
      alert('Please enter a filename.');
      return;
    }
    const cleanFilename = filename.toLowerCase().endsWith('.json') ? filename : `${filename}.json`;
    onConfirm(cleanFilename, floors);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 2000 }}>
      <div className="modal-content" style={STYLES.modalContent}>
        <div className="modal-header">
          <h3>Create New Map File</h3>
        </div>

        <div className="modal-body">
          <div style={STYLES.formGroup}>
            <label style={STYLES.label}>Filename</label>
            <input 
              style={STYLES.input}
              placeholder="e.g. dungeon1.json"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
          </div>
          <div style={STYLES.formGroup}>
            <label style={STYLES.label}>Number of Floors</label>
            <input 
              style={STYLES.input}
              type="number"
              min={1}
              max={10}
              value={floors}
              onChange={(e) => setFloors(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onCancel} style={{ backgroundColor: '#444' }}>
            <X size={16} /> Cancel
          </button>
          <button onClick={handleConfirm}>
            <Save size={16} /> Create Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateMapModal;
