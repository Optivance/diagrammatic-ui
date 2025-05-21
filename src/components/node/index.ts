// Placeholder for node components
// Will be implemented in Phase 2

export * from './GraphNode';
export * from './DocumentGraphNode';
export * from './CustomDocumentNode';
export * from './SimpleNodeMenu';
export * from './NodeRenderer';

export const defaultNodeRenderer = () => {
  return null;
};

// Export node components
export * from './GraphNode';
export { default as NodeMenu } from './NodeMenu';
export { default as SimpleNodeMenu } from './SimpleNodeMenu';
export { default as NodeRenderer } from './NodeRenderer'; 