import React from 'react'
import { DialogFragment, DialogVariant, DialogLines, DialogLine, DialogObject, DialogCondition } from '../types/NPCEntityTypes'
import { Plus, Trash2, ChevronDown, ChevronRight, Settings } from 'lucide-react'

interface EditNPCDialogsProps {
  dialog: DialogFragment[];
  onUpdateDialog: (newDialog: DialogFragment[]) => void;
}

const DIALOG_OBJECT_TYPES = [
    'event', 
    'joinParty', 
    'leaveParty', 
    'setFlag', 
    'endConversation', 
    'dialogInterruption', 
    'setHostile'
];

/**
 * Normalizes DialogLines to an array for easier mapping
 */
const normalizeLines = (lines: DialogLines | undefined): DialogLine[] => {
    if (!lines) return [];
    if (Array.isArray(lines)) return lines;
    return [lines];
};

const DialogLineEditor: React.FC<{
    line: DialogLine;
    onChange: (newLine: DialogLine) => void;
    onDelete: () => void;
}> = ({ line, onChange, onDelete }) => {
    const isObject = typeof line !== 'string';
    const obj = isObject ? (line as DialogObject) : null;

    return (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'flex-start', background: '#333', padding: '8px', borderRadius: '4px' }}>
            <div style={{ flex: 1 }}>
                {!isObject ? (
                    <textarea 
                        style={{ width: '100%', minHeight: '40px', backgroundColor: '#1e1e1e', color: 'white', border: '1px solid #555', padding: '5px' }}
                        value={line as string}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Dialog text..."
                    />
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                        <div className="form-group">
                            <label style={{ fontSize: '0.7rem' }}>Type</label>
                            <select 
                                style={{ width: '100%', backgroundColor: '#1e1e1e', color: 'white', border: '1px solid #555', padding: '4px' }}
                                value={obj?.type}
                                onChange={(e) => onChange({ ...obj!, type: e.target.value })}
                            >
                                {DIALOG_OBJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        {(obj?.type === 'event' || obj?.type === 'joinParty' || obj?.type === 'leaveParty' || obj?.type === 'dialogInterruption') && (
                            <div className="form-group">
                                <label style={{ fontSize: '0.7rem' }}>Text</label>
                                <textarea 
                                    style={{ width: '100%', backgroundColor: '#1e1e1e', color: 'white', border: '1px solid #555', padding: '4px' }}
                                    value={obj?.text || ''}
                                    onChange={(e) => onChange({ ...obj!, text: e.target.value })}
                                />
                            </div>
                        )}
                        {obj?.type === 'dialogInterruption' && (
                            <div className="form-group">
                                <label style={{ fontSize: '0.7rem' }}>Speaker Name</label>
                                <input 
                                    style={{ width: '100%', backgroundColor: '#1e1e1e', color: 'white', border: '1px solid #555', padding: '4px' }}
                                    value={obj?.name || ''}
                                    onChange={(e) => onChange({ ...obj!, name: e.target.value })}
                                />
                            </div>
                        )}
                        {obj?.type === 'setFlag' && (
                            <div className="form-group">
                                <label style={{ fontSize: '0.7rem' }}>Flag Name</label>
                                <input 
                                    style={{ width: '100%', backgroundColor: '#1e1e1e', color: 'white', border: '1px solid #555', padding: '4px' }}
                                    value={obj?.flagName || ''}
                                    onChange={(e) => onChange({ ...obj!, flagName: e.target.value })}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <button 
                    onClick={() => {
                        if (isObject) onChange(obj?.text || "");
                        else onChange({ type: 'event', text: line as string });
                    }}
                    style={{ padding: '2px 5px', fontSize: '0.6rem', backgroundColor: '#444' }}
                    title={isObject ? "Convert to plain text" : "Convert to action object"}
                >
                    {isObject ? "T" : "{}"}
                </button>
                <button onClick={onDelete} style={{ background: '#a33', padding: '4px' }}>
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
};

const DialogLinesEditor: React.FC<{
    lines: DialogLines | undefined;
    onChange: (newLines: DialogLines) => void;
}> = ({ lines, onChange }) => {
    const items = normalizeLines(lines);

    const updateItem = (idx: number, newItem: DialogLine) => {
        const next = [...items];
        next[idx] = newItem;
        onChange(next);
    };

    const deleteItem = (idx: number) => {
        const next = items.filter((_, i) => i !== idx);
        onChange(next);
    };

    const addItem = () => {
        onChange([...items, ""]);
    };

    return (
        <div style={{ padding: '10px', border: '1px solid #444', borderRadius: '4px', background: '#222' }}>
            {items.map((line, idx) => (
                <DialogLineEditor 
                    key={idx} 
                    line={line} 
                    onChange={(l) => updateItem(idx, l)} 
                    onDelete={() => deleteItem(idx)} 
                />
            ))}
            <button onClick={addItem} style={{ width: '100%', padding: '5px', fontSize: '0.8rem', border: '1px dashed #555', background: 'transparent', color: '#888' }}>
                <Plus size={14} /> Add Line/Action
            </button>
        </div>
    );
};

const DialogConditionEditor: React.FC<{
    condition: DialogCondition | undefined;
    onChange: (newCondition: DialogCondition | undefined) => void;
}> = ({ condition, onChange }) => {
    if (!condition) {
        return (
            <button 
                onClick={() => onChange({ flag: '', value: false })}
                style={{ fontSize: '0.7rem', padding: '2px 8px', backgroundColor: '#444', marginBottom: '10px' }}
            >
                + Add Condition
            </button>
        );
    }

    return (
        <div style={{ background: '#333', padding: '10px', borderRadius: '4px', marginBottom: '10px', border: '1px solid #555' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>Condition</label>
                <button onClick={() => onChange(undefined)} style={{ background: 'transparent', border: 'none', color: '#ff4444' }}><Trash2 size={12}/></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.6rem' }}>Flag</label>
                    <input 
                        style={{ width: '100%', backgroundColor: '#1e1e1e', color: 'white', border: '1px solid #555', padding: '2px 5px', fontSize: '0.8rem' }}
                        value={condition.flag || ''}
                        onChange={(e) => onChange({ ...condition, flag: e.target.value })}
                    />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.6rem' }}>Value</label>
                    <input 
                        style={{ width: '100%', backgroundColor: '#1e1e1e', color: 'white', border: '1px solid #555', padding: '2px 5px', fontSize: '0.8rem' }}
                        value={condition.value === undefined ? '' : condition.value}
                        onChange={(e) => {
                            let val: any = e.target.value;
                            if (val === 'true') val = true;
                            if (val === 'false') val = false;
                            onChange({ ...condition, value: val });
                        }}
                    />
                </div>
                <div className="form-group" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input 
                        type="checkbox"
                        checked={!!condition.joined}
                        onChange={(e) => onChange({ ...condition, joined: e.target.checked })}
                    />
                    <label style={{ fontSize: '0.6rem' }}>In Party?</label>
                </div>
            </div>
        </div>
    );
};

const EditNPCDialogs: React.FC<EditNPCDialogsProps> = ({ dialog, onUpdateDialog }) => {
  const [expandedFragments, setExpandedFragments] = React.useState<Record<number, boolean>>({});

  const toggleFragment = (idx: number) => {
    setExpandedFragments(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const addDialogFragment = () => {
    const newDialog = [...(dialog || []), { key: 'new_key', dialog: '' }];
    onUpdateDialog(newDialog);
    setExpandedFragments(prev => ({ ...prev, [dialog.length]: true }));
  };

  const removeDialogFragment = (index: number) => {
    if (!confirm('Delete this dialog fragment?')) return;
    const newDialog = (dialog || []).filter((_, i) => i !== index);
    onUpdateDialog(newDialog);
  };

  const handleFragmentChange = (index: number, updated: DialogFragment) => {
    const newDialog = [...(dialog || [])];
    newDialog[index] = updated;
    onUpdateDialog(newDialog);
  };

  const toggleVariants = (idx: number) => {
      const fragment = dialog[idx];
      if (fragment.variants) {
          // Convert back to single dialog (taking the first variant's dialog)
          const firstDialog = fragment.variants[0]?.dialog || "";
          handleFragmentChange(idx, { ...fragment, dialog: firstDialog, variants: undefined });
      } else {
          // Convert to variants
          const initialVariant: DialogVariant = { dialog: fragment.dialog || "" };
          handleFragmentChange(idx, { ...fragment, variants: [initialVariant], dialog: undefined });
      }
  };

  return (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <label>Conversation Fragments</label>
            <button onClick={addDialogFragment} style={{ padding: '4px 12px', fontSize: '0.8rem' }}><Plus size={14} /> Add Fragment</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(dialog || []).map((fragment, idx) => {
                const isExpanded = expandedFragments[idx];
                return (
                    <div key={idx} style={{ background: '#2d2d2d', borderRadius: '4px', border: '1px solid #444', overflow: 'hidden' }}>
                        <div 
                            style={{ padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: '#383838' }}
                            onClick={() => toggleFragment(idx)}
                        >
                            {isExpanded ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                            <span style={{ fontWeight: 'bold', flexGrow: 1 }}>{fragment.key}</span>
                            {fragment.synonym && <span style={{ color: '#888', fontSize: '0.8rem' }}>(Synonym of: {fragment.synonym})</span>}
                            <button onClick={(e) => { e.stopPropagation(); removeDialogFragment(idx); }} style={{ background: 'transparent', border: 'none', color: '#ff4444' }}><Trash2 size={16} /></button>
                        </div>

                        {isExpanded && (
                            <div style={{ padding: '15px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                                    <div className="form-group">
                                        <label>Key</label>
                                        <input 
                                            value={fragment.key} 
                                            onChange={(e) => handleFragmentChange(idx, { ...fragment, key: e.target.value })} 
                                            placeholder="greeting, job, etc."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Synonym Of</label>
                                        <input 
                                            value={fragment.synonym || ''} 
                                            onChange={(e) => handleFragmentChange(idx, { ...fragment, synonym: e.target.value })} 
                                            placeholder="Reference another key"
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Dialog Content</h4>
                                    <button 
                                        onClick={() => toggleVariants(idx)}
                                        style={{ fontSize: '0.7rem', padding: '4px 10px', backgroundColor: fragment.variants ? '#007acc' : '#444' }}
                                    >
                                        <Settings size={12} style={{ marginRight: '5px' }}/>
                                        {fragment.variants ? "Disable Variants" : "Enable Variants"}
                                    </button>
                                </div>

                                {fragment.variants ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        {fragment.variants.map((v, vIdx) => (
                                            <div key={vIdx} style={{ borderLeft: '3px solid #007acc', paddingLeft: '15px', position: 'relative' }}>
                                                <div style={{ position: 'absolute', right: 0, top: 0 }}>
                                                    <button 
                                                        onClick={() => {
                                                            const next = fragment.variants!.filter((_, i) => i !== vIdx);
                                                            handleFragmentChange(idx, { ...fragment, variants: next });
                                                        }}
                                                        style={{ background: 'transparent', border: 'none', color: '#a33' }}
                                                    >
                                                        <Trash2 size={14}/>
                                                    </button>
                                                </div>
                                                <DialogConditionEditor 
                                                    condition={v.condition} 
                                                    onChange={(c) => {
                                                        const next = [...fragment.variants!];
                                                        next[vIdx] = { ...v, condition: c };
                                                        handleFragmentChange(idx, { ...fragment, variants: next });
                                                    }} 
                                                />
                                                <DialogLinesEditor 
                                                    lines={v.dialog} 
                                                    onChange={(l) => {
                                                        const next = [...fragment.variants!];
                                                        next[vIdx] = { ...v, dialog: l };
                                                        handleFragmentChange(idx, { ...fragment, variants: next });
                                                    }}
                                                />
                                            </div>
                                        ))}
                                        <button 
                                            onClick={() => {
                                                const next = [...(fragment.variants || []), { dialog: "" }];
                                                handleFragmentChange(idx, { ...fragment, variants: next });
                                            }}
                                            style={{ padding: '8px', fontSize: '0.8rem', backgroundColor: '#333' }}
                                        >
                                            <Plus size={14} /> Add Variant
                                        </button>
                                    </div>
                                ) : (
                                    <DialogLinesEditor 
                                        lines={fragment.dialog} 
                                        onChange={(l) => handleFragmentChange(idx, { ...fragment, dialog: l })} 
                                    />
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
            {(!dialog || dialog.length === 0) && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888', border: '1px dashed #444', borderRadius: '4px' }}>
                    No dialog fragments defined. Click "Add Fragment" to start.
                </div>
            )}
        </div>
    </div>
  );
}

export default EditNPCDialogs
