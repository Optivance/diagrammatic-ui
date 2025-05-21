/**
 * Layout algorithms for graph visualization
 */

// Export all layout algorithms and their option types
export * from './circular';
export * from './force';
export * from './grid';
export * from './radial';
export * from './tree';
export * from './factory';

// Layout types
import { Node, Edge, Position } from '../types/graph';
import { CircularLayoutOptions, circularLayout } from './circular';
import { ForceLayoutOptions, forceLayout } from './force';
import { GridLayoutOptions, gridLayout } from './grid';
import { RadialLayoutOptions, radialLayout } from './radial';
import { TreeLayoutOptions, treeLayout } from './tree';

// Supported layout algorithm types
export type LayoutType = 'force' | 'circular' | 'tree' | 'spiral' | 'donut' | 'grid' | 'radial';

// Union type of all layout options
export interface LayoutOptions {
  /** Spacing between nodes */
  nodeSpacing?: number;
  /** Strength of forces in force-directed layout */
  forceStrength?: number;
  /** Number of iterations for force-directed layout */
  iterations?: number;
  /** Direction for tree layout */
  treeDirection?: 'horizontal' | 'vertical';
  /** Radius for circular layouts */
  radius?: number;
  [key: string]: unknown;
}

export interface LayoutResult {
  [nodeId: string]: Position;
}

// Generic layout function signature
export type LayoutFunction = (
  nodes: Node[],
  edges: Edge[],
  width: number,
  height: number,
  options?: LayoutOptions
) => LayoutResult;

// Layout registry to easily access all available layouts
export const layouts: Record<LayoutType, LayoutFunction> = {
  force: (nodes, edges, width, height, options) => 
    forceLayout(nodes, edges, width, height, options as ForceLayoutOptions),
  
  circular: (nodes, _edges, width, height, options) => 
    circularLayout(nodes, width, height, options as CircularLayoutOptions),
  
  tree: (nodes, edges, width, height, options) => 
    treeLayout(nodes, edges, width, height, options as TreeLayoutOptions),
  
  spiral: (nodes, edges, width, height, options) => 
    radialLayout(nodes, edges, width, height, options as RadialLayoutOptions),
  
  donut: (nodes, _edges, width, height, options) => 
    circularLayout(nodes, width, height, { ...options as CircularLayoutOptions, isDonut: true }),
  
  grid: (nodes, _edges, width, height, options) => 
    gridLayout(nodes, width, height, options as GridLayoutOptions),

  radial: (nodes, edges, width, height, options) =>
    radialLayout(nodes, edges, width, height, options as RadialLayoutOptions),
}; 