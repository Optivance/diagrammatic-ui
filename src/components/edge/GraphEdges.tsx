import React, { useState, useEffect } from 'react';
import { Edge, Node } from '../../types/graph';

export interface GraphEdgesProps {
  /** All edges in the graph */
  edges: Edge[];
  /** Record of node positions keyed by node ID */
  nodePositions: Record<string, { x: number; y: number }>;
  /** Scale factor for node sizes */
  nodeSizeScale: number;
  /** Currently selected node */
  selectedNode: Node | null;
  /** Record of highlighted paths */
  highlightedPath: {
    nodes: Set<string>;
    edges: Set<string>;
  };
  /** Visual theme */
  theme: 'light' | 'dark';
  /** Current transform state */
  transform: { scale: number };
  /** Callback when an edge is clicked */
  onEdgeClick: (edge: Edge) => void;
  /** Record of node sizes (width, height) keyed by node ID */
  nodeSizes?: Record<string, { width: number; height: number }>;
}

/**
 * Component that renders all edges in the graph
 */
export const GraphEdges: React.FC<GraphEdgesProps> = ({
  edges,
  nodePositions,
  nodeSizeScale,
  selectedNode,
  highlightedPath,
  theme,
  transform,
  onEdgeClick,
  nodeSizes = {}
}) => {
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  
  // Default node size if not provided
  const defaultNodeSize = 120 * nodeSizeScale;
  const defaultColor = theme === 'dark' ? '#4b5563' : '#a0aec0';
  const highlightedColor = '#22c55e';
  const selectedColor = '#3b82f6';
  const hoverColor = theme === 'dark' ? '#e2e8f0' : '#1a202c';
  
  return (
    <g className="graph-edges">
      {edges.map(edge => {
        const sourcePos = nodePositions[edge.source];
        const targetPos = nodePositions[edge.target];
        
        if (!sourcePos || !targetPos) return null;
        
        const edgeId = `${edge.source}-${edge.target}`;
        const isSelected = selectedNode && 
          (selectedNode.id === edge.source || selectedNode.id === edge.target);
        const isPathHighlighted = highlightedPath.edges.has(edgeId);
        const isHovered = hoveredEdge === edgeId;
        
        let color = defaultColor;
        let strokeWidth = 1.5 / transform.scale;
        
        if (isHovered) {
          color = hoverColor;
          strokeWidth = 2.5 / transform.scale;
        } else if (isPathHighlighted) {
          color = highlightedColor;
          strokeWidth = 2 / transform.scale;
        } else if (isSelected) {
          color = selectedColor;
          strokeWidth = 1.8 / transform.scale;
        }
        
        // Calculate edge path with adjustments for node size
        const dx = targetPos.x - sourcePos.x;
        const dy = targetPos.y - sourcePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Skip rendering if nodes are in the same position
        if (distance === 0) return null;
        
        // Calculate normalized direction vector
        const nx = dx / distance;
        const ny = dy / distance;
        
        // Get node sizes (width and height)
        const sourceSize = nodeSizes[edge.source] || { 
          width: defaultNodeSize, 
          height: defaultNodeSize 
        };
        const targetSize = nodeSizes[edge.target] || { 
          width: defaultNodeSize, 
          height: defaultNodeSize 
        };
        
        // Simple function to calculate intersection point with rectangular nodes
        // This gives more accurate edge connections than the ellipse approximation
        const findIntersection = (
          nodeCenter: {x: number, y: number},
          nodeWidth: number,
          nodeHeight: number,
          pointOutside: {x: number, y: number}
        ) => {
          // Half-dimensions of the node rectangle
          const halfWidth = nodeWidth / 2;
          const halfHeight = nodeHeight / 2;
          
          // If target is at the same position as source, return center
          if (Math.abs(nodeCenter.x - pointOutside.x) < 0.1 && 
              Math.abs(nodeCenter.y - pointOutside.y) < 0.1) {
            return { x: nodeCenter.x, y: nodeCenter.y };
          }
          
          // Direction vector from node center to outside point
          const dirX = pointOutside.x - nodeCenter.x;
          const dirY = pointOutside.y - nodeCenter.y;
          
          // Normalize the direction vector
          const magnitude = Math.sqrt(dirX * dirX + dirY * dirY);
          const normDirX = dirX / magnitude;
          const normDirY = dirY / magnitude;
          
          // Scale to create 4 possible intersection points with rectangle sides
          const xIntersect1 = nodeCenter.x + (halfWidth * Math.sign(normDirX));
          const yAtXIntersect1 = nodeCenter.y + (normDirY * (xIntersect1 - nodeCenter.x) / normDirX);
          
          const xIntersect2 = nodeCenter.x - (halfWidth * Math.sign(normDirX));
          const yAtXIntersect2 = nodeCenter.y + (normDirY * (xIntersect2 - nodeCenter.x) / normDirX);
          
          const yIntersect1 = nodeCenter.y + (halfHeight * Math.sign(normDirY));
          const xAtYIntersect1 = nodeCenter.x + (normDirX * (yIntersect1 - nodeCenter.y) / normDirY);
          
          const yIntersect2 = nodeCenter.y - (halfHeight * Math.sign(normDirY));
          const xAtYIntersect2 = nodeCenter.x + (normDirX * (yIntersect2 - nodeCenter.y) / normDirY);
          
          // Check which point is on the rectangle and closest to outside point
          const intersections = [];
          
          // Check horizontal sides
          if (Math.abs(xAtYIntersect1 - nodeCenter.x) <= halfWidth) {
            intersections.push({
              x: xAtYIntersect1,
              y: yIntersect1,
              distance: Math.sqrt(
                Math.pow(xAtYIntersect1 - pointOutside.x, 2) + 
                Math.pow(yIntersect1 - pointOutside.y, 2)
              )
            });
          }
          
          if (Math.abs(xAtYIntersect2 - nodeCenter.x) <= halfWidth) {
            intersections.push({
              x: xAtYIntersect2,
              y: yIntersect2,
              distance: Math.sqrt(
                Math.pow(xAtYIntersect2 - pointOutside.x, 2) + 
                Math.pow(yIntersect2 - pointOutside.y, 2)
              )
            });
          }
          
          // Check vertical sides
          if (Math.abs(yAtXIntersect1 - nodeCenter.y) <= halfHeight) {
            intersections.push({
              x: xIntersect1,
              y: yAtXIntersect1,
              distance: Math.sqrt(
                Math.pow(xIntersect1 - pointOutside.x, 2) + 
                Math.pow(yAtXIntersect1 - pointOutside.y, 2)
              )
            });
          }
          
          if (Math.abs(yAtXIntersect2 - nodeCenter.y) <= halfHeight) {
            intersections.push({
              x: xIntersect2,
              y: yAtXIntersect2,
              distance: Math.sqrt(
                Math.pow(xIntersect2 - pointOutside.x, 2) + 
                Math.pow(yAtXIntersect2 - pointOutside.y, 2)
              )
            });
          }
          
          // Sort by distance from outside point and return closest
          intersections.sort((a, b) => a.distance - b.distance);
          
          // If no valid intersection found (shouldn't happen), return the side in the direction
          if (intersections.length === 0) {
            if (Math.abs(normDirX) > Math.abs(normDirY)) {
              // Edge is more horizontal
              return {
                x: nodeCenter.x + halfWidth * Math.sign(normDirX),
                y: nodeCenter.y
              };
            } else {
              // Edge is more vertical
              return {
                x: nodeCenter.x,
                y: nodeCenter.y + halfHeight * Math.sign(normDirY)
              };
            }
          }
          
          // Add a small offset (2px) for visual clarity
          const offset = 2 / transform.scale;
          const bestIntersection = intersections[0];
          
          return {
            x: bestIntersection.x + normDirX * offset,
            y: bestIntersection.y + normDirY * offset
          };
        };
        
        // Calculate the intersection points with the source and target nodes
        const sourceIntersection = findIntersection(
          sourcePos,
          sourceSize.width,
          sourceSize.height,
          targetPos
        );
        
        const targetIntersection = findIntersection(
          targetPos,
          targetSize.width,
          targetSize.height,
          sourcePos
        );
        
        // Use the calculated intersection points
        const startX = sourceIntersection.x;
        const startY = sourceIntersection.y;
        const endX = targetIntersection.x;
        const endY = targetIntersection.y;
        
        // Determine arrow points
        const arrowSize = 6 / transform.scale;
        const arrowAngle = Math.atan2(endY - startY, endX - startX);
        const arrowX1 = endX - arrowSize * Math.cos(arrowAngle - Math.PI / 7);
        const arrowY1 = endY - arrowSize * Math.sin(arrowAngle - Math.PI / 7);
        const arrowX2 = endX - arrowSize * Math.cos(arrowAngle + Math.PI / 7);
        const arrowY2 = endY - arrowSize * Math.sin(arrowAngle + Math.PI / 7);
        
        return (
          <g 
            key={edgeId}
            onMouseEnter={() => setHoveredEdge(edgeId)}
            onMouseLeave={() => setHoveredEdge(null)}
            onClick={() => onEdgeClick(edge)}
            cursor="pointer"
          >
            <line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <polygon
              points={`${endX},${endY} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`}
              fill={color}
            />
          </g>
        );
      })}
    </g>
  );
}; 