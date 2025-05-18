/**
 * Grid layout places nodes in a regular grid pattern
 */
import { Node, Position } from '../types/graph';

export interface GridLayoutOptions {
  /** Margin from the viewport edges */
  margin?: number;
  /** Spacing between grid cells */
  spacing?: number;
  /** Number of columns (if not specified, will calculate based on aspect ratio) */
  columns?: number;
  /** Sort nodes before layout */
  sortNodes?: boolean | ((a: Node, b: Node) => number);
}

/**
 * Calculate node positions in a grid layout
 */
export function gridLayout(
  nodes: Node[],
  width: number,
  height: number,
  options: GridLayoutOptions = {}
): Record<string, Position> {
  const {
    margin = 40,
    spacing = 150,
    columns: explicitColumns,
    sortNodes = false,
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

  // Calculate the number of columns based on viewport aspect ratio
  const aspectRatio = width / height;
  const calculatedColumns = Math.round(Math.sqrt(nodesCopy.length * aspectRatio));
  const columns = explicitColumns || calculatedColumns || 1;
  
  // Calculate the number of rows needed
  const rows = Math.ceil(nodesCopy.length / columns);
  
  // Calculate actual cell size based on available space
  const availableWidth = width - 2 * margin;
  const availableHeight = height - 2 * margin;
  
  // Use either the specified spacing or calculate spacing to fill available space
  const columnSpacing = Math.min(
    spacing,
    availableWidth / (columns > 1 ? columns - 1 : 1)
  );
  
  const rowSpacing = Math.min(
    spacing,
    availableHeight / (rows > 1 ? rows - 1 : 1)
  );
  
  // Calculate positions
  const positions: Record<string, Position> = {};
  
  nodesCopy.forEach((node, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;
    
    // Calculate position
    const x = margin + (col * columnSpacing);
    const y = margin + (row * rowSpacing);
    
    positions[node.id] = { x, y };
  });
  
  return positions;
} 