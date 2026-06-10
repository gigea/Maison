import { useState, useRef } from 'react';
import './ImageZoom.css';

export default function ImageZoom({ src, alt }) {
  const [zoomed, setZoomed] = useState(false);
  const [pos,    setPos]    = useState({ x: 50, y: 50 });
  const imgRef = useRef();

  const handleMove = (e) => {
    if (!zoomed) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    setPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  return (
    <div
      ref={imgRef}
      className={`zoom-wrap ${zoomed ? 'zoomed' : ''}`}
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
      onMouseMove={handleMove}
    >
      <img
        src={src} alt={alt}
        className="zoom-img"
        style={zoomed ? { transformOrigin: `${pos.x}% ${pos.y}%`, transform: 'scale(2.2)' } : {}}
      />
      {!zoomed && <span className="zoom-hint">🔍 Hover to zoom</span>}
    </div>
  );
}
