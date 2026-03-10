import React, { useRef, useEffect } from 'react'
import { ProjectData } from '../EntityTypes'

interface AppearanceCanvasProps {
  projectData: ProjectData;
  tilesetId: string;
  frameIndex: number;
  size?: number;
}

const AppearanceCanvas: React.FC<AppearanceCanvasProps> = ({ 
  projectData, 
  tilesetId, 
  frameIndex, 
  size = 64 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Find tileset definition
  const tilesetDef = projectData.project.tilesets.find(ts => ts.id === tilesetId);
  const tileWidth = tilesetDef?.tileWidth || projectData.project.tileWidth || 16;
  const tileHeight = tilesetDef?.tileHeight || projectData.project.tileHeight || 16;

  // Resolve image path
  const lastSlash = Math.max(projectData.filePath.lastIndexOf('/'), projectData.filePath.lastIndexOf('\\'));
  const projectDir = projectData.filePath.substring(0, lastSlash);
  const imgPathRelative = tilesetDef?.file || '';
  let fullImgPath = projectDir + (projectDir.includes('/') ? '/' : '\\') + imgPathRelative;
  const mediaUrl = `media:///${fullImgPath.replace(/\\/g, '/')}`;

  useEffect(() => {
    if (!canvasRef.current || !mediaUrl) return;

    const img = new Image();
    img.src = mediaUrl;
    img.onload = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const columns = Math.floor(img.width / tileWidth);
        if (columns === 0) return;

        const x = (frameIndex % columns) * tileWidth;
        const y = Math.floor(frameIndex / columns) * tileHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false; 
        ctx.drawImage(img, x, y, tileWidth, tileHeight, 0, 0, canvas.width, canvas.height);
    };
  }, [mediaUrl, frameIndex, tileWidth, tileHeight]);

  return (
    <div style={{ background: '#000', padding: '5px', border: '1px solid #555', minWidth: `${size}px`, minHeight: `${size}px` }}>
        <canvas 
            ref={canvasRef} 
            width={size} 
            height={size} 
            style={{ display: 'block', imageRendering: 'pixelated' }}
        />
    </div>
  )
}

export default AppearanceCanvas
