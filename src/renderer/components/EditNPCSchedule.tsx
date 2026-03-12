import React from 'react'
import { ScheduleItem, ScheduleAction } from '../types/NPCEntityTypes'
import { Plus, Trash2, Clock, MapPin, Activity } from 'lucide-react'

interface EditNPCScheduleProps {
  schedule: ScheduleItem[];
  onUpdateSchedule: (newSchedule: ScheduleItem[]) => void;
}

const EditNPCSchedule: React.FC<EditNPCScheduleProps> = ({ schedule, onUpdateSchedule }) => {
  
  const sortedSchedule = [...(schedule || [])].sort((a, b) => a.time - b.time);

  const handleItemChange = (index: number, field: keyof ScheduleItem, value: any) => {
    const next = [...sortedSchedule];
    next[index] = { ...next[index], [field]: value };
    onUpdateSchedule(next);
  };

  const handleLocationChange = (index: number, coord: 'x' | 'y', value: number) => {
    const next = [...sortedSchedule];
    next[index] = { 
        ...next[index], 
        location: { ...next[index].location, [coord]: value } 
    };
    onUpdateSchedule(next);
  };

  const handleActionChange = (index: number, action: ScheduleAction | undefined) => {
    const next = [...sortedSchedule];
    next[index] = { ...next[index], action };
    onUpdateSchedule(next);
  };

  const addItem = () => {
    const newItem: ScheduleItem = {
        id: 'new_task',
        time: 12,
        location: { x: 0, y: 0 }
    };
    onUpdateSchedule([...sortedSchedule, newItem]);
  };

  const removeItem = (index: number) => {
    const next = sortedSchedule.filter((_, i) => i !== index);
    onUpdateSchedule(next);
  };

  return (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <label>Daily Schedule</label>
            <button onClick={addItem} style={{ padding: '4px 12px', fontSize: '0.8rem' }}><Plus size={14} /> Add Task</button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #444' }}>
                    <th style={{ padding: '8px', width: '80px' }}><Clock size={14} /> Time</th>
                    <th style={{ padding: '8px' }}>Task ID</th>
                    <th style={{ padding: '8px', width: '150px' }}><MapPin size={14} /> Location (X, Y)</th>
                    <th style={{ padding: '8px' }}><Activity size={14} /> Action (Optional)</th>
                    <th style={{ padding: '8px', width: '40px' }}></th>
                </tr>
            </thead>
            <tbody>
                {sortedSchedule.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #333' }}>
                        <td style={{ padding: '8px' }}>
                            <input 
                                type="number"
                                min="0"
                                max="23"
                                style={{ width: '100%', backgroundColor: '#1e1e1e', color: 'white', border: '1px solid #555', padding: '4px' }}
                                value={item.time}
                                onChange={(e) => handleItemChange(idx, 'time', parseInt(e.target.value) || 0)}
                            />
                        </td>
                        <td style={{ padding: '8px' }}>
                            <input 
                                style={{ width: '100%', backgroundColor: '#1e1e1e', color: 'white', border: '1px solid #555', padding: '4px' }}
                                value={item.id}
                                onChange={(e) => handleItemChange(idx, 'id', e.target.value)}
                            />
                        </td>
                        <td style={{ padding: '8px' }}>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <input 
                                    type="number"
                                    placeholder="X"
                                    style={{ width: '50%', backgroundColor: '#1e1e1e', color: 'white', border: '1px solid #555', padding: '4px' }}
                                    value={item.location.x}
                                    onChange={(e) => handleLocationChange(idx, 'x', parseInt(e.target.value) || 0)}
                                />
                                <input 
                                    type="number"
                                    placeholder="Y"
                                    style={{ width: '50%', backgroundColor: '#1e1e1e', color: 'white', border: '1px solid #555', padding: '4px' }}
                                    value={item.location.y}
                                    onChange={(e) => handleLocationChange(idx, 'y', parseInt(e.target.value) || 0)}
                                />
                            </div>
                        </td>
                        <td style={{ padding: '8px' }}>
                            {item.action ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', background: '#252525', padding: '8px', borderRadius: '4px', border: '1px solid #444' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <select 
                                            style={{ backgroundColor: '#1e1e1e', color: 'white', border: '1px solid #555', padding: '2px', fontSize: '0.7rem' }}
                                            value={item.action.type}
                                            onChange={(e) => handleActionChange(idx, { ...item.action!, type: e.target.value })}
                                        >
                                            <option value="sleep">sleep</option>
                                        </select>
                                        <button onClick={() => handleActionChange(idx, undefined)} style={{ background: 'transparent', border: 'none', color: '#ff4444' }} title="Remove Action"><Trash2 size={12}/></button>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                            <label style={{ fontSize: '0.6rem', color: '#888' }}>Hours:</label>
                                            <input 
                                                type="number"
                                                style={{ width: '40px', backgroundColor: '#1e1e1e', color: 'white', border: '1px solid #555', padding: '2px', fontSize: '0.7rem' }}
                                                value={item.action.hours || 0}
                                                onChange={(e) => handleActionChange(idx, { ...item.action!, hours: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                            <input 
                                                type="checkbox"
                                                checked={!!item.action.once}
                                                onChange={(e) => handleActionChange(idx, { ...item.action!, once: e.target.checked })}
                                            />
                                            <label style={{ fontSize: '0.6rem', color: '#888' }}>Once</label>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => handleActionChange(idx, { type: 'sleep', hours: 8, once: true })}
                                    style={{ fontSize: '0.7rem', padding: '2px 8px', backgroundColor: '#444' }}
                                >
                                    + Add Action
                                </button>
                            )}
                        </td>
                        <td style={{ padding: '8px' }}>
                            <button onClick={() => removeItem(idx)} style={{ background: 'transparent', border: 'none', color: '#ff4444' }}><Trash2 size={16}/></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {sortedSchedule.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#888', border: '1px dashed #444', marginTop: '10px' }}>
                No schedule items defined.
            </div>
        )}
    </div>
  );
}

export default EditNPCSchedule
