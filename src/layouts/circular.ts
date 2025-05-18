/**
 * Circular layout places nodes in a circle with equal spacing
 */
import { Node, Position } from '../types/graph';

export interface CircularLayoutOptions {
  /** Center X position of the circle */
  centerX?: number;
  /** Center Y position of the circle */
  centerY?: number;
  /** Radius of the circle */
  radius?: number;
  /** Starting angle in radians */
  startAngle?: number;
  /** Whether to sort nodes before layout (by id or another property) */
  sortNodes?: boolean | ((a: Node, b: Node) => number);
  /** Whether to arrange nodes in a donut shape */
  isDonut?: boolean;
  /** Inner radius for donut layout */
  innerRadius?: number;
}

/**
 * Calculate node positions in a circular layout
 */
export function circularLayout(
  nodes: Node[],
  width: number,
  height: number,
  options: CircularLayoutOptions = {}
): Record<string, Position> {
  const {
    centerX = width / 2,
    centerY = height / 2,
    radius = Math.min(width, height) * 0.4,
    startAngle = 0,
    sortNodes = false,
    isDonut = false,
    innerRadius = radius * 0.5,
  } = options;

  // If there are no nodes, return an empty positioning object
  if (!nodes.length) return {};

  // Create a copy of the nodes array to avoid modifying the original
  let nodesCopy = [...nodes];

  // Sort nodes if requested
  if (sortNodes) {
    if (typeof sortNodes === 'function') {
      nodesCopy.sort(sortNodes);
    } else {
      nodesCopy.sort((a, b) => a.id.localeCompare(b.id));
    }
  }

  // Calculate positions
  const positions: Record<string, Position> = {};
  const angleStep = (2 * Math.PI) / nodesCopy.length;

  nodesCopy.forEach((node, index) => {
    const angle = startAngle + angleStep * index;
    
    // For donut layout, use inner and outer radii
    let nodeRadius = radius;
    if (isDonut) {
      // Calculate node-specific radius between inner and outer radius
      // Alternate between inner and outer circle for visual separation
      const isEven = index % 2 === 0;
      nodeRadius = isEven ? radius : innerRadius;
    }
    
    positions[node.id] = {
      x: centerX + nodeRadius * Math.cos(angle),
      y: centerY + nodeRadius * Math.sin(angle),
    };
  });

  return positions;
} 