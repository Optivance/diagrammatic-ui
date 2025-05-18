import { useState, useRef, useEffect } from 'react';

/**
 * Custom hook that manages node dragging functionality.
 * Handles coordinate conversion between screen and graph spaces.
 */
export function useDragHandler(
  isInteractive: boolean,
  zoomScale: number,
  onPositionChange: (id: string, position: { x: number; y: number }) => void,
  nodeId: string
) {
  const [isDragging, setIsDragging] = useState(false);
  const initialMouseRef = useRef<{ x: number; y: number } | null>(null);
  const initialPositionRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!isDragging || !isInteractive) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!initialMouseRef.current || !initialPositionRef.current) return;

      // Convert screen space delta to graph space
      const deltaX = (e.clientX - initialMouseRef.current.x) / zoomScale;
      const deltaY = (e.clientY - initialMouseRef.current.y) / zoomScale;

      // Calculate new position in graph space
      const newPosition = {
        x: initialPositionRef.current.x + deltaX,
        y: initialPositionRef.current.y + deltaY
      };

      // Update node position
      onPositionChange(nodeId, newPosition);
    };

    const handleMouseUp = (e: MouseEvent) => {
      setIsDragging(false);
      document.body.style.cursor = 'default';
      
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'grabbing';

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isDragging, isInteractive, nodeId, onPositionChange, zoomScale]);

  const startDrag = (e: React.MouseEvent, currentPosition: { x: number; y: number }) => {
    if (!isInteractive) return;
    
    e.preventDefault();
    e.stopPropagation();

    // Store initial values
    initialMouseRef.current = { x: e.clientX, y: e.clientY };
    initialPositionRef.current = { ...currentPosition };
    setIsDragging(true);
  };

  return { isDragging, startDrag };
} 