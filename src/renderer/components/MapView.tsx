import React, { useEffect, useRef, useState } from 'react';

interface MapViewProps {
  mapData: any;
  tilesetPaths: Record<string, string>;
  visibleLayers: Record<number, boolean>;
  activeLayerIdx: number;
  zoom: number;
  onCellClick: (lIdx: number, tIdx: number) => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
}

const MapView: React.FC<MapViewProps> = ({ mapData, tilesetPaths, visibleLayers, activeLayerIdx, zoom, onCellClick, onMouseDown, onMouseUp }) => {
  const { width, height, tilewidth, tileheight, layers, tilesets } = mapData;
  const [hoverPos, setHoverPos] = useState<{ col: number, row: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<Record<string, HTMLImageElement>>({});
  const isMouseDown = useRef(false);
  const lastProcessedPos = useRef<{ col: number, row: number } | null>(null);

  // Load tileset images
  useEffect(() => {
    const loadedImages: Record<string, HTMLImageElement> = {};
    let loadedCount = 0;
    const tilesetNames = Object.keys(tilesetPaths);
    
    if (tilesetNames.length === 0) {
        setImages({});
        return;
    }

    tilesetNames.forEach(name => {
      const img = new Image();
      img.src = tilesetPaths[name];
      img.onload = () => {
        loadedImages[name] = img;
        loadedCount++;
        if (loadedCount === tilesetNames.length) {
          setImages(loadedImages);
        }
      };
    });
  }, [tilesetPaths]);

  const getTilesetForGid = (gid: number) => {
    for (let i = tilesets.length - 1; i >= 0; i--) {
      if (gid >= tilesets[i].firstgid) {
        return tilesets[i];
      }
    }
    return null;
  };

  const decodeLayerData = (layer: any) => {
    if (layer.data instanceof Uint32Array) return Array.from(layer.data);
    if (layer.encoding === 'base64') {
      const binaryString = window.atob(layer.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return Array.from(new Uint32Array(bytes.buffer));
    }
    return layer.data;
  };

  // Draw map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    ctx.save();
    ctx.scale(zoom, zoom);

    layers.forEach((layer: any, lIdx: number) => {
      if (!visibleLayers[lIdx]) return;

      ctx.globalAlpha = layer.opacity ?? 1;

      if (layer.type === 'tilelayer') {
        const data = decodeLayerData(layer);
        data.forEach((gid: number, tIdx: number) => {
          if (gid === 0) return;
          const ts = getTilesetForGid(gid);
          if (!ts || !images[ts.name]) return;

          const localId = gid - ts.firstgid;
          const columns = ts.columns || Math.floor(ts.imagewidth / ts.tilewidth);
          const tx = (localId % columns) * ts.tilewidth;
          const ty = Math.floor(localId / columns) * ts.tileheight;

          const x = (tIdx % layer.width) * tilewidth;
          const y = Math.floor(tIdx / layer.width) * tileheight;

          ctx.drawImage(
            images[ts.name],
            tx, ty, ts.tilewidth, ts.tileheight,
            x, y, ts.tilewidth, ts.tileheight
          );
        });
      } else if (layer.type === 'objectgroup') {
        (layer.objects || []).forEach((obj: any) => {
          if (!obj.gid || !obj.visible) return;

          const ts = getTilesetForGid(obj.gid);
          if (!ts || !images[ts.name]) return;

          const localId = obj.gid - ts.firstgid;
          const columns = ts.columns || Math.floor(ts.imagewidth / ts.tilewidth);
          const tx = (localId % columns) * ts.tilewidth;
          const ty = Math.floor(localId / columns) * ts.tileheight;

          const x = obj.x;
          const y = obj.y - obj.height;

          ctx.save();
          ctx.translate(x, y + obj.height);
          ctx.rotate((obj.rotation || 0) * Math.PI / 180);
          ctx.drawImage(
            images[ts.name],
            tx, ty, ts.tilewidth, ts.tileheight,
            0, -obj.height, obj.width, obj.height
          );
          ctx.restore();
        });
      }
    });

    ctx.restore();
    ctx.globalAlpha = 1;
  }, [mapData, visibleLayers, images, zoom]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isMouseDown.current = true;
    onMouseDown?.();
    handleMouseMove(e); // Trigger first click
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
    onMouseUp?.();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    const col = Math.floor(x / tilewidth);
    const row = Math.floor(y / tileheight);
    
    if (col >= 0 && col < width && row >= 0 && row < height) {
        setHoverPos({ col, row });
        if (isMouseDown.current) {
            const tIdx = row * width + col;
            onCellClick(activeLayerIdx, tIdx);
        }
    } else {
        setHoverPos(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverPos(null);
    if (isMouseDown.current) {
        isMouseDown.current = false;
        onMouseUp?.();
    }
  };

  return (
    <div 
      ref={containerRef}
      style={{ flexGrow: 1, background: '#000', overflow: 'auto', position: 'relative' }}
    >
      <div style={{ 
        position: 'relative', 
        width: width * tilewidth * zoom, 
        height: height * tileheight * zoom,
        background: '#111',
        margin: '20px auto',
        cursor: 'crosshair'
      }}>
        <canvas
          ref={canvasRef}
          width={width * tilewidth * zoom}
          height={height * tileheight * zoom}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ 
            display: 'block',
            imageRendering: 'pixelated'
          }}
        />

        {/* Hover Highlight - keeping as DOM for simpler interaction feedback */}
        {hoverPos && (
            <div style={{
                position: 'absolute',
                left: hoverPos.col * tilewidth * zoom,
                top: hoverPos.row * tileheight * zoom,
                width: tilewidth * zoom,
                height: tileheight * zoom,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid #fff',
                pointerEvents: 'none',
                zIndex: 100,
                boxSizing: 'border-box'
            }} />
        )}
      </div>
    </div>
  );
};

export default MapView;
