/**
 * CytoscapeAdapter - Converts between Cytoscape.js format and our internal graph format
 */
import { DataAdapter, CytoscapeData } from './AdapterTypes';
import { GraphData, Node, Edge } from '../types/graph';

/**
 * Adapter for Cytoscape.js format
 * @see https://js.cytoscape.org/#notation/elements-json
 */
export class CytoscapeAdapter implements DataAdapter<CytoscapeData> {
  /**
   * Convert Cytoscape.js format to our internal graph format
   * @param data Cytoscape.js data
   * @returns Our internal graph format
   */
  toGraph(data: CytoscapeData): GraphData {
    if (!data || !data.elements || !data.elements.nodes || !data.elements.edges) {
      throw new Error('Invalid Cytoscape data format');
    }

    // Convert nodes
    const nodes: Node[] = data.elements.nodes.map(cyNode => {
      const { id, ...rest } = cyNode.data;
      
      // Extract label if present or use id as fallback
      const label = typeof rest.label === 'string' 
        ? rest.label 
        : (typeof rest.name === 'string' ? rest.name : String(id));
      
      // Remove label and name from rest as they're handled specially
      const { label: _, name, ...nodeData } = rest;
      
      // Extract position data if present
      const position = cyNode.position as { x: number; y: number } | undefined;
      const typedNodeData = { ...nodeData };
      
      // Merge position data if present
      if (position) {
        typedNodeData.x = position.x;
        typedNodeData.y = position.y;
      }
      
      return {
        id: String(id),
        label,
        // If there's a type field, use it
        type: typeof rest.type === 'string' ? rest.type : undefined,
        // Put remaining properties in data
        data: Object.keys(typedNodeData).length > 0 ? typedNodeData : undefined
      };
    });

    // Convert edges
    const edges: Edge[] = data.elements.edges.map((cyEdge, index) => {
      const { source, target, id, ...rest } = cyEdge.data;
      
      if (!source || !target) {
        throw new Error(`Edge at index ${index} is missing source or target`);
      }
      
      return {
        // Use id if present, otherwise generate one
        id: id ? String(id) : `e${index}`,
        source: String(source),
        target: String(target),
        // If there's a type field, use it
        type: typeof rest.type === 'string' ? rest.type : undefined,
        // If there's a label field, use it
        label: typeof rest.label === 'string' ? rest.label : undefined,
        // Put remaining properties in data
        data: Object.keys(rest).length > 0 ? rest : undefined
      };
    });

    // Extract metadata from additional properties
    const { elements, ...metadata } = data;

    return {
      nodes,
      edges,
      metadata: Object.keys(metadata).length > 0 ? metadata : {}
    };
  }

  /**
   * Convert our internal graph format to Cytoscape.js format
   * @param graphData Our internal graph data
   * @returns Cytoscape.js format
   */
  fromGraph(graphData: GraphData): CytoscapeData {
    if (!graphData || !graphData.nodes || !graphData.edges) {
      throw new Error('Invalid graph data');
    }

    // Convert nodes
    const nodes = graphData.nodes.map(node => {
      const nodeData: Record<string, unknown> = {
        id: node.id
      };

      // Add label
      if (node.label) {
        nodeData.label = node.label;
      }

      // Add type if present
      if (node.type) {
        nodeData.type = node.type;
      }

      // Extract position if available
      let position: { x: number; y: number } | undefined = undefined;
      
      // Add all data properties
      if (node.data) {
        // Look for position data
        if (typeof node.data.x === 'number' && typeof node.data.y === 'number') {
          position = {
            x: node.data.x,
            y: node.data.y
          };
          
          // Make a copy without the position data
          const { x, y, ...nodeDataWithoutPosition } = node.data;
          
          // Add all other data properties
          Object.entries(nodeDataWithoutPosition).forEach(([key, value]) => {
            nodeData[key] = value;
          });
        } else {
          // Add all data properties if no position data
          Object.entries(node.data).forEach(([key, value]) => {
            nodeData[key] = value;
          });
        }
      }

      const result: { 
        data: { id: string; [key: string]: unknown }; 
        position?: { x: number; y: number }
      } = {
        data: nodeData as { id: string; [key: string]: unknown }
      };
      
      // Add position if available
      if (position) {
        result.position = position;
      }
      
      return result;
    });

    // Convert edges
    const edges = graphData.edges.map(edge => {
      const edgeData: { 
        id: string; 
        source: string; 
        target: string; 
        [key: string]: unknown 
      } = {
        id: edge.id,
        source: edge.source,
        target: edge.target
      };

      // Add type if present
      if (edge.type) {
        edgeData.type = edge.type;
      }

      // Add label if present
      if (edge.label) {
        edgeData.label = edge.label;
      }

      // Add all data properties
      if (edge.data) {
        Object.entries(edge.data).forEach(([key, value]) => {
          edgeData[key] = value;
        });
      }

      return { 
        data: edgeData 
      };
    });

    // Build final result
    const result: CytoscapeData = {
      elements: {
        nodes: nodes as CytoscapeData['elements']['nodes'],
        edges: edges as CytoscapeData['elements']['edges']
      }
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