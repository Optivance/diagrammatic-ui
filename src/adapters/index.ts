/**
 * Data adapters for converting between various graph formats
 */

// Export adapter types and interfaces
export * from './AdapterTypes';

// Export all adapter implementations
export { D3ForceAdapter } from './D3ForceAdapter';
export { CytoscapeAdapter } from './CytoscapeAdapter';
export { AdjacencyMatrixAdapter } from './AdjacencyMatrixAdapter';
export { DependencyTreeAdapter } from './DependencyTreeAdapter';
export { JSONGraphAdapter } from './JSONGraphAdapter';

// Create a factory for easy adapter selection
import { GraphData } from '../types/graph';
import { 
  DataAdapter,
  D3ForceData,
  CytoscapeData,
  AdjacencyMatrixData,
  DependencyTreeData,
  JSONGraphFormat
} from './AdapterTypes';

import { D3ForceAdapter } from './D3ForceAdapter';
import { CytoscapeAdapter } from './CytoscapeAdapter';
import { AdjacencyMatrixAdapter } from './AdjacencyMatrixAdapter';
import { DependencyTreeAdapter } from './DependencyTreeAdapter';
import { JSONGraphAdapter } from './JSONGraphAdapter';

/**
 * Supported data format types
 */
export type DataFormatType = 
  | 'd3'
  | 'cytoscape'
  | 'adjacency-matrix'
  | 'dependency-tree'
  | 'json-graph';

/**
 * Union type of all supported data formats
 */
export type SupportedDataFormat = 
  | D3ForceData
  | CytoscapeData
  | AdjacencyMatrixData
  | DependencyTreeData
  | JSONGraphFormat;

/**
 * Factory for creating adapters based on data format
 */
export class AdapterFactory {
  private static readonly adapters: Record<DataFormatType, DataAdapter<any>> = {
    'd3': new D3ForceAdapter(),
    'cytoscape': new CytoscapeAdapter(),
    'adjacency-matrix': new AdjacencyMatrixAdapter(),
    'dependency-tree': new DependencyTreeAdapter(),
    'json-graph': new JSONGraphAdapter()
  };

  /**
   * Get an adapter instance for the specified format
   * @param format The data format type
   * @returns The corresponding adapter instance
   */
  static getAdapter(format: DataFormatType): DataAdapter<any> {
    const adapter = this.adapters[format];
    if (!adapter) {
      throw new Error(`Unsupported data format: ${format}`);
    }
    return adapter;
  }

  /**
   * Convert data from a supported format to our internal graph format
   * @param data Data in a supported format
   * @param format The format of the input data
   * @returns Data in our internal graph format
   */
  static toGraph(data: SupportedDataFormat, format: DataFormatType): GraphData {
    return this.getAdapter(format).toGraph(data);
  }

  /**
   * Convert our internal graph format to a supported format
   * @param graphData Data in our internal graph format
   * @param format The desired output format
   * @returns Data in the specified format
   */
  static fromGraph(graphData: GraphData, format: DataFormatType): SupportedDataFormat {
    return this.getAdapter(format).fromGraph(graphData);
  }
}

// Helper functions for direct conversion
export const convertFromD3 = (data: D3ForceData): GraphData => {
  return new D3ForceAdapter().toGraph(data);
};

export const convertToD3 = (graphData: GraphData): D3ForceData => {
  return new D3ForceAdapter().fromGraph(graphData);
};

export const convertFromCytoscape = (data: CytoscapeData): GraphData => {
  return new CytoscapeAdapter().toGraph(data);
};

export const convertToCytoscape = (graphData: GraphData): CytoscapeData => {
  return new CytoscapeAdapter().fromGraph(graphData);
};

export const convertFromAdjacencyMatrix = (data: AdjacencyMatrixData): GraphData => {
  return new AdjacencyMatrixAdapter().toGraph(data);
};

export const convertToAdjacencyMatrix = (graphData: GraphData): AdjacencyMatrixData => {
  return new AdjacencyMatrixAdapter().fromGraph(graphData);
};

export const convertFromDependencyTree = (data: DependencyTreeData): GraphData => {
  return new DependencyTreeAdapter().toGraph(data);
};

export const convertToDependencyTree = (graphData: GraphData): DependencyTreeData => {
  return new DependencyTreeAdapter().fromGraph(graphData);
};

export const convertFromJSONGraph = (data: JSONGraphFormat): GraphData => {
  return new JSONGraphAdapter().toGraph(data);
};

export const convertToJSONGraph = (graphData: GraphData): JSONGraphFormat => {
  return new JSONGraphAdapter().fromGraph(graphData);
}; 