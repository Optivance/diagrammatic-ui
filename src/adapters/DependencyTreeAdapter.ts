/**
 * DependencyTreeAdapter - Converts between tree-structured data and our internal graph format
 */
import { DataAdapter, DependencyTreeData } from './AdapterTypes';
import { GraphData, Node, Edge } from '../types/graph';

/**
 * Adapter for dependency tree format, common for package/module dependency visualization
 */
export class DependencyTreeAdapter implements DataAdapter<DependencyTreeData> {
  /**
   * Convert dependency tree format to our internal graph format
   * @param data Dependency tree data
   * @returns Our internal graph format
   */
  toGraph(data: DependencyTreeData): GraphData {
    if (!data || !data.root) {
      throw new Error('Invalid dependency tree data format');
    }

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    // Process the tree recursively, starting from the root
    this.processNode(data.root, nodes, edges, data.nodeAttributes || {});

    // Extract metadata from additional properties
    const { root: _, nodeAttributes: __, ...metadata } = data;

    return {
      nodes,
      edges,
      metadata: Object.keys(metadata).length > 0 ? metadata : {}
    };
  }
  
  /**
   * Helper method to recursively process nodes in the tree
   */
  private processNode(
    node: DependencyTreeData['root'],
    nodes: Node[],
    edges: Edge[],
    nodeAttributes: Record<string, unknown>,
    parentId?: string
  ): void {
    // Extract node data
    const { id, name, children, ...restNodeData } = node;
    
    // Create the node
    const graphNode: Node = {
      id: String(id),
      label: name || String(id),
      // Get type from node attributes if available
      type: this.getNodeType(id, nodeAttributes),
      // Merge remaining properties with node attributes
      data: {
        ...restNodeData,
        ...(nodeAttributes[id] || {})
      }
    };
    
    // Only add data if it's not empty
    if (Object.keys(graphNode.data || {}).length === 0) {
      delete graphNode.data;
    }
    
    // Add node to the collection
    nodes.push(graphNode);
    
    // If this node has a parent, create an edge
    if (parentId) {
      const edge: Edge = {
        id: `e-${parentId}-${id}`,
        source: parentId,
        target: String(id),
        // Default to 'depends' relationship
        type: 'depends'
      };
      
      edges.push(edge);
    }
    
    // Process child nodes recursively
    if (children && Array.isArray(children)) {
      children.forEach(child => {
        this.processNode(child, nodes, edges, nodeAttributes, String(id));
      });
    }
  }
  
  /**
   * Helper to extract node type from attributes
   */
  private getNodeType(id: string, nodeAttributes: Record<string, unknown>): string | undefined {
    if (nodeAttributes[id]) {
      const attrs = nodeAttributes[id] as Record<string, unknown>;
      if (typeof attrs.type === 'string') {
        return attrs.type;
      }
    }
    return undefined;
  }

  /**
   * Convert our internal graph format to dependency tree format
   * This is more complex as we need to identify the root and build the tree
   * @param graphData Our internal graph data
   * @returns Dependency tree format
   */
  fromGraph(graphData: GraphData): DependencyTreeData {
    if (!graphData || !graphData.nodes || !graphData.edges) {
      throw new Error('Invalid graph data');
    }

    // Find potential root nodes (those with no incoming edges)
    const nodesWithIncomingEdges = new Set<string>();
    
    graphData.edges.forEach(edge => {
      nodesWithIncomingEdges.add(edge.target);
    });
    
    const rootCandidates = graphData.nodes
      .filter(node => !nodesWithIncomingEdges.has(node.id))
      .map(node => node.id);
    
    // If no root candidates, use the first node
    const rootId = rootCandidates.length > 0 
      ? rootCandidates[0] 
      : (graphData.nodes.length > 0 ? graphData.nodes[0].id : null);
    
    if (rootId === null) {
      throw new Error('No nodes found in graph data');
    }
    
    // Build an adjacency map for quick child lookup
    const childrenMap = new Map<string, string[]>();
    
    graphData.nodes.forEach(node => {
      childrenMap.set(node.id, []);
    });
    
    graphData.edges.forEach(edge => {
      const children = childrenMap.get(edge.source);
      if (children) {
        children.push(edge.target);
      }
    });
    
    // Build node lookup for quick access
    const nodeMap = new Map<string, Node>();
    graphData.nodes.forEach(node => {
      nodeMap.set(node.id, node);
    });
    
    // Extract node attributes
    const nodeAttributes: Record<string, Record<string, unknown>> = {};
    
    graphData.nodes.forEach(node => {
      if (node.data && Object.keys(node.data).length > 0) {
        nodeAttributes[node.id] = { ...(node.data as Record<string, unknown>) };
      }
      
      // Add type to node attributes if present
      if (node.type) {
        nodeAttributes[node.id] = nodeAttributes[node.id] || {};
        nodeAttributes[node.id].type = node.type;
      }
    });
    
    // Recursively build the tree
    const buildTreeNode = (nodeId: string, visited = new Set<string>()): DependencyTreeData['root'] => {
      // Prevent cycles by tracking visited nodes
      if (visited.has(nodeId)) {
        return { id: nodeId, name: nodeId, cycle: true };
      }
      
      visited.add(nodeId);
      
      const node = nodeMap.get(nodeId);
      if (!node) {
        throw new Error(`Node with id ${nodeId} not found`);
      }
      
      const children = childrenMap.get(nodeId) || [];
      const childNodes = children
        .filter(childId => nodeMap.has(childId)) // Ensure child exists
        .map(childId => buildTreeNode(childId, new Set(visited)));
      
      // Create the tree node
      const treeNode: DependencyTreeData['root'] = {
        id: node.id
      };
      
      // Add name from label
      if (node.label) {
        treeNode.name = node.label;
      }
      
      // Add children if any
      if (childNodes.length > 0) {
        treeNode.children = childNodes;
      }
      
      // Add any additional properties from data
      if (node.data) {
        Object.entries(node.data).forEach(([key, value]) => {
          treeNode[key] = value;
        });
      }
      
      return treeNode;
    };
    
    // Build the tree starting from the root
    const root = buildTreeNode(rootId);
    
    // Build final result
    const result: DependencyTreeData = {
      root
    };
    
    // Add nodeAttributes if any
    if (Object.keys(nodeAttributes).length > 0) {
      result.nodeAttributes = nodeAttributes;
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