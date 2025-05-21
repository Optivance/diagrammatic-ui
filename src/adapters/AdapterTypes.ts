/**
 * Data Adapter Types and Interfaces
 * These types define the contract for data adapters in the library
 */
import { GraphData } from '../types/graph';

/**
 * Base interface for data adapters
 * All adapters must implement this interface
 */
export interface DataAdapter<T> {
  /**
   * Convert from source format to internal graph data format
   * @param data Data in the source format
   * @returns Data in the internal graph format
   */
  toGraph(data: T): GraphData;
  
  /**
   * Convert from internal graph data format to source format
   * @param graphData Data in the internal graph format
   * @returns Data in the source format
   */
  fromGraph(graphData: GraphData): T;
}

/**
 * Simple object with nodes and edges as arrays
 */
export interface SimpleNodeEdgeData {
  nodes: unknown[];
  edges: unknown[];
  [key: string]: unknown;
}

/**
 * D3 force layout compatible format
 */
export interface D3ForceData {
  nodes: {
    id: string;
    [key: string]: unknown;
  }[];
  links: {
    source: string | number;
    target: string | number;
    [key: string]: unknown;
  }[];
  [key: string]: unknown;
}

/**
 * Cytoscape.js compatible format
 */
export interface CytoscapeData {
  elements: {
    nodes: {
      data: {
        id: string;
        [key: string]: unknown;
      };
      [key: string]: unknown;
    }[];
    edges: {
      data: {
        id?: string;
        source: string;
        target: string;
        [key: string]: unknown;
      };
      [key: string]: unknown;
    }[];
  };
  [key: string]: unknown;
}

/**
 * Adjacency matrix format
 */
export interface AdjacencyMatrixData {
  /** Node labels/IDs in order corresponding to the matrix */
  nodes: string[];
  /** Matrix where mat[i][j] indicates connection from nodes[i] to nodes[j] */
  matrix: (0 | 1 | number)[][];
  /** Optional edge properties keyed by 'source-target' */
  edgeProperties?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Dependency tree format
 */
export interface DependencyTreeData {
  /** Root node of the tree */
  root: {
    id: string;
    name?: string;
    children?: DependencyTreeData['root'][];
    [key: string]: unknown;
  };
  /** Optional map of node attributes keyed by ID */
  nodeAttributes?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * JSON Graph Format (JGF) - A standardized format
 * @see http://jsongraphformat.info/
 */
export interface JSONGraphFormat {
  graph: {
    id?: string;
    type?: string;
    label?: string;
    directed?: boolean;
    metadata?: {
      [key: string]: unknown;
    };
    nodes: {
      id: string;
      label?: string;
      metadata?: {
        [key: string]: unknown;
      };
      [key: string]: unknown;
    }[];
    edges: {
      id?: string;
      source: string;
      target: string;
      relation?: string;
      directed?: boolean;
      label?: string;
      metadata?: {
        [key: string]: unknown;
      };
      [key: string]: unknown;
    }[];
  };
} 