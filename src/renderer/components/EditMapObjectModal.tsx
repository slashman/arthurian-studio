import React, { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import mapObjectTypes from '../mapObjectTypes.json'

export interface MapObject {
    id: number;
    name: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    gid: number;
    rotation: number;
    visible: boolean;
    properties?: Record<string, any>;
    propertytypes?: Record<string, string>;
}

interface EditMapObjectModalProps {
    object: MapObject;
    onCancel: () => void;
    onConfirm: (updated: MapObject) => void;
    onDelete?: (id: number) => void;
    isNew?: boolean;
    layerCategory?: string | null;
}

const EditMapObjectModal: React.FC<EditMapObjectModalProps> = ({ 
    object, 
    onCancel, 
    onConfirm,
    onDelete,
    isNew = false,
    layerCategory = null
}) => {
    const availableTypes = layerCategory 
        ? mapObjectTypes.types.filter(t => t.category === layerCategory)
        : mapObjectTypes.types;

    const getPropertyType = (val: any) => {
        if (typeof val === 'boolean') return 'bool';
        if (typeof val === 'number') return 'int';
        return 'string';
    };

    const prefillProperties = (type: string, currentObject: MapObject) => {
        const typeDef = mapObjectTypes.types.find(t => t.type === type);
        if (!typeDef) return currentObject;

        const props: Record<string, any> = {};
        const types: Record<string, string> = {};

        Object.entries(typeDef.properties).forEach(([name, defaultValue]) => {
            if (currentObject.properties && currentObject.properties[name] !== undefined) {
                // Keep existing value if property name matches
                props[name] = currentObject.properties[name];
                types[name] = currentObject.propertytypes?.[name] || getPropertyType(currentObject.properties[name]);
            } else {
                // Use default value
                props[name] = defaultValue;
                types[name] = getPropertyType(defaultValue);
            }
        });

        return { ...currentObject, properties: props, propertytypes: types };
    };

    const [editedObject, setEditedObject] = useState<MapObject>(() => {
        let initialType = object.type;
        if (!initialType && availableTypes.length > 0) {
            initialType = availableTypes[0].type;
        }
        return prefillProperties(initialType, { ...object, type: initialType });
    });
    const [newPropName, setNewPropName] = useState('');

    const updateField = (field: keyof MapObject, value: any) => {
        let newObject = { ...editedObject, [field]: value };
        if (field === 'type') {
            newObject = prefillProperties(value, newObject);
        }
        setEditedObject(newObject);
    };

    const updateProperty = (name: string, value: any) => {
        const props = { ...(editedObject.properties || {}) };
        props[name] = value;
        setEditedObject(prev => ({ ...prev, properties: props }));
    };

    const removeProperty = (name: string) => {
        const props = { ...(editedObject.properties || {}) };
        delete props[name];
        
        const types = { ...(editedObject.propertytypes || {}) };
        delete types[name];

        setEditedObject(prev => ({ ...prev, properties: props, propertytypes: types }));
    };

    const addProperty = () => {
        if (!newPropName || editedObject.properties?.[newPropName]) return;
        updateProperty(newPropName, '');
        const types = { ...(editedObject.propertytypes || {}) };
        types[newPropName] = 'string';
        setEditedObject(prev => ({ ...prev, propertytypes: types }));
        setNewPropName('');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ width: '600px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0 }}>{isNew ? 'Add' : 'Edit'} Map Object</h3>
                    {!isNew && onDelete && (
                        <button 
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete this object?')) {
                                    onDelete(editedObject.id);
                                }
                            }}
                            style={{ backgroundColor: '#ff4444', padding: '5px 10px', fontSize: '0.8rem' }}
                        >
                            Delete Object
                        </button>
                    )}
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #333' }}>
                                <td style={{ padding: '8px', fontSize: '0.9rem', width: '30%' }}>Name</td>
                                <td style={{ padding: '8px' }}>
                                    <input 
                                        style={{ width: '100%', padding: '4px' }}
                                        value={editedObject.name || ''} 
                                        onChange={(e) => updateField('name', e.target.value)} 
                                    />
                                </td>
                                <td style={{ padding: '8px', width: '40px' }}></td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #333' }}>
                                <td style={{ padding: '8px', fontSize: '0.9rem' }}>Type</td>
                                <td style={{ padding: '8px' }}>
                                    <select 
                                        style={{ width: '100%', padding: '4px', backgroundColor: '#3c3c3c', border: '1px solid #454545', color: 'white', borderRadius: '4px' }}
                                        value={editedObject.type || (availableTypes.length > 0 ? availableTypes[0].type : '')} 
                                        onChange={(e) => updateField('type', e.target.value)}
                                    >
                                        {availableTypes.map(t => (
                                            <option key={t.type} value={t.type}>{t.type}</option>
                                        ))}
                                    </select>
                                </td>
                                <td style={{ padding: '8px' }}></td>
                            </tr>
                            {Object.entries(editedObject.properties || {}).map(([name, value]) => {
                                const propType = editedObject.propertytypes?.[name] || 'string';
                                const typeDef = mapObjectTypes.types.find(t => t.type === editedObject.type);
                                const isCoreProperty = typeDef && Object.keys(typeDef.properties).includes(name);

                                return (
                                    <tr key={name} style={{ borderBottom: '1px solid #333' }}>
                                        <td style={{ padding: '8px', fontSize: '0.9rem' }}>{name}</td>
                                        <td style={{ padding: '8px' }}>
                                            {propType === 'bool' ? (
                                                <input 
                                                    type="checkbox"
                                                    checked={!!value}
                                                    onChange={(e) => updateProperty(name, e.target.checked)}
                                                />
                                            ) : propType === 'int' ? (
                                                <input 
                                                    type="number"
                                                    style={{ width: '100%', padding: '4px' }}
                                                    value={value} 
                                                    onChange={(e) => updateProperty(name, parseInt(e.target.value) || 0)} 
                                                />
                                            ) : (
                                                <input 
                                                    style={{ width: '100%', padding: '4px' }}
                                                    value={value} 
                                                    onChange={(e) => updateProperty(name, e.target.value)} 
                                                />
                                            )}
                                        </td>
                                        <td style={{ padding: '8px' }}>
                                            {!isCoreProperty && (
                                                <button 
                                                    onClick={() => removeProperty(name)}
                                                    style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', padding: 0 }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        <input 
                            placeholder="New property name..."
                            value={newPropName}
                            onChange={(e) => setNewPropName(e.target.value)}
                            style={{ flexGrow: 1 }}
                        />
                        <button onClick={addProperty} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Plus size={16} /> Add Property
                        </button>
                    </div>
                </div>

                <div className="modal-actions">
                    <button onClick={onCancel} style={{ backgroundColor: '#444' }}>Cancel</button>
                    <button onClick={() => onConfirm(editedObject)}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default EditMapObjectModal;
