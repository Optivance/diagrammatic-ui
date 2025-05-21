/**
 * Core type definitions for the graph library
 */

import React from 'react';

/**
 * Basic Node interface representing a vertex in the graph
 */
export interface Node {
  /** Unique identifier for the node */
  id: string;
  
  /** Display label for the node */
  label?: string;
  
  /** Node classification/category */
  type?: string;
  
  /** Legacy name field for compatibility */
  name?: string;
  
  /** Legacy title field for compatibility */
  title?: string;
  
  /** Source path or location (generic representation) */
  path?: string;
  
  /** Brief text description of the node */
  description?: string;
  
  /** Detailed structured metadata for the node */
  metadata?: {
    [key: string]: unknown;
  };
  
  /** Structured content sections within the node */
  sections?: Section[];
  
  /** Additional extensible data associated with the node */
  data?: Record<string, unknown>;
}

/**
 * Section represents a grouping of items within a node
 */
export interface Section {
  /** Unique identifier for the section */
  id: string;
  /** Display name for the section */
  name: string;
  /** Items contained within this section */
  items: SectionItem[];
}

/**
 * Item within a section
 */
export interface SectionItem {
  /** Unique identifier for the item */
  id: string;
  /** Display value/content of the item */
  value: string;
  /** Icon identifier for visual representation */
  icon?: string;
  /** Any additional metadata for the item */
  metadata?: Record<string, unknown>;
}

/**
 * Edge interface representing a connection between nodes
 */
export interface Edge {
  /** Unique identifier for the edge */
  id: string;
  /** Source node ID */
  source: string;
  /** Target node ID */
  target: string;
  /** Type of edge (affects styling and behavior) */
  type?: string;
  /** Edge label */
  label?: string;
  /** Additional metadata for the edge */
  data?: Record<string, unknown>;
}

/**
 * Position coordinates in the 2D graph space
 */
export interface Position {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Props for node components
 */
export interface GraphNodeProps {
  /** The node data to visualize */
  node: Node;
  /** Position coordinates for the node */
  position: { x: number; y: number };
  /** Callback when the node position changes */
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  /** Whether this node is currently selected */
  isHighlighted?: boolean;
  /** Whether this node is part of a highlighted path */
  isPathHighlighted?: boolean;
  /** Callback when the node is clicked */
  onNodeClick?: (node: Node) => void;
  /** Callback to show dependencies of this node */
  onShowDependencies?: (node: Node) => void;
  /** Callback to show dependents of this node */
  onShowDependents?: (node: Node) => void;
  /** Scale factor for node size */
  sizeScale?: number;
  /** Theme to use (light or dark) */
  theme?: 'light' | 'dark';
  /** Total number of nodes currently in view */
  totalNodesInView: number;
  /** Whether the node is interactive (can be clicked/dragged) */
  isInteractive?: boolean;
  /** Current zoom scale of the graph */
  zoomScale?: number;
  /** Minimum node size */
  minNodeSize?: number;
  /** Maximum node size */
  maxNodeSize?: number;
  /** Callback when node size changes */
  onSizeChange?: (size: { width: number; height: number }) => void;
  /** Custom menu items for the node */
  menuItems?: NodeMenuItem[];
  /** Whether to show the dropdown menu button */
  showDropdownMenu?: boolean;
  /** Whether to enable the context menu */
  enableContextMenu?: boolean;
}

/**
 * Node style types for visual customization
 */
export type NodeStyle = 'default' | 'document' | 'card' | 'compact' | 'custom';

/**
 * Node style configuration for customizing node appearance
 */
export interface NodeStyleConfig {
  /** Style type to use for nodes */
  type?: NodeStyle;
  /** Custom renderer for 'custom' style type */
  renderer?: React.ComponentType<GraphNodeProps>;
  /** Style options for specific node types */
  typeStyles?: Record<string, Record<string, string | number>>;
  /** Custom icons for node types */
  typeIcons?: Record<string, React.ReactNode>;
  /** Mapping function to determine style based on node content */
  styleSelector?: (node: Node) => NodeStyle;
}

/**
 * Root data structure for the graph
 */
export interface GraphData {
  /** Name of the graph */
  name?: string;
  
  /** Category/classification of the graph */
  category?: string;
  
  /** Primary mode/view for the graph */
  mode?: string;
  
  /** Version identifier */
  version?: string;
  
  /** Timestamp when this data was generated */
  timestamp?: string;
  
  /** List of nodes in the graph */
  nodes: Node[];
  /** List of edges connecting the nodes */
  edges: Edge[];
  
  /** Any additional metadata for the graph */
  metadata?: Record<string, unknown>;
  
  /** Configuration for node styling */
  nodeStyleConfig?: NodeStyleConfig;
}

/**
 * Custom menu item definition for node context menus
 */
export interface NodeMenuItem {
  /** Unique identifier for the menu item */
  id: string;
  /** Display label for the menu item */
  label: string;
  /** Optional icon to display (React element) */
  icon?: React.ReactNode;
  /** Action to perform when clicked */
  onClick: (node: Node) => void;
  /** Whether to show a divider after this item */
  divider?: boolean;
  /** Whether this menu item is disabled */
  disabled?: boolean;
}

/**
 * Menu configuration for node context and dropdown menus
 */
export interface NodeMenuConfig {
  /** Whether to show the dropdown menu toggle button */
  showDropdownMenu?: boolean;
  /** Whether to enable the context menu on right-click */
  enableContextMenu?: boolean;
  /** Custom menu items to display */
  items?: NodeMenuItem[];
}

// Update the GraphProps interface to accept nodeStyleConfig
export interface GraphProps {
  /** The graph data to visualize */
  data: GraphData;
  /** Options for node styling */
  nodeStyleConfig?: NodeStyleConfig;
  // ... other existing props ...
} 