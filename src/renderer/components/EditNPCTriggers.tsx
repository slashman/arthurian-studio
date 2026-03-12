import React from 'react'
import { TriggerItem, TriggerAction } from '../types/NPCEntityTypes'
import { Plus, Trash2, Zap, Play } from 'lucide-react'

interface EditNPCTriggersProps {
  triggers: TriggerItem[];
  onUpdateTriggers: (newTriggers: TriggerItem[]) => void;
}

const TRIGGER_TYPES = ['playerDistance', 'combatTurnsOver'];
const ACTION_TYPES = ['talk', 'console', 'cutscene', 'vanishNearbyMobs', 'endCombat'];

const EditNPCTriggers: React.FC<EditNPCTriggersProps> = ({ triggers, onUpdateTriggers }) => {

  const handleTriggerChange = (index: number, field: keyof TriggerItem, value: any) => {
    const next = [...(triggers || [])];
    next[index] = { ...next[index], [field]: value };
    onUpdateTriggers(next);
  };

  const handleActionChange = (tIdx: number, aIdx: number, field: keyof TriggerAction, value: any) => {
    const nextTriggers = [...(triggers || [])];
    const nextActions = [...nextTriggers[tIdx].actions];
    nextActions[aIdx] = { ...nextActions[aIdx], [field]: value };
    nextTriggers[tIdx] = { ...nextTriggers[tIdx], actions: nextActions };
    onUpdateTriggers(nextTriggers);
  };

  const addTrigger = () => {
    const newTrigger: TriggerItem = {
        id: 'new_trigger',
        type: 'playerDistance',
        value: 5,
        actions: [{ type: 'talk' }]
    };
    onUpdateTriggers([...(triggers || []), newTrigger]);
  };

  const removeTrigger = (index: number) => {
    const next = triggers.filter((_, i) => i !== index);
    onUpdateTriggers(next);
  };

  const addAction = (tIdx: number) => {
    const nextTriggers = [...(triggers || [])];
    const nextActions = [...nextTriggers[tIdx].actions, { type: 'talk' }];
    nextTriggers[tIdx] = { ...nextTriggers[tIdx], actions: nextActions };
    onUpdateTriggers(nextTriggers);
  };

  const removeAction = (tIdx: number, aIdx: number) => {
    const nextTriggers = [...(triggers || [])];
    const nextActions = nextTriggers[tIdx].actions.filter((_, i) => i !== aIdx);
    nextTriggers[tIdx] = { ...nextTriggers[tIdx], actions: nextActions };
    onUpdateTriggers(nextTriggers);
  };

  return (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <label>NPC Triggers</label>
            <button onClick={addTrigger} style={{ padding: '4px 12px', fontSize: '0.8rem' }}><Plus size={14} /> Add Trigger</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {(triggers || []).map((trigger, tIdx) => (
                <div key={tIdx} style={{ background: '#2d2d2d', padding: '15px', borderRadius: '4px', border: '1px solid #444' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 40px', gap: '10px', marginBottom: '15px', alignItems: 'flex-end' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.7rem' }}><Zap size={12} /> Trigger ID</label>
                            <input 
                                style={{ width: '100%', backgroundColor: '#1e1e1e', color: 'white', border: '1px solid #555', padding: '4px' }}
                                value={trigger.id}
                                onChange={(e) => handleTriggerChange(tIdx, 'id', e.target.value)}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.7rem' }}>Type</label>
                            <select 
                                style={{ width: '100%', backgroundColor: '#1e1e1e', color: 'white', border: '1px solid #555', padding: '4px' }}
                                value={trigger.type}
                                onChange={(e) => handleTriggerChange(tIdx, 'type', e.target.value)}
                            >
                                {TRIGGER_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.7rem' }}>Value</label>
                            <input 
                                type="number"
                                style={{ width: '100%', backgroundColor: '#1e1e1e', color: 'white', border: '1px solid #555', padding: '4px' }}
                                value={trigger.value}
                                onChange={(e) => handleTriggerChange(tIdx, 'value', parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <button onClick={() => removeTrigger(tIdx)} style={{ background: 'transparent', border: 'none', color: '#ff4444' }}><Trash2 size={18}/></button>
                    </div>

                    <div style={{ background: '#222', padding: '10px', borderRadius: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <label style={{ fontSize: '0.7rem', color: '#aaa' }}><Play size={12} /> Actions</label>
                            <button onClick={() => addAction(tIdx)} style={{ padding: '2px 8px', fontSize: '0.7rem', backgroundColor: '#444' }}><Plus size={12} /> Add Action</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {trigger.actions.map((action, aIdx) => (
                                <div key={aIdx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <select 
                                        style={{ width: '150px', backgroundColor: '#1e1e1e', color: 'white', border: '1px solid #555', padding: '4px', fontSize: '0.8rem' }}
                                        value={action.type}
                                        onChange={(e) => handleActionChange(tIdx, aIdx, 'type', e.target.value)}
                                    >
                                        {ACTION_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                    </select>
                                    {(action.type === 'console' || action.type === 'cutscene') && (
                                        <input 
                                            placeholder="Value..."
                                            style={{ flex: 1, backgroundColor: '#1e1e1e', color: 'white', border: '1px solid #555', padding: '4px', fontSize: '0.8rem' }}
                                            value={action.value || ''}
                                            onChange={(e) => handleActionChange(tIdx, aIdx, 'value', e.target.value)}
                                        />
                                    )}
                                    <button onClick={() => removeAction(tIdx, aIdx)} style={{ background: 'transparent', border: 'none', color: '#ff4444' }}><Trash2 size={14}/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
            {(!triggers || triggers.length === 0) && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#888', border: '1px dashed #444' }}>
                    No triggers defined for this NPC.
                </div>
            )}
        </div>
    </div>
  );
}

export default EditNPCTriggers
