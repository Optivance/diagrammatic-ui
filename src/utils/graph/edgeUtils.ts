/**
 * Utility functions for edge calculations and rendering
 */

/**
 * Calculates the point where an edge should intersect with a node border
 * to ensure edges connect visually to the edge of the node rather than its center
 */
export function calculateNodeIntersection(
  nodeX: number,
  nodeY: number,
  nodeWidth: number,
  nodeHeight: number,
  angle: number,
  padding: number = 0
): { x: number; y: number } {
  // Calculate half dimensions
  const halfWidth = nodeWidth / 2;
  const halfHeight = nodeHeight / 2;
  
  // For perfect circles, calculate based on radius
  if (nodeWidth === nodeHeight) {
    const radius = halfWidth - padding;
    return {
      x: nodeX + Math.cos(angle) * radius,
      y: nodeY + Math.sin(angle) * radius
    };
  }
  
  // For rectangles, find the intersection point on the border
  // Adjust both rectangle edges and elliptical approximation for better visual results
  
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  
  // If angle is close to horizontal
  if (Math.abs(dx) > Math.abs(dy)) {
    // Intersect with left or right edge
    const xSign = Math.sign(dx);
    const slope = dy / dx;
    const x = xSign * (halfWidth - padding);
    const y = slope * x;
    
    // Check if y is within the height bounds
    if (Math.abs(y) <= halfHeight - padding) {
      return {
        x: nodeX + x,
        y: nodeY + y
      };
    }
  }
  
  // If angle is more vertical or if horizontal intersection is outside height bounds
  // Intersect with top or bottom edge
  const ySign = Math.sign(dy);
  const inverseSlope = dy !== 0 ? dx / dy : 0;
  const y = ySign * (halfHeight - padding);
  const x = inverseSlope * y;
  
  return {
    x: nodeX + x,
    y: nodeY + y
  };
} 