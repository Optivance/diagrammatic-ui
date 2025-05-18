import React from 'react';
import { Edge } from '../../types/graph';
import { calculateNodeIntersection } from '../../utils/graph/edgeUtils';

export interface GraphEdgeProps {
  /** The edge data */
  edge: Edge;
  /** Position of the source node */
  sourcePos: { x: number; y: number };
  /** Position of the target node */
  targetPos: { x: number; y: number };
  /** Node dimensions to calculate edge connections */
  nodeSize: { width: number; height: number };
  /** Whether this edge is currently highlighted */
  isHighlighted?: boolean;
  /** Whether this edge is part of a highlighted path */
  isPathHighlighted?: boolean;
  /** Callback when edge is clicked */
  onClick?: (edge: Edge) => void;
  /** Visual theme */
  theme?: 'light' | 'dark';
  /** Current zoom level */
  zoomScale?: number;
}

/**
 * Component that renders an edge between two nodes
 */
export const GraphEdge: React.FC<GraphEdgeProps> = ({
  edge,
  sourcePos,
  targetPos,
  nodeSize,
  isHighlighted = false,
  isPathHighlighted = false,
  onClick,
  theme = 'light',
  zoomScale = 1,
}) => {
  const isDark = theme === 'dark';
  
  // Calculate the angle for proper alignment
  const angle = Math.atan2(targetPos.y - sourcePos.y, targetPos.x - sourcePos.x);
  
  // Add padding to prevent edges from exactly touching node borders
  const sourcePadding = 5;
  const targetPadding = 6; // Slightly larger for arrowhead
  
  // Calculate start and end points based on node intersections
  const sourceIntersection = calculateNodeIntersection(
    sourcePos.x, 
    sourcePos.y, 
    nodeSize.width, 
    nodeSize.height, 
    angle, 
    sourcePadding
  );
  
  const targetIntersection = calculateNodeIntersection(
    targetPos.x, 
    targetPos.y, 
    nodeSize.width, 
    nodeSize.height, 
    angle + Math.PI, 
    targetPadding
  );
  
  const startX = sourceIntersection.x;
  const startY = sourceIntersection.y;
  const endX = targetIntersection.x;
  const endY = targetIntersection.y;
  
  // Calculate midpoint for labels
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  
  // Determine style based on state
  let stroke = isDark ? '#4b5563' : '#d1d5db'; // Default gray
  let strokeWidth = 1.5;
  let markerEnd = 'url(#arrow-default)';
  
  if (isPathHighlighted) {
    stroke = '#22c55e'; // Green
    strokeWidth = 2.5;
    markerEnd = 'url(#arrow-path)';
  } else if (isHighlighted) {
    stroke = '#3b82f6'; // Blue
    strokeWidth = 2;
    markerEnd = 'url(#arrow-highlight)';
  }
  
  // Adjust strokeWidth based on zoom level
  const scaledStrokeWidth = strokeWidth / (zoomScale || 1);
  
  // Get a display name for the edge type
  const edgeType = edge.type || 'relates to';
  
  // Handle edge click
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(edge);
    }
  };
  
  return (
    <g 
      onClick={handleClick}
      data-edge-id={`${edge.source}-${edge.target}`}
      style={{ cursor: 'pointer' }}
    >
      {/* Main visible edge line */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={stroke}
        strokeWidth={scaledStrokeWidth}
        markerEnd={markerEnd}
        style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
      />
      
      {/* Edge label - only shown when highlighted or path highlighted */}
      {(isHighlighted || isPathHighlighted) && edge.type && (
        <text
          x={midX}
          y={midY}
          dy="-5"
          textAnchor="middle"
          fill={stroke}
          fontSize={`${12 / (zoomScale || 1)}px`}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {edgeType}
        </text>
      )}
      
      {/* Invisible thicker line for easier interaction */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="transparent"
        strokeWidth={(10 / (zoomScale || 1))}
        style={{ cursor: 'pointer' }}
      />
    </g>
  );
}; 