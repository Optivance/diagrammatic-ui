/**
 * JSONGraphAdapter - Converts between JSON Graph Format (JGF) and our internal graph format
 * @see http://jsongraphformat.info/
 */
import { DataAdapter, JSONGraphFormat } from './AdapterTypes';
import { GraphData, Node, Edge } from '../types/graph';

/**
 * Adapter for JSON Graph Format (JGF)
 */
export class JSONGraphAdapter implements DataAdapter<JSONGraphFormat> {
  /**
   * Convert JSON Graph Format to our internal graph format
   * @param data JSON Graph Format data
   * @returns Our internal graph format
   */
  toGraph(data: JSONGraphFormat): GraphData {
    if (!data || !data.graph || !data.graph.nodes || !Array.isArray(data.graph.nodes)) {
      throw new Error('Invalid JSON Graph Format data');
    }

    // Convert nodes
    const nodes: Node[] = data.graph.nodes.map(jgfNode => {
      const { id, label, metadata, ...rest } = jgfNode;
      
      return {
        id: String(id),
        // Use label if present, otherwise use id
        label: label || String(id),
        // Use type from metadata if present
        type: metadata?.type ? String(metadata.type) : undefined,
        // Merge metadata and remaining properties
        data: {
          ...rest,
          ...(metadata || {})
        }
      };
    });

    // Convert edges
    const edges: Edge[] = data.graph.edges ? data.graph.edges.map((jgfEdge, index) => {
      const { id, source, target, relation, label, metadata, ...rest } = jgfEdge;
      
      if (!source || !target) {
        throw new Error(`Edge at index ${index} is missing source or target`);
      }
      
      return {
        // Use id if present, otherwise generate one
        id: id ? String(id) : `e${index}`,
        source: String(source),
        target: String(target),
        // Use relation as type if present
        type: relation || undefined,
        // Use label if present
        label: label || undefined,
        // Merge metadata and remaining properties
        data: {
          ...rest,
          ...(metadata || {})
        }
      };
    }) : [];

    // Extract graph metadata
    const graphMetadata: Record<string, unknown> = {};
    
    if (data.graph.id) {
      graphMetadata.id = data.graph.id;
    }
    
    if (data.graph.type) {
      graphMetadata.type = data.graph.type;
    }
    
    if (data.graph.label) {
      graphMetadata.label = data.graph.label;
    }
    
    if (data.graph.directed !== undefined) {
      graphMetadata.directed = data.graph.directed;
    }
    
    if (data.graph.metadata) {
      Object.entries(data.graph.metadata).forEach(([key, value]) => {
        graphMetadata[key] = value;
      });
    }

    return {
      nodes,
      edges,
      metadata: Object.keys(graphMetadata).length > 0 ? graphMetadata : {}
    };
  }

  /**
   * Convert our internal graph format to JSON Graph Format
   * @param graphData Our internal graph data
   * @returns JSON Graph Format
   */
  fromGraph(graphData: GraphData): JSONGraphFormat {
    if (!graphData || !graphData.nodes || !graphData.edges) {
      throw new Error('Invalid graph data');
    }

    // Convert nodes
    const nodes = graphData.nodes.map(node => {
      const { id, label, type, data } = node;
      
      // Extract type field for JGF's metadata section
      const metadata: Record<string, unknown> = {};
      let nodeData: Record<string, unknown> = {};
      
      if (type) {
        metadata.type = type;
      }
      
      // Add remaining data fields
      if (data) {
        // Split between metadata and regular properties
        Object.entries(data).forEach(([key, value]) => {
          if (
            typeof value === 'object' || 
            key === 'description' || 
            key === 'category' || 
            key === 'weight'
          ) {
            metadata[key] = value;
          } else {
            nodeData[key] = value;
          }
        });
      }
      
      const jgfNode: any = {
        id: id,
      };
      
      // Add label if present
      if (label) {
        jgfNode.label = label;
      }
      
      // Add metadata if not empty
      if (Object.keys(metadata).length > 0) {
        jgfNode.metadata = metadata;
      }
      
      // Add other data properties
      Object.entries(nodeData).forEach(([key, value]) => {
        jgfNode[key] = value;
      });
      
      return jgfNode;
    });

    // Convert edges
    const edges = graphData.edges.map(edge => {
      const { id, source, target, type, label, data } = edge;
      
      // Extract fields for JGF's metadata section
      const metadata: Record<string, unknown> = {};
      let edgeData: Record<string, unknown> = {};
      
      if (data) {
        // Split between metadata and regular properties
        Object.entries(data).forEach(([key, value]) => {
          if (
            typeof value === 'object' || 
            key === 'description' || 
            key === 'weight'
          ) {
            metadata[key] = value;
          } else {
            edgeData[key] = value;
          }
        });
      }
      
      const jgfEdge: any = {
        id: id,
        source: source,
        target: target
      };
      
      // Use type as relation in JGF
      if (type) {
        jgfEdge.relation = type;
      }
      
      // Add label if present
      if (label) {
        jgfEdge.label = label;
      }
      
      // Add metadata if not empty
      if (Object.keys(metadata).length > 0) {
        jgfEdge.metadata = metadata;
      }
      
      // Add other data properties
      Object.entries(edgeData).forEach(([key, value]) => {
        jgfEdge[key] = value;
      });
      
      return jgfEdge;
    });

    // Build graph object
    const graph: any = {
      nodes
    };
    
    // Add edges if present
    if (edges.length > 0) {
      graph.edges = edges;
    }
    
    // Add graph metadata from our metadata
    if (graphData.metadata) {
      const { id, type, label, directed, ...restMetadata } = graphData.metadata;
      
      if (id) {
        graph.id = id;
      }
      
      if (type) {
        graph.type = type;
      }
      
      if (label) {
        graph.label = label;
      }
      
      if (directed !== undefined) {
        graph.directed = directed;
      }
      
      // Add remaining metadata fields to metadata object
      if (Object.keys(restMetadata).length > 0) {
        graph.metadata = restMetadata;
      }
    }
    
    // Build final result
    return {
      graph
    };
  }
} 