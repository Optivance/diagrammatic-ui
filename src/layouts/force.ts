/**
 * Force-directed layout uses physical simulation to position nodes
 * It places connected nodes closer to each other
 */
import { Node, Edge, Position } from '../types/graph';

export interface ForceLayoutOptions {
  /** Number of iterations to run the simulation */
  iterations?: number;
  /** Strength of attraction between connected nodes */
  attractionForce?: number;
  /** Strength of repulsion between nodes */
  repulsionForce?: number;
  /** Distance between connected nodes */
  linkDistance?: number;
  /** Initial temperature (movement allowed) */
  initialTemperature?: number;
  /** Cooling factor per iteration */
  coolingFactor?: number;
  /** Prevent nodes from going outside the viewport */
  preventOverlap?: boolean;
  /** Randomize initial positions */
  randomizeInitialPositions?: boolean;
  /** Center gravity strength */
  centerGravity?: number;
}

// Internal interface used for the simulation
interface NodePosition extends Position {
  vx: number;
  vy: number;
}

/**
 * Calculate node positions using a force-directed layout algorithm
 */
export function forceLayout(
  nodes: Node[],
  edges: Edge[],
  width: number,
  height: number,
  options: ForceLayoutOptions = {}
): Record<string, Position> {
  const {
    iterations = 50,
    attractionForce = 0.1,
    repulsionForce = 2000,
    linkDistance = 100,
    initialTemperature = 0.1,
    coolingFactor = 0.95,
    preventOverlap = true,
    randomizeInitialPositions = true,
    centerGravity = 0.1,
  } = options;

  // If there are no nodes, return an empty positioning object
  if (!nodes.length) return {};

  // Create a map of edges for quick lookup
  const edgeMap: Map<string, Set<string>> = new Map();
  
  // Initialize edge map for each node
  nodes.forEach(node => {
    edgeMap.set(node.id, new Set());
  });

  // Fill edge map with connections
  edges.forEach(edge => {
    const sourceSet = edgeMap.get(edge.source);
    const targetSet = edgeMap.get(edge.target);
    
    if (sourceSet) sourceSet.add(edge.target);
    if (targetSet) targetSet.add(edge.source);
  });

  // Initialize positions
  const simPositions: Record<string, NodePosition> = {};
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Set initial positions either randomly or in a circle
  nodes.forEach((node, i) => {
    if (randomizeInitialPositions) {
      simPositions[node.id] = {
        x: centerX + (Math.random() - 0.5) * width * 0.8,
        y: centerY + (Math.random() - 0.5) * height * 0.8,
        vx: 0,
        vy: 0
      };
    } else {
      // Default to a circle layout
      const angle = (2 * Math.PI * i) / nodes.length;
      const radius = Math.min(width, height) * 0.3;
      simPositions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        vx: 0,
        vy: 0
      };
    }
  });

  // Run simulation
  let temperature = initialTemperature;
  
  for (let i = 0; i < iterations; i++) {
    // Calculate forces
    const forces: Record<string, { fx: number; fy: number }> = {};
    
    // Initialize forces to zero
    nodes.forEach(node => {
      forces[node.id] = { fx: 0, fy: 0 };
    });
    
    // Apply repulsion forces between all pairs of nodes
    for (let i = 0; i < nodes.length; i++) {
      const nodeA = nodes[i];
      const posA = simPositions[nodeA.id];
      
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeB = nodes[j];
        const posB = simPositions[nodeB.id];
        
        // Calculate distance between nodes
        const dx = posB.x - posA.x;
        const dy = posB.y - posA.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 0.1; // Avoid division by zero
        
        // Apply repulsion force (inverse square law)
        const force = repulsionForce / (distance * distance);
        const forceX = dx / distance * force;
        const forceY = dy / distance * force;
        
        // Add to forces (opposite directions)
        forces[nodeA.id].fx -= forceX;
        forces[nodeA.id].fy -= forceY;
        forces[nodeB.id].fx += forceX;
        forces[nodeB.id].fy += forceY;
      }
    }
    
    // Apply attraction forces between connected nodes
    edges.forEach(edge => {
      const sourcePos = simPositions[edge.source];
      const targetPos = simPositions[edge.target];
      
      if (sourcePos && targetPos) {
        const dx = targetPos.x - sourcePos.x;
        const dy = targetPos.y - sourcePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
        
        // Force is proportional to distance from ideal length
        const force = (distance - linkDistance) * attractionForce;
        const forceX = dx / distance * force;
        const forceY = dy / distance * force;
        
        forces[edge.source].fx += forceX;
        forces[edge.source].fy += forceY;
        forces[edge.target].fx -= forceX;
        forces[edge.target].fy -= forceY;
      }
    });
    
    // Apply center gravity
    nodes.forEach(node => {
      const pos = simPositions[node.id];
      const dx = centerX - pos.x;
      const dy = centerY - pos.y;
      forces[node.id].fx += dx * centerGravity;
      forces[node.id].fy += dy * centerGravity;
    });
    
    // Update positions based on forces
    nodes.forEach(node => {
      const pos = simPositions[node.id];
      const force = forces[node.id];
      
      // Update velocity with force and damping
      pos.vx = (pos.vx || 0) * 0.9 + force.fx * temperature;
      pos.vy = (pos.vy || 0) * 0.9 + force.fy * temperature;
      
      // Update position
      pos.x += pos.vx;
      pos.y += pos.vy;
      
      // Constrain to viewport if needed
      if (preventOverlap) {
        const padding = 50;
        pos.x = Math.max(padding, Math.min(width - padding, pos.x));
        pos.y = Math.max(padding, Math.min(height - padding, pos.y));
      }
    });
    
    // Cool down the system
    temperature *= coolingFactor;
  }

  // Clean up extra properties before returning
  const finalPositions: Record<string, Position> = {};
  nodes.forEach(node => {
    const pos = simPositions[node.id];
    finalPositions[node.id] = { x: pos.x, y: pos.y };
  });

  return finalPositions;
} 