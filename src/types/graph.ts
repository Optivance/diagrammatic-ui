/**
 * Core type definitions for the graph library
 */

/**
 * Basic Node interface representing a vertex in the graph
 */
export interface Node {
  /** Unique identifier for the node */
  id: string;
  
  /** Display label for the node */
  label?: string;
  
  /** Node type for styling/behavior */
  type?: string;
  
  /** Legacy name field for compatibility */
  name?: string;
  
  /** Legacy title field for compatibility */
  title?: string;
  
  /** File path associated with the node */
  filepath?: string;
  
  /** Description text for the node */
  description?: string;
  
  /** Metadata for the node */
  metadata?: {
    filePath?: string;
    path?: string;
    description?: string;
    [key: string]: unknown;
  };
  
  /** Sections within the node */
  sections?: Array<{
    [key: string]: unknown;
    id: string;
    name: string;
    items: unknown[];
  }>;
  
  /** Additional data associated with the node */
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
  metadata?: Record<string, any>;
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
  data?: Record<string, any>;
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
 * Root data structure for the graph
 */
export interface GraphData {
  /** Name of the project/graph */
  projectName?: string;
  /** Type of project this graph represents */
  projectType?: string;
  /** Primary language of the project */
  language?: string;
  /** Version of the project */
  version?: string;
  /** Timestamp when this data was generated/analyzed */
  analyzedAt?: string;
  
  /** List of nodes in the graph */
  nodes: Node[];
  /** List of edges connecting the nodes */
  edges: Edge[];
  
  /** Any additional metadata for the graph */
  metadata?: Record<string, any>;
}

export interface NodeSection {
  [key: string]: unknown;
  id: string;
  name: string;
  items: unknown[];
}

export interface NodeMetadata {
  [key: string]: unknown;
  filePath?: string;
  path?: string;
  description?: string;
}

export interface Node {
  id: string;
  name?: string;
  title?: string;
  type?: string;
  data?: Record<string, unknown>;
  metadata?: NodeMetadata;
  filepath?: string;
  sections?: Array<{
    [key: string]: unknown;
    id: string;
    name: string;
    items: unknown[];
  }>;
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