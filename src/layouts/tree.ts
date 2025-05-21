/**
 * Tree layout arranges nodes in a hierarchical tree structure
 */
import { Node, Edge, Position } from '../types/graph';

export interface TreeLayoutOptions {
  /** Direction of the tree: 'top-down', 'bottom-up', 'left-right', 'right-left' */
  direction?: 'top-down' | 'bottom-up' | 'left-right' | 'right-left';
  /** Horizontal spacing between nodes */
  horizontalSpacing?: number;
  /** Vertical spacing between levels */
  verticalSpacing?: number;
  /** ID of the root node (if not provided, will use algorithm to find a suitable root) */
  rootId?: string;
  /** Method to find root node if not specified: 'first', 'most-connections', 'least-inputs' */
  rootSelectionMethod?: 'first' | 'most-connections' | 'least-inputs';
  /** Balancing factor between levels (0 to 1) */
  levelBalancing?: number;
}

/**
 * Calculate node positions in a tree layout
 */
export function treeLayout(
  nodes: Node[],
  edges: Edge[],
  width: number,
  height: number,
  options: TreeLayoutOptions = {}
): Record<string, Position> {
  const {
    direction = 'top-down',
    horizontalSpacing = 120,
    verticalSpacing = 100,
    rootId,
    rootSelectionMethod = 'least-inputs',
    levelBalancing = 0.5,
  } = options;

  // If there are no nodes, return an empty positioning object
  if (!nodes.length) return {};

  // Create adjacency lists to represent graph connectivity
  const outgoing: Record<string, string[]> = {};
  const incoming: Record<string, string[]> = {};
  const connectionCount: Record<string, number> = {};

  // Initialize
  nodes.forEach(node => {
    outgoing[node.id] = [];
    incoming[node.id] = [];
    connectionCount[node.id] = 0;
  });

  // Fill adjacency lists
  edges.forEach(edge => {
    // Skip self-loops
    if (edge.source === edge.target) return;
    
    // Add to outgoing and incoming lists
    if (outgoing[edge.source]) {
      outgoing[edge.source].push(edge.target);
      connectionCount[edge.source]++;
    }
    
    if (incoming[edge.target]) {
      incoming[edge.target].push(edge.source);
      connectionCount[edge.target]++;
    }
  });

  // Find root node
  let root: string;
  
  if (rootId && nodes.some(n => n.id === rootId)) {
    // Use the specified root
    root = rootId;
  } else {
    // Find a suitable root based on the selection method
    if (rootSelectionMethod === 'first') {
      root = nodes[0].id;
    } else if (rootSelectionMethod === 'most-connections') {
      // Find node with most connections
      root = nodes.reduce((maxId, node) => {
        return connectionCount[node.id] > connectionCount[maxId] ? node.id : maxId;
      }, nodes[0].id);
    } else {
      // 'least-inputs': Find node with fewest incoming connections
      root = nodes.reduce((minId, node) => {
        return incoming[node.id].length < incoming[minId].length ? node.id : minId;
      }, nodes[0].id);
    }
  }

  // BFS to assign levels to nodes
  const levels: Record<string, number> = {};
  const queue: string[] = [root];
  const visited = new Set<string>([root]);
  levels[root] = 0;
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    const nextLevel = levels[current] + 1;
    
    // Process outgoing edges (for top-down or similar direction)
    outgoing[current].forEach(target => {
      if (!visited.has(target)) {
        visited.add(target);
        levels[target] = nextLevel;
        queue.push(target);
      }
    });
  }

  // Handle nodes not reachable from the root
  let currentLevel = 0;
  nodes.forEach(node => {
    if (!levels[node.id]) {
      levels[node.id] = ++currentLevel;
      
      // Add neighbors to the same level
      const processNeighbors = (neighbors: string[]) => {
        neighbors.forEach(neighbor => {
          if (!levels[neighbor]) {
            levels[neighbor] = currentLevel;
            visited.add(neighbor);
          }
        });
      };
      
      processNeighbors(outgoing[node.id]);
      processNeighbors(incoming[node.id]);
    }
  });

  // Count nodes at each level
  const levelCounts: Record<number, number> = {};
  const nodesAtLevel: Record<number, string[]> = {};
  
  Object.entries(levels).forEach(([nodeId, level]) => {
    levelCounts[level] = (levelCounts[level] || 0) + 1;
    if (!nodesAtLevel[level]) {
      nodesAtLevel[level] = [];
    }
    nodesAtLevel[level].push(nodeId);
  });

  // Calculate max nodes in any level
  const maxNodesInLevel = Math.max(...Object.values(levelCounts));
  
  // Calculate positions based on direction
  const positions: Record<string, Position> = {};
  const isHorizontal = direction === 'left-right' || direction === 'right-left';
  const isReversed = direction === 'bottom-up' || direction === 'right-left';
  
  Object.entries(levels).forEach(([nodeId, level]) => {
    // Calculate position within level
    const nodesInThisLevel = levelCounts[level];
    const indexInLevel = nodesAtLevel[level].indexOf(nodeId);
    
    // Calculate spacing within level
    const levelWidth = isHorizontal
      ? height - 2 * verticalSpacing
      : width - 2 * horizontalSpacing;
    
    const spacing = nodesInThisLevel > 1
      ? levelWidth / (nodesInThisLevel - 1)
      : 0;
    
    // Add balancing to prevent nodes stacking directly on top of each other
    // For levels with fewer nodes than the max, add a balancing offset
    const balanceOffset = levelBalancing * (maxNodesInLevel - nodesInThisLevel) * spacing / 2;
    
    // Calculate x and y based on direction
    let x, y;
    
    if (isHorizontal) {
      // Left-right or right-left
      const levelPos = isReversed
        ? width - horizontalSpacing - level * horizontalSpacing
        : horizontalSpacing + level * horizontalSpacing;
      
      x = levelPos;
      y = nodesInThisLevel > 1
        ? verticalSpacing + balanceOffset + indexInLevel * spacing
        : height / 2;
    } else {
      // Top-down or bottom-up
      const levelPos = isReversed
        ? height - verticalSpacing - level * verticalSpacing
        : verticalSpacing + level * verticalSpacing;
      
      x = nodesInThisLevel > 1
        ? horizontalSpacing + balanceOffset + indexInLevel * spacing
        : width / 2;
      y = levelPos;
    }
    
    positions[nodeId] = { x, y };
  });
  
  return positions;
} 