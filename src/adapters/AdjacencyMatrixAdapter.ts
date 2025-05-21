/**
 * AdjacencyMatrixAdapter - Converts between adjacency matrix format and our internal graph format
 */
import { DataAdapter, AdjacencyMatrixData } from './AdapterTypes';
import { GraphData, Node, Edge } from '../types/graph';

/**
 * Adapter for adjacency matrix format
 */
export class AdjacencyMatrixAdapter implements DataAdapter<AdjacencyMatrixData> {
  /**
   * Convert adjacency matrix format to our internal graph format
   * @param data Adjacency matrix data
   * @returns Our internal graph format
   */
  toGraph(data: AdjacencyMatrixData): GraphData {
    if (!data || !data.nodes || !Array.isArray(data.nodes) || !data.matrix || !Array.isArray(data.matrix)) {
      throw new Error('Invalid adjacency matrix data format');
    }

    // Ensure the matrix dimensions match the number of nodes
    if (data.matrix.length !== data.nodes.length) {
      throw new Error('Matrix rows do not match the number of nodes');
    }

    for (const row of data.matrix) {
      if (!Array.isArray(row) || row.length !== data.nodes.length) {
        throw new Error('Matrix is not square or has invalid rows');
      }
    }

    // Convert nodes
    const nodes: Node[] = data.nodes.map((id) => {
      // Get node attributes if they exist
      const nodeAttrs = data.nodeAttributes ? 
        (data.nodeAttributes[id as keyof typeof data.nodeAttributes] as Record<string, unknown> | undefined) : 
        undefined;

      return {
        id: String(id),
        label: String(id),
        // No type info in basic adjacency matrix
        // Additional data could be passed in nodeAttributes if available
        data: nodeAttrs ? { ...nodeAttrs } : undefined
      };
    });

    // Convert matrix to edges
    const edges: Edge[] = [];
    let edgeIndex = 0;

    for (let i = 0; i < data.matrix.length; i++) {
      for (let j = 0; j < data.matrix[i].length; j++) {
        // Only create edge if there's a connection (value > 0)
        if (data.matrix[i][j]) {
          const source = String(data.nodes[i]);
          const target = String(data.nodes[j]);
          const edgeId = `e${edgeIndex++}`;
          const edgeKey = `${source}-${target}`;
          
          const edge: Edge = {
            id: edgeId,
            source,
            target,
            // The value from the matrix can be used as a weight
            data: {
              weight: data.matrix[i][j]
            }
          };
          
          // Add additional edge properties if available
          if (data.edgeProperties && data.edgeProperties[edgeKey]) {
            edge.data = {
              ...edge.data,
              ...data.edgeProperties[edgeKey]
            };
            
            // Check for type and label in edge properties
            const edgeProps = data.edgeProperties[edgeKey] as Record<string, unknown>;
            
            if (typeof edgeProps.type === 'string') {
              edge.type = edgeProps.type;
            }
            
            if (typeof edgeProps.label === 'string') {
              edge.label = edgeProps.label;
            }
          }
          
          edges.push(edge);
        }
      }
    }

    // Extract metadata from additional properties
    const { nodes: _, matrix: __, nodeAttributes: ___, edgeProperties: ____, ...metadata } = data;

    return {
      nodes,
      edges,
      metadata: Object.keys(metadata).length > 0 ? metadata : {}
    };
  }

  /**
   * Convert our internal graph format to adjacency matrix format
   * @param graphData Our internal graph data
   * @returns Adjacency matrix format
   */
  fromGraph(graphData: GraphData): AdjacencyMatrixData {
    if (!graphData || !graphData.nodes || !graphData.edges) {
      throw new Error('Invalid graph data');
    }

    // Get unique node IDs in consistent order
    const nodeIds = graphData.nodes.map(node => node.id);
    
    // Create empty matrix (initialized with zeros)
    const matrix: number[][] = Array(nodeIds.length)
      .fill(0)
      .map(() => Array(nodeIds.length).fill(0));
    
    // Create lookup for node indices
    const nodeIndexMap = new Map<string, number>();
    nodeIds.forEach((id, index) => {
      nodeIndexMap.set(id, index);
    });
    
    // Fill the matrix based on edges
    const edgeProperties: Record<string, unknown> = {};
    
    graphData.edges.forEach(edge => {
      const sourceIndex = nodeIndexMap.get(edge.source);
      const targetIndex = nodeIndexMap.get(edge.target);
      
      if (sourceIndex === undefined || targetIndex === undefined) {
        console.warn(`Edge ${edge.id} references unknown node(s): ${edge.source} -> ${edge.target}`);
        return;
      }
      
      // Use the weight from data if available, otherwise default to 1
      let weight = 1;
      if (edge.data && typeof edge.data.weight === 'number') {
        weight = edge.data.weight;
      }
      
      // Set the matrix value
      matrix[sourceIndex][targetIndex] = weight;
      
      // Store edge properties
      const edgeKey = `${edge.source}-${edge.target}`;
      const edgeProp: Record<string, unknown> = {};
      
      if (edge.type) {
        edgeProp.type = edge.type;
      }
      
      if (edge.label) {
        edgeProp.label = edge.label;
      }
      
      if (edge.data) {
        Object.entries(edge.data).forEach(([key, value]) => {
          if (key !== 'weight') { // Skip weight as it's already in the matrix
            edgeProp[key] = value;
          }
        });
      }
      
      if (Object.keys(edgeProp).length > 0) {
        edgeProperties[edgeKey] = edgeProp;
      }
    });
    
    // Extract any node attributes
    const nodeAttributes: Record<string, unknown> = {};
    
    graphData.nodes.forEach(node => {
      if (node.data && Object.keys(node.data).length > 0) {
        nodeAttributes[node.id] = node.data;
      }
    });

    // Build final result
    const result: AdjacencyMatrixData = {
      nodes: nodeIds,
      matrix
    };
    
    // Add node attributes if any
    if (Object.keys(nodeAttributes).length > 0) {
      result.nodeAttributes = nodeAttributes;
    }
    
    // Add edge properties if any
    if (Object.keys(edgeProperties).length > 0) {
      result.edgeProperties = edgeProperties;
    }

    // Add metadata
    if (graphData.metadata) {
      Object.entries(graphData.metadata).forEach(([key, value]) => {
        result[key] = value;
      });
    }

    return result;
  }
} 