import React, { useState, useRef, useEffect, useMemo } from 'react'
import { DialogFragment } from '../types/NPCEntityTypes'
import { Plus, Trash2 } from 'lucide-react'

interface EditNPCDialogsProps {
  dialog: DialogFragment[];
  onUpdateDialog: (newDialog: DialogFragment[]) => void;
}

const JsonTextArea: React.FC<{
    value: any;
    onChange: (parsed: any) => void;
    style?: React.CSSProperties;
}> = ({ value, onChange, style }) => {
    const [text, setText] = useState(JSON.stringify(value, null, 2));
    const lastSentValueRef = useRef(JSON.stringify(value));

    // Update local text only if the external value changes from outside
    useEffect(() => {
        const incomingValueStr = JSON.stringify(value);
        if (incomingValueStr !== lastSentValueRef.current) {
            setText(JSON.stringify(value, null, 2));
            lastSentValueRef.current = incomingValueStr;
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setText(newText);
        try {
            const parsed = JSON.parse(newText);
            const parsedStr = JSON.stringify(parsed);
            if (parsedStr !== lastSentValueRef.current) {
                lastSentValueRef.current = parsedStr;
                onChange(parsed);
            }
        } catch (err) {
            // Invalid JSON while typing, just keep local text state
        }
    };

    const isValid = useMemo(() => {
        try {
            JSON.parse(text);
            return true;
        } catch (e) {
            return false;
        }
    }, [text]);

    return (
        <div style={{ position: 'relative' }}>
            <textarea 
                style={{ 
                    ...style, 
                    borderColor: isValid ? '#555' : '#a33',
                    outline: 'none'
                }}
                value={text}
                onChange={handleChange}
            />
            {!isValid && <div style={{ color: '#ff4444', fontSize: '0.7rem', marginTop: '2px' }}>Invalid JSON (updates paused)</div>}
        </div>
    );
};

const EditNPCDialogs: React.FC<EditNPCDialogsProps> = ({ dialog, onUpdateDialog }) => {
  const addDialogFragment = () => {
    const newDialog = [...(dialog || []), { key: 'new_key', dialog: '' }];
    onUpdateDialog(newDialog);
  };

  const removeDialogFragment = (index: number) => {
    const newDialog = (dialog || []).filter((_, i) => i !== index);
    onUpdateDialog(newDialog);
  };

  const handleDialogChange = (index: number, field: keyof DialogFragment, value: any) => {
    const newDialog = [...(dialog || [])];
    newDialog[index] = { ...newDialog[index], [field]: value };
    onUpdateDialog(newDialog);
  };

  return (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <label>Dialog Fragments</label>
            <button onClick={addDialogFragment} style={{ padding: '4px 12px', fontSize: '0.8rem' }}><Plus size={14} /> Add Fragment</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {(dialog || []).map((fragment, idx) => (
                <div key={idx} style={{ background: '#2d2d2d', padding: '15px', borderRadius: '4px', border: '1px solid #444' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                            <label>Key</label>
                            <input 
                                value={fragment.key} 
                                onChange={(e) => handleDialogChange(idx, 'key', e.target.value)} 
                                placeholder="e.g. greeting, job, name"
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                            <label>Synonym Of</label>
                            <input 
                                value={fragment.synonym || ''} 
                                onChange={(e) => handleDialogChange(idx, 'synonym', e.target.value)} 
                                placeholder="Optional"
                            />
                        </div>
                        <button onClick={() => removeDialogFragment(idx)} style={{ background: '#a33', marginTop: '20px', padding: '6px' }}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                    
                    <div className="form-group">
                        <label>Content (Dialog Lines or Variants as JSON)</label>
                        <JsonTextArea 
                            style={{ width: '100%', height: '120px', backgroundColor: '#1e1e1e', color: '#d4d4d4', fontFamily: 'monospace', fontSize: '0.8rem', border: '1px solid #555', padding: '8px' }}
                            value={fragment.variants ? { variants: fragment.variants } : { dialog: fragment.dialog }}
                            onChange={(parsed) => {
                                if (parsed.variants) {
                                    handleDialogChange(idx, 'variants', parsed.variants);
                                    handleDialogChange(idx, 'dialog', undefined);
                                } else if (parsed.dialog) {
                                    handleDialogChange(idx, 'dialog', parsed.dialog);
                                    handleDialogChange(idx, 'variants', undefined);
                                }
                            }}
                        />
                    </div>
                </div>
            ))}
            {(!dialog || dialog.length === 0) && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#888', border: '1px dashed #444' }}>
                    No dialog fragments defined yet.
                </div>
            )}
        </div>
    </div>
  );
}

export default EditNPCDialogs
