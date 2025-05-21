import { useState, useRef, useEffect, useCallback } from 'react';

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
  const dragStartedRef = useRef(false);
  const currentPositionRef = useRef<{ x: number; y: number } | null>(null);
  
  // Handle mouse movement during drag
  useEffect(() => {
    if (!isDragging || !isInteractive) return;

    // Create these handlers in the effect to avoid stale closure issues
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!initialMouseRef.current || !initialPositionRef.current) return;

      // Set flag to indicate actual dragging has started (mouse has moved)
      if (!dragStartedRef.current) {
        dragStartedRef.current = true;
        
        // Add a class to the document body to indicate active dragging
        document.body.classList.add('node-dragging');
        
        // Add styles to ensure proper event capture during dragging
        const styleEl = document.createElement('style');
        styleEl.id = 'global-drag-style';
        styleEl.textContent = `
          body.node-dragging {
            cursor: grabbing !important;
            user-select: none !important;
            -webkit-user-select: none !important;
          }
          body.node-dragging * {
            cursor: grabbing !important;
          }
          .graph-node, .document-node {
            pointer-events: all !important;
          }
        `;
        document.head.appendChild(styleEl);
      }

      // Calculate mouse movement delta
      const deltaX = e.clientX - initialMouseRef.current.x;
      const deltaY = e.clientY - initialMouseRef.current.y;
      
      // Convert screen space delta to graph space
      const graphDeltaX = deltaX / zoomScale;
      const graphDeltaY = deltaY / zoomScale;
      
      // Calculate new position in graph space
      const newPosition = {
        x: initialPositionRef.current.x + graphDeltaX,
        y: initialPositionRef.current.y + graphDeltaY
      };

      // Update node position and store current position
      currentPositionRef.current = newPosition;
      onPositionChange(nodeId, newPosition);
    };

    const handleMouseUp = () => {
      // Remove all drag-specific styles and cleanup
      document.body.classList.remove('node-dragging');
      document.getElementById('global-drag-style')?.remove();
      document.body.style.cursor = '';
      dragStartedRef.current = false;
      setIsDragging(false);
      
      window.removeEventListener('mousemove', handleMouseMove, { capture: true });
      window.removeEventListener('mouseup', handleMouseUp, { capture: true });
    };

    // Use capture phase to ensure our handlers run before other handlers
    window.addEventListener('mousemove', handleMouseMove, { capture: true });
    window.addEventListener('mouseup', handleMouseUp, { capture: true });
    
    // Set cursor immediately on drag start attempt
    document.body.style.cursor = 'grabbing';

    return () => {
      window.removeEventListener('mousemove', handleMouseMove, { capture: true });
      window.removeEventListener('mouseup', handleMouseUp, { capture: true });
      document.body.style.cursor = '';
      document.body.classList.remove('node-dragging');
      document.getElementById('global-drag-style')?.remove();
    };
  }, [isDragging, isInteractive, nodeId, onPositionChange, zoomScale]);

  // Start drag operation
  const startDrag = useCallback((e: React.MouseEvent, currentPosition: { x: number; y: number }) => {
    if (!isInteractive) return;
    
    // Prevent any default behavior and stop propagation to prevent the graph from panning
    e.preventDefault();
    e.stopPropagation();
    
    // Always use the most up-to-date position
    const startPosition = currentPositionRef.current || currentPosition;
    
    // Store initial values for the drag calculation
    initialMouseRef.current = { x: e.clientX, y: e.clientY };
    initialPositionRef.current = { ...startPosition };
    currentPositionRef.current = { ...startPosition };
    
    // Reset drag started flag
    dragStartedRef.current = false;
    
    // Start dragging state immediately
    setIsDragging(true);
  }, [isInteractive]);

  // Function to update current position reference when position changes externally
  const updateCurrentPosition = useCallback((position: { x: number; y: number }) => {
    if (!isDragging) {
      currentPositionRef.current = { ...position };
    }
  }, [isDragging]);

  // Clean up refs on unmount
  useEffect(() => {
    return () => {
      initialMouseRef.current = null;
      initialPositionRef.current = null;
      currentPositionRef.current = null;
    };
  }, []);

  return { isDragging, startDrag, updateCurrentPosition };
} 