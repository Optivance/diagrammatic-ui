/**
 * Layout factory for selecting and using different graph layout algorithms
 */
import { Node, Edge, Position } from '../types/graph';
import { 
  LayoutType,
  CircularLayoutOptions,
  ForceLayoutOptions,
  GridLayoutOptions,
  RadialLayoutOptions,
  TreeLayoutOptions,
  circularLayout, 
  forceLayout, 
  gridLayout, 
  radialLayout, 
  treeLayout 
} from './index';

/**
 * Layout factory options
 */
export interface LayoutFactoryOptions {
  /** Type of layout algorithm to use */
  type: LayoutType;
  /** Options specific to the selected layout */
  layoutOptions?: any;
  /** Width of the layout viewport */
  width: number;
  /** Height of the layout viewport */
  height: number;
}

/**
 * Creates a layout for the given nodes and edges using the specified algorithm
 */
export function createLayout(
  nodes: Node[],
  edges: Edge[],
  options: LayoutFactoryOptions
): Record<string, Position> {
  const { type, layoutOptions, width, height } = options;

  // Select and apply the appropriate layout algorithm
  switch (type) {
    case 'circular':
      return circularLayout(nodes, width, height, layoutOptions as CircularLayoutOptions);
    
    case 'force':
      return forceLayout(nodes, edges, width, height, layoutOptions as ForceLayoutOptions);
    
    case 'grid':
      return gridLayout(nodes, width, height, layoutOptions as GridLayoutOptions);
    
    case 'radial':
      return radialLayout(nodes, edges, width, height, layoutOptions as RadialLayoutOptions);
    
    case 'tree':
      return treeLayout(nodes, edges, width, height, layoutOptions as TreeLayoutOptions);
    
    case 'spiral':
      return radialLayout(nodes, edges, width, height, layoutOptions as RadialLayoutOptions);
    
    case 'donut':
      return circularLayout(nodes, width, height, { ...layoutOptions as CircularLayoutOptions, isDonut: true });
    
    default:
      console.warn(`Unknown layout type: ${type}. Falling back to grid layout.`);
      return gridLayout(nodes, width, height, layoutOptions as GridLayoutOptions);
  }
}

/**
 * Applies the layout to the nodes, updating their positions in-place
 */
export function applyLayout(
  nodes: Node[],
  positions: Record<string, Position>
): void {
  nodes.forEach(node => {
    const position = positions[node.id];
    if (position) {
      if (node.data && typeof node.data === 'object') {
        node.data.x = position.x;
        node.data.y = position.y;
      } else {
        // Create new data object with position and any existing data
        const existingData = node.data || {};
        node.data = { 
          x: position.x, 
          y: position.y,
          ...(typeof existingData === 'object' ? existingData : { value: existingData })
        };
      }
    }
  });
} 