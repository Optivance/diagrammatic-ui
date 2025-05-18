/**
 * D3ForceAdapter - Converts between D3 force layout format and our internal graph format
 */
import { DataAdapter, D3ForceData } from './AdapterTypes';
import { GraphData, Node, Edge } from '../types/graph';

/**
 * Adapter for D3 force layout format
 * @see https://github.com/d3/d3-force
 */
export class D3ForceAdapter implements DataAdapter<D3ForceData> {
  /**
   * Convert D3 force layout format to our internal graph format
   * @param data D3 force layout data
   * @returns Our internal graph format
   */
  toGraph(data: D3ForceData): GraphData {
    if (!data || !data.nodes || !Array.isArray(data.nodes) || !data.links || !Array.isArray(data.links)) {
      throw new Error('Invalid D3 force layout data format');
    }

    // Convert nodes
    const nodes: Node[] = data.nodes.map(d3Node => {
      const { id, ...rest } = d3Node;
      
      // Extract label if present or use id as fallback
      const label = typeof rest.name === 'string' 
        ? rest.name 
        : (typeof rest.label === 'string' ? rest.label : String(id));
      
      // Remove name and label from rest as they're handled specially
      const { name, label: _, ...nodeData } = rest;
      
      return {
        id: String(id),
        label,
        // If there's a type field, use it
        type: typeof rest.type === 'string' ? rest.type : undefined,
        // Put remaining properties in data
        data: Object.keys(nodeData).length > 0 ? nodeData : undefined
      };
    });

    // Convert links to edges
    const edges: Edge[] = data.links.map((link, index) => {
      // Handle both string and number source/target
      const sourceId = typeof link.source === 'object' && link.source !== null
        ? String((link.source as { id: string }).id)
        : String(link.source);
      
      const targetId = typeof link.target === 'object' && link.target !== null
        ? String((link.target as { id: string }).id)
        : String(link.target);

      const { source: _, target: __, id, ...rest } = link;
      
      return {
        // Use id if present, otherwise generate one
        id: id ? String(id) : `e${index}`,
        source: sourceId,
        target: targetId,
        // If there's a type field, use it
        type: typeof rest.type === 'string' ? rest.type : undefined,
        // If there's a label field, use it
        label: typeof rest.label === 'string' ? rest.label : undefined,
        // Put remaining properties in data
        data: Object.keys(rest).length > 0 ? rest : undefined
      };
    });

    // Extract metadata from additional properties
    const { nodes: _, links: __, ...metadata } = data;

    return {
      nodes,
      edges,
      metadata: Object.keys(metadata).length > 0 ? metadata : {}
    };
  }

  /**
   * Convert our internal graph format to D3 force layout format
   * @param graphData Our internal graph data
   * @returns D3 force layout format
   */
  fromGraph(graphData: GraphData): D3ForceData {
    if (!graphData || !graphData.nodes || !graphData.edges) {
      throw new Error('Invalid graph data');
    }

    // Convert nodes
    const nodes = graphData.nodes.map(node => {
      const result: {
        id: string;
        [key: string]: unknown;
      } = {
        id: node.id
      };

      // Add label as name for D3 compatibility
      if (node.label) {
        result.name = node.label;
      }

      // Add type if present
      if (node.type) {
        result.type = node.type;
      }

      // Add all data properties
      if (node.data) {
        Object.entries(node.data).forEach(([key, value]) => {
          result[key] = value;
        });
      }

      return result;
    });

    // Convert edges to links
    const links = graphData.edges.map(edge => {
      const result: {
        source: string;
        target: string;
        [key: string]: unknown;
      } = {
        source: edge.source,
        target: edge.target
      };

      // Add id if present
      if (edge.id) {
        result.id = edge.id;
      }

      // Add type if present
      if (edge.type) {
        result.type = edge.type;
      }

      // Add label if present
      if (edge.label) {
        result.label = edge.label;
      }

      // Add all data properties
      if (edge.data) {
        Object.entries(edge.data).forEach(([key, value]) => {
          result[key] = value;
        });
      }

      return result;
    });

    // Build final result
    const result: D3ForceData = {
      nodes,
      links
    };

    // Add metadata
    if (graphData.metadata) {
      Object.entries(graphData.metadata).forEach(([key, value]) => {
        result[key] = value;
      });
    }

    return result;
  }
} 