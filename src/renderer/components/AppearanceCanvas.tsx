import React, { useRef, useEffect } from 'react'
import { useProject } from '../ProjectContext'

interface AppearanceCanvasProps {
  tilesetId: string;
  frameIndex: number;
  size?: number;
}

const AppearanceCanvas: React.FC<AppearanceCanvasProps> = ({ 
  tilesetId, 
  frameIndex, 
  size = 64 
}) => {
  const { projectData } = useProject();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!projectData) return null;

  // Find tileset definition
  const tilesetDef = projectData.project.tilesets.find(ts => ts.id === tilesetId);
  const tileWidth = tilesetDef?.tileWidth || projectData.project.tileWidth || 16;
  const tileHeight = tilesetDef?.tileHeight || projectData.project.tileHeight || 16;

  // Resolve image path
  const lastSlash = Math.max(projectData.filePath.lastIndexOf('/'), projectData.filePath.lastIndexOf('\\'));
  const projectDir = projectData.filePath.substring(0, lastSlash);
  const imgPathRelative = tilesetDef?.file || '';
  
  // Only build URL if we have a valid path fragment
  const mediaUrl = imgPathRelative 
    ? `media:///${(projectDir + (projectDir.includes('/') ? '/' : '\\') + imgPathRelative).replace(/\\/g, '/')}`
    : null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!mediaUrl) {
        // Draw an "X" for invalid/missing appearances
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#f44';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(size * 0.2, size * 0.2);
        ctx.lineTo(size * 0.8, size * 0.8);
        ctx.moveTo(size * 0.8, size * 0.2);
        ctx.lineTo(size * 0.2, size * 0.8);
        ctx.stroke();
        return;
    }

    const img = new Image();
    img.src = mediaUrl;
    img.onload = () => {
        const columns = Math.floor(img.width / tileWidth);
        if (columns === 0) return;

        const x = (frameIndex % columns) * tileWidth;
        const y = Math.floor(frameIndex / columns) * tileHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false; 
        ctx.drawImage(img, x, y, tileWidth, tileHeight, 0, 0, canvas.width, canvas.height);
    };
    img.onerror = () => {
        // Draw a question mark if the image fails to load
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f44';
        ctx.font = `bold ${size * 0.8}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', size / 2, size / 2);
    }
  }, [mediaUrl, frameIndex, tileWidth, tileHeight, size]);

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
