/**
 * Radial layout places nodes in concentric circles around a central node
 * It's useful for showing relationships relative to a central concept
 */
import { Node, Edge, Position } from '../types/graph';

export interface RadialLayoutOptions {
  /** ID of the central node (if not provided, will use algorithm to find a suitable center) */
  centerNodeId?: string;
  /** Method to find center node if not specified: 'first', 'most-connections', 'most-central' */
  centerSelectionMethod?: 'first' | 'most-connections' | 'most-central';
  /** Radius for the first level of nodes */
  initialRadius?: number;
  /** Increase in radius for each level */
  radiusIncrement?: number;
  /** Minimum angular separation between nodes in the same level (in radians) */
  minAngleSeparation?: number;
  /** Sort nodes at each level based on their connections */
  sortNodesAtLevel?: boolean;
}

/**
 * Calculate node positions in a radial layout
 */
export function radialLayout(
  nodes: Node[],
  edges: Edge[],
  width: number,
  height: number,
  options: RadialLayoutOptions = {}
): Record<string, Position> {
  const {
    centerNodeId,
    centerSelectionMethod = 'most-connections',
    initialRadius = Math.min(width, height) * 0.2,
    radiusIncrement = Math.min(width, height) * 0.15,
    minAngleSeparation = 0.1,
    sortNodesAtLevel = true,
  } = options;

  // If there are no nodes, return an empty positioning object
  if (!nodes.length) return {};

  // Create adjacency lists to represent graph connectivity
  const adjacency: Record<string, Set<string>> = {};
  const connectionCount: Record<string, number> = {};

  // Initialize
  nodes.forEach(node => {
    adjacency[node.id] = new Set();
    connectionCount[node.id] = 0;
  });

  // Fill adjacency lists
  edges.forEach(edge => {
    // Skip self-loops
    if (edge.source === edge.target) return;
    
    // Add to adjacency lists
    if (adjacency[edge.source]) {
      adjacency[edge.source].add(edge.target);
      connectionCount[edge.source]++;
    }
    
    if (adjacency[edge.target]) {
      adjacency[edge.target].add(edge.source);
      connectionCount[edge.target]++;
    }
  });

  // Find center node
  let center: string;
  
  if (centerNodeId && nodes.some(n => n.id === centerNodeId)) {
    // Use the specified center
    center = centerNodeId;
  } else {
    // Find a suitable center based on the selection method
    if (centerSelectionMethod === 'first') {
      center = nodes[0].id;
    } else if (centerSelectionMethod === 'most-connections') {
      // Find node with most connections
      center = nodes.reduce((maxId, node) => {
        return connectionCount[node.id] > connectionCount[maxId] ? node.id : maxId;
      }, nodes[0].id);
    } else {
      // 'most-central': Find node with lowest total distance to all other nodes
      // This is an approximation of centrality using a simple breadth-first search
      
      // Find the node with the lowest sum of shortest path distances to all other nodes
      const distanceSum: Record<string, number> = {};
      
      // For each possible center node
      nodes.forEach(startNode => {
        // Find shortest path distances using BFS
        const distances: Record<string, number> = {};
        const queue: [string, number][] = [[startNode.id, 0]];
        const visited = new Set<string>([startNode.id]);
        
        while (queue.length > 0) {
          const [current, distance] = queue.shift()!;
          distances[current] = distance;
          
          // Process neighbors
          adjacency[current].forEach(neighbor => {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              queue.push([neighbor, distance + 1]);
            }
          });
        }
        
        // Calculate sum of distances
        distanceSum[startNode.id] = nodes.reduce((sum, node) => {
          // If node is not reachable, use a large value
          const distance = distances[node.id] !== undefined ? distances[node.id] : nodes.length;
          return sum + distance;
        }, 0);
      });
      
      // Find node with minimum distance sum
      center = nodes.reduce((minId, node) => {
        return distanceSum[node.id] < distanceSum[minId] ? node.id : minId;
      }, nodes[0].id);
    }
  }

  // BFS to assign levels to nodes
  const levels: Record<string, number> = {};
  const queue: string[] = [center];
  const visited = new Set<string>([center]);
  levels[center] = 0;
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    const nextLevel = levels[current] + 1;
    
    // Process neighbors
    adjacency[current].forEach(neighbor => {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        levels[neighbor] = nextLevel;
        queue.push(neighbor);
      }
    });
  }

  // Handle nodes not reachable from the center
  nodes.forEach(node => {
    if (!levels[node.id]) {
      levels[node.id] = 1; // Place disconnected nodes in the first level
    }
  });

  // Group nodes by level
  const nodesByLevel: Record<number, string[]> = {};
  
  Object.entries(levels).forEach(([nodeId, level]) => {
    if (!nodesByLevel[level]) {
      nodesByLevel[level] = [];
    }
    nodesByLevel[level].push(nodeId);
  });

  // Sort nodes at each level based on connections
  if (sortNodesAtLevel) {
    Object.entries(nodesByLevel).forEach(([level, nodeIds]) => {
      if (Number(level) === 0) return; // Skip center node
      
      const levelNum = Number(level);
      const prevLevel = levelNum - 1;
      
      // Sort nodes based on their connections to the previous level
      nodeIds.sort((a, b) => {
        // Count connections to the previous level
        const aConnections = Array.from(adjacency[a]).filter(
          neighbor => levels[neighbor] === prevLevel
        ).length;
        
        const bConnections = Array.from(adjacency[b]).filter(
          neighbor => levels[neighbor] === prevLevel
        ).length;
        
        return bConnections - aConnections;
      });
    });
  }

  // Calculate positions
  const positions: Record<string, Position> = {};
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Set position for center node
  positions[center] = { x: centerX, y: centerY };
  
  // Calculate positions for each level
  Object.entries(nodesByLevel).forEach(([level, nodeIds]) => {
    if (Number(level) === 0) return; // Skip center node (already positioned)
    
    const radius = initialRadius + (Number(level) - 1) * radiusIncrement;
    const nodesInLevel = nodeIds.length;
    
    // Calculate angle for each node
    const angleStep = Math.max(minAngleSeparation, (2 * Math.PI) / nodesInLevel);
    
    nodeIds.forEach((nodeId, index) => {
      const angle = index * angleStep;
      positions[nodeId] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
  });
  
  return positions;
} 