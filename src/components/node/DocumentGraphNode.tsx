import React, { useRef, useEffect } from 'react';
import { GraphNode, GraphNodeProps } from './GraphNode';
import { CustomDocumentNode } from './CustomDocumentNode';
import { useDragHandler } from '../../hooks/useDragHandler';

/**
 * A wrapper around GraphNode that renders document-style nodes
 */
export const DocumentGraphNode: React.FC<GraphNodeProps> = (props) => {
  // Keep track of the last valid position
  const lastValidPositionRef = useRef(props.position);
  
  // Pull out the drag handlers from the hook
  const { startDrag, isDragging, updateCurrentPosition } = useDragHandler(
    props.isInteractive || false,
    props.zoomScale || 1,
    props.onPositionChange,
    props.node.id
  );
  
  // Update last valid position when position prop changes
  useEffect(() => {
    if (!isDragging) {
      lastValidPositionRef.current = props.position;
      updateCurrentPosition(props.position);
    }
  }, [props.position, isDragging, updateCurrentPosition]);

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || !props.isInteractive) return; // Only handle left mouse button
    if ((e.target as HTMLElement).closest('.node-menu-btn')) return; // Don't drag when clicking menu

    // Prevent default and stop propagation
    e.preventDefault();
    e.stopPropagation();
    
    // Start the drag operation
    startDrag(e, lastValidPositionRef.current);
  };

  // Determine if we should use document style
  const shouldUseDocumentStyle = Boolean(
    // Example: Check for a specific node type or structure
    // In a real app, you could add a "style" field to the node data
    props.node.sections && props.node.sections.length > 0
  );

  // If it's a document-style node, use our custom component
  if (shouldUseDocumentStyle) {
    return (
      <CustomDocumentNode
        {...props}
        onMouseDown={handleMouseDown}
        isInteractive={props.isInteractive}
        isDragging={isDragging}
        styleConfig={props.styleConfig}
      />
    );
  }

  // Otherwise, fall back to the standard node
  return <GraphNode {...props} />;
};

export default DocumentGraphNode; 