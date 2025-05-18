import React from 'react';

export interface GraphDefsProps {
  /** The visual theme */
  theme: 'light' | 'dark';
}

/**
 * Component that defines SVG markers and definitions used in the graph
 */
export const GraphDefs: React.FC<GraphDefsProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  
  // Default marker colors
  const defaultColor = isDark ? '#4b5563' : '#d1d5db';
  const highlightedColor = '#3b82f6'; // Blue
  const pathColor = '#22c55e'; // Green
  
  return (
    <defs>
      {/* Default arrow marker */}
      <marker
        id="arrowhead-default"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path
          d="M0,0 L10,3.5 L0,7 Z"
          fill={defaultColor}
        />
      </marker>
      
      {/* Highlighted arrow marker */}
      <marker
        id="arrowhead-highlighted"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path
          d="M0,0 L10,3.5 L0,7 Z"
          fill={highlightedColor}
        />
      </marker>
      
      {/* Path highlighted arrow marker */}
      <marker
        id="arrowhead-path"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path
          d="M0,0 L10,3.5 L0,7 Z"
          fill={pathColor}
        />
      </marker>
    </defs>
  );
}; 