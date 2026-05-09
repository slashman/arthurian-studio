import { useState, useCallback } from 'react'
import { MapObject } from '../components/EditMapObjectModal'

export type MapAction = 
    | { type: 'DRAW_TILE', lIdx: number, tIdx: number, oldGid: number, newGid: number }
    | { type: 'MULTI_DRAW_TILE', actions: { lIdx: number, tIdx: number, oldGid: number, newGid: number }[] }
    | { type: 'CREATE_OBJECT', lIdx: number, object: MapObject }
    | { type: 'UPDATE_OBJECT', lIdx: number, oldObject: MapObject, newObject: MapObject }
    | { type: 'DELETE_OBJECT', lIdx: number, object: MapObject };

export const useMapHistory = (initialMapData: any) => {
    const [mapData, _setMapData] = useState<any>(initialMapData);
    const [undoStack, setUndoStack] = useState<MapAction[]>([]);
    const [redoStack, setRedoStack] = useState<MapAction[]>([]);

    const setMapData = useCallback((data: any, clearHistory = false) => {
        _setMapData(data);
        if (clearHistory) {
            setUndoStack([]);
            setRedoStack([]);
        }
    }, []);

    const applyAction = (data: any, action: MapAction, isUndo: boolean) => {
        if (!data) return data;
        const newData = { ...data, layers: [...data.layers] };

        if (action.type === 'MULTI_DRAW_TILE') {
            action.actions.forEach(subAction => {
                const { lIdx, tIdx, oldGid, newGid } = subAction;
                const gid = isUndo ? oldGid : newGid;
                const layer = { ...newData.layers[lIdx] };
                newData.layers[lIdx] = layer;

                // Data is now assumed to be a Uint32Array or similar raw format in memory
                if (layer.data instanceof Uint32Array) {
                    layer.data[tIdx] = gid;
                } else {
                    const layerData = [...layer.data];
                    layerData[tIdx] = gid;
                    layer.data = layerData;
                }
            });
            return newData;
        }

        const { lIdx, type } = action;
        const layer = { ...newData.layers[lIdx] };
        newData.layers[lIdx] = layer;

        switch (type) {
            case 'DRAW_TILE': {
                const { tIdx, oldGid, newGid } = action;
                const gid = isUndo ? oldGid : newGid;
                
                if (layer.data instanceof Uint32Array) {
                    layer.data[tIdx] = gid;
                } else {
                    const layerData = [...layer.data];
                    layerData[tIdx] = gid;
                    layer.data = layerData;
                }
                break;
            }
            case 'CREATE_OBJECT': {
                const { object } = action;
                const objects = [...(layer.objects || [])];
                if (isUndo) {
                    const idx = objects.findIndex(o => o.id === object.id);
                    if (idx !== -1) objects.splice(idx, 1);
                } else {
                    objects.push(object);
                }
                layer.objects = objects;
                break;
            }
            case 'UPDATE_OBJECT': {
                const { oldObject, newObject } = action;
                const objects = [...(layer.objects || [])];
                const target = isUndo ? oldObject : newObject;
                const idx = objects.findIndex(o => o.id === target.id);
                if (idx !== -1) {
                    objects[idx] = target;
                }
                layer.objects = objects;
                break;
            }
            case 'DELETE_OBJECT': {
                const { object } = action;
                const objects = [...(layer.objects || [])];
                if (isUndo) {
                    objects.push(object);
                } else {
                    const idx = objects.findIndex(o => o.id === object.id);
                    if (idx !== -1) objects.splice(idx, 1);
                }
                layer.objects = objects;
                break;
            }
        }

        return newData;
    };

    const performAction = useCallback((action: MapAction) => {
        _setMapData((current: any) => applyAction(current, action, false));
        setUndoStack(prev => [...prev, action]);
        setRedoStack([]);
    }, []);

    const undo = useCallback(() => {
        if (undoStack.length === 0) return;
        const action = undoStack[undoStack.length - 1];
        setUndoStack(prev => prev.slice(0, -1));
        setRedoStack(prev => [...prev, action]);
        _setMapData((current: any) => applyAction(current, action, true));
    }, [undoStack]);

    const redo = useCallback(() => {
        if (redoStack.length === 0) return;
        const action = redoStack[redoStack.length - 1];
        setRedoStack(prev => prev.slice(0, -1));
        setUndoStack(prev => [...prev, action]);
        _setMapData((current: any) => applyAction(current, action, false));
    }, [redoStack]);

    return { 
        mapData, 
        setMapData, 
        performAction,
        undo, 
        redo, 
        canUndo: undoStack.length > 0, 
        canRedo: redoStack.length > 0 
    };
};
